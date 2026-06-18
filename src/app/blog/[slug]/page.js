import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import SubPageShell from "@/components/SubPageShell";
import CTASection from "@/components/CTASection";
import { getPost, getAllPosts, POST_SLUGS, formatDate } from "@/lib/blog";

export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found — Trustmailtoday" };
  return {
    title: `${post.title} — Trustmailtoday`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
    },
  };
}

function Block({ block }) {
  if (block.h2) return <h2 className="mt-10 text-2xl font-bold text-white">{block.h2}</h2>;
  if (block.quote)
    return (
      <blockquote className="my-6 border-l-2 border-[#22c55e] pl-4 italic text-[#cbd5e1]">
        {block.quote}
      </blockquote>
    );
  if (block.ul)
    return (
      <ul className="my-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[#CBD5E1]">
        {block.ul.map((li, i) => (
          <li key={i}>{li}</li>
        ))}
      </ul>
    );
  return <p className="mt-4 text-[15px] leading-relaxed text-[#CBD5E1]">{block.p}</p>;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <SubPageShell>
      <article className="pt-nav relative z-10 mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#cbd5e1] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <span className="inline-flex rounded-full bg-[#22c55e]/10 px-3 py-0.5 text-xs font-semibold text-[#22c55e] ring-1 ring-[#22c55e]/25">
          {post.category}
        </span>
        <h1 className="mt-4 text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.1] text-white">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-[#64748B]">
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {post.readingTime}
          </span>
        </div>

        <div className="mt-8">
          {post.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </article>

      <section className="relative z-10 mx-auto max-w-[1200px] px-5 pb-4 sm:px-8">
        <h2 className="mb-5 text-center text-sm font-semibold uppercase tracking-wider text-[#22c55e]">
          Keep reading
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card-ring rounded-2xl bg-[#111827] p-5 transition hover:-translate-y-0.5"
            >
              <span className="text-xs font-semibold text-[#22c55e]">
                {p.category}
              </span>
              <h3 className="mt-2 text-sm font-bold leading-snug text-white">
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <CTASection />
    </SubPageShell>
  );
}
