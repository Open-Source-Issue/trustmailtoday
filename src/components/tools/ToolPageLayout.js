import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { TOOLS, getTool } from "@/lib/tools";
import { toolIcon } from "@/components/tools/icons";

/**
 * Shared layout for every free-tool page.
 *
 * Props:
 *   slug      - tool slug (looked up in lib/tools.js for title/tagline/icon)
 *   eyebrow   - hero eyebrow (default "Free tool")
 *   intro     - optional longer paragraph under the tagline
 *   children  - the interactive tool component
 *   about     - optional array of { q, a } shown as an explainer/FAQ
 */
export default function ToolPageLayout({
  slug,
  eyebrow = "Free tool",
  intro,
  children,
  about = [],
}) {
  const tool = getTool(slug) || { name: "Tool", tagline: "", icon: "Wrench" };
  const related = TOOLS.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <SubPageShell>
      <PageHero
        eyebrow={eyebrow}
        iconName={tool.icon}
        title={tool.name}
        subtitle={intro || tool.tagline}
      />

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-8 sm:px-8">
        <div className="card-ring rounded-2xl bg-[#111827] p-6 sm:p-8">
          {children}
        </div>
      </section>

      {about.length > 0 && (
        <section className="relative z-10 mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <div className="space-y-6">
            {about.map((item) => (
              <div key={item.q}>
                <h2 className="text-lg font-bold text-white">{item.q}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#CBD5E1]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-4 sm:px-8">
        <h2 className="mb-5 text-center text-sm font-semibold uppercase tracking-wider text-[#22c55e]">
          More free tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((t) => {
            const RIcon = toolIcon(t.icon);
            return (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="card-ring group rounded-2xl bg-[#111827] p-5 transition hover:-translate-y-0.5"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                  <RIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{t.name}</h3>
                <p className="mt-1 text-xs text-[#CBD5E1]">{t.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#22c55e]">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/free-email-deliverability-tools"
            className="text-sm font-medium text-[#cbd5e1] underline-offset-4 hover:text-white hover:underline"
          >
            View all deliverability tools →
          </Link>
        </div>
      </section>

      <CTASection
        title="Found an issue? Fix it with"
        highlight="warmup"
        subtitle="Authentication and clean lists are only half the battle. Build real sender reputation so your emails actually land in the inbox."
      />
    </SubPageShell>
  );
}
