/**
 * Sender reputation scoring.
 *
 * Produces a 0–100 score from REAL signals collected during warmup, not a
 * random number. Each factor is scored independently and combined with a
 * weight, so the UI can show an honest breakdown of what's helping or hurting.
 *
 * Signals (all optional; sensible defaults applied):
 *   authPass        : SPF/DKIM/DMARC all aligned on sent mail (bool)
 *   sentCount       : total messages sent during warmup
 *   bounceCount     : hard/soft bounces
 *   complaintCount  : spam complaints / "report spam"
 *   inboxCount      : messages observed landing in Primary/inbox
 *   spamFolderCount : messages observed landing in spam
 *   replyCount      : genuine replies received
 *   activeDays      : distinct days with sending activity (consistency)
 */

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const rate = (num, den) => (den > 0 ? num / den : 0);

export function computeReputation(signals = {}) {
  const {
    authPass = false,
    sentCount = 0,
    bounceCount = 0,
    complaintCount = 0,
    inboxCount = 0,
    spamFolderCount = 0,
    replyCount = 0,
    activeDays = 0,
  } = signals;

  // --- Individual factor scores (each 0–100) ---

  // 1. Authentication (SPF/DKIM/DMARC) — pass/fail, foundational.
  const authentication = authPass ? 100 : 35;

  // 2. Bounce rate — lower is better. >5% is bad, 0% is perfect.
  const bounceRate = rate(bounceCount, sentCount);
  const bounces = clamp(100 - bounceRate * 100 * 20); // 5% -> 0

  // 3. Spam complaints — extremely sensitive. >0.3% is a red flag.
  const complaintRate = rate(complaintCount, sentCount);
  const complaints = clamp(100 - complaintRate * 100 * 333); // 0.3% -> 0

  // 4. Inbox placement — inbox vs spam folder among observed messages.
  const observed = inboxCount + spamFolderCount;
  const placement = observed > 0 ? clamp(rate(inboxCount, observed) * 100) : 60;

  // 5. Engagement — replies relative to volume (capped; 20% reply = full).
  const engagement = clamp(rate(replyCount, sentCount) * 100 * 5);

  // 6. Consistency — steady daily activity over the warmup window.
  const consistency = clamp((activeDays / 14) * 100); // 14 active days -> full

  const factors = {
    authentication: { score: Math.round(authentication), weight: 0.3 },
    bounces: { score: Math.round(bounces), weight: 0.2 },
    complaints: { score: Math.round(complaints), weight: 0.2 },
    placement: { score: Math.round(placement), weight: 0.15 },
    engagement: { score: Math.round(engagement), weight: 0.1 },
    consistency: { score: Math.round(consistency), weight: 0.05 },
  };

  // New accounts with no history start with limited data — reflect that by
  // blending toward a neutral baseline until enough mail has been sent.
  const confidence = clamp((sentCount / 50) * 100) / 100; // full confidence at 50 sends
  const baseline = 50;

  let weighted = 0;
  for (const f of Object.values(factors)) weighted += f.score * f.weight;
  const score = Math.round(baseline + (weighted - baseline) * confidence);

  return {
    score: clamp(score),
    label: scoreLabel(clamp(score)),
    confidence: Math.round(confidence * 100),
    factors,
  };
}

export function scoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "At risk";
  return "Poor";
}

/** Empty signal set used before any warmup activity. */
export function emptySignals() {
  return {
    authPass: false,
    sentCount: 0,
    bounceCount: 0,
    complaintCount: 0,
    inboxCount: 0,
    spamFolderCount: 0,
    replyCount: 0,
    activeDays: 0,
  };
}
