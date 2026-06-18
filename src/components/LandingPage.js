import {
  ShieldCheck,
  TrendingUp,
  Gauge,
  MailCheck,
  Inbox,
  Rocket,
  Users,
  Building2,
  Code2,
  Megaphone,
  Newspaper,
  Server,
  Network,
  AlertTriangle,
  MessageSquare,
  Wrench,
} from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";

const ICONS = {
  ShieldCheck,
  TrendingUp,
  Gauge,
  MailCheck,
  Inbox,
  Rocket,
  Users,
  Building2,
  Code2,
  Megaphone,
  Newspaper,
  Server,
  Network,
  AlertTriangle,
  MessageSquare,
};
const icon = (name) => ICONS[name] || Wrench;

/**
 * Renders a use-case / SEO landing page from a plain data object
 * (see lib/landing-pages.js). Reuses the shared chrome, hero and CTA so every
 * page is on-brand without bespoke code.
 */
export default function LandingPage({ data }) {
  const {
    eyebrow,
    title,
    highlight,
    subtitle,
    heroIcon,
    intro,
    benefits = [],
    sections = [],
    faqs = [],
    cta = {},
  } = data;

  return (
    <SubPageShell>
      <PageHero
        eyebrow={eyebrow}
        iconName={heroIcon}
        title={title}
        highlight={highlight}
        subtitle={subtitle}
      />

      {intro && (
        <section className="relative z-10 mx-auto max-w-3xl px-5 pb-4 sm:px-8">
          <p className="text-[15px] leading-relaxed text-[#CBD5E1]">{intro}</p>
        </section>
      )}

      {benefits.length > 0 && (
        <section className="relative z-10 mx-auto max-w-[1200px] px-5 py-12 sm:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((b) => {
              const Icon = icon(b.icon);
              return (
                <div
                  key={b.title}
                  className="card-ring rounded-2xl bg-[#111827] p-7"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <section className="relative z-10 mx-auto max-w-3xl px-5 py-4 sm:px-8">
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-2xl font-bold text-white">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#CBD5E1]">
                  {(Array.isArray(s.body) ? s.body : [s.body]).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="relative z-10 mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="card-ring group rounded-2xl bg-[#111827] p-5 sm:p-6 [&[open]]:ring-1 [&[open]]:ring-[#22c55e]/30"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-white">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      <CTASection
        title={cta.title || "Ready to land in the"}
        highlight={cta.highlight || "inbox"}
        subtitle={
          cta.subtitle ||
          "Connect your inbox and start building real sender reputation today — free to start."
        }
        secondaryHref={cta.secondaryHref || "/free-email-deliverability-tools"}
        secondaryLabel={cta.secondaryLabel || "Try the free tools"}
      />
    </SubPageShell>
  );
}
