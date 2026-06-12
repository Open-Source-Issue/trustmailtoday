"use client";

import { motion } from "framer-motion";
import { Shield, Send, Globe, MessageCircle, Mail } from "lucide-react";
import Image from "next/image";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "#home" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Deliverability guide", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Acceptable Use", href: "#" },
    ],
  },
];

const socials = [
  { icon: Send, href: "#", label: "Twitter / X" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: MessageCircle, href: "#", label: "Community" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-[#243044] bg-[#111827]"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <a href="#home" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Trustmailtoday Logo"
              height={32} 
              width={32} 
              className="h-8 w-8 rounded-xl"
            />
            <span className="text-xl font-bold text-white">Trustmailtoday</span>
          </a>
          <p className="mt-4 max-w-xs text-sm text-[#CBD5E1]">
            Real sender-reputation warmup for teams that ship — inbox, not spam.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#243044] bg-[#1E293B] text-[#CBD5E1] transition-colors hover:border-[#22c55e]/40 hover:text-[#22c55e]"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[#CBD5E1] transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[#243044]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-2 px-5 py-6 text-sm text-[#CBD5E1] sm:flex-row sm:justify-center sm:gap-4 sm:px-8">
          <p>© {new Date().getFullYear()} Trustmailtoday. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
