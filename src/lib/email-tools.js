/**
 * Pure helpers for the Gmail alias generator and the random/test email
 * generator. No network, no side effects — safe to run on the client.
 */

/**
 * Gmail treats `john.doe@gmail.com`, `johndoe@gmail.com` and
 * `j.o.h.n.d.o.e@gmail.com` as the SAME inbox (dots are ignored), and supports
 * `+tag` sub-addressing. This generates valid alias variations that all deliver
 * to one Gmail account — useful for testing filters and signups.
 */
export function generateGmailAliases(rawUser, { tags = [], limit = 25 } = {}) {
  const user = String(rawUser || "")
    .toLowerCase()
    .replace(/@gmail\.com$/i, "")
    .replace(/[^a-z0-9.]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "");

  if (!user || user.length < 2) return [];

  const domain = "gmail.com";
  const aliases = new Set();

  // Dot variations — insert a dot at each interior position.
  const bare = user.replace(/\./g, "");
  aliases.add(`${bare}@${domain}`);
  for (let i = 1; i < bare.length && aliases.size < limit; i++) {
    aliases.add(`${bare.slice(0, i)}.${bare.slice(i)}@${domain}`);
  }
  // Fully-dotted variant.
  if (bare.length <= 20) aliases.add(`${bare.split("").join(".")}@${domain}`);

  // Plus-tag variations.
  const tagList = tags.length
    ? tags
    : ["news", "shopping", "work", "social", "test", "signup"];
  for (const tag of tagList) {
    if (aliases.size >= limit) break;
    const clean = String(tag)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    if (clean) aliases.add(`${bare}+${clean}@${domain}`);
  }

  return Array.from(aliases).slice(0, limit);
}

const ADJECTIVES = [
  "swift", "bright", "calm", "bold", "clever", "lucky", "quiet", "rapid",
  "sunny", "brave", "cool", "happy", "keen", "neat", "wise", "zesty",
];
const NOUNS = [
  "falcon", "river", "maple", "comet", "harbor", "willow", "summit", "ember",
  "pixel", "orbit", "delta", "cedar", "lotus", "nova", "quartz", "raven",
];

function randInt(max) {
  // Prefer crypto when available for nicer distribution; fall back to Math.
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pick(arr) {
  return arr[randInt(arr.length)];
}

/**
 * Generate plausible-looking random email addresses for testing forms,
 * placeholders and seed data. Defaults to example.com (RFC 2606 reserved) so
 * generated addresses can never hit a real inbox unless a domain is provided.
 */
export function generateRandomEmails(
  count = 10,
  { domain = "example.com", style = "word" } = {}
) {
  const n = Math.max(1, Math.min(100, Number(count) || 10));
  const out = [];
  const seen = new Set();

  let guard = 0;
  while (out.length < n && guard < n * 20) {
    guard++;
    let local;
    if (style === "name") {
      local = `${pick(ADJECTIVES)}.${pick(NOUNS)}${randInt(99)}`;
    } else if (style === "random") {
      local = Math.random().toString(36).slice(2, 10);
    } else {
      local = `${pick(ADJECTIVES)}${pick(NOUNS)}${randInt(999)}`;
    }
    const email = `${local}@${domain}`;
    if (!seen.has(email)) {
      seen.add(email);
      out.push(email);
    }
  }
  return out;
}
