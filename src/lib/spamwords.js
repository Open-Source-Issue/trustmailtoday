/**
 * Spam-content analyzer (pure, no network) — usable on client or server.
 *
 * Scores an email's subject + body against well-known spam-trigger phrases,
 * structural risk signals (ALL CAPS, excess punctuation, link/image ratio),
 * and gives an actionable breakdown. This is a heuristic guide, not a guarantee
 * of how a specific provider's filter will score the message.
 */

// Categorized spam-trigger terms commonly flagged by content filters.
export const SPAM_TERMS = {
  "Urgency / pressure": [
    "act now",
    "limited time",
    "urgent",
    "expires today",
    "don't delete",
    "apply now",
    "once in a lifetime",
    "while supplies last",
    "instant",
    "now only",
  ],
  "Money / financial": [
    "free money",
    "cash bonus",
    "earn extra cash",
    "make money",
    "double your income",
    "no cost",
    "100% free",
    "risk free",
    "money back",
    "lowest price",
    "best price",
    "save big",
    "cheap",
    "$$$",
    "million dollars",
  ],
  "Guarantees / hype": [
    "guarantee",
    "guaranteed",
    "no risk",
    "promise you",
    "amazing",
    "incredible deal",
    "miracle",
    "you won",
    "winner",
    "congratulations",
  ],
  "Sales / marketing": [
    "click here",
    "click below",
    "buy now",
    "order now",
    "subscribe now",
    "this isn't spam",
    "no obligation",
    "special promotion",
    "discount",
    "free trial",
    "increase sales",
    "extra income",
  ],
  "Sketchy / phishing": [
    "viagra",
    "pharmacy",
    "weight loss",
    "casino",
    "crypto giveaway",
    "verify your account",
    "confirm your identity",
    "you have been selected",
    "nigerian prince",
    "wire transfer",
  ],
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Analyze subject + body.
 * @returns { score (0-100, higher = riskier), risk label, findings[], signals }
 */
export function analyzeSpam({ subject = "", body = "" } = {}) {
  const subjectText = String(subject || "");
  const bodyText = String(body || "");
  const combined = `${subjectText}\n${bodyText}`;
  const lower = combined.toLowerCase();

  const findings = [];
  let penalty = 0;

  // 1. Trigger-word matches by category.
  for (const [category, terms] of Object.entries(SPAM_TERMS)) {
    const hits = [];
    for (const term of terms) {
      const re = new RegExp(`\\b${escapeRegExp(term.toLowerCase())}\\b`, "g");
      const matches = lower.match(re);
      if (matches) hits.push({ term, count: matches.length });
    }
    if (hits.length) {
      const weight = hits.reduce((s, h) => s + h.count, 0) * 6;
      penalty += weight;
      findings.push({
        type: "trigger",
        category,
        hits,
        message: `${hits.length} ${category.toLowerCase()} trigger${
          hits.length > 1 ? "s" : ""
        } found`,
      });
    }
  }

  // 2. Structural signals.
  const words = combined.trim() ? combined.trim().split(/\s+/) : [];
  const upperWords = words.filter(
    (w) => w.length >= 3 && w === w.toUpperCase() && /[A-Z]/.test(w)
  );
  const capsRatio = words.length ? upperWords.length / words.length : 0;
  if (capsRatio > 0.3 && words.length > 4) {
    penalty += 15;
    findings.push({
      type: "structure",
      message: `Excessive ALL-CAPS (${Math.round(capsRatio * 100)}% of words)`,
    });
  }

  const exclamations = (combined.match(/!/g) || []).length;
  if (exclamations >= 3) {
    penalty += Math.min(exclamations * 3, 15);
    findings.push({
      type: "structure",
      message: `${exclamations} exclamation marks — overuse looks promotional`,
    });
  }

  const moneySymbols = (combined.match(/\$|₹|€|£/g) || []).length;
  if (moneySymbols >= 3) {
    penalty += 8;
    findings.push({
      type: "structure",
      message: `Heavy use of currency symbols (${moneySymbols})`,
    });
  }

  const links = (combined.match(/https?:\/\/\S+/gi) || []).length;
  if (links >= 5) {
    penalty += 10;
    findings.push({
      type: "structure",
      message: `${links} links — a high link count raises spam risk`,
    });
  }

  // 3. Subject-line checks.
  if (subjectText.length > 70) {
    penalty += 6;
    findings.push({
      type: "subject",
      message: `Subject is long (${subjectText.length} chars) — aim for under 60`,
    });
  }
  if (/(re:|fwd:)/i.test(subjectText)) {
    penalty += 5;
    findings.push({
      type: "subject",
      message: "Fake Re:/Fwd: in subject is a known spam tactic",
    });
  }

  const score = Math.max(0, Math.min(100, Math.round(penalty)));
  const risk =
    score >= 60 ? "High" : score >= 30 ? "Medium" : score >= 12 ? "Low" : "Minimal";

  return {
    score,
    risk,
    findings,
    signals: {
      words: words.length,
      links,
      exclamations,
      capsRatio: Math.round(capsRatio * 100),
      triggerCategories: findings.filter((f) => f.type === "trigger").length,
    },
  };
}
