import { NextResponse } from "next/server";
import { checkDomainAuth } from "@/lib/dns";

export const runtime = "nodejs";
export const maxDuration = 20;

const DOMAIN_RE =
  /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function normalizeDomain(raw) {
  let v = (raw || "").trim().toLowerCase();
  // Accept full emails or URLs and extract the domain.
  if (v.includes("@")) v = v.split("@")[1] || "";
  v = v.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
  return v;
}

/**
 * Public SPF / DKIM / DMARC lookup for the free checker tools.
 * POST { domain } — no authentication required (read-only DNS).
 */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    /* no body */
  }
  const domain = normalizeDomain(body.domain);

  if (!domain || !DOMAIN_RE.test(domain)) {
    return NextResponse.json(
      { error: "invalid_domain", domain },
      { status: 400 }
    );
  }

  try {
    const result = await checkDomainAuth(domain);
    return NextResponse.json(result);
  } catch (err) {
    console.error("tools/dns-auth failed:", err?.message || err);
    return NextResponse.json(
      { error: "dns_lookup_failed", detail: err?.message },
      { status: 502 }
    );
  }
}
