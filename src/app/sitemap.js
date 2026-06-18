import { TOOLS } from "@/lib/tools";
import { LANDING_SLUGS } from "@/lib/landing-pages";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://trustmailtoday.com";

/**
 * App Router sitemap. Stays in sync automatically: tools, use-case pages and
 * blog posts are pulled from their data sources, so new entries appear here.
 */
export default function sitemap() {
  const now = new Date();

  const staticPages = [
    { url: "/", priority: 1, changeFrequency: "daily" },
    { url: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { url: "/features", priority: 0.8, changeFrequency: "weekly" },
    { url: "/about-us", priority: 0.7, changeFrequency: "monthly" },
    { url: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { url: "/affiliates", priority: 0.6, changeFrequency: "monthly" },
    { url: "/blog", priority: 0.9, changeFrequency: "weekly" },
    { url: "/free-email-deliverability-tools", priority: 0.8, changeFrequency: "weekly" },
    { url: "/privacy", priority: 0.5, changeFrequency: "yearly" },
    { url: "/terms", priority: 0.5, changeFrequency: "yearly" },
    { url: "/acceptable-use", priority: 0.5, changeFrequency: "yearly" },
  ];

  const toolPages = TOOLS.map((t) => ({
    url: `/${t.slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const landingPages = LANDING_SLUGS.map((slug) => ({
    url: `/${slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const blogPosts = getAllPosts().map((p) => ({
    url: `/blog/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: new Date(p.date),
  }));

  return [...staticPages, ...toolPages, ...landingPages, ...blogPosts].map(
    (entry) => ({
      url: `${BASE}${entry.url}`,
      lastModified: entry.lastModified || now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })
  );
}
