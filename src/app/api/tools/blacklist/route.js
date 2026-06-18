import { NextResponse } from "next/server";
import { checkBlacklist } from "@/lib/blacklist";

export const runtime = "nodejs";
export const maxDuration = 25;

/**
 * Public DNSBL/RBL blacklist lookup for the free checker tool.
 * POST { input } where input is an IPv4 address or a domain.
 */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    /* no body */
  }
  const input = (body.input || body.domain || body.ip || "").trim();
  if (!input) {
    return NextResponse.json({ error: "empty_input" }, { status: 400 });
  }

  try {
    const result = await checkBlacklist(input);
    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("tools/blacklist failed:", err?.message || err);
    return NextResponse.json(
      { error: "lookup_failed", detail: err?.message },
      { status: 502 }
    );
  }
}
