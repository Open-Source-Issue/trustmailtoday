import { promises as dns } from "node:dns";

/**
 * Real DNS blacklist (DNSBL/RBL) checks. No third-party APIs — we query public
 * DNSBL zones directly over DNS, exactly how mail servers do.
 *
 * How it works: an IP 1.2.3.4 is reversed to 4.3.2.1 and prepended to a zone
 * (e.g. 4.3.2.1.zen.spamhaus.org). If that name resolves to an A record, the IP
 * is LISTED on that blacklist; NXDOMAIN means it is clean.
 *
 * For a domain we first resolve its A record(s) and check each IP.
 */

// Widely-used, free-to-query DNSBL zones.
export const DNSBL_ZONES = [
  { zone: "zen.spamhaus.org", name: "Spamhaus ZEN" },
  { zone: "bl.spamcop.net", name: "SpamCop" },
  { zone: "b.barracudacentral.org", name: "Barracuda" },
  { zone: "dnsbl.sorbs.net", name: "SORBS" },
  { zone: "spam.dnsbl.sorbs.net", name: "SORBS Spam" },
  { zone: "cbl.abuseat.org", name: "Abuseat CBL" },
  { zone: "dnsbl-1.uceprotect.net", name: "UCEPROTECT L1" },
  { zone: "psbl.surriel.com", name: "PSBL" },
];

const IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const DOMAIN_RE =
  /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function isIpv4(value) {
  const m = IPV4_RE.exec(value);
  if (!m) return false;
  return m.slice(1).every((o) => Number(o) >= 0 && Number(o) <= 255);
}

function reverseIp(ip) {
  return ip.split(".").reverse().join(".");
}

/** Resolve a domain to its A records (IPv4). Returns [] on failure. */
async function resolveIps(domain) {
  try {
    return await dns.resolve4(domain);
  } catch {
    return [];
  }
}

/** Check a single reversed-IP against a single zone. */
async function checkZone(reversed, zone) {
  const query = `${reversed}.${zone}`;
  try {
    const records = await dns.resolve4(query);
    let reason = null;
    try {
      const txt = await dns.resolveTxt(query);
      reason = txt.map((c) => c.join("")).join(" ") || null;
    } catch {
      /* no TXT reason */
    }
    return { listed: true, codes: records, reason };
  } catch (err) {
    if (["ENOTFOUND", "ENODATA", "NXDOMAIN"].includes(err.code)) {
      return { listed: false };
    }
    // Timeout / servfail — report as inconclusive rather than clean.
    return { listed: false, error: err.code || "lookup_error" };
  }
}

/** Check one IP across all configured zones. */
async function checkIp(ip) {
  const reversed = reverseIp(ip);
  const results = await Promise.all(
    DNSBL_ZONES.map(async (z) => {
      const r = await checkZone(reversed, z.zone);
      return { ...z, ...r };
    })
  );
  const listedOn = results.filter((r) => r.listed);
  return {
    ip,
    listedCount: listedOn.length,
    total: DNSBL_ZONES.length,
    clean: listedOn.length === 0,
    results,
  };
}

/**
 * Public entry point. Accepts an IPv4 address or a domain.
 * Returns per-IP results across all DNSBL zones.
 */
export async function checkBlacklist(input) {
  const value = (input || "").trim().toLowerCase();
  if (!value) return { error: "empty_input" };

  let ips = [];
  let domain = null;

  if (isIpv4(value)) {
    ips = [value];
  } else if (DOMAIN_RE.test(value)) {
    domain = value;
    ips = await resolveIps(value);
    if (ips.length === 0) {
      return { error: "no_a_record", domain };
    }
  } else {
    return { error: "invalid_input" };
  }

  const perIp = await Promise.all(ips.map((ip) => checkIp(ip)));
  const totalListed = perIp.reduce((sum, r) => sum + r.listedCount, 0);

  return {
    input: value,
    domain,
    ips,
    clean: totalListed === 0,
    totalListed,
    checkedZones: DNSBL_ZONES.length,
    perIp,
  };
}
