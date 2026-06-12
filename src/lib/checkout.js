"use client";

/**
 * Client-side Razorpay subscription checkout flow.
 *   1. POST /api/payment/subscribe  -> { subscriptionId, keyId }
 *   2. Open Razorpay Checkout with the subscription id
 *   3. POST /api/payment/verify on success -> upgrade the UI
 *
 * Requires a connected inbox (the subscribe route is session-gated). A 401
 * means "connect first" — callers should redirect to /#start.
 */

let scriptPromise = null;

function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Start checkout for a paid plan key ("pro" | "premium" | "enterprise").
 * @returns {Promise<{status: 'success'|'cancelled'|'needs_connect'|'error', message?: string, plan?: object}>}
 */
export async function startCheckout(planKey) {
  // 1. Create the subscription server-side.
  const res = await fetch("/api/payment/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan: planKey }),
  });

  if (res.status === 401) return { status: "needs_connect" };

  const data = await res.json();
  if (!res.ok) {
    const map = {
      billing_not_configured: "Billing isn't configured yet.",
      plan_id_not_set: "This plan isn't available yet.",
      subscription_create_failed: "Couldn't start checkout. Try again.",
      invalid_plan: "Invalid plan.",
    };
    return { status: "error", message: map[data.error] || "Checkout failed." };
  }

  // 2. Load and open Razorpay Checkout.
  const ok = await loadRazorpayScript();
  if (!ok) return { status: "error", message: "Couldn't load Razorpay." };

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      subscription_id: data.subscriptionId,
      name: "Trustmailtoday",
      description: `${planKey[0].toUpperCase()}${planKey.slice(1)} subscription`,
      prefill: { email: data.email || "" },
      theme: { color: "#0A64BC" },
      handler: async (response) => {
        // 3. Verify the signature server-side.
        const v = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const vd = await v.json();
        if (v.ok) resolve({ status: "success", plan: vd.plan });
        else resolve({ status: "error", message: "Payment verification failed." });
      },
      modal: {
        ondismiss: () => resolve({ status: "cancelled" }),
      },
    });
    rzp.open();
  });
}
