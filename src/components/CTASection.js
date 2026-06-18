"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

/**
 * CTA band for sub-pages. Unlike the home FinalCTA (which smooth-scrolls to
 * in-page anchors), this links to real routes so it works on any page.
 *
 * Props: title, highlight, subtitle, primaryHref, primaryLabel,
 *        secondaryHref, secondaryLabel.
 */
export default function CTASection({
  title = "Ready to land in the",
  highlight = "inbox",
  subtitle = "Connect your inbox in seconds and start building real sender reputation today. Free to start — no card required.",
  primaryHref = "/#start",
  primaryLabel = "Start free warmup",
  secondaryHref = "/pricing",
  secondaryLabel = "Compare plans",
}) {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[#22c55e]/25 bg-gradient-to-b from-[#111827] to-[#0B1220] px-6 py-14 text-center sm:px-12"
        >
          <div className="glow glow--green glow--bottom-right" aria-hidden />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {title} <span className="text-grad-green">{highlight}</span>
            </h2>
            <p className="mt-4 text-[#CBD5E1]">{subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-7 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
              >
                {primaryLabel} <ArrowRight className="h-4 w-4" />
              </a>
              {secondaryHref && (
                <a
                  href={secondaryHref}
                  className="text-sm font-medium text-[#cbd5e1] underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {secondaryLabel}
                </a>
              )}
            </div>
            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#8aa0b2]">
              <ShieldCheck className="h-4 w-4 text-[#22c55e]" />
              Secured by OAuth 2.0 · Disconnect anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
