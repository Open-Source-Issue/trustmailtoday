import ToolPageLayout from "@/components/tools/ToolPageLayout";
import DnsAuthChecker from "@/components/tools/DnsAuthChecker";

export const metadata = {
  title: "Free DMARC Checker — Trustmailtoday",
  description:
    "Check your domain's DMARC record and policy. See whether you're on p=none, quarantine or reject — and get a recommended record if it's missing or weak.",
  alternates: { canonical: "/dmarc-checker" },
};

const about = [
  {
    q: "What is DMARC?",
    a: "DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receivers what to do when a message fails SPF or DKIM, and where to send aggregate reports. It ties your authentication together and protects your domain from spoofing.",
  },
  {
    q: "What does p=none / quarantine / reject mean?",
    a: "p=none only monitors (no enforcement) — a safe starting point. p=quarantine sends failing mail to spam. p=reject blocks it outright. Move up the ladder as your authentication becomes consistent. This tool flags p=none as 'weak' so you know there's room to harden.",
  },
  {
    q: "Where does the DMARC record live?",
    a: "As a TXT record at _dmarc.yourdomain.com starting with v=DMARC1. We read it live from DNS and, if it's missing or set to monitor-only, suggest a stronger record you can copy.",
  },
];

export default function DmarcCheckerPage() {
  return (
    <ToolPageLayout
      slug="dmarc-checker"
      intro="Enter your domain to read your live DMARC policy and find out whether it's actually protecting you."
      about={about}
    >
      <DnsAuthChecker focus="dmarc" />
    </ToolPageLayout>
  );
}
