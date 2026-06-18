import { Megaphone, Wallet, Link2 } from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "Affiliate Program — Trustmailtoday",
  description:
    "Earn recurring commission by referring senders to Trustmailtoday. Ideal for agencies, consultants and creators in the cold email and deliverability space.",
  alternates: { canonical: "/affiliates" },
};

const steps = [
  {
    icon: Link2,
    title: "1. Apply & get your link",
    desc: "Email us to join. We'll set you up with a unique referral link and onboarding details.",
  },
  {
    icon: Megaphone,
    title: "2. Share it",
    desc: "Recommend Trustmailtoday to your audience, clients or network — anyone who sends email and wants the inbox.",
  },
  {
    icon: Wallet,
    title: "3. Earn commission",
    desc: "Get paid for every paying customer you refer. Great fit for agencies managing multiple sending domains.",
  },
];

export default function AffiliatesPage() {
  return (
    <SubPageShell>
      <PageHero
        eyebrow="Affiliate program"
        iconName="Handshake"
        title="Partner with"
        highlight="Trustmailtoday"
        subtitle="Help senders escape the spam folder and earn for every referral. Built for agencies, consultants and creators in the deliverability space."
      />

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-4 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="card-ring rounded-2xl bg-[#111827] p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-5 py-12 text-center sm:px-8">
        <h2 className="text-2xl font-bold text-white">Who it&apos;s for</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#CBD5E1]">
          If you run a lead-gen or cold-email agency, consult on deliverability,
          or create content for founders and marketers, your audience already
          needs warmup. The affiliate program lets you recommend a tool you trust
          and earn recurring revenue while you do it.
        </p>
        <a
          href="mailto:support@trustmailtoday.com?subject=Affiliate%20program%20application"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-7 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
        >
          Apply to become an affiliate
        </a>
      </section>

      <CTASection
        title="Not a partner yet? Try the product"
        highlight="first"
        subtitle="See why senders love it — connect an inbox and start a free warmup today."
        secondaryHref="/features"
        secondaryLabel="Explore features"
      />
    </SubPageShell>
  );
}
