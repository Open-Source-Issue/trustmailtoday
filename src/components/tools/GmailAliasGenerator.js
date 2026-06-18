"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Copy, Check, AtSign } from "lucide-react";
import { generateGmailAliases } from "@/lib/email-tools";

export default function GmailAliasGenerator() {
  const [user, setUser] = useState("");
  const [aliases, setAliases] = useState([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const generate = (e) => {
    e?.preventDefault();
    setAliases(generateGmailAliases(user, { limit: 30 }));
    setCopiedAll(false);
  };

  const copy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      if (idx === "all") {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 1500);
      } else {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
      }
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="mx-auto max-w-2xl text-left">
      <form onSubmit={generate} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <AtSign className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="yourname (or yourname@gmail.com)"
            className="w-full rounded-lg border border-[#243044] bg-[#1E293B] py-3 pl-10 pr-3 text-white placeholder:text-[#64748B] outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
        >
          <Wand2 className="h-4 w-4" /> Generate
        </button>
      </form>

      {aliases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-[#CBD5E1]">
              {aliases.length} aliases — all deliver to the same Gmail inbox
            </p>
            <button
              onClick={() => copy(aliases.join("\n"), "all")}
              className="flex items-center gap-1.5 rounded-md bg-[#1E293B] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition hover:bg-[#243044] hover:text-white"
            >
              {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy all
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {aliases.map((a, i) => (
              <button
                key={a}
                onClick={() => copy(a, i)}
                className="flex items-center justify-between gap-2 rounded-lg border border-[#243044] bg-[#0B1220] px-3 py-2 text-left transition hover:border-[#22c55e]/30"
              >
                <code className="truncate font-mono text-xs text-[#6EE7B7]">
                  {a}
                </code>
                {copiedIdx === i ? (
                  <Check className="h-4 w-4 shrink-0 text-[#22c55e]" />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-[#64748B]" />
                )}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#64748B]">
            Gmail ignores dots and supports <code>+tags</code>, so every address
            above reaches your inbox. Great for testing signups and filters —
            use responsibly and never to abuse signup limits.
          </p>
        </motion.div>
      )}
    </div>
  );
}
