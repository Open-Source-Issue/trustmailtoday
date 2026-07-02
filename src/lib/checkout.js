"use client";

/**
 * Client-side Stripe subscription checkout.
 *
 * Hosted Checkout does all the heavy lifting (card + UPI, 3DS/SCA, RBI
 * e-mandate creation, currency), so the client just asks the server for a
 * Checkout Session URL and redirects to it:
 *
 *   1. POST /api/payment/checkout  -> { url }
 *   2. window.location = url       (Stripe-hosted page)
 *   3. Stripe redirects back to /dashboard?checkout=success|cancel
 *
 * Plan state is granted authoritatively by the webhook, never by the client.
 * Requires a connected inbox (the checkout route is session-gated). A 401
 * means "connect first" — callers should redirect to /#start.
 */

/**
 * Start checkout for a paid plan key ("pro" | "premium" | "enterprise").
 * On success this navigates away, so the returned promise only resolves for
 * the non-redirect outcomes.
 * @returns {Promise<{status:'redirecting'|'needs_connect'|'error', message?:string}>}
 */
export async function startCheckout(planKey) {
  const res = await fetch("/api/payment/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan: planKey }),
  });

  if (res.status === 401) return { status: "needs_connect" };

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error */
  }

  if (!res.ok || !data.url) {
    const map = {
      billing_not_configured: "Billing isn't configured yet.",
      price_id_not_set: "This plan isn't available yet.",
      checkout_create_failed: "Couldn't start checkout. Try again.",
      invalid_plan: "Invalid plan.",
    };
    return {
      status: "error",
      message: map[data.error] || "Checkout failed. Please try again.",
    };
  }

  // Redirect to Stripe's hosted Checkout page.
  window.location.assign(data.url);
  return { status: "redirecting" };
}
