import { NextResponse } from "next/server";
import crypto from "crypto";
import { getConsentUrl, isGoogleConfigured } from "@/lib/google";

export const runtime = "nodejs";

/**
 * GET /api/auth/google
 * Starts the OAuth flow: sets an anti-CSRF `state` cookie and redirects the
 * user to Google's consent screen.
 */
export async function GET(request) {
  if (!isGoogleConfigured()) {
    const base = process.env.APP_BASE_URL || new URL(request.url).origin;
    return NextResponse.redirect(`${base}/?error=oauth_not_configured`);
  }

  const state = crypto.randomBytes(16).toString("base64url");
  const loginHint = new URL(request.url).searchParams.get("login_hint") || undefined;
  const consentUrl = getConsentUrl(state, { loginHint });

  const res = NextResponse.redirect(consentUrl);
  // Short-lived, httpOnly cookie to validate the callback came from us.
  res.cookies.set("mw_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });
  return res;
}
