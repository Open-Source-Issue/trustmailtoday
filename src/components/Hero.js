"use client";

import { motion } from "framer-motion";
import { Inbox, ShieldCheck, Star, Users } from "lucide-react";
import ConnectInboxForm from "./ConnectInboxForm";
import { heroHeading, fadeUpStagger } from "@/lib/motion";

const stats = [
  { icon: Inbox, value: "90%", label: "Inbox placement" },
  { icon: Users, value: "50K+", label: "Inboxes warmed" },
  { icon: Star, value: "4.9★", label: "Avg. rating" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="pt-nav relative overflow-hidden pb-24"
    >
      <div className="glow glow--green glow--bottom-right" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        {/* Left: copy */}
        <motion.div initial="hidden" animate="show">
          <motion.span
            variants={fadeUpStagger}
            custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#243044] bg-[#111827] px-3 py-1 text-xs font-medium text-[#4ADE80]"
          >
            <ShieldCheck className="h-4 w-4" /> AI deliverability engine
          </motion.span>

          <motion.h1
            variants={heroHeading}
            className="text-[clamp(34px,5vw,56px)] font-extrabold leading-[1.05] text-white"
          >
            Land in the inbox,{" "}
            <span className="text-grad-green">not the spam folder</span>
          </motion.h1>

          <motion.p
            variants={fadeUpStagger}
            custom={1}
            className="mt-5 max-w-[520px] text-lg text-[#CBD5E1]"
          >
            Warm up new mailboxes with real, gradual sending and live reputation
            tracking — built on legitimate deliverability, not spam-filter tricks.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeUpStagger}
            custom={2}
            className="mt-10 grid max-w-md grid-cols-3 gap-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[#243044] bg-[#111827] p-4"
              >
                <s.icon className="mb-1 h-5 w-5 text-[#22c55e]" />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-[#CBD5E1]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: visual + form */}
        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden w-full max-w-md rounded-2xl border border-[#243044] bg-[#111827]/60 p-4 backdrop-blur sm:block"
          >
            <div className="animate-float card-ring rounded-xl bg-[#111827] p-4">
              <div className="mb-3 flex items-center gap-2 border-b border-[#243044] pb-3">
                <Inbox className="h-5 w-5 text-[#22c55e]" />
                <span className="text-sm font-semibold text-[#cbd5e1]">
                  Primary Inbox
                </span>
                <span className="ml-auto rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-xs font-medium text-[#22c55e] ring-1 ring-[#22c55e]/25">
                  Delivered
                </span>
              </div>
              {[
                "Quarterly partnership proposal",
                "Re: Demo follow-up 🚀",
                "Your invoice is ready",
              ].map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-[#1E293B]"
                >
                  <span className="h-8 w-8 shrink-0 rounded-full bg-brand-gradient" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#FFFFFF]">
                      {t}
                    </p>
                    <p className="truncate text-xs text-[#CBD5E1]">
                      Reputation score 98 · landed in inbox
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <ConnectInboxForm />
        </div>
      </div>
    </section>
  );
}
