import { OAuth2Client } from "google-auth-library";

/**
 * Gmail scopes required for the warmup engine.
 *  - gmail.send       : send warmup emails on the user's behalf
 *  - gmail.modify     : read/label messages to measure inbox placement
 *  - userinfo.email   : identify which account was connected
 *
 * Keep scopes minimal — request only what the feature actually needs.
 */
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/userinfo.email",
  "openid",
];

/**
 * Returns true only when the required OAuth env vars are present.
 * Lets the UI degrade gracefully when credentials aren't configured yet.
 */
export function isGoogleConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REDIRECT_URI
  );
}

/**
 * Build a fresh OAuth2 client. A new instance per request keeps token state
 * isolated between users (important on a shared server).
 */
export function getOAuthClient() {
  if (!isGoogleConfigured()) {
    throw new Error(
      "Google OAuth is not configured. Copy .env.local.example to .env.local and set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI."
    );
  }
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/**
 * Generate the consent-screen URL.
 * @param {string} state - opaque anti-CSRF value echoed back to the callback.
 * @param {{ loginHint?: string }} [opts]
 */
export function getConsentUrl(state, opts = {}) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline", // request a refresh token
    prompt: "consent", // ensure a refresh token is returned every time
    scope: GOOGLE_SCOPES,
    state,
    include_granted_scopes: true,
    ...(opts.loginHint ? { login_hint: opts.loginHint } : {}),
  });
}
