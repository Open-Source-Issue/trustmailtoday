"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

/**
 * Minimal, elegant scroll progress for the dark/green theme.
 * - A 2px gradient line at the very top that scales left → right with scroll.
 * - A subtle percentage pill (top-right) that fades in after a little scroll.
 * Sits above the navbar (z-[60]).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  // smooth the raw 0→1 progress so the line glides instead of jumping
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPct(Math.round(v * 100));
  });

  return (
    <>
      {/* progress line */}
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#4ADE80] via-[#22c55e] to-[#16A34A] shadow-[0_0_12px_rgba(34,197,94,0.55)]"
      />

      {/* percentage readout — appears once the user starts scrolling */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: pct > 2 ? 1 : 0, y: pct > 2 ? 0 : -6 }}
        transition={{ duration: 0.25 }}
        className="fixed right-4 top-3 z-[60] hidden select-none rounded-full border border-[#22c55e]/25 bg-[#0F172A]/70 px-2.5 py-1 text-[11px] font-medium tabular-nums text-[#4ADE80] backdrop-blur-md sm:right-6 sm:block"
      >
        {pct}%
      </motion.div>
    </>
  );
}
