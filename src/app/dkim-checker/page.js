import ToolPageLayout from "@/components/tools/ToolPageLayout";
import DnsAuthChecker from "@/components/tools/DnsAuthChecker";

export const metadata = {
  title: "Free DKIM Checker — Trustmailtoday",
  description:
    "Check whether your domain publishes a valid DKIM key. We probe common selectors (google, default, selector1/2 and more) and show how to fix a missing key.",
  alternates: { canonical: "/dkim-checker" },
};

const about = [
  {
    q: "What is DKIM?",
    a: "DKIM (DomainKeys Identified Mail) adds a cryptographic signature to your outgoing mail. Receivers fetch your public key from DNS to verify the message wasn't altered and really came from your domain. It's a core trust signal for inbox placement.",
  },
  {
    q: "Why do you ask about selectors?",
    a: "DKIM keys live at <selector>._domainkey.yourdomain.com, and the selector is chosen by your mail provider. We automatically probe the most common selectors (google, default, selector1, selector2, k1 and others) so you usually don't need to know yours.",
  },
  {
    q: "My DKIM is missing — what now?",
    a: "Generate a DKIM key in your email provider's admin console (for Google Workspace: Apps → Gmail → Authenticate email), then publish the TXT record it gives you. Allow up to 48 hours for DNS to propagate and re-check.",
  },
];

export default function DkimCheckerPage() {
  return (
    <ToolPageLayout
      slug="dkim-checker"
      intro="Enter your domain and we'll look for a published DKIM key across the most common selectors."
      about={about}
    >
      <DnsAuthChecker focus="dkim" />
    </ToolPageLayout>
  );
}
