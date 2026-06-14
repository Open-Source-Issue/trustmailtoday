"use client";

import { motion } from "framer-motion";
import { Plug, TrendingUp, LineChart } from "lucide-react";
import { fadeUpStagger, cardHover } from "@/lib/motion";

const steps = [
  {
    icon: Plug,
    title: "Connect your inbox",
    desc: "Securely link your mailbox with Google OAuth in seconds. We never see or store your password — and you can disconnect anytime.",
  },
  {
    icon: TrendingUp,
    title: "We warm it up gradually",
    desc: "Our engine sends and replies to real, human-like emails, ramping volume day by day from a safe baseline so providers learn to trust your domain.",
  },
  {
    icon: LineChart,
    title: "Watch your reputation climb",
    desc: "Track a live reputation score and see exactly where your emails land — Primary, Promotions or Spam — before you launch a real campaign.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#22c55e]">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            From spam folder to inbox in{" "}
            <span className="text-green-accent">three steps</span>
          </h2>
          <p className="mt-4 text-[#CBD5E1]">
            No DNS headaches, no manual sending. Connect once and let the warmup
            run on autopilot.
          </p>
        </motion.div>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
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
                className="card-ring relative h-full rounded-2xl bg-[#111827] p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-extrabold text-[#0F172A]">
                    {i + 1}
                  </span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25">
                    <s.icon className="h-6 w-6" />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                  {s.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
