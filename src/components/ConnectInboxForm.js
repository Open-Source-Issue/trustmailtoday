"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

/**
 * Connect-Inbox form (dark/green). OAuth-first — never collects a password.
 */
export default function ConnectInboxForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    // Hand off to the server-side OAuth flow (pre-fills the account chooser).
    window.location.href = `/api/auth/google?login_hint=${encodeURIComponent(
      email
    )}`;
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      id="start"
      className="card-ring w-full max-w-md rounded-2xl bg-[#111827] p-7 sm:p-8"
    >
      <h3 className="text-xl font-bold text-white">Start email warmup</h3>
      <p className="mt-1 text-sm text-[#CBD5E1]">
        Connect your inbox securely with OAuth — no passwords, ever.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[#cbd5e1]"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CBD5E1]" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-[#243044] bg-[#1E293B] py-3 pl-10 pr-3 text-white placeholder:text-[#64748B] outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
            />
          </div>
          {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gradient py-3 font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Connecting…
            </>
          ) : (
            <>
              Start warmup <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-[#CBD5E1]">
          <ShieldCheck className="h-4 w-4 text-[#22c55e]" />
          Secured by OAuth 2.0 · We never store your password
        </p>
      </form>
    </motion.div>
  );
}
