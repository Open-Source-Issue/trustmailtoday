"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MailCheck,
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

const PLACEMENT_META = {
  inbox: { label: "Primary inbox", color: "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25", good: true },
  updates: { label: "Updates", color: "bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/25", good: true },
  promotions: { label: "Promotions", color: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25", good: false },
  social: { label: "Social", color: "bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/25", good: false },
  spam: { label: "Spam", color: "bg-red-500/10 text-red-300 ring-1 ring-red-500/25", good: false },
  trash: { label: "Trash", color: "bg-red-500/10 text-red-300 ring-1 ring-red-500/25", good: false },
  unknown: { label: "Not found yet", color: "bg-[#1E293B] text-[#CBD5E1] ring-1 ring-[#243044]", good: false },
};

function AuthRow({ label, ok }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2">
      <span className="text-sm text-[#CBD5E1]">{label}</span>
      {ok ? (
        <span className="flex items-center gap-1 text-xs font-medium text-[#22c55e]">
          <ShieldCheck className="h-4 w-4" /> pass
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-medium text-red-300">
          <ShieldX className="h-4 w-4" /> fail
        </span>
      )}
    </div>
  );
}

export default function InboxCheck({ locked }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/inbox-check", { method: "POST" });
      const data = await res.json();
      if (res.status === 403) {
        setError("Inbox placement checks are a Premium feature.");
        return;
      }
      if (!res.ok) throw new Error(data.detail || data.error || "Check failed");
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  if (locked) {
    return (
      <div className="card-ring rounded-2xl bg-[#111827] p-6">
        <div className="flex items-center gap-2 font-semibold text-white">
          <MailCheck className="h-5 w-5 text-[#22c55e]" /> Inbox placement check
        </div>
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-[#243044] bg-[#1E293B] p-6 text-center">
          <Lock className="h-8 w-8 text-[#64748B]" />
          <p className="text-sm text-[#CBD5E1]">
            See exactly where your emails land (Primary, Promotions or Spam) and
            verify SPF/DKIM/DMARC.
          </p>
          <a
            href="/#pricing"
            className="rounded-lg bg-brand-gradient px-5 py-2 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
          >
            Upgrade to Premium
          </a>
        </div>
      </div>
    );
  }

  const meta = result ? PLACEMENT_META[result.placement] || PLACEMENT_META.unknown : null;

  return (
    <div className="card-ring rounded-2xl bg-[#111827] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold text-white">
          <MailCheck className="h-5 w-5 text-[#22c55e]" /> Inbox placement check
        </div>
        <button
          onClick={run}
          disabled={running}
          className="flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Checking…
            </>
          ) : (
            "Run check"
          )}
        </button>
      </div>

      <p className="mt-2 text-sm text-[#CBD5E1]">
        Sends a tagged test email to your own inbox and reports where it landed.
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/25">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 space-y-4"
        >
          <div className="flex items-center justify-between rounded-xl border border-[#243044] bg-[#1E293B] p-4">
            <div className="flex items-center gap-2">
              {meta?.good ? (
                <CheckCircle2 className="h-6 w-6 text-[#22c55e]" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              )}
              <span className="text-sm font-medium text-[#cbd5e1]">
                Landed in
              </span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${meta?.color}`}
            >
              {meta?.label}
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Authentication
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              <AuthRow label="SPF" ok={result.auth?.spf} />
              <AuthRow label="DKIM" ok={result.auth?.dkim} />
              <AuthRow label="DMARC" ok={result.auth?.dmarc} />
            </div>
          </div>

          {result.note && (
            <p className="text-sm text-[#CBD5E1]">{result.note}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
