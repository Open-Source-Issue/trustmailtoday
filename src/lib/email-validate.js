import { promises as dns } from "node:dns";

/**
 * Email address validation that goes beyond a regex:
 *   1. Syntax (RFC-ish, pragmatic)
 *   2. Domain has MX records (can actually receive mail) — real DNS lookup
 *   3. Disposable-domain detection (common throwaway providers)
 *   4. Role-based address detection (info@, support@, …)
 *
 * No SMTP probing (that's unreliable and often blocked); MX presence is the
 * strongest signal we can verify without sending mail.
 */

// Pragmatic syntax check: local@domain.tld, no spaces, sane characters.
const EMAIL_RE =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

// A small, well-known set of disposable/temporary email domains.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
  "fakeinbox.com",
  "sharklasers.com",
  "maildrop.cc",
]);

const ROLE_LOCALPARTS = new Set([
  "admin",
  "administrator",
  "billing",
  "contact",
  "help",
  "info",
  "hr",
  "marketing",
  "noreply",
  "no-reply",
  "office",
  "postmaster",
  "sales",
  "support",
  "team",
  "webmaster",
  "abuse",
]);

const FREE_PROVIDERS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

async function resolveMx(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return records.sort((a, b) => a.priority - b.priority);
  } catch {
    return [];
  }
}

export async function validateEmail(input) {
  const email = (input || "").trim().toLowerCase();
  if (!email) return { email, valid: false, reason: "empty" };

  const syntaxValid = EMAIL_RE.test(email);
  const [localPart, domain] = email.split("@");

  if (!syntaxValid || !domain) {
    return {
      email,
      valid: false,
      reason: "bad_syntax",
      checks: { syntax: false },
    };
  }

  const mx = await resolveMx(domain);
  const hasMx = mx.length > 0;
  const disposable = DISPOSABLE_DOMAINS.has(domain);
  const roleBased = ROLE_LOCALPARTS.has(localPart);
  const free = FREE_PROVIDERS.has(domain);

  // Deliverable means: valid syntax + a domain that can receive mail.
  const deliverable = syntaxValid && hasMx;

  // A simple confidence score for the UI.
  let score = 0;
  if (syntaxValid) score += 40;
  if (hasMx) score += 40;
  if (!disposable) score += 10;
  if (!roleBased) score += 10;

  return {
    email,
    localPart,
    domain,
    valid: deliverable && !disposable,
    deliverable,
    score,
    checks: {
      syntax: syntaxValid,
      mx: hasMx,
      disposable,
      roleBased,
      free,
    },
    mxHost: hasMx ? mx[0].exchange : null,
    mxRecords: mx.map((r) => ({ exchange: r.exchange, priority: r.priority })),
  };
}
