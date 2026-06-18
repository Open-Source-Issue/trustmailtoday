/**
 * Content for the use-case / SEO landing pages. One entry per route slug,
 * rendered by components/LandingPage.js. All copy is original and grounded in
 * the actual product (gradual warmup, real reputation scoring, OAuth connect,
 * SPF/DKIM/DMARC tooling). Provider pages stay honest: automated warmup connects
 * via Google OAuth today; no false one-click Outlook/Yahoo claims.
 */

const SOLUTION = {
  warmup: {
    icon: "TrendingUp",
    title: "Gradual, human-like warmup",
    desc: "Volume ramps day by day from a safe baseline so mailbox providers see steady, organic growth instead of a spammy spike.",
  },
  reputation: {
    icon: "Gauge",
    title: "Live reputation scoring",
    desc: "A 0–100 score built from real signals — authentication, bounces, complaints, placement and engagement — so you always know where you stand.",
  },
  placement: {
    icon: "MailCheck",
    title: "Inbox placement tracking",
    desc: "See whether your test mail lands in Primary, Promotions or Spam, plus SPF/DKIM/DMARC results, before you run a real campaign.",
  },
};

export const LANDING_PAGES = {
  "email-warmup-tool": {
    metaTitle: "Email Warmup Tool — Trustmailtoday",
    metaDescription:
      "An automated email warmup tool that builds real sender reputation with gradual sending and live reputation tracking, so your emails land in the inbox.",
    eyebrow: "Email warmup tool",
    heroIcon: "TrendingUp",
    title: "The email warmup tool that builds",
    highlight: "real reputation",
    subtitle:
      "Automatically warm up your mailbox with gradual, realistic sending and live reputation tracking — built on legitimate deliverability, not spam-filter tricks.",
    intro:
      "A cold mailbox with no sending history is treated with suspicion by Gmail, Outlook and Yahoo. An email warmup tool fixes that by sending and engaging with mail on your behalf, slowly increasing volume until providers trust your domain. Trustmailtoday does this the honest way — and shows you the results in real time.",
    benefits: [SOLUTION.warmup, SOLUTION.reputation, SOLUTION.placement],
    sections: [
      {
        heading: "Why you need email warmup",
        body: [
          "Mailbox providers score every sender. New domains, new mailboxes and senders who suddenly increase volume all look risky — and risky mail gets filtered to spam or throttled.",
          "Warmup establishes a positive track record. By sending small, steady, engaged volumes that grow over time, you teach providers that your mail is wanted, which lifts your inbox placement before you ever launch a campaign.",
        ],
      },
      {
        heading: "How Trustmailtoday's warmup works",
        body: [
          "Connect your inbox securely with Google OAuth — no passwords, ever. Our engine then runs a gradual ramp, sending warmup messages and measuring where they land.",
          "As the ramp progresses, your reputation score climbs and you can watch the factor-by-factor breakdown improve. You stay in control and can disconnect at any time.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is email warmup safe?",
        a: "Yes — when done legitimately. We never use spam-filter tricks or send unsolicited bulk email. We build reputation through gradual, realistic sending that mirrors organic growth, which is exactly what protects your domain.",
      },
      {
        q: "How long does warmup take?",
        a: "Warmup is gradual by design. Most senders see reputation improvements within the first couple of weeks, with continued gains as volume safely ramps. Domain age and authentication setup affect the timeline.",
      },
    ],
  },

  "warmup-inbox": {
    metaTitle: "Warm Up Your Inbox — Trustmailtoday",
    metaDescription:
      "Warm up your inbox to escape the spam folder. Gradual sending, live reputation scoring and inbox-placement tracking that gets your emails seen.",
    eyebrow: "Warmup inbox",
    heroIcon: "Inbox",
    title: "Warm up your inbox and",
    highlight: "win the inbox",
    subtitle:
      "Turn a cold, untrusted mailbox into a sender providers welcome — with automated warmup and real-time reputation tracking.",
    intro:
      "Whether you just created a mailbox or your sending stalled, warming up your inbox rebuilds the trust that gets your mail delivered. Trustmailtoday automates the process and shows you measurable progress.",
    benefits: [SOLUTION.warmup, SOLUTION.placement, SOLUTION.reputation],
    sections: [
      {
        heading: "Signs your inbox needs warming up",
        body: [
          "Replies have dried up, open rates dropped, or test emails to colleagues land in spam. Bounce rates crept up after you increased volume. These are classic symptoms of a reputation problem.",
          "Warming up your inbox addresses the root cause — sender trust — rather than tweaking subject lines and hoping for the best.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need a custom domain to warm up my inbox?",
        a: "You can warm up any connected mailbox, but custom domains benefit most because you control authentication (SPF/DKIM/DMARC). Free provider addresses are managed for you and can't be authenticated the same way.",
      },
    ],
  },

  "email-warmup-microsoft": {
    metaTitle: "Email Warmup for Microsoft / Outlook — Trustmailtoday",
    metaDescription:
      "Improve deliverability for Microsoft 365 and Outlook senders. Understand Outlook's filters and build the sender reputation that keeps you out of Junk.",
    eyebrow: "Microsoft & Outlook",
    heroIcon: "Inbox",
    title: "Better deliverability for",
    highlight: "Outlook & Microsoft 365",
    subtitle:
      "Outlook and Microsoft 365 run some of the strictest spam filters around. Build the reputation and authentication that keep your mail out of Junk.",
    intro:
      "Microsoft's filtering (including SmartScreen and SCL scoring) is notoriously aggressive with new or cold senders. Strong authentication and a steady, trustworthy sending pattern are the most reliable ways to reach Outlook and Microsoft 365 inboxes.",
    benefits: [SOLUTION.reputation, SOLUTION.placement, SOLUTION.warmup],
    sections: [
      {
        heading: "Why Outlook sends good mail to Junk",
        body: [
          "Microsoft weighs sender reputation, authentication alignment and recipient engagement heavily. A new domain with no history, or a sudden volume increase, often gets quarantined or junked by default.",
          "Getting your SPF, DKIM and DMARC aligned is step one — use our free checkers to confirm them. Building a consistent, positive sending history is step two, which is where warmup helps.",
        ],
      },
      {
        heading: "How to improve Microsoft deliverability",
        body: [
          "Verify authentication with our SPF, DKIM and DMARC checkers, keep lists clean with the email checker, and warm up your sending so reputation grows steadily rather than spiking.",
          "Note: Trustmailtoday's automated warmup currently connects mailboxes via Google OAuth. The authentication tools and deliverability guidance on this page apply to any domain, including Microsoft 365.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does Trustmailtoday connect directly to Outlook?",
        a: "Our automated warmup connects via Google OAuth today. Our free authentication and deliverability tools work for any domain, including Microsoft 365 and Outlook, and our guidance applies regardless of provider.",
      },
    ],
  },

  "email-warmup-yahoo": {
    metaTitle: "Email Warmup for Yahoo — Trustmailtoday",
    metaDescription:
      "Reach the Yahoo inbox. Learn how Yahoo filters mail and build the authentication and sender reputation that improve your Yahoo deliverability.",
    eyebrow: "Yahoo Mail",
    heroIcon: "Inbox",
    title: "Improve your",
    highlight: "Yahoo deliverability",
    subtitle:
      "Yahoo weighs authentication and engagement heavily. Build the reputation and DNS setup that keep your mail in the Yahoo inbox.",
    intro:
      "Yahoo (and AOL, which shares its infrastructure) enforces sender authentication and watches engagement closely. Senders who follow the rules and build steady reputation see far better Yahoo placement.",
    benefits: [SOLUTION.reputation, SOLUTION.warmup, SOLUTION.placement],
    sections: [
      {
        heading: "What Yahoo cares about",
        body: [
          "Yahoo expects valid SPF, DKIM and DMARC, low complaint rates, and genuine engagement. Bulk senders must follow its sender requirements or risk being throttled or junked.",
          "Confirm your authentication with our free checkers, then build a consistent, positive sending history through warmup so Yahoo learns to trust you.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why does my mail go to Yahoo spam?",
        a: "Usually weak authentication, low engagement, or an inconsistent sending pattern. Fix authentication first (use our SPF/DKIM/DMARC checkers), then build reputation with gradual warmup.",
      },
    ],
  },

  "warmup-gmail-account": {
    metaTitle: "Warm Up a Gmail / Google Workspace Account — Trustmailtoday",
    metaDescription:
      "Warm up a new Gmail or Google Workspace account safely. Connect with OAuth and build sender reputation gradually so your emails reach the Primary inbox.",
    eyebrow: "Gmail & Google Workspace",
    heroIcon: "MailCheck",
    title: "Warm up your",
    highlight: "Gmail account",
    subtitle:
      "Connect your Gmail or Google Workspace mailbox with OAuth and build the reputation that lands you in Primary — not Promotions or Spam.",
    intro:
      "New Gmail and Google Workspace accounts have no sending history, so Google watches them closely. Warmup builds a positive track record gradually, which is exactly what Gmail rewards with inbox placement.",
    benefits: [SOLUTION.warmup, SOLUTION.reputation, SOLUTION.placement],
    sections: [
      {
        heading: "Gmail rewards consistency",
        body: [
          "Gmail's filters favor senders with steady volume, strong authentication and real engagement. Sudden spikes from a fresh account are a red flag.",
          "Because our automated warmup connects via Google OAuth, Gmail and Google Workspace accounts are the most seamless to warm up with Trustmailtoday — no passwords, and you can disconnect anytime.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will warming up my Gmail get it banned?",
        a: "No. We build reputation with gradual, legitimate sending and never use spam tactics. That's the opposite of what gets accounts flagged.",
      },
    ],
  },

  "ip-warmup": {
    metaTitle: "IP Warmup — Trustmailtoday",
    metaDescription:
      "Understand IP warmup: how to gradually build a sending IP's reputation so mailbox providers trust it. Plus the authentication checks that support it.",
    eyebrow: "IP warmup",
    heroIcon: "Network",
    title: "IP warmup,",
    highlight: "explained",
    subtitle:
      "A new or cold sending IP has no reputation. IP warmup gradually increases volume so providers learn to trust it before you send at scale.",
    intro:
      "If you send from a dedicated IP (your own mail server or a dedicated address from an ESP), that IP earns its own reputation. Ramping volume gradually is essential — flooding a cold IP is one of the fastest ways to get filtered.",
    benefits: [SOLUTION.warmup, SOLUTION.reputation, SOLUTION.placement],
    sections: [
      {
        heading: "Dedicated vs shared IPs",
        body: [
          "On a shared IP, you inherit the pooled reputation of every sender on it. On a dedicated IP, the reputation is entirely yours — powerful at scale, but it must be warmed up from zero.",
          "Whichever you use, authentication still matters. Confirm SPF, DKIM and DMARC with our free checkers and verify you're not on a blacklist before ramping volume.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does IP warmup take?",
        a: "Typically a few weeks of gradual ramping, depending on your target volume. The key is consistency and low complaint rates throughout.",
      },
    ],
  },

  "smtp-warmup": {
    metaTitle: "SMTP Warmup — Trustmailtoday",
    metaDescription:
      "What SMTP warmup is and how to do it right: gradually ramp sending through your SMTP server while keeping authentication and reputation healthy.",
    eyebrow: "SMTP warmup",
    heroIcon: "Server",
    title: "SMTP warmup",
    highlight: "done right",
    subtitle:
      "Ramp sending through your SMTP server gradually so receiving servers build trust in your mail flow instead of throttling it.",
    intro:
      "When you send through a new SMTP setup, receiving servers have no history for it. SMTP warmup means increasing volume slowly while keeping bounces and complaints low, so your mail flow earns a clean reputation.",
    benefits: [SOLUTION.warmup, SOLUTION.placement, SOLUTION.reputation],
    sections: [
      {
        heading: "Get the fundamentals right first",
        body: [
          "Before ramping, make sure your sending domain has valid SPF, DKIM and DMARC and isn't blacklisted — our free tools check all of these in seconds.",
          "Then increase volume gradually and monitor bounces and complaints. Sudden jumps or high error rates will undo your progress quickly.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is SMTP warmup the same as inbox warmup?",
        a: "They're related. Inbox/mailbox warmup focuses on a specific account's reputation; SMTP/IP warmup focuses on the server or IP doing the sending. Both rely on the same principle: gradual, consistent, low-complaint sending.",
      },
    ],
  },

  "how-to-avoid-spam-folder": {
    metaTitle: "How to Avoid the Spam Folder — Trustmailtoday",
    metaDescription:
      "A practical guide to staying out of spam: authentication, list hygiene, content, engagement and sender reputation — with free tools to check each.",
    eyebrow: "Deliverability guide",
    heroIcon: "ShieldCheck",
    title: "How to avoid the",
    highlight: "spam folder",
    subtitle:
      "Staying out of spam comes down to five things: authentication, reputation, list quality, content and engagement. Here's how to get each right.",
    intro:
      "There's no single trick to reach the inbox — filters weigh many signals. But the fundamentals are well understood, and you can check most of them for free with our tools.",
    benefits: [SOLUTION.reputation, SOLUTION.placement, SOLUTION.warmup],
    sections: [
      {
        heading: "The deliverability checklist",
        body: [
          "1. Authenticate: publish valid SPF, DKIM and DMARC (check them with our free tools). 2. Stay off blacklists: verify your domain and IP aren't listed. 3. Clean your list: remove invalid and disposable addresses. 4. Mind your content: avoid spam-trigger words and heavy formatting. 5. Build reputation: warm up gradually and keep engagement high.",
          "Get these five right and you've addressed the vast majority of spam-folder causes.",
        ],
      },
    ],
    faqs: [
      {
        q: "What's the single biggest cause of landing in spam?",
        a: "For most senders it's weak sender reputation combined with missing or misaligned authentication. Fix authentication, then build reputation through warmup.",
      },
    ],
  },

  "emails-going-to-spam": {
    metaTitle: "Why Are My Emails Going to Spam? — Trustmailtoday",
    metaDescription:
      "Diagnose why your emails go to spam: authentication failures, blacklists, poor reputation, risky content or low engagement — and how to fix each.",
    eyebrow: "Troubleshooting",
    heroIcon: "AlertTriangle",
    title: "Why are my emails",
    highlight: "going to spam?",
    subtitle:
      "Emails land in spam for a handful of fixable reasons. Work through them in order and you'll usually find the culprit fast.",
    intro:
      "If your emails suddenly started going to spam, something changed — your reputation, your authentication, your list, or your sending pattern. Here's how to diagnose it methodically.",
    benefits: [SOLUTION.placement, SOLUTION.reputation, SOLUTION.warmup],
    sections: [
      {
        heading: "Diagnose it step by step",
        body: [
          "Check authentication first: run our SPF, DKIM and DMARC checkers. A recent DNS change can break alignment overnight. Next, check blacklists for your domain and IP.",
          "Then look at behavior: did you increase volume suddenly, buy a list, or change content? Each can tank placement. Finally, run an inbox-placement test to see exactly where your mail lands.",
        ],
      },
    ],
    faqs: [
      {
        q: "My emails went to spam overnight — what happened?",
        a: "Sudden changes are usually a broken DNS/authentication record, a new blacklisting, or a volume spike. Check authentication and blacklists first with our free tools.",
      },
    ],
  },

  "why-emails-dont-get-replies": {
    metaTitle: "Why Your Emails Don't Get Replies — Trustmailtoday",
    metaDescription:
      "Low reply rates often start with deliverability: if your email is in spam, it can't be answered. Diagnose placement, then improve targeting and copy.",
    eyebrow: "Reply rates",
    heroIcon: "MessageSquare",
    title: "Why your emails",
    highlight: "don't get replies",
    subtitle:
      "Before you blame your copy, check your placement. An email sitting in spam can't be replied to — deliverability is the silent reply-rate killer.",
    intro:
      "Teams obsess over subject lines and CTAs, but the first question should be: is the email even being seen? Poor inbox placement caps your reply rate no matter how good the writing is.",
    benefits: [SOLUTION.placement, SOLUTION.reputation, SOLUTION.warmup],
    sections: [
      {
        heading: "Placement first, then persuasion",
        body: [
          "Run an inbox-placement test. If your mail is landing in Promotions or Spam, fix that before touching your copy — it's the highest-leverage change you can make.",
          "Once you're reliably in the inbox, then optimize targeting, personalization and your call to action. Good copy on delivered mail is what earns replies.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I know if deliverability is my problem?",
        a: "Run a placement test to a few seed accounts across providers. If you're not consistently in Primary/Inbox, deliverability is capping your replies.",
      },
    ],
  },

  "email-warmup-for-agencies": {
    metaTitle: "Email Warmup for Agencies — Trustmailtoday",
    metaDescription:
      "Email warmup built for agencies managing many client domains and mailboxes. Protect deliverability across accounts and prove results with real reputation data.",
    eyebrow: "For agencies",
    heroIcon: "Building2",
    title: "Email warmup for",
    highlight: "agencies",
    subtitle:
      "Manage deliverability across multiple client mailboxes and domains, and show clients real reputation data — not guesswork.",
    intro:
      "Agencies live and die by deliverability. When client campaigns hit spam, results crater and churn follows. Warmup and reputation monitoring protect the accounts your business depends on.",
    benefits: [SOLUTION.reputation, SOLUTION.placement, SOLUTION.warmup],
    sections: [
      {
        heading: "Why agencies warm up",
        body: [
          "New client domains and fresh mailboxes need a track record before campaigns launch. Warming them up first protects sender reputation and campaign performance from day one.",
          "Transparent reputation scoring also gives you something concrete to report to clients, turning deliverability from an invisible risk into a demonstrable win.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I manage multiple inboxes?",
        a: "Paid plans support multiple connected inboxes; the Enterprise tier is built for teams and agencies with unlimited inboxes and API access. See the pricing page for details.",
      },
    ],
    cta: {
      title: "Protect every client's",
      highlight: "deliverability",
      subtitle:
        "Warm up client mailboxes and monitor reputation in one place. See plans built for teams and agencies.",
      secondaryHref: "/pricing",
      secondaryLabel: "See agency pricing",
    },
  },

  "email-warmup-for-cold-outbound": {
    metaTitle: "Email Warmup for Cold Outbound — Trustmailtoday",
    metaDescription:
      "Cold outbound only works if you reach the inbox. Warm up your sending domains and mailboxes so your cold email campaigns actually get delivered.",
    eyebrow: "For cold outbound",
    heroIcon: "Rocket",
    title: "Email warmup for",
    highlight: "cold outbound",
    subtitle:
      "Cold email is pointless if it lands in spam. Warm up your mailboxes and protect your domains so your outbound reaches real people.",
    intro:
      "Cold outbound puts unusual strain on deliverability: new domains, fresh mailboxes and higher volumes are exactly what filters distrust. Warmup is the foundation that makes the rest of your sequence work.",
    benefits: [SOLUTION.warmup, SOLUTION.reputation, SOLUTION.placement],
    sections: [
      {
        heading: "Warm up before you send cold",
        body: [
          "Launching cold campaigns from a brand-new mailbox is the fastest route to the spam folder and a burned domain. Warm up first so there's a positive history in place.",
          "Pair warmup with clean lists (verify addresses with our email checker), solid authentication, and conservative initial volume to keep complaint rates low.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long before I can start cold sending?",
        a: "Give new mailboxes a couple of weeks of warmup before meaningful cold volume, then ramp gradually. Rushing it risks your domain's long-term reputation.",
      },
    ],
  },

  "email-warmup-for-developers": {
    metaTitle: "Email Warmup for Developers — Trustmailtoday",
    metaDescription:
      "Make sure your transactional and product emails reach users. Warmup, authentication tooling and reputation monitoring for developers who send email.",
    eyebrow: "For developers",
    heroIcon: "Code2",
    title: "Email warmup for",
    highlight: "developers",
    subtitle:
      "Shipping transactional or product email? Make sure password resets, receipts and notifications actually arrive — not just return a 200.",
    intro:
      "A successful API call doesn't mean the email reached the inbox. Developers need the same deliverability fundamentals as marketers: authentication, reputation and placement visibility.",
    benefits: [SOLUTION.placement, SOLUTION.reputation, SOLUTION.warmup],
    sections: [
      {
        heading: "Deliverability is part of the stack",
        body: [
          "Verify SPF, DKIM and DMARC for your sending domain with our free checkers, and make sure you're not blacklisted. These are the email equivalent of a green CI pipeline.",
          "When you spin up a new sending domain or mailbox, warm it up before relying on it for critical transactional mail. The Enterprise plan includes API access for teams that want to integrate deeper.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is there an API?",
        a: "API access is included on the Enterprise plan. The free deliverability tools (SPF/DKIM/DMARC, blacklist, email verification) are also great for manual checks during development.",
      },
    ],
  },

  "email-warmup-for-founders": {
    metaTitle: "Email Warmup for Founders — Trustmailtoday",
    metaDescription:
      "Founders rely on email for sales, fundraising and hiring. Warm up your mailbox so your most important messages reach the inbox, not spam.",
    eyebrow: "For founders",
    heroIcon: "Rocket",
    title: "Email warmup for",
    highlight: "founders",
    subtitle:
      "Your outreach to investors, customers and candidates is too important to land in spam. Build the reputation that gets you read.",
    intro:
      "Early-stage founders send some of their highest-stakes emails from brand-new domains. Warmup ensures those messages — sales, fundraising, hiring — actually arrive.",
    benefits: [SOLUTION.warmup, SOLUTION.placement, SOLUTION.reputation],
    sections: [
      {
        heading: "Don't burn your new domain",
        body: [
          "A new company domain has zero sending history. Blasting it with outreach on day one teaches providers to distrust it — right when you can least afford it.",
          "Warm it up gradually, get authentication right, and your important emails will land where they belong. Trustmailtoday is priced to be startup-friendly, starting free.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this affordable for a pre-revenue startup?",
        a: "Yes. There's a free plan to start, and paid plans begin at ₹200/month. Pricing is built with early-stage founders in mind.",
      },
    ],
    cta: {
      title: "Make every founder email",
      highlight: "count",
      subtitle:
        "Start free and warm up your domain before your next big send.",
      secondaryHref: "/pricing",
      secondaryLabel: "See pricing",
    },
  },

  "email-warmup-for-marketers": {
    metaTitle: "Email Warmup for Marketers — Trustmailtoday",
    metaDescription:
      "Protect your email marketing ROI. Warm up sending mailboxes and monitor reputation so campaigns reach the inbox and your metrics reflect reality.",
    eyebrow: "For marketers",
    heroIcon: "Megaphone",
    title: "Email warmup for",
    highlight: "marketers",
    subtitle:
      "Open and click rates only matter if your email reaches the inbox. Warm up your sending and protect the channel your numbers depend on.",
    intro:
      "Marketers optimize subject lines and send times, but deliverability sets the ceiling on every metric. If campaigns are slipping into Promotions or Spam, warmup and reputation work fix the foundation.",
    benefits: [SOLUTION.placement, SOLUTION.reputation, SOLUTION.warmup],
    sections: [
      {
        heading: "Deliverability is your real funnel top",
        body: [
          "Every email that lands in spam is a lost open, click and conversion you'll never see in your dashboard. Inbox placement is the true top of your email funnel.",
          "Verify authentication, keep lists clean with the email checker, scan campaigns with the spam checker, and warm up sending mailboxes so your reach reflects your effort.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will warmup improve my open rates?",
        a: "Indirectly but meaningfully — better inbox placement means more of your audience actually sees your email, which lifts opens and clicks across the board.",
      },
    ],
  },

  "email-warmup-for-sales": {
    metaTitle: "Email Warmup for Sales Teams — Trustmailtoday",
    metaDescription:
      "Sales runs on email that gets opened and answered. Warm up rep mailboxes and protect deliverability so your pipeline doesn't leak into spam.",
    eyebrow: "For sales teams",
    heroIcon: "TrendingUp",
    title: "Email warmup for",
    highlight: "sales teams",
    subtitle:
      "Every rep email that hits spam is a lost opportunity. Warm up mailboxes and protect deliverability so your pipeline keeps flowing.",
    intro:
      "Sales outreach depends on getting seen and getting replies. When rep mailboxes are cold or domains are untrusted, deliverability quietly drains your pipeline.",
    benefits: [SOLUTION.warmup, SOLUTION.placement, SOLUTION.reputation],
    sections: [
      {
        heading: "Protect every rep's mailbox",
        body: [
          "New reps, new mailboxes and ramped outbound volume all stress deliverability. Warming up each mailbox protects reply rates and keeps quota attainment on track.",
          "Combine warmup with verified authentication and clean prospect lists to keep bounces and complaints low — the metrics that decide whether you reach the inbox.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can we warm up several reps' inboxes?",
        a: "Yes — paid plans support multiple inboxes, and Enterprise offers unlimited inboxes with team access. See the pricing page.",
      },
    ],
    cta: {
      title: "Keep your pipeline out of",
      highlight: "spam",
      subtitle:
        "Warm up your reps' mailboxes and protect deliverability across the team.",
      secondaryHref: "/pricing",
      secondaryLabel: "See team pricing",
    },
  },

  "email-warmup-for-newsletter-creators": {
    metaTitle: "Email Warmup for Newsletter Creators — Trustmailtoday",
    metaDescription:
      "Grow a newsletter that actually reaches inboxes. Warm up your sending, protect your reputation and keep subscribers engaged instead of unsubscribed by spam.",
    eyebrow: "For newsletter creators",
    heroIcon: "Newspaper",
    title: "Email warmup for",
    highlight: "newsletter creators",
    subtitle:
      "A newsletter only grows if it reaches inboxes. Warm up your sending and protect the reputation your subscriber relationships depend on.",
    intro:
      "Newsletter creators face a unique deliverability challenge: growing volume to engaged audiences while staying out of the Promotions tab and spam. Reputation and consistency are everything.",
    benefits: [SOLUTION.reputation, SOLUTION.placement, SOLUTION.warmup],
    sections: [
      {
        heading: "Land in Primary, not Promotions",
        body: [
          "Consistent sending to engaged readers builds the reputation that keeps you in the Primary inbox. Sudden volume jumps or rising complaints push you toward Promotions or spam.",
          "Warm up new sending mailboxes, authenticate your domain, and keep your list clean so your hard-won subscribers actually see each issue.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I stay out of the Promotions tab?",
        a: "Strong reputation, genuine engagement and lightweight, less 'promotional' formatting all help. Warmup builds the reputation foundation; our spam checker helps you keep content clean.",
      },
    ],
  },
};

export function getLandingPage(slug) {
  return LANDING_PAGES[slug] || null;
}

export const LANDING_SLUGS = Object.keys(LANDING_PAGES);
