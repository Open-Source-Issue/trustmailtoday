"use client";

import { createElement } from "react";
import { motion } from "framer-motion";
import { resolveIcon } from "@/components/iconMap";

/**
 * Reusable page header for sub-pages. Mirrors the Hero typography/eyebrow style
 * (emerald eyebrow, gradient highlight, muted lede) without the home-only form.
 *
 * Props:
 *   eyebrow   - small uppercase label (e.g. "Free tool")
 *   title     - main heading (string or node)
 *   highlight - optional substring rendered with the green gradient
 *   subtitle  - supporting paragraph
 *   iconName  - optional lucide icon NAME (string), resolved via iconMap
 *   children  - optional extra content (badges, CTA row)
 */
export default function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  iconName,
  children,
}) {
  const iconCmp = iconName ? resolveIcon(iconName) : null;
  return (
    <section className="pt-nav relative overflow-hidden pb-12">
      <div className="glow glow--green glow--bottom-right" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
        {eyebrow && (
          <motion.span
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#243044] bg-[#111827] px-3 py-1 text-xs font-medium text-[#4ADE80]"
          >
            {iconCmp && createElement(iconCmp, { className: "h-4 w-4" })} {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-[clamp(30px,4.5vw,48px)] font-extrabold leading-[1.08] text-white"
        >
          {title}{" "}
          {highlight && <span className="text-grad-green">{highlight}</span>}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-[#CBD5E1]"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
