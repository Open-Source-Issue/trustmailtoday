import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Shared shell for legal/static content pages (Privacy, Terms, Acceptable Use).
 * Keeps the marketing chrome (navbar + footer) and applies readable prose
 * styling that matches the dark-slate / emerald design system.
 */
export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="bg-dotted relative min-h-screen overflow-x-clip">
      <div className="glow glow--teal glow--top-left" aria-hidden />
      <Navbar />
      <main className="relative z-10">
        <article className="pt-nav mx-auto max-w-3xl px-5 pb-24 sm:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#cbd5e1] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </h1>
          {updated && (
            <p className="mt-3 text-sm text-[#8aa0b2]">Last updated: {updated}</p>
          )}

          <div className="legal-prose mt-10 space-y-8 text-[#CBD5E1]">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

/** A titled section block used inside LegalLayout children. */
export function LegalSection({ heading, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-white">{heading}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#CBD5E1]">
        {children}
      </div>
    </section>
  );
}
