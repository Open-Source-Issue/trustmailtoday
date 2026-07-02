import SubPageShell from "@/components/SubPageShell";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Pricing — Trustmailtoday",
  description:
    "Simple, honest email warmup pricing. Start free with 10 warmup emails/day, or go unlimited from $19/month with a 7-day free trial. Cards worldwide; UPI supported for India (billed in INR). Cancel anytime.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <SubPageShell>
      {/* Pricing's own py-24 clears the fixed navbar; it carries the page header. */}
      <Pricing />
      <FAQ />
      <CTASection
        title="Start free. Upgrade when you're"
        highlight="ready."
        subtitle="Connect your inbox in seconds and warm it up on the Free plan — no card required. Move up only when you need more volume or inboxes."
        secondaryHref="/free-email-deliverability-tools"
        secondaryLabel="Try the free tools"
      />
    </SubPageShell>
  );
}
