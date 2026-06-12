"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const STATUS_META = {
  pass: { label: "Pass", color: "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25", Icon: CheckCircle2, iconClass: "text-[#22c55e]" },
  weak: { label: "Weak", color: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25", Icon: AlertTriangle, iconClass: "text-amber-400" },
  missing: { label: "Missing", color: "bg-red-500/10 text-red-300 ring-1 ring-red-500/25", Icon: XCircle, iconClass: "text-red-400" },
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

function CheckRow({ check }) {
  const meta = STATUS_META[check.status] || STATUS_META.missing;
  const { Icon } = meta;
  return (
    <div className="flex items-center justify-between border-b border-[#243044] py-3 last:border-0">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${meta.iconClass}`} />
        <div>
          <p className="text-sm font-semibold text-[#cbd5e1]">{check.name}</p>
          {check.selector && (
            <p className="text-xs text-[#64748B]">selector: {check.selector}</p>
          )}
        </div>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
        {meta.label}
      </span>
    </div>
  );
}

export default function AuthSetup() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domainInput, setDomainInput] = useState("");

  const load = useCallback(async (domain) => {
    setLoading(true);
    setError(null);
    try {
      const res = domain
        ? await fetch("/api/auth-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
          })
        : await fetch("/api/auth-check", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error === "invalid_domain" ? "Enter a valid domain." : "Lookup failed.");
        return;
      }
      setData(json);
      if (json.domain && !domain) setDomainInput(json.domain);
    } catch {
      setError("Lookup failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="card-ring rounded-2xl bg-[#111827] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold text-white">
          <ShieldCheck className="h-5 w-5 text-[#22c55e]" /> Email authentication
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(domainInput.trim().toLowerCase());
          }}
          className="flex gap-2"
        >
          <input
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="yourdomain.com"
            className="w-44 rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-1.5 text-sm text-white placeholder:text-[#64748B] outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Check"}
          </button>
        </form>
      </div>

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <p className="text-sm text-[#CBD5E1]">
            Results for{" "}
            <span className="font-medium text-[#cbd5e1]">{data.domain}</span> —{" "}
            {data.summary.passing}/{data.summary.total} passing
          </p>

          <div className="mt-3 rounded-xl border border-[#243044] bg-[#1E293B] px-4">
            <CheckRow check={data.checks.spf} />
            <CheckRow check={data.checks.dkim} />
            <CheckRow check={data.checks.dmarc} />
          </div>

          {data.recommendations?.length > 0 ? (
            <div className="mt-5 space-y-4">
              <p className="text-sm font-semibold text-[#cbd5e1]">
                Recommended records
              </p>
              {data.recommendations.map((rec) => (
                <div key={rec.type} className="rounded-xl border border-[#243044] p-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#22c55e]/10 px-2 py-0.5 text-xs font-semibold text-[#22c55e] ring-1 ring-[#22c55e]/25">
                      {rec.type}
                    </span>
                    <span className="text-xs text-[#64748B]">{rec.recordType} record</span>
                  </div>
                  <p className="mt-2 text-xs text-[#CBD5E1]">
                    <span className="font-medium text-[#cbd5e1]">Host:</span>{" "}
                    {rec.host}
                  </p>
                  <div className="mt-2">
                    <CopyField value={rec.value} />
                  </div>
                  <p className="mt-2 text-xs text-[#CBD5E1]">{rec.why}</p>
                </div>
              ))}
              <p className="text-xs text-[#64748B]">
                Add these at your DNS provider (e.g. GoDaddy, Cloudflare, Route
                53). Changes can take up to 48h to propagate, then re-run this
                check.
              </p>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#22c55e]/10 px-4 py-3 text-sm text-[#22c55e] ring-1 ring-[#22c55e]/25">
              <CheckCircle2 className="h-4 w-4" /> All authentication records look
              good. Nothing to fix.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
