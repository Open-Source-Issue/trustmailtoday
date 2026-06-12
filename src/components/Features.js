"use client";

import { motion } from "framer-motion";
import { TrendingUp, Gauge, MailCheck } from "lucide-react";
import { fadeUpStagger, cardHover } from "@/lib/motion";

const features = [
  {
    icon: TrendingUp,
    title: "Auto warmup ramp",
    desc: "Gradually increases your sending volume day by day from a safe baseline, mimicking organic growth so providers learn to trust your domain.",
    visual: "ramp",
  },
  {
    icon: Gauge,
    title: "Reputation score",
    desc: "Track a live 0–100 sender reputation built from real signals — bounce rate, spam complaints, authentication and engagement.",
    visual: "score",
  },
  {
    icon: MailCheck,
    title: "Inbox placement",
    desc: "See exactly where your emails land across Gmail, Outlook and Yahoo — Primary, Promotions or Spam — before you run a campaign.",
    visual: "placement",
  },
];

function Visual({ kind }) {
  if (kind === "score") {
    return (
      <div className="mt-5">
        <div className="mb-1 flex justify-between text-xs font-medium text-[#CBD5E1]">
          <span>Reputation</span>
          <span className="text-[#22c55e]">92 / 100</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1E293B]">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "92%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-[#4ADE80] via-[#22c55e] to-[#16A34A]"
          />
        </div>
      </div>
    );
  }
  if (kind === "ramp") {
    return (
      <div className="mt-5 flex h-16 items-end gap-1.5">
        {[20, 32, 28, 45, 52, 60, 74, 88].map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
            className="flex-1 rounded-t bg-brand-gradient"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-5 space-y-2">
      {[
        ["Primary", "84%", "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25"],
        ["Promotions", "12%", "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25"],
        ["Spam", "4%", "bg-red-500/10 text-red-300 ring-1 ring-red-500/25"],
      ].map(([k, v, c]) => (
        <div key={k} className="flex items-center justify-between text-sm">
          <span className="text-[#CBD5E1]">{k}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c}`}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need to{" "}
            <span className="text-green-accent">reach the inbox</span>
          </h2>
          <p className="mt-4 text-[#CBD5E1]">
            Built on legitimate deliverability practices — not spam-filter
            tricks that get your domain blacklisted.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
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
                className="card-ring min-h-[240px] rounded-2xl bg-[#111827] p-7"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                  {f.desc}
                </p>
                <Visual kind={f.visual} />
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
