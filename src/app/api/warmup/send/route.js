import { NextResponse } from "next/server";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import { warmupProgress, dateKey } from "@/lib/warmup";
import { sendEmail, inspectMessage } from "@/lib/gmail";
import { dailyCap } from "@/lib/plans";

export const runtime = "nodejs";

// Hard cap per request so a single click can't fire off a huge batch.
const MAX_BATCH = 5;

const SUBJECTS = [
  "Quick question about your roadmap",
  "Following up on our chat",
  "Thoughts on this?",
  "Re: project update",
  "Checking in",
];
const BODIES = [
  "Hi there,\n\nJust wanted to follow up and see how things are going. Let me know if there's anything I can help with.\n\nBest,\nTrustmailtoday",
  "Hello,\n\nHope you're having a good week! Sharing a quick note to keep our thread warm.\n\nCheers,\nTrustmailtoday",
  "Hey,\n\nNo action needed — just a friendly check-in to keep this conversation active.\n\nThanks,\nTrustmailtoday",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Recipients for warmup sends.
 *  - Always includes the user's own connected address (a legitimate
 *    deliverability self-test — you're emailing yourself).
 *  - Optionally a consenting seed list via SEED_RECIPIENTS (comma-separated).
 *
 * We never send to addresses that haven't opted in. Sending warmup mail to
 * non-consenting third parties is spam and will damage reputation, not help it.
 */
function recipientPool(selfEmail) {
  const seeds = (process.env.SEED_RECIPIENTS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [selfEmail, ...seeds].filter(Boolean);
}

export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }
  if (!session.warmup?.startedAt) {
    return NextResponse.json({ error: "not_started" }, { status: 400 });
  }
  if (!session.email) {
    return NextResponse.json({ error: "no_sender_address" }, { status: 400 });
  }

  const warmup = { ...session.warmup };
  const cap = dailyCap(session.plan || "free");
  const progress = warmupProgress(warmup, { cap });
  if (progress.remainingToday <= 0) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      note: progress.capReached
        ? `Free plan limit reached (${cap}/day). Upgrade for unlimited warmup.`
        : "Daily warmup target already met.",
      progress,
    });
  }

  const pool = recipientPool(session.email);
  const batch = Math.min(progress.remainingToday, MAX_BATCH);

  // Working copies of mutable state.
  const dailySent = { ...(warmup.dailySent || {}) };
  const signals = { ...warmup.signals };
  const log = [...(warmup.log || [])];
  const today = dateKey();
  let tokens = session.tokens;
  let sent = 0;
  const errors = [];

  for (let i = 0; i < batch; i++) {
    const to = pool[i % pool.length];
    try {
      const result = await sendEmail(tokens, {
        from: session.email,
        to,
        subject: pick(SUBJECTS),
        text: pick(BODIES),
      });
      if (result.refreshedTokens) tokens = result.refreshedTokens;

      sent += 1;
      signals.sentCount = (signals.sentCount || 0) + 1;

      // Best-effort placement/auth inspection for self-tests.
      let placement = "unknown";
      if (to === session.email && result.id) {
        try {
          const insp = await inspectMessage(tokens, result.id);
          if (insp.refreshedTokens) tokens = insp.refreshedTokens;
          if (insp.spf || insp.dkim || insp.dmarc) {
            signals.authPass = insp.authPass;
          }
          if (insp.labelIds?.includes("INBOX")) {
            signals.inboxCount = (signals.inboxCount || 0) + 1;
            placement = "inbox";
          } else if (insp.labelIds?.includes("SPAM")) {
            signals.spamFolderCount = (signals.spamFolderCount || 0) + 1;
            placement = "spam";
          }
        } catch {
          /* inspection is best-effort */
        }
      }

      log.push({ ts: Date.now(), to, placement, ok: true });
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || "send_failed";
      errors.push(msg);
      log.push({ ts: Date.now(), to, ok: false, error: msg });
    }
  }

  dailySent[today] = (dailySent[today] || 0) + sent;

  // Consistency: count distinct active days.
  signals.activeDays = Object.values(dailySent).filter((n) => n > 0).length;

  const nextWarmup = {
    ...warmup,
    dailySent,
    totalSent: (warmup.totalSent || 0) + sent,
    signals,
    log: log.slice(-50),
  };

  await updateSession(cookie, { warmup: nextWarmup, tokens });

  return NextResponse.json({
    ok: errors.length === 0,
    sent,
    errors,
    progress: warmupProgress(nextWarmup, { cap }),
  });
}
