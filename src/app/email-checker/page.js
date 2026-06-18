import ToolPageLayout from "@/components/tools/ToolPageLayout";
import EmailChecker from "@/components/tools/EmailChecker";

export const metadata = {
  title: "Free Email Checker & Verifier — Trustmailtoday",
  description:
    "Verify an email address: syntax, MX records, disposable-domain and role-based detection. Real DNS checks to spot undeliverable addresses before you send.",
  alternates: { canonical: "/email-checker" },
};

const about = [
  {
    q: "How does email verification work here?",
    a: "We check four things: valid syntax, whether the domain has MX records (so it can actually receive mail), whether it's a known disposable/throwaway provider, and whether it's a role-based address like info@ or support@. We don't send a probe email, so it's safe and non-intrusive.",
  },
  {
    q: "Why does MX matter?",
    a: "If a domain has no MX records, no mail server is configured to receive email there — messages will bounce. MX presence is the strongest deliverability signal you can verify without actually sending mail.",
  },
  {
    q: "Why flag role-based and disposable addresses?",
    a: "Role addresses (info@, sales@) often have lower engagement and higher complaint rates, and disposable domains vanish quickly. Cleaning these from your list protects your sender reputation and bounce rate.",
  },
];

export default function EmailCheckerPage() {
  return (
    <ToolPageLayout
      slug="email-checker"
      intro="Enter an email address to validate its syntax, mail server (MX) and quality signals."
      about={about}
    >
      <EmailChecker />
    </ToolPageLayout>
  );
}
