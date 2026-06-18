import ToolPageLayout from "@/components/tools/ToolPageLayout";
import BlacklistChecker from "@/components/tools/BlacklistChecker";

export const metadata = {
  title: "Free Blacklist Checker (DNSBL) — Trustmailtoday",
  description:
    "Check whether your domain or IP is listed on major email blacklists like Spamhaus, SpamCop, Barracuda and SORBS. Real-time DNSBL lookups, no signup.",
  alternates: { canonical: "/blacklist-checker" },
};

const about = [
  {
    q: "What is a blacklist (DNSBL)?",
    a: "A DNS-based blacklist is a list of IPs or domains known for sending spam. Mail servers query these lists in real time and may reject or junk your email if you're listed. Getting blacklisted can quietly destroy your deliverability.",
  },
  {
    q: "Which lists do you check?",
    a: "We query widely-used public zones including Spamhaus ZEN, SpamCop, Barracuda, SORBS, Abuseat CBL, UCEPROTECT and PSBL — exactly the way a receiving mail server does, directly over DNS.",
  },
  {
    q: "I'm listed — how do I get removed?",
    a: "Each blacklist runs its own delisting process; visit the listing provider's site to request removal after fixing the root cause (compromised account, misconfigured server, or poor sending practices). Then rebuild trust gradually with proper warmup.",
  },
];

export default function BlacklistCheckerPage() {
  return (
    <ToolPageLayout
      slug="blacklist-checker"
      intro="Enter a domain or IPv4 address to check it against major email blacklists in real time."
      about={about}
    >
      <BlacklistChecker />
    </ToolPageLayout>
  );
}
