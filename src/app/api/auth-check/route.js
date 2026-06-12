import { NextResponse } from "next/server";
import { getSession, SESSION_COOKIE } from "@/lib/session";
import { checkDomainAuth } from "@/lib/dns";

export const runtime = "nodejs";
export const maxDuration = 20;

// Free providers can't have custom auth DNS configured by the user.
const FREE_PROVIDERS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
]);

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

/** GET uses the connected email's domain; POST accepts { domain }. */
export async function GET(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }
  const domain = (session.email || "").split("@")[1] || null;
  return runCheck(domain);
}

export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    /* no body */
  }
  const domain =
    (body.domain || "").trim().toLowerCase() ||
    (session.email || "").split("@")[1] ||
    null;
  return runCheck(domain);
}

async function runCheck(domain) {
  if (!domain || !DOMAIN_RE.test(domain)) {
    return NextResponse.json({ error: "invalid_domain", domain }, { status: 400 });
  }
  if (FREE_PROVIDERS.has(domain)) {
    return NextResponse.json({
      domain,
      managedProvider: true,
      note: `${domain} manages SPF/DKIM/DMARC for you. To control your own email authentication, use a custom domain (e.g. via Google Workspace).`,
    });
  }

  try {
    const result = await checkDomainAuth(domain);
    return NextResponse.json(result);
  } catch (err) {
    console.error("auth-check failed:", err?.message || err);
    return NextResponse.json(
      { error: "dns_lookup_failed", detail: err?.message },
      { status: 502 }
    );
  }
}
