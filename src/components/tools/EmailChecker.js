"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

function Row({ label, ok, okText = "Yes", badText = "No", neutral }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#243044] bg-[#0B1220] px-3 py-2.5">
      <span className="text-sm text-[#CBD5E1]">{label}</span>
      {neutral ? (
        <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-xs font-medium text-[#CBD5E1] ring-1 ring-[#243044]">
          {ok ? okText : badText}
        </span>
      ) : ok ? (
        <span className="flex items-center gap-1 text-xs font-medium text-[#22c55e]">
          <CheckCircle2 className="h-4 w-4" /> {okText}
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-medium text-red-300">
          <XCircle className="h-4 w-4" /> {badText}
        </span>
      )}
    </div>
  );
}

export default function EmailChecker() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (e) => {
    e?.preventDefault();
    const value = email.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/tools/email-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError("Could not validate that address. Try again.");
        return;
      }
      setData(json);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-lg border border-[#243044] bg-[#1E293B] py-3 pl-10 pr-3 text-white placeholder:text-[#64748B] outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
        </button>
      </form>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/25">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3 text-left"
        >
          <div
            className={`flex items-center justify-between rounded-xl px-4 py-4 ${
              data.deliverable
                ? "bg-[#22c55e]/10 ring-1 ring-[#22c55e]/25"
                : "bg-red-500/10 ring-1 ring-red-500/25"
            }`}
          >
            <div>
              <p className="font-semibold text-white">
                {data.deliverable ? "Looks deliverable" : "Likely undeliverable"}
              </p>
              <p className="text-sm text-[#CBD5E1]">{data.email}</p>
            </div>
            <span className="text-2xl font-extrabold text-white">
              {data.score ?? 0}
              <span className="text-sm text-[#64748B]">/100</span>
            </span>
          </div>

          {data.checks && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Row label="Valid syntax" ok={data.checks.syntax} />
              <Row
                label="Domain accepts mail (MX)"
                ok={data.checks.mx}
                okText="Found"
                badText="None"
              />
              <Row
                label="Disposable domain"
                ok={!data.checks.disposable}
                okText="No"
                badText="Yes"
              />
              <Row
                label="Role-based address"
                ok={!data.checks.roleBased}
                okText="No"
                badText="Yes"
              />
            </div>
          )}

          {data.mxHost && (
            <p className="text-xs text-[#64748B]">
              Primary mail server: <span className="text-[#CBD5E1]">{data.mxHost}</span>
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
