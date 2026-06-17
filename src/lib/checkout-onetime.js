"use client";

/**
 * Client-side Razorpay Standard Web Checkout for ONE-TIME payments.
 *   1. POST /api/payment/create-order  -> { orderId, amount, currency, keyId }
 *   2. Open Razorpay Checkout with the order id
 *   3. POST /api/payment/verify-order on success -> record + verify signature
 *
 * Requires a connected inbox (the create-order route is session-gated, exactly
 * like the subscription flow in lib/checkout.js). A 401 means "connect first" —
 * callers should redirect to /#start.
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
 * Start one-time checkout.
 * @param {object} options
 * @param {number} options.amount - Amount in paise (>= 100, e.g. 10000 = ₹100)
 * @param {string} [options.currency="INR"]
 * @param {string} [options.receipt]
 * @param {string} [options.description="Payment"]
 * @param {string} [options.customerEmail]
 * @param {string} [options.customerName]
 * @param {string} [options.themeColor="#0A64BC"]
 *
 * @returns {Promise<{status:'success'|'cancelled'|'needs_connect'|'error', paymentId?:string, orderId?:string, payment?:object, message?:string}>}
 */
export async function startOneTimeCheckout(options = {}) {
  const {
    amount,
    currency = "INR",
    receipt,
    description = "Payment",
    customerEmail = "",
    customerName = "",
    themeColor = "#0A64BC",
  } = options;

  if (!Number.isInteger(amount) || amount < 100) {
    return {
      status: "error",
      message: "Amount must be at least 100 paise (₹1).",
    };
  }

  // 1. Create the order server-side.
  const res = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, receipt }),
  });

  if (res.status === 401) return { status: "needs_connect" };

  const data = await res.json();
  if (!res.ok) {
    const map = {
      billing_not_configured: "Billing isn't configured yet.",
      invalid_amount: "Invalid amount.",
      razorpay_auth_failed: "Payment gateway auth failed.",
      order_create_failed: "Couldn't create order. Try again.",
    };
    return { status: "error", message: map[data.error] || "Checkout failed." };
  }

  // 2. Load and open Razorpay Checkout.
  const ok = await loadRazorpayScript();
  if (!ok) return { status: "error", message: "Couldn't load Razorpay." };

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      name: "Trustmailtoday",
      description,
      prefill: {
        email: customerEmail || data.email || "",
        name: customerName,
      },
      theme: { color: themeColor },
      handler: async (response) => {
        // 3. Verify the signature server-side.
        const v = await fetch("/api/payment/verify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const vd = await v.json();
        if (v.ok && vd.valid) {
          resolve({
            status: "success",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            payment: vd.payment,
          });
        } else {
          resolve({
            status: "error",
            message: "Payment verification failed.",
          });
        }
      },
      modal: {
        ondismiss: () => resolve({ status: "cancelled" }),
      },
    });

    // Surface gateway-side payment failures (card declined, etc.).
    rzp.on("payment.failed", (resp) => {
      resolve({
        status: "error",
        message: resp?.error?.description || "Payment failed. Please try again.",
      });
    });

    rzp.open();
  });
}
