import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Generic chrome for every non-home page (tools, marketing, use-case, blog).
 * Keeps the marketing navbar + footer and the dotted/glow background so new
 * pages feel native to the existing landing UI. Content is passed as children.
 */
export default function SubPageShell({ children }) {
  return (
    <div className="bg-dotted relative min-h-screen overflow-x-hidden">
      <div className="glow glow--teal glow--top-left" aria-hidden />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
