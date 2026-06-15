"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { startCheckout } from "@/lib/checkout";
import { fadeUpStagger, cardHover } from "@/lib/motion";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    tagline: "Try it out",
    features: [
      "10 warmup emails / day",
      "1 connected inbox",
      "Basic reputation score",
      "Community support",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹200",
    period: "/month",
    tagline: "For growing senders",
    features: [
      "Everything in Free, plus:",
      "Unlimited warmup emails (no daily cap)",
      "Live reputation tracking",
      "Auto warmup ramp-up",
      "Email support",
    ],
    cta: "Get Pro",
    highlight: true,
  },
  {
    key: "premium",
    name: "Premium",
    price: "₹500",
    period: "/month",
    tagline: "For serious campaigns",
    features: [
      "Everything in Pro",
      "Up to 3 inboxes",
      "Inbox placement checks",
      "SPF/DKIM/DMARC monitoring",
      "Priority support",
    ],
    cta: "Get Premium",
    highlight: false,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "₹2000",
    period: "/month",
    tagline: "For teams & agencies",
    features: [
      "Everything in Premium",
      "Unlimited inboxes",
      "Team access & roles",
      "API access",
      "Dedicated manager",
    ],
    cta: "Get Enterprise",
    highlight: false,
  },
];

export default function Pricing() {
  const [pending, setPending] = useState(null); // plan key being processed
  const [notice, setNotice] = useState(null);

  const handleCta = async (plan) => {
    setNotice(null);
    // Free plan just sends the user to connect their inbox.
    if (plan.key === "free") {
      window.location.href = "/#start";
      return;
    }
    setPending(plan.key);
    try {
      const result = await startCheckout(plan.key);
      if (result.status === "needs_connect") {
        setNotice({
          type: "info",
          text: "Connect your inbox first, then subscribe.",
        });
        setTimeout(() => (window.location.href = "/#start"), 1200);
      } else if (result.status === "success") {
        setNotice({ type: "ok", text: `You're on ${plan.name}! Redirecting…` });
        setTimeout(() => (window.location.href = "/dashboard"), 1000);
      } else if (result.status === "error") {
        setNotice({ type: "err", text: result.message });
      }
      // "cancelled" -> silently do nothing
    } finally {
      setPending(null);
    }
  };

  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#22c55e]">
            Pricing
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, <span className="text-green-accent">honest pricing</span>
          </h2>
          <p className="mt-4 text-[#CBD5E1]">
            Startup-friendly pricing built for Indian senders. Start free, no
            card required — upgrade or cancel anytime.
          </p>
          {notice && (
            <p
              className={`mt-4 inline-block rounded-lg px-4 py-2 text-sm ${
                notice.type === "ok"
                  ? "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25"
                  : notice.type === "err"
                  ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/25"
                  : "bg-[#0A64BC]/20 text-[#93C5FD] ring-1 ring-[#0A64BC]/40"
              }`}
            >
              {notice.text}
            </p>
          )}
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
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
                className={`relative flex h-full flex-col rounded-[20px] p-7 ${
                  p.highlight
                    ? "bg-gradient-to-b from-[#111827] to-[#0B1220] ring-1 ring-[#22c55e]/40"
                    : "card-ring bg-[#111827]"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4ADE80] px-3 py-1 text-xs font-bold text-[#0F172A]">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-sm text-[#CBD5E1]">{p.tagline}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {p.price}
                  </span>
                  <span className="text-sm text-[#CBD5E1]">{p.period}</span>
                </div>

                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" />
                      <span className="text-[#CBD5E1]">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleCta(p)}
                  disabled={pending === p.key}
                  className="mt-7 flex items-center justify-center gap-2 rounded-lg bg-brand-gradient py-2.5 text-center text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
                >
                  {pending === p.key && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {p.cta}
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
