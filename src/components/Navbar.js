"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const links = [
  { label: "Home", href: "#home" },
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      e.preventDefault();
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // Section isn't on the current page (e.g. a legal page) — go home.
        window.location.href = `/${href}`;
      }
    }
    setOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: "var(--nav-h)" }}
      className={`fixed inset-x-0 top-0 z-50 flex items-center transition-[background,box-shadow,border-color] duration-300 ${
        scrolled ? "glass-nav" : "glass-nav--top"
      }`}
    >
      <nav className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a href="#home" className="flex items-center gap-2" aria-label="Trustmailtoday home" onClick={(e) => handleSmoothScroll(e, "#home")}>
          <Image 
            src="/logo.png" 
            alt="Trustmailtoday Logo"
            height={40} 
            width={40} 
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-white">Trustmailtoday</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleSmoothScroll(e, l.href)}
              className="text-sm font-medium text-[#cbd5e1] transition-colors hover:text-white cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#start"
            onClick={(e) => handleSmoothScroll(e, "#start")}
            className="rounded-lg bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-[#071018] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e] cursor-pointer"
          >
            Get started
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-4 top-full mt-2 rounded-2xl border border-[#22c55e]/20 bg-[#0b141d]/90 p-4 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(34,197,94,0.35)] md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleSmoothScroll(e, l.href)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#cbd5e1] hover:bg-[#131d2a] hover:text-white cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#start"
            onClick={(e) => handleSmoothScroll(e, "#start")}
            className="mt-2 block rounded-lg bg-brand-gradient px-3 py-2.5 text-center text-sm font-semibold text-[#071018] cursor-pointer"
          >
            Get started
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
