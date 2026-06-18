import ToolPageLayout from "@/components/tools/ToolPageLayout";
import EmailSignatureGenerator from "@/components/tools/EmailSignatureGenerator";

export const metadata = {
  title: "Free Email Signature Generator — Trustmailtoday",
  description:
    "Build a clean, professional, deliverability-friendly email signature. Live preview and one-click HTML export for Gmail, Outlook and any email client.",
  alternates: { canonical: "/email-signature-generator" },
};

const about = [
  {
    q: "How do I use the generated signature?",
    a: "Fill in your details, pick an accent color, then click 'Copy signature HTML'. Paste it into Gmail Settings → Signature, Outlook's signature editor, or your client of choice. The preview shows exactly how it will render.",
  },
  {
    q: "Why a 'deliverability-friendly' signature?",
    a: "Heavy image-based signatures, tracking pixels and lots of links can raise spam risk and slow loading. This generator produces lightweight, text-first HTML with a single accent — clean for both inbox placement and readability.",
  },
  {
    q: "Is my information saved?",
    a: "No. Everything runs in your browser; we never receive or store the details you type.",
  },
];

export default function EmailSignatureGeneratorPage() {
  return (
    <ToolPageLayout
      slug="email-signature-generator"
      intro="Create a professional, lightweight email signature with a live preview and copy-paste HTML. Nothing leaves your browser."
      about={about}
    >
      <EmailSignatureGenerator />
    </ToolPageLayout>
  );
}
