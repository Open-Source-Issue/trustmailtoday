import ToolPageLayout from "@/components/tools/ToolPageLayout";
import DnsAuthChecker from "@/components/tools/DnsAuthChecker";

export const metadata = {
  title: "Free SPF Record Checker — Trustmailtoday",
  description:
    "Check your domain's SPF record instantly. See whether SPF is published, valid and authorizing your real senders — with a copy-paste fix if it's missing.",
  alternates: { canonical: "/spf-checker" },
};

const about = [
  {
    q: "What is SPF?",
    a: "SPF (Sender Policy Framework) is a DNS TXT record that lists which servers are allowed to send email for your domain. Receiving servers use it to detect forged senders. A missing or broken SPF record is one of the most common reasons legitimate mail lands in spam.",
  },
  {
    q: "How does this checker work?",
    a: "We query your domain's live DNS TXT records directly (no third-party API) and look for a valid v=spf1 record. If it's missing or weak, we show a recommended record you can copy into your DNS provider.",
  },
  {
    q: "What should my SPF record look like?",
    a: "It starts with v=spf1, lists your senders via include: or ip4:/ip6: mechanisms, and ends with an ~all (soft fail) or -all (hard fail) qualifier. Keep it under 10 DNS lookups to stay valid.",
  },
];

export default function SpfCheckerPage() {
  return (
    <ToolPageLayout
      slug="spf-checker"
      intro="Enter your domain to verify your SPF record in real time. We read your live DNS and tell you exactly what to fix."
      about={about}
    >
      <DnsAuthChecker focus="spf" />
    </ToolPageLayout>
  );
}
