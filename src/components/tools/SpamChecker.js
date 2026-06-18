"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScanText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { analyzeSpam } from "@/lib/spamwords";

const RISK_COLOR = {
  Minimal: "text-[#22c55e]",
  Low: "text-[#84cc16]",
  Medium: "text-amber-400",
  High: "text-red-400",
};

export default function SpamChecker() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);

  const analyze = (e) => {
    e?.preventDefault();
    if (!subject.trim() && !body.trim()) return;
    setResult(analyzeSpam({ subject, body }));
  };

  return (
    <div className="mx-auto max-w-3xl text-left">
      <form onSubmit={analyze} className="space-y-3">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject line"
          className="w-full rounded-lg border border-[#243044] bg-[#1E293B] px-4 py-3 text-white placeholder:text-[#64748B] outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          placeholder="Paste your email body here…"
          className="w-full resize-y rounded-lg border border-[#243044] bg-[#1E293B] px-4 py-3 text-white placeholder:text-[#64748B] outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
        >
          <ScanText className="h-4 w-4" /> Analyze for spam triggers
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <div className="flex items-center justify-between rounded-xl border border-[#243044] bg-[#0B1220] px-4 py-4">
            <div>
              <p className="text-sm text-[#CBD5E1]">Spam risk</p>
              <p className={`text-2xl font-extrabold ${RISK_COLOR[result.risk]}`}>
                {result.risk}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-white">
                {result.score}
                <span className="text-sm text-[#64748B]">/100</span>
              </p>
              <p className="text-xs text-[#64748B]">
                {result.signals.words} words · {result.signals.links} links
              </p>
            </div>
          </div>

          {result.findings.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">
                What looks risky
              </p>
              {result.findings.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-[#243044] bg-[#0B1220] px-3 py-2.5"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-sm text-[#CBD5E1]">{f.message}</p>
                    {f.hits && (
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        {f.hits.map((h) => h.term).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-[#22c55e]/10 px-4 py-3 text-sm text-[#22c55e] ring-1 ring-[#22c55e]/25">
              <CheckCircle2 className="h-4 w-4" /> No major spam triggers found.
              Looking clean!
            </div>
          )}
          <p className="text-xs text-[#64748B]">
            This is a heuristic content guide, not a guarantee of how a specific
            provider&apos;s filter will score your message. Authentication
            (SPF/DKIM/DMARC) and sender reputation matter just as much.
          </p>
        </motion.div>
      )}
    </div>
  );
}
