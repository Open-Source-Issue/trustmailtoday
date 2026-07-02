import crypto from "crypto";
import { sendEmail, findDeliveredMessage } from "@/lib/gmail";
import { warmupProgress, dateKey } from "@/lib/warmup";

/**
 * Warmup batch runner — the shared core used by both the manual trigger
 * (/api/warmup/send) and the background scheduler. Given a connected session,
 * it sends a small batch of warmup emails from the account to its own inbox
 * (a deliverability self-test) plus any consenting seed addresses configured
 * on the warmup record, then folds the outcome back into the ramp counters,
 * reputation signals and activity log.
 *
 * Contract expected by callers:
 *   runWarmupBatch(session, { cap }) -> {
 *     skipped: boolean,              // true when there was nothing to send
 *     capReached?: boolean,          // (when skipped) plan daily cap hit
 *     sent?: number,                 // messages sent this batch
 *     errors?: string[],             // per-message send failures
 *     warmup?: object,               // updated warmup record to persist
 *     credentialUpdate?: object,     // e.g. { tokens } if OAuth refreshed
 *     progress?: object,             // warmupProgress() summary
 *   }
 *
 * Design notes:
 *   - Batches are capped (BATCH_SIZE) so a single serverless invocation stays
 *     well within time limits and sends look organic rather than bursty.
 *   - Only the first self-addressed send is inspected for placement/auth (one
 *     short poll) to keep the request fast; bulk placement is measured by the
 *     dedicated inbox-check flow.
 *   - Sending is resilient: one failed message is recorded in `errors`/`log`
 *     and does not abort the rest of the batch.
 */

// Max messages sent per invocation. Keeps latency bounded on serverless and
// avoids bursty sending patterns that hurt reputation.
const BATCH_SIZE = 5;

const SUBJECTS = [
  "Quick note",
  "Following up",
  "Checking in",
  "Re: our conversation",
  "Thanks again",
  "A short update",
  "Touching base",
];

const BODIES = [
  "Hi there,\n\nJust a quick note to keep our thread going. Talk soon!\n\nBest",
  "Hello,\n\nHope you're doing well. Sending this along as a follow-up.\n\nCheers",
  "Hey,\n\nWanted to check in and make sure everything's on track.\n\nThanks",
  "Hi,\n\nA short message to stay in touch. Let me know if you need anything.\n\nRegards",
  "Hello,\n\nAppreciate your time earlier. Looking forward to the next steps.\n\nBest wishes",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Recipients for a batch: the account itself, plus any configured seeds. */
function recipientsFor(session) {
  const self = session.email;
  const seeds = Array.isArray(session.warmup?.seeds)
    ? session.warmup.seeds.filter((s) => typeof s === "string" && s.includes("@"))
    : [];
  const list = [self, ...seeds].filter(Boolean);
  return list.length ? list : [self];
}

export async function runWarmupBatch(session, { cap = Infinity } = {}) {
  const now = Date.now();
  const warmup = session.warmup || {};
  const before = warmupProgress(warmup, { cap, now });

  // Nothing to send: plan cap hit, or today's ramp target already met.
  if (before.capReached) {
    return { skipped: true, capReached: true };
  }
  if (before.remainingToday <= 0) {
    return { skipped: true, capReached: false };
  }
  // Can't send without OAuth credentials (shouldn't happen post-connect).
  if (!session.tokens) {
    return {
      skipped: false,
      sent: 0,
      errors: ["no_credentials"],
      warmup,
      credentialUpdate: {},
      progress: before,
    };
  }

  const batchN = Math.min(before.remainingToday, BATCH_SIZE);
  const recipients = recipientsFor(session);

  let tokens = session.tokens;
  let refreshed = null;
  let sent = 0;
  const errors = [];
  const logEntries = [];
  let inspected = null;

  for (let i = 0; i < batchN; i++) {
    const to = recipients[i % recipients.length];
    const tag = `TMT-${crypto.randomBytes(4).toString("hex")}`;
    const subject = `${pick(SUBJECTS)} [${tag}]`;
    const text = pick(BODIES);

    try {
      const res = await sendEmail(tokens, {
        from: session.email,
        to,
        subject,
        text,
      });
      if (res.refreshedTokens) {
        tokens = res.refreshedTokens;
        refreshed = res.refreshedTokens;
      }
      sent += 1;
      const entry = { to, ok: true, placement: null, tag, at: Date.now() };
      logEntries.push(entry);

      // Inspect only the first self-addressed message for a placement/auth
      // signal (best-effort, short poll) — keeps the batch fast.
      if (!inspected && to === session.email) {
        try {
          const d = await findDeliveredMessage(tokens, tag, {
            attempts: 3,
            delayMs: 1000,
          });
          if (d.refreshedTokens) {
            tokens = d.refreshedTokens;
            refreshed = d.refreshedTokens;
          }
          if (d.found) {
            inspected = d;
            entry.placement = d.placement;
          }
        } catch {
          /* inspection is best-effort; ignore failures */
        }
      }
    } catch (err) {
      errors.push(err?.message || "send_failed");
      logEntries.push({ to, ok: false, placement: null, at: Date.now() });
    }
  }

  // Fold results into the warmup record.
  const today = dateKey(now);
  const dailySent = { ...(warmup.dailySent || {}) };
  dailySent[today] = (dailySent[today] || 0) + sent;

  const prev = warmup.signals || {};
  const signals = {
    ...prev,
    sentCount: (prev.sentCount || 0) + sent,
    activeDays: Object.keys(dailySent).length,
  };
  if (inspected) {
    signals.authPass = inspected.auth?.pass ?? prev.authPass ?? false;
    if (inspected.placement === "spam") {
      signals.spamFolderCount = (prev.spamFolderCount || 0) + 1;
    } else if (inspected.placement === "inbox") {
      signals.inboxCount = (prev.inboxCount || 0) + 1;
    }
  }

  const updatedWarmup = {
    ...warmup,
    dailySent,
    totalSent: (warmup.totalSent || 0) + sent,
    signals,
    log: [...(warmup.log || []), ...logEntries].slice(-50),
    lastRunAt: now,
  };

  return {
    skipped: false,
    capReached: false,
    sent,
    errors,
    warmup: updatedWarmup,
    credentialUpdate: refreshed ? { tokens: refreshed } : {},
    progress: warmupProgress(updatedWarmup, { cap, now }),
  };
}
