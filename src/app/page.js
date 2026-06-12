import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-dotted relative min-h-screen overflow-x-hidden">
      <div className="glow glow--teal glow--top-left" aria-hidden />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
