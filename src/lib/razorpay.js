import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Razorpay client + helpers.
 * Like the Google integration, this degrades gracefully when keys are absent
 * so the app still builds and runs in demo mode.
 */

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpay() {
  if (!isRazorpayConfigured()) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local."
    );
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/** Map an internal plan key to its configured Razorpay plan_id. */
export function planIdFor(planKey) {
  const map = {
    pro: process.env.RAZORPAY_PLAN_PRO,
    premium: process.env.RAZORPAY_PLAN_PREMIUM,
    enterprise: process.env.RAZORPAY_PLAN_ENTERPRISE,
  };
  return map[planKey] || null;
}

/**
 * Verify the signature returned by Checkout after a subscription payment.
 * Razorpay signs `payment_id|subscription_id` with the key secret.
 */
export function verifySubscriptionSignature({
  razorpay_payment_id,
  razorpay_subscription_id,
  razorpay_signature,
}) {
  if (
    !razorpay_payment_id ||
    !razorpay_subscription_id ||
    !razorpay_signature
  ) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest("hex");
  return timingSafeEqualHex(expected, razorpay_signature);
}

/** Verify a webhook payload against the X-Razorpay-Signature header. */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return timingSafeEqualHex(expected, signature);
}

function timingSafeEqualHex(a, b) {
  const ba = Buffer.from(a, "utf-8");
  const bb = Buffer.from(b, "utf-8");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
