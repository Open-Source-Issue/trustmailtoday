"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Info,
} from "lucide-react";

const STATUS_META = {
  pass: {
    label: "Pass",
    color: "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25",
    Icon: CheckCircle2,
    iconClass: "text-[#22c55e]",
  },
  weak: {
    label: "Weak",
    color: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25",
    Icon: AlertTriangle,
    iconClass: "text-amber-400",
  },
  missing: {
    label: "Missing",
    color: "bg-red-500/10 text-red-300 ring-1 ring-red-500/25",
    Icon: XCircle,
    iconClass: "text-red-400",
  },
};

function CopyField({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked */
    }
  };
  return (
    <div className="flex items-start gap-2 rounded-lg border border-[#243044] bg-[#0B1220] p-3">
      <code className="flex-1 break-all font-mono text-xs text-[#6EE7B7]">
        {value}
      </code>
      <button
        onClick={copy}
        className="shrink-0 rounded-md bg-[#1E293B] p-1.5 text-[#CBD5E1] transition hover:bg-[#243044] hover:text-white"
        aria-label="Copy"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function RecordCard({ check, emphasized }) {
  const meta = STATUS_META[check.status] || STATUS_META.missing;
  const { Icon } = meta;
  return (
    <div
      className={`rounded-xl border bg-[#0B1220] p-4 ${
        emphasized ? "border-[#22c55e]/40" : "border-[#243044]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${meta.iconClass}`} />
          <span className="text-sm font-semibold text-white">{check.name}</span>
          {check.selector && (
            <span className="text-xs text-[#64748B]">
              selector: {check.selector}
            </span>
          )}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}
        >
          {meta.label}
        </span>
      </div>
      {check.record && (
        <div className="mt-3">
          <CopyField value={check.record} />
        </div>
      )}
      {check.host && (
        <p className="mt-2 text-xs text-[#64748B]">Looked up: {check.host}</p>
      )}
    </div>
  );
}

/**
 * Public SPF/DKIM/DMARC checker. `focus` (spf|dkim|dmarc) emphasizes one record
 * but always shows the full picture, since the three are interdependent.
 */
export default function DnsAuthChecker({ focus = "all", placeholder = "yourdomain.com" }) {
  const [domain, setDomain] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (e) => {
    e?.preventDefault();
    const value = domain.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/tools/dns-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: value }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          json.error === "invalid_domain"
            ? "Please enter a valid domain (e.g. example.com)."
            : "DNS lookup failed. Try again in a moment."
        );
        return;
      }
      setData(json);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const order =
    focus === "spf"
      ? ["spf", "dkim", "dmarc"]
      : focus === "dkim"
      ? ["dkim", "spf", "dmarc"]
      : focus === "dmarc"
      ? ["dmarc", "spf", "dkim"]
      : ["spf", "dkim", "dmarc"];

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-[#243044] bg-[#1E293B] py-3 pl-10 pr-3 text-white placeholder:text-[#64748B] outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </form>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/25">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      {data?.managedProvider && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#0A64BC]/20 px-4 py-3 text-sm text-[#93C5FD] ring-1 ring-[#0A64BC]/40">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> {data.note}
        </div>
      )}

      {data?.checks && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3 text-left"
        >
          <p className="text-sm text-[#CBD5E1]">
            Results for{" "}
            <span className="font-medium text-white">{data.domain}</span> —{" "}
            {data.summary.passing}/{data.summary.total} passing
          </p>
          {order.map((key) => (
            <RecordCard
              key={key}
              check={data.checks[key]}
              emphasized={focus === key}
            />
          ))}

          {data.recommendations?.length > 0 && (
            <div className="mt-5 space-y-4">
              <p className="text-sm font-semibold text-white">
                How to fix it
              </p>
              {data.recommendations.map((rec) => (
                <div
                  key={rec.type}
                  className="rounded-xl border border-[#243044] p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#22c55e]/10 px-2 py-0.5 text-xs font-semibold text-[#22c55e] ring-1 ring-[#22c55e]/25">
                      {rec.type}
                    </span>
                    <span className="text-xs text-[#64748B]">
                      {rec.recordType} · {rec.host}
                    </span>
                  </div>
                  <div className="mt-2">
                    <CopyField value={rec.value} />
                  </div>
                  <p className="mt-2 text-xs text-[#CBD5E1]">{rec.why}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
