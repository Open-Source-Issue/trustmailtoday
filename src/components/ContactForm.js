"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const SUPPORT_EMAIL = "support@trustmailtoday.com";

/**
 * Contact form that composes a pre-filled email and opens the visitor's mail
 * client. We don't run a backend mail service, so this is the honest,
 * dependency-free way to start a conversation — the message is never sent
 * anywhere without the user's own email client.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      form.subject || `Contact from ${form.name || "a visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
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
        className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
      >
        <Send className="h-4 w-4" /> Open email to send
      </button>
      <p className="text-xs text-[#64748B]">
        This opens your email app with the message pre-filled. Prefer to write
        directly? Email us at{" "}
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
