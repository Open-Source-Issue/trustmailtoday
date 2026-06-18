/**
 * Blog content. Original posts written for Trustmailtoday — NOT copied from any
 * other site. Content is structured as blocks so the post template can render
 * headings, paragraphs and lists consistently. Add new posts by appending to
 * POSTS; the index, post pages and sitemap pick them up automatically.
 *
 * Block types: { h2: string } | { p: string } | { ul: string[] } | { quote: string }
 */

export const POSTS = [
  {
    slug: "what-is-email-warmup",
    title: "What Is Email Warmup, and Why Does It Matter?",
    description:
      "A plain-English explanation of email warmup: what it is, why mailbox providers care, and how gradual sending earns the reputation that lands you in the inbox.",
    date: "2026-06-10",
    category: "Fundamentals",
    readingTime: "5 min read",
    content: [
      { p: "If you've ever sent a perfectly good email only to watch it vanish into the spam folder, you've run into the deliverability problem. Email warmup is the most reliable way to solve it — and it's far simpler than it sounds." },
      { h2: "The core idea" },
      { p: "Mailbox providers like Gmail, Outlook and Yahoo decide where your email lands based largely on your sender reputation — a running judgement of how trustworthy your mail is. A brand-new domain or mailbox has no reputation, so providers treat it cautiously, often routing its mail to spam or throttling it." },
      { p: "Email warmup builds that reputation deliberately. Instead of blasting a cold mailbox with high volume on day one, you start small and increase gradually, with steady, engaged sending that looks like organic growth. Over time, providers learn that your mail is wanted — and start delivering it to the inbox." },
      { h2: "Why sudden volume is a red flag" },
      { p: "Spammers tend to acquire a domain and immediately send as much as possible before they're blocked. Filters know this pattern well. When a new sender suddenly pushes high volume, it looks exactly like that behavior, and the filters respond accordingly." },
      { ul: [
        "A cold mailbox sending hundreds of emails on day one looks like spam.",
        "The same mailbox sending a handful of engaged emails, ramping up over weeks, looks legitimate.",
        "The difference is pattern, not content.",
      ] },
      { h2: "What good warmup actually does" },
      { p: "Legitimate warmup increases volume on a gradual schedule, keeps complaint and bounce rates low, and generates genuine engagement signals. It does not use tricks to evade filters — those are what get domains blacklisted in the first place." },
      { p: "At Trustmailtoday, warmup connects via OAuth (no passwords), runs a gradual ramp, and reports a live reputation score built from real signals so you can watch your progress instead of guessing." },
      { h2: "The bottom line" },
      { p: "Warmup isn't a growth hack — it's basic hygiene for anyone who sends important email from a new domain or mailbox. Do it before you launch campaigns, and your most important messages will actually arrive." },
    ],
  },
  {
    slug: "spf-dkim-dmarc-explained",
    title: "SPF, DKIM and DMARC Explained (Without the Jargon)",
    description:
      "The three email authentication records every sender needs, what each one does, and how to set them up so providers trust your mail.",
    date: "2026-06-08",
    category: "Authentication",
    readingTime: "6 min read",
    content: [
      { p: "SPF, DKIM and DMARC are the three records that prove your email is really from you. Get them right and you remove one of the biggest reasons legitimate mail lands in spam. Here's each one in plain English." },
      { h2: "SPF — who's allowed to send" },
      { p: "SPF (Sender Policy Framework) is a DNS record listing which servers are authorized to send email for your domain. When a receiving server gets your message, it checks whether the sending server is on your list. If not, the message looks forged." },
      { p: "An SPF record starts with v=spf1, names your senders (via include: or ip4: mechanisms), and ends with a qualifier like ~all. Keep it under 10 DNS lookups or it becomes invalid." },
      { h2: "DKIM — proof it wasn't tampered with" },
      { p: "DKIM (DomainKeys Identified Mail) adds a cryptographic signature to your outgoing mail. Receivers fetch your public key from DNS and verify the signature, confirming the message really came from your domain and wasn't altered in transit." },
      { h2: "DMARC — what to do on failure" },
      { p: "DMARC ties SPF and DKIM together. It tells receivers what to do when a message fails authentication (nothing, quarantine, or reject) and where to send reports. Start with p=none to monitor, then tighten to p=quarantine and eventually p=reject as your mail passes consistently." },
      { h2: "How to check yours" },
      { p: "You don't have to read raw DNS by hand. Our free SPF, DKIM and DMARC checkers read your live records and tell you exactly what's missing — with a copy-paste record to fix it." },
      { ul: [
        "Publish SPF so receivers know who sends for you.",
        "Enable DKIM so they know your mail is intact.",
        "Add DMARC so they know what to do — and so you get reports.",
      ] },
      { p: "Authentication is the foundation. Once it's solid, warmup and reputation work can do the rest." },
    ],
  },
  {
    slug: "top-reasons-emails-land-in-spam",
    title: "The Top Reasons Emails Land in Spam — and How to Fix Each",
    description:
      "Emails go to spam for a short list of fixable reasons. Here's the checklist, in priority order, with the free tools to diagnose each one.",
    date: "2026-06-05",
    category: "Deliverability",
    readingTime: "7 min read",
    content: [
      { p: "Spam filters weigh many signals, but the reasons good mail gets filtered fall into a handful of categories. Work through them in order and you'll usually find — and fix — the problem fast." },
      { h2: "1. Broken or missing authentication" },
      { p: "If your SPF, DKIM or DMARC is missing or misaligned, receivers can't verify you, and your mail looks suspicious. This is the most common cause and the easiest to fix. Run our free authentication checkers first." },
      { h2: "2. A blacklisted domain or IP" },
      { p: "If your domain or sending IP is on a DNSBL (like Spamhaus), receivers may reject or junk your mail outright. Check your status with our blacklist checker and start the delisting process if you're listed." },
      { h2: "3. Poor sender reputation" },
      { p: "A new or cold sender has no track record, and a sender with rising complaints has a bad one. Both hurt placement. Warmup is the cure — it builds a positive history gradually." },
      { h2: "4. Dirty lists and high bounces" },
      { p: "Sending to invalid, disposable or role-based addresses spikes your bounce and complaint rates, which filters punish. Verify addresses with our email checker before you send." },
      { h2: "5. Spammy content" },
      { p: "Trigger words, ALL CAPS, excessive punctuation and link overload all raise risk. Run your copy through our spam checker — though remember content is only one factor among many." },
      { h2: "Put it together" },
      { ul: [
        "Fix authentication (SPF/DKIM/DMARC).",
        "Confirm you're not blacklisted.",
        "Clean your list.",
        "Sanity-check your content.",
        "Build reputation with warmup.",
      ] },
      { p: "Address these five and you've handled the overwhelming majority of spam-folder causes." },
    ],
  },
  {
    slug: "how-long-does-email-warmup-take",
    title: "How Long Does Email Warmup Take?",
    description:
      "A realistic look at email warmup timelines, what affects them, and why patience beats shortcuts when building sender reputation.",
    date: "2026-06-02",
    category: "Fundamentals",
    readingTime: "4 min read",
    content: [
      { p: "The honest answer: warmup is gradual by design, and rushing it defeats the purpose. But you can set realistic expectations based on a few factors." },
      { h2: "A typical ramp" },
      { p: "Many warmup schedules run over several weeks, starting from a low daily volume and increasing steadily. The goal is a smooth, organic-looking growth curve — not a finish line you sprint toward. Trustmailtoday uses a gradual ramp that grows volume day by day from a safe baseline." },
      { h2: "What affects the timeline" },
      { ul: [
        "Domain age: older domains with some history warm up faster than brand-new ones.",
        "Authentication: a properly authenticated domain builds trust more quickly.",
        "Consistency: steady daily activity matters more than bursts.",
        "Complaints and bounces: keep them low or you'll move backwards.",
      ] },
      { h2: "Why you shouldn't rush" },
      { p: "Skipping warmup or ramping too fast is the fastest way to damage a domain's reputation — sometimes permanently. A few weeks of patience protects an asset you'll rely on for years." },
      { h2: "Watch real progress" },
      { p: "Rather than guessing, track a live reputation score and inbox-placement results as you go. When the numbers climb and your test emails consistently land in the inbox, you're ready to scale up your real sending." },
    ],
  },
];

export function getAllPosts() {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}

export const POST_SLUGS = POSTS.map((p) => p.slug);

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
