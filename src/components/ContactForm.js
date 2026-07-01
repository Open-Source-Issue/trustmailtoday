"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const SUPPORT_EMAIL = "support@trustmailtoday.com";

/**
 * Contact form that submits to the backend (POST /api/contact), which stores
 * the message and/or forwards it by email. If the backend isn't configured
 * (503) or the request fails, we fall back to the visitor's mail client via a
 * pre-filled mailto: link, so a message is never lost.
 */
export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot (hidden)
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const mailtoFallback = () => {
    const subject = encodeURIComponent(
      form.subject || `Contact from ${form.name || "a visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "", website: "" });
        return;
      }

      // Backend not configured to handle the message → use mail client.
      if (res.status === 503) {
        mailtoFallback();
        setStatus("idle");
        return;
      }

      const data = await res.json().catch(() => ({}));
      const map = {
        missing_fields: "Please fill in your name, email and message.",
        invalid_email: "Please enter a valid email address.",
      };
      setError(map[data.error] || "Couldn't send your message. Try again.");
      setStatus("error");
    } catch {
      // Network error → fall back to the mail client.
      mailtoFallback();
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-[#22c55e]/10 px-6 py-10 text-center ring-1 ring-[#22c55e]/25">
        <CheckCircle2 className="h-10 w-10 text-[#22c55e]" />
        <h3 className="text-lg font-semibold text-white">Message sent</h3>
        <p className="max-w-sm text-sm text-[#CBD5E1]">
          Thanks for reaching out — we&apos;ll get back to you at the email you
          provided.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-medium text-[#22c55e] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/25">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Honeypot: hidden from humans, tempting to bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
            Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2.5 text-white placeholder:text-[#64748B] outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2.5 text-white placeholder:text-[#64748B] outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
          Subject
        </label>
        <input
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="w-full rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2.5 text-white placeholder:text-[#64748B] outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
          Message
        </label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full resize-y rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2.5 text-white placeholder:text-[#64748B] outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
          placeholder="Tell us a bit about what you need…"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </button>
      <p className="text-xs text-[#64748B]">
        Prefer to write directly? Email us at{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-[#22c55e] underline hover:text-[#4ADE80]"
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
