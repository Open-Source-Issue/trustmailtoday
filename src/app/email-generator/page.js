import ToolPageLayout from "@/components/tools/ToolPageLayout";
import EmailGenerator from "@/components/tools/EmailGenerator";

export const metadata = {
  title: "Free Email Generator — Bulk Test Addresses — Trustmailtoday",
  description:
    "Generate test email addresses in bulk for QA, seed data and form testing. Choose count, domain and style. Defaults to the reserved example.com domain.",
  alternates: { canonical: "/email-generator" },
};

const about = [
  {
    q: "What is this for?",
    a: "Generating realistic-looking email addresses for testing signup forms, validation logic, placeholders and seed data — without using anyone's real address.",
  },
  {
    q: "Will these reach a real inbox?",
    a: "By default we use example.com, a domain reserved by RFC 2606 that can never receive mail, so generated addresses are safe. If you set your own domain, treat the output accordingly and use it responsibly.",
  },
  {
    q: "What do the styles mean?",
    a: "Word-based produces friendly combinations like swiftfalcon421@…, Name-like produces patterns like bright.maple12@…, and Random string produces opaque local parts. Pick whatever best matches your test data.",
  },
];

export default function EmailGeneratorPage() {
  return (
    <ToolPageLayout
      slug="email-generator"
      intro="Create test email addresses in bulk for QA and seed data. Pick how many, the domain, and the style."
      about={about}
    >
      <EmailGenerator />
    </ToolPageLayout>
  );
}
