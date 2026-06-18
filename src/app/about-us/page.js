import { Target, ShieldCheck, HeartHandshake } from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";

export const metadata = {
  title: "About Us — Trustmailtoday",
  description:
    "Trustmailtoday builds real email sender reputation through legitimate, gradual warmup — so your emails land in the inbox without spam-filter tricks.",
  alternates: { canonical: "/about-us" },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Legitimacy over tricks",
    desc: "We build deliverability the honest way — gradual, realistic sending that earns provider trust. No spam-filter loopholes that get domains blacklisted.",
  },
  {
    icon: Target,
    title: "Real signals, real scores",
    desc: "Our reputation score is computed from actual signals — authentication, bounces, complaints, placement and engagement — not a vanity number.",
  },
  {
    icon: HeartHandshake,
    title: "Privacy by design",
    desc: "We connect via OAuth and never store your password. We only send and label the warmup mail our engine creates to measure where it lands.",
  },
];

export default function AboutPage() {
  return (
    <SubPageShell>
      <PageHero
        eyebrow="About us"
        iconName="Building2"
        title="Deliverability, done"
        highlight="honestly"
        subtitle="Trustmailtoday exists to solve one painful problem: good emails landing in spam. We help senders build genuine reputation so their messages reach real people."
      />

      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-4 sm:px-8">
        <div className="space-y-6 text-[15px] leading-relaxed text-[#CBD5E1]">
          <p>
            Email is still the highest-ROI channel in business — but only if your
            messages actually arrive. Mailbox providers like Gmail, Outlook and
            Yahoo guard their users aggressively, and a new domain or a cold
            mailbox with no history is treated with suspicion. The result:
            carefully written emails quietly disappear into spam.
          </p>
          <p>
            Trustmailtoday fixes that the right way. Instead of chasing
            filter-evasion tricks (which get domains blacklisted), our engine
            warms your inbox with gradual, human-like sending that mirrors
            organic growth. As providers learn to trust your domain, your
            reputation score climbs and your inbox placement improves — and you
            can see all of it happen in real time.
          </p>
          <p>
            We built the product we wished existed: transparent scoring grounded
            in real signals, OAuth-only security with no passwords, and pricing
            that startups and solo senders can actually afford.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 py-12 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card-ring rounded-2xl bg-[#111827] p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </SubPageShell>
  );
}
