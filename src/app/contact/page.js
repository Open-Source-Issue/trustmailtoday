import { Mail, MessageSquare, LifeBuoy } from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — Trustmailtoday",
  description:
    "Get in touch with the Trustmailtoday team. Questions about email warmup, deliverability, plans or partnerships — we're happy to help.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Mail,
    title: "Email support",
    desc: "support@trustmailtoday.com",
    href: "mailto:support@trustmailtoday.com",
  },
  {
    icon: LifeBuoy,
    title: "Deliverability help",
    desc: "Stuck in spam? Tell us your domain and we'll point you in the right direction.",
  },
  {
    icon: MessageSquare,
    title: "Partnerships",
    desc: "Agencies and resellers — ask about our affiliate program.",
    href: "/affiliates",
  },
];

export default function ContactPage() {
  return (
    <SubPageShell>
      <PageHero
        eyebrow="Contact"
        iconName="Mail"
        title="We'd love to"
        highlight="hear from you"
        subtitle="Questions about warmup, deliverability, billing or partnerships? Send us a note and we'll get back to you."
      />

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            {channels.map((c) => {
              const Inner = (
                <div className="card-ring flex h-full items-start gap-3 rounded-2xl bg-[#111827] p-5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    <p className="mt-1 text-sm text-[#CBD5E1]">{c.desc}</p>
                  </div>
                </div>
              );
              return c.href ? (
                <a key={c.title} href={c.href} className="block">
                  {Inner}
                </a>
              ) : (
                <div key={c.title}>{Inner}</div>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <div className="card-ring rounded-2xl bg-[#111827] p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
