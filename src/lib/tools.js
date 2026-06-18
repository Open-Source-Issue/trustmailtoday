/**
 * Central registry of the free deliverability tools. Single source of truth for
 * the tools hub, navbar dropdown, sitemap and cross-linking. Icons are resolved
 * by name in the UI (see IC­ON_MAP in the hub) to keep this file serializable.
 */

export const TOOLS = [
  {
    slug: "spf-checker",
    name: "SPF Checker",
    short: "SPF",
    icon: "ShieldCheck",
    tagline: "Verify your SPF record and authorized senders.",
    category: "Authentication",
  },
  {
    slug: "dkim-checker",
    name: "DKIM Checker",
    short: "DKIM",
    icon: "KeyRound",
    tagline: "Confirm your DKIM signing key is published.",
    category: "Authentication",
  },
  {
    slug: "dmarc-checker",
    name: "DMARC Checker",
    short: "DMARC",
    icon: "ShieldAlert",
    tagline: "Check your DMARC policy and reporting.",
    category: "Authentication",
  },
  {
    slug: "blacklist-checker",
    name: "Blacklist Checker",
    short: "Blacklist",
    icon: "Ban",
    tagline: "See if your domain or IP is on a DNSBL.",
    category: "Reputation",
  },
  {
    slug: "email-checker",
    name: "Email Checker",
    short: "Email verify",
    icon: "MailCheck",
    tagline: "Validate syntax, MX and deliverability.",
    category: "Reputation",
  },
  {
    slug: "spam-checker",
    name: "Spam Checker",
    short: "Spam words",
    icon: "ScanText",
    tagline: "Scan your copy for spam-trigger phrases.",
    category: "Content",
  },
  {
    slug: "email-generator",
    name: "Email Generator",
    short: "Email gen",
    icon: "Wand2",
    tagline: "Create test email addresses in bulk.",
    category: "Utilities",
  },
  {
    slug: "gmail-generator",
    name: "Gmail Alias Generator",
    short: "Gmail alias",
    icon: "AtSign",
    tagline: "Generate dot & +tag Gmail aliases.",
    category: "Utilities",
  },
  {
    slug: "email-signature-generator",
    name: "Email Signature Generator",
    short: "Signature",
    icon: "PenLine",
    tagline: "Build a clean, deliverability-friendly signature.",
    category: "Utilities",
  },
];

export function getTool(slug) {
  return TOOLS.find((t) => t.slug === slug) || null;
}

/** Tools grouped by category, preserving order. */
export function toolsByCategory() {
  const groups = {};
  for (const tool of TOOLS) {
    (groups[tool.category] ||= []).push(tool);
  }
  return groups;
}
