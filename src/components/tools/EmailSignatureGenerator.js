"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const FIELDS = [
  { key: "name", label: "Full name", placeholder: "Jane Doe" },
  { key: "title", label: "Job title", placeholder: "Head of Growth" },
  { key: "company", label: "Company", placeholder: "Trustmailtoday" },
  { key: "phone", label: "Phone", placeholder: "+91 90000 00000" },
  { key: "email", label: "Email", placeholder: "jane@company.com" },
  { key: "website", label: "Website", placeholder: "https://company.com" },
];

function buildSignatureHtml(v, accent) {
  const line = (label, value, href) => {
    if (!value) return "";
    const inner = href
      ? `<a href="${href}" style="color:#0a64bc;text-decoration:none;">${value}</a>`
      : value;
    return `<div style="font-size:13px;color:#475569;line-height:1.5;">${label ? `<span style="color:#94a3b8;">${label} </span>` : ""}${inner}</div>`;
  };

  return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:16px;border-right:3px solid ${accent};">
      <div style="font-size:17px;font-weight:bold;color:#0f172a;">${v.name || ""}</div>
      <div style="font-size:13px;color:${accent};font-weight:600;">${[v.title, v.company].filter(Boolean).join(" · ")}</div>
    </td>
    <td style="padding-left:16px;">
      ${line("", v.phone)}
      ${line("", v.email, v.email ? `mailto:${v.email}` : "")}
      ${line("", v.website, v.website)}
    </td>
  </tr>
</table>`;
}

export default function EmailSignatureGenerator() {
  const [values, setValues] = useState({
    name: "",
    title: "",
    company: "",
    phone: "",
    email: "",
    website: "",
  });
  const [accent, setAccent] = useState("#22c55e");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => buildSignatureHtml(values, accent), [values, accent]);

  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  const accents = ["#22c55e", "#0a64bc", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="mx-auto grid max-w-4xl gap-6 text-left lg:grid-cols-2">
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
              {f.label}
            </label>
            <input
              value={values[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full rounded-lg border border-[#243044] bg-[#1E293B] px-3 py-2.5 text-white placeholder:text-[#64748B] outline-none focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/30"
            />
          </div>
        ))}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#cbd5e1]">
            Accent color
          </label>
          <div className="flex gap-2">
            {accents.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccent(c)}
                aria-label={`Accent ${c}`}
                style={{ background: c }}
                className={`h-8 w-8 rounded-full transition ${
                  accent === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0f172a]" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-white">Live preview</p>
        <div className="rounded-xl border border-[#243044] bg-white p-5">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <button
          onClick={copyHtml}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied HTML" : "Copy signature HTML"}
        </button>
        <p className="mt-3 text-xs text-[#64748B]">
          Paste the HTML into Gmail Settings → Signature, or your email
          client&apos;s signature editor. Keep signatures lightweight — heavy
          images and many links can hurt deliverability.
        </p>
      </div>
    </div>
  );
}
