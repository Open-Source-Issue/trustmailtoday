import { NextResponse } from "next/server";
import { getOAuthClient, isGoogleConfigured } from "@/lib/google";
import {
  createSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";

export const runtime = "nodejs";

/**
 * GET /api/auth/google/callback
 * Google redirects here after consent. We:
 *   1. validate the anti-CSRF state,
 *   2. exchange the auth code for tokens,
 *   3. look up the connected email,
 *   4. store tokens server-side, set a session cookie,
 *   5. redirect to /dashboard.
 */
export async function GET(request) {
  const url = new URL(request.url);
  const base = process.env.APP_BASE_URL || url.origin;

  const fail = (reason) =>
    NextResponse.redirect(`${base}/?error=${encodeURIComponent(reason)}`);

  if (!isGoogleConfigured()) return fail("oauth_not_configured");

  // User denied consent or Google returned an error.
  const oauthError = url.searchParams.get("error");
  if (oauthError) return fail(oauthError);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.cookies.get("mw_oauth_state")?.value;

  if (!code) return fail("missing_code");
  if (!state || !savedState || state !== savedState) {
    return fail("state_mismatch");
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Identify the connected account.
    let email = null;
    try {
      const info = await client.request({
        url: "https://openidconnect.googleapis.com/v1/userinfo",
      });
      email = info.data?.email ?? null;
    } catch {
      // Non-fatal: we can still store the session without the email.
    }

    // Persist tokens server-side (MVP: in-memory; swap for MongoDB later).
    const { cookieValue } = await createSession({
      email,
      tokens, // contains access_token, refresh_token, expiry_date, scope
      provider: "google",
    });

    const res = NextResponse.redirect(`${base}/dashboard`);
    res.cookies.set(SESSION_COOKIE, cookieValue, sessionCookieOptions());
    // Clear the one-time state cookie.
    res.cookies.set("mw_oauth_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error("OAuth callback failed:", err?.message || err);
    return fail("token_exchange_failed");
  }
}
