"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, KeyRound, Quote } from "lucide-react";
import { fadeUpStagger, cardHover } from "@/lib/motion";

/**
 * Social proof for an early-stage product.
 *
 * We intentionally avoid fabricated customer testimonials — for a trust /
 * deliverability product, invented quotes are a credibility risk. Instead we
 * lead with verifiable trust pillars and a founder commitment.
 *
 * To add REAL testimonials later, populate this array and the section below
 * will render them automatically:
 *   const testimonials = [{ quote, name, role }];
 */
const testimonials = [];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Limited Use compliant",
    desc: "Our handling of Gmail data follows Google's API Services User Data Policy, including the Limited Use requirements.",
  },
  {
    icon: KeyRound,
    title: "OAuth 2.0 only",
    desc: "We connect through Google's official OAuth flow. We never see, ask for, or store your password.",
  },
  {
    icon: Lock,
    title: "You stay in control",
    desc: "Review the exact permissions you grant and disconnect your inbox at any time — access is revoked instantly.",
  },
];

export default function Testimonials() {
  return (
    <section id="trust" className="relative py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#22c55e]">
            Built on trust, not tricks
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Why senders <span className="text-green-accent">trust us</span>
          </h2>
          <p className="mt-4 text-[#CBD5E1]">
            Deliverability is earned. We&apos;re transparent about exactly how we
            access your inbox and what we do with it.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={fadeUpStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="card-ring h-full rounded-2xl bg-[#111827] p-7"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                  {p.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {testimonials.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="card-ring rounded-2xl bg-[#111827] p-7"
              >
                <Quote className="h-6 w-6 text-[#22c55e]" />
                <blockquote className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-white">
                  {t.name}
                  <span className="block font-normal text-[#8aa0b2]">
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <motion.figure
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[#22c55e]/20 bg-gradient-to-b from-[#111827] to-[#0B1220] p-8 text-center"
          >
            <Quote className="mx-auto h-7 w-7 text-[#22c55e]" />
            <blockquote className="mt-4 text-lg font-medium leading-relaxed text-white">
              &ldquo;We built Trustmailtoday because real deliverability comes
              from earning a mailbox provider&apos;s trust — gradually and
              honestly — not from gaming spam filters. That&apos;s the only kind
              of warmup we&apos;ll ever ship.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-[#22c55e]">
              The Trustmailtoday team
            </figcaption>
          </motion.figure>
        )}
      </div>
    </section>
  );
}
