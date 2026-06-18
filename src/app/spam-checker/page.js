import ToolPageLayout from "@/components/tools/ToolPageLayout";
import SpamChecker from "@/components/tools/SpamChecker";

export const metadata = {
  title: "Free Spam Checker — Email Spam Word Analyzer — Trustmailtoday",
  description:
    "Paste your subject and body to scan for spam-trigger words and risky formatting (ALL CAPS, excess punctuation, link overload). Get an instant spam-risk score.",
  alternates: { canonical: "/spam-checker" },
};

const about = [
  {
    q: "What does the spam checker look for?",
    a: "It scans your subject and body for well-known spam-trigger phrases across categories (urgency, money, hype, hard-sell, sketchy/phishing), plus structural red flags like excessive ALL-CAPS, too many exclamation marks, currency-symbol spam and link overload.",
  },
  {
    q: "Is a low score a guarantee of inbox placement?",
    a: "No — and we won't pretend otherwise. Content is only one factor. Authentication (SPF/DKIM/DMARC), sender reputation, list quality and engagement matter just as much. Use this as a content sanity-check, then warm up your domain for the rest.",
  },
  {
    q: "Does my email content get stored?",
    a: "No. The analysis runs entirely in your browser — your subject and body are never sent to our servers.",
  },
];

export default function SpamCheckerPage() {
  return (
    <ToolPageLayout
      slug="spam-checker"
      intro="Paste your email below to find spam-trigger words and formatting that could send you to the junk folder. Runs entirely in your browser."
      about={about}
    >
      <SpamChecker />
    </ToolPageLayout>
  );
}
