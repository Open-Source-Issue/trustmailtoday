import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata = {
  title: "Blog — Email Deliverability & Warmup — Trustmailtoday",
  description:
    "Practical guides on email deliverability, warmup, authentication (SPF/DKIM/DMARC), and staying out of the spam folder.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <SubPageShell>
      <PageHero
        eyebrow="Blog"
        iconName="BookOpen"
        title="Deliverability"
        highlight="insights"
        subtitle="Practical, jargon-free guides on email warmup, authentication and reaching the inbox — written by the Trustmailtoday team."
      />

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-8 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-ring group flex flex-col rounded-2xl bg-[#111827] p-6 transition hover:-translate-y-0.5"
            >
              <span className="inline-flex w-fit rounded-full bg-[#22c55e]/10 px-3 py-0.5 text-xs font-semibold text-[#22c55e] ring-1 ring-[#22c55e]/25">
                {post.category}
              </span>
              <h2 className="mt-4 text-lg font-bold leading-snug text-white">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#CBD5E1]">
                {post.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-[#64748B]">
                <span>{formatDate(post.date)}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {post.readingTime}
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#22c55e]">
                Read more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection
        title="Reading about deliverability? Start"
        highlight="fixing it"
        subtitle="Put these guides into practice — connect your inbox and warm it up free."
      />
    </SubPageShell>
  );
}
