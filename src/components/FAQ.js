"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Will email warmup get my domain banned or blacklisted?",
    a: "No. We do the opposite — we build legitimate sender reputation through gradual, realistic sending that mirrors organic growth. We never use spam-filter tricks or send unsolicited bulk email, which are the things that actually get domains blacklisted.",
  },
  {
    q: "Do you read or store my emails?",
    a: "We never store your password and we don't read your personal email. We only send and label the warmup messages our engine generates, so we can measure where they land. Our use of Gmail data follows Google's API Services User Data Policy, including the Limited Use requirements.",
  },
  {
    q: "What permissions do you request, and why?",
    a: "We request the minimum Gmail scopes needed: permission to send warmup emails, to label them so we can measure inbox placement, and to read your email address to identify the connected account. You can review and revoke access anytime from your Google Account.",
  },
  {
    q: "How long until I see results?",
    a: "Warmup is gradual by design. Most senders see reputation improvements within the first couple of weeks, with continued gains as volume safely ramps. Deliverability depends on factors like your domain age and authentication setup, so timelines vary.",
  },
  {
    q: "Which email providers are supported?",
    a: "We support inbox-placement tracking across Gmail, Outlook, and Yahoo. You connect your mailbox securely with OAuth — no passwords required.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no lock-in contracts. You can disconnect your inbox or cancel your plan at any time directly from your dashboard.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#22c55e]">
            FAQ
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Questions, <span className="text-green-accent">answered</span>
          </h2>
          <p className="mt-4 text-[#CBD5E1]">
            Everything you need to know about safety, permissions, and results.
          </p>
        </motion.div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-ring group rounded-2xl bg-[#111827] p-5 sm:p-6 [&[open]]:ring-1 [&[open]]:ring-[#22c55e]/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-white">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-[#22c55e] transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                {f.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
