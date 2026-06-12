"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Send,
  RefreshCw,
  TrendingUp,
  Inbox,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const FACTOR_LABELS = {
  authentication: "Authentication (SPF/DKIM/DMARC)",
  bounces: "Bounce rate",
  complaints: "Spam complaints",
  placement: "Inbox placement",
  engagement: "Engagement",
  consistency: "Sending consistency",
};

function scoreColor(score) {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 50) return "#f59e0b";
  if (score >= 30) return "#f97316";
  return "#ef4444";
}

export default function WarmupPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/warmup/status", { cache: "no-store" });
      if (!res.ok) return;
      setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 8000); // live polling
    return () => clearInterval(id);
  }, [refresh]);

  const startWarmup = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/warmup/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start");
      await refresh();
      setMessage({ type: "ok", text: "Warmup started." });
    } catch (e) {
      setMessage({ type: "err", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const sendBatch = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/warmup/send", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      await refresh();
      setMessage({
        type: data.errors?.length ? "err" : "ok",
        text: data.errors?.length
          ? `Sent ${data.sent}, ${data.errors.length} failed: ${data.errors[0]}`
          : data.note || `Sent ${data.sent} warmup email(s).`,
      });
    } catch (e) {
      setMessage({ type: "err", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="card-ring flex items-center gap-2 rounded-2xl bg-[#111827] p-6 text-[#CBD5E1]">
        <RefreshCw className="h-4 w-4 animate-spin" /> Loading warmup status…
      </div>
    );
  }

  const progress = status?.progress;
  const rep = status?.reputation;
  const pct = progress?.targetToday
    ? Math.min(100, Math.round((progress.sentToday / progress.targetToday) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            message.type === "ok"
              ? "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25"
              : "bg-red-500/10 text-red-300 ring-1 ring-red-500/25"
          }`}
        >
          {message.type === "ok" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reputation gauge */}
        <div className="card-ring rounded-2xl bg-[#111827] p-6">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <TrendingUp className="h-5 w-5 text-[#22c55e]" /> Reputation
          </h2>
          <div className="mt-4 flex items-center justify-center">
            <Gauge score={rep?.score ?? 0} />
          </div>
          <p className="mt-3 text-center text-sm text-[#CBD5E1]">
            <span className="font-semibold text-[#cbd5e1]">{rep?.label}</span>{" "}
            · {rep?.confidence ?? 0}% confidence
          </p>
        </div>

        {/* Factor breakdown */}
        <div className="card-ring rounded-2xl bg-[#111827] p-6 lg:col-span-2">
          <h2 className="font-semibold text-white">Score breakdown</h2>
          <div className="mt-4 space-y-3">
            {rep?.factors &&
              Object.entries(rep.factors).map(([key, f]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs text-[#CBD5E1]">
                    <span>{FACTOR_LABELS[key] || key}</span>
                    <span className="font-medium text-[#cbd5e1]">
                      {f.score}/100
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#1E293B]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.score}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: scoreColor(f.score) }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Ramp + controls */}
      <div className="card-ring rounded-2xl bg-[#111827] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Inbox className="h-5 w-5 text-[#22c55e]" /> Warmup ramp
          </h2>
          <div className="flex gap-2">
            {!progress?.started ? (
              <button
                onClick={startWarmup}
                disabled={busy}
                className="flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Play className="h-4 w-4" /> Start warmup
              </button>
            ) : (
              <button
                onClick={sendBatch}
                disabled={busy || progress?.remainingToday <= 0}
                className="flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {progress?.remainingToday <= 0
                  ? "Today complete"
                  : `Send batch (${progress?.remainingToday} left)`}
              </button>
            )}
          </div>
        </div>

        {progress?.started ? (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Day" value={`${progress.day} / ${progress.totalDays}`} />
              <Stat label="Today's target" value={progress.targetToday} />
              <Stat label="Sent today" value={progress.sentToday} />
              <Stat label="Total sent" value={progress.totalSent} />
            </div>
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-xs text-[#CBD5E1]">
                <span>Today&apos;s progress</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#1E293B]">
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-brand-gradient"
                />
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-[#CBD5E1]">
            Warmup hasn&apos;t started yet. Click “Start warmup” to begin the
            gradual ramp. Emails go to your own inbox (a deliverability
            self-test) plus any consenting seed addresses you configure.
          </p>
        )}

        {status?.log?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[#cbd5e1]">
              Recent activity
            </h3>
            <ul className="mt-2 divide-y divide-[#243044] text-sm">
              {status.log.map((e, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="truncate text-[#CBD5E1]">{e.to}</span>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      !e.ok
                        ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/25"
                        : e.placement === "spam"
                        ? "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25"
                        : e.placement === "inbox"
                        ? "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25"
                        : "bg-[#1E293B] text-[#CBD5E1] ring-1 ring-[#243044]"
                    }`}
                  >
                    {!e.ok ? "failed" : e.placement || "sent"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[#243044] bg-[#1E293B] p-3">
      <div className="text-xs text-[#CBD5E1]">{label}</div>
      <div className="mt-0.5 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function Gauge({ score }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="#1E293B"
        strokeWidth="12"
      />
      <motion.circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.9 }}
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="66"
        textAnchor="middle"
        fill="#ffffff"
        style={{ fontSize: 30, fontWeight: 700 }}
      >
        {score}
      </text>
      <text
        x="70"
        y="88"
        textAnchor="middle"
        fill="#CBD5E1"
        style={{ fontSize: 12 }}
      >
        / 100
      </text>
    </svg>
  );
}
