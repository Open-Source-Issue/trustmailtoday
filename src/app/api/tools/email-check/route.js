import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validate";

export const runtime = "nodejs";
export const maxDuration = 15;

/**
 * Public email verification for the free checker tool.
 * POST { email } — checks syntax, MX records, disposable + role-based flags.
 */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    /* no body */
  }
  const email = (body.email || "").trim();
  if (!email) {
    return NextResponse.json({ error: "empty_input" }, { status: 400 });
  }

  try {
    const result = await validateEmail(email);
    return NextResponse.json(result);
  } catch (err) {
    console.error("tools/email-check failed:", err?.message || err);
    return NextResponse.json(
      { error: "lookup_failed", detail: err?.message },
      { status: 502 }
    );
  }
}
