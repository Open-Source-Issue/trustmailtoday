"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Copy, Check, RefreshCw } from "lucide-react";
import { generateRandomEmails } from "@/lib/email-tools";

const STYLES = [
  { key: "word", label: "Word-based" },
  { key: "name", label: "Name-like" },
  { key: "random", label: "Random string" },
];

export default function EmailGenerator() {
  const [count, setCount] = useState(10);
  const [domain, setDomain] = useState("example.com");
  const [style, setStyle] = useState("word");
  const [emails, setEmails] = useState([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = (e) => {
    e?.preventDefault();
    const cleanDomain = domain.trim() || "example.com";
    setEmails(generateRandomEmails(count, { domain: cleanDomain, style }));
    setCopiedAll(false);
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(emails.join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="mx-auto max-w-2xl text-left">
      <form onSubmit={generate} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
              How many
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2.5 text-white outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
              Domain
            </label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="w-full rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2.5 text-white placeholder:text-[#64748B] outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStyle(s.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                style === s.key
                  ? "bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-[#22c55e]/30"
                  : "border border-[#243044] bg-[#1E293B] text-[#CBD5E1] hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
        >
          <Wand2 className="h-4 w-4" /> Generate emails
        </button>
      </form>

      {emails.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-[#CBD5E1]">{emails.length} addresses</p>
            <div className="flex gap-2">
              <button
                onClick={generate}
                className="flex items-center gap-1.5 rounded-md bg-[#1E293B] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition hover:bg-[#243044] hover:text-white"
              >
                <RefreshCw className="h-4 w-4" /> Regenerate
              </button>
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 rounded-md bg-[#1E293B] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition hover:bg-[#243044] hover:text-white"
              >
                {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy all
              </button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {emails.map((em) => (
              <div
                key={em}
                className="rounded-lg border border-[#243044] bg-[#0B1220] px-3 py-2"
              >
                <code className="truncate font-mono text-xs text-[#6EE7B7]">
                  {em}
                </code>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#64748B]">
            Generated for testing forms, placeholders and seed data. Defaults to{" "}
            <code>example.com</code> (a reserved domain) so addresses can&apos;t
            reach a real inbox unless you set your own domain.
          </p>
        </motion.div>
      )}
    </div>
  );
}
