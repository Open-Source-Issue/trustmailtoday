import ToolPageLayout from "@/components/tools/ToolPageLayout";
import GmailAliasGenerator from "@/components/tools/GmailAliasGenerator";

export const metadata = {
  title: "Free Gmail Alias Generator (Dot & +Tag) — Trustmailtoday",
  description:
    "Generate Gmail aliases using the dot trick and +tag sub-addressing. Every alias delivers to your one inbox — perfect for organizing mail and testing filters.",
  alternates: { canonical: "/gmail-generator" },
};

const about = [
  {
    q: "How do Gmail aliases work?",
    a: "Gmail ignores dots in the local part, so john.doe@gmail.com and johndoe@gmail.com are the same inbox. It also supports +tags, so johndoe+news@gmail.com still reaches you. This tool generates valid dot and +tag variations of your address.",
  },
  {
    q: "What can I use aliases for?",
    a: "Organizing incoming mail with filters, tracking which service shared or sold your address, and testing your own signup or filtering logic. Use them responsibly — not to abuse free-trial or signup limits.",
  },
  {
    q: "Do aliases affect deliverability?",
    a: "Receiving mail at an alias is fine. Sending from many lookalike addresses, however, can look suspicious. For real sending, build genuine reputation through proper warmup rather than juggling aliases.",
  },
];

export default function GmailGeneratorPage() {
  return (
    <ToolPageLayout
      slug="gmail-generator"
      intro="Enter your Gmail username to generate dot and +tag aliases that all land in your inbox."
      about={about}
    >
      <GmailAliasGenerator />
    </ToolPageLayout>
  );
}
