"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

export default function BlacklistChecker() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (e) => {
    e?.preventDefault();
    const value = input.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/tools/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
      });
      const json = await res.json();
      if (!res.ok) {
        const map = {
          invalid_input: "Enter a valid domain or IPv4 address.",
          no_a_record: "That domain has no A record to check.",
          empty_input: "Enter a domain or IP address.",
        };
        setError(map[json.error] || "Lookup failed. Try again.");
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
    <div className="mx-auto max-w-3xl">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="yourdomain.com or 203.0.113.10"
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

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-left"
        >
          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-4 ${
              data.clean
                ? "bg-[#22c55e]/10 ring-1 ring-[#22c55e]/25"
                : "bg-red-500/10 ring-1 ring-red-500/25"
            }`}
          >
            {data.clean ? (
              <ShieldCheck className="h-7 w-7 text-[#22c55e]" />
            ) : (
              <ShieldAlert className="h-7 w-7 text-red-400" />
            )}
            <div>
              <p className="font-semibold text-white">
                {data.clean
                  ? "Not listed on any checked blacklist"
                  : `Listed on ${data.totalListed} blacklist${
                      data.totalListed > 1 ? "s" : ""
                    }`}
              </p>
              <p className="text-sm text-[#CBD5E1]">
                Checked {data.checkedZones} DNSBL zones
                {data.domain ? ` · resolved IP(s): ${data.ips.join(", ")}` : ""}
              </p>
            </div>
          </div>

          {data.perIp?.map((ipResult) => (
            <div key={ipResult.ip} className="mt-5">
              <p className="mb-2 text-sm font-semibold text-white">
                {ipResult.ip}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ipResult.results.map((r) => (
                  <div
                    key={r.zone}
                    className="flex items-center justify-between rounded-lg border border-[#243044] bg-[#0B1220] px-3 py-2"
                  >
                    <span className="text-sm text-[#CBD5E1]">{r.name}</span>
                    {r.listed ? (
                      <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-300 ring-1 ring-red-500/25">
                        Listed
                      </span>
                    ) : r.error ? (
                      <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-xs font-medium text-[#64748B] ring-1 ring-[#243044]">
                        No data
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-xs font-medium text-[#22c55e] ring-1 ring-[#22c55e]/25">
                        Clean
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
