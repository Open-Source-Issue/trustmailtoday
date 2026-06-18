import SubPageShell from "@/components/SubPageShell";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Features — Trustmailtoday",
  description:
    "Auto warmup ramp, live sender-reputation scoring, and real inbox-placement testing across Gmail. Built on legitimate deliverability — not spam-filter tricks.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <SubPageShell>
      {/* Features' own py-24 clears the fixed navbar and carries the header. */}
      <Features />
      <HowItWorks />
      <CTASection
        title="See it work on your own"
        highlight="inbox"
        subtitle="Connect your mailbox and watch your reputation score and inbox placement improve as the warmup ramps — free to start."
        secondaryHref="/pricing"
        secondaryLabel="Compare plans"
      />
    </SubPageShell>
  );
}
