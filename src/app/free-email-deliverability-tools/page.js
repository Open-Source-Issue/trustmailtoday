import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { toolsByCategory } from "@/lib/tools";
import { toolIcon } from "@/components/tools/icons";

export const metadata = {
  title: "Free Email Deliverability Tools — Trustmailtoday",
  description:
    "A free toolkit for email deliverability: SPF, DKIM and DMARC checkers, blacklist lookup, spam-word analyzer, email verifier, and Gmail/email/signature generators. No signup.",
  alternates: { canonical: "/free-email-deliverability-tools" },
};

export default function ToolsHubPage() {
  const groups = toolsByCategory();

  return (
    <SubPageShell>
      <PageHero
        eyebrow="Free toolkit"
        iconName="Wrench"
        title="Free email"
        highlight="deliverability tools"
        subtitle="Everything you need to diagnose and fix email deliverability — authentication, reputation, content and utilities. Free, no signup, real-time results."
      />

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-8 sm:px-8">
        {Object.entries(groups).map(([category, tools]) => (
          <div key={category} className="mb-12">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#22c55e]">
              {category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((t) => {
                const Icon = toolIcon(t.icon);
                return (
                  <Link
                    key={t.slug}
                    href={`/${t.slug}`}
                    className="card-ring group rounded-2xl bg-[#111827] p-6 transition hover:-translate-y-0.5"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-white">
                      {t.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#CBD5E1]">{t.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#22c55e]">
                      Open tool <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <CTASection
        title="Tools diagnose. Warmup"
        highlight="fixes."
        subtitle="These tools show you what's wrong. Trustmailtoday builds the real sender reputation that gets you back into the inbox — and keeps you there."
      />
    </SubPageShell>
  );
}
