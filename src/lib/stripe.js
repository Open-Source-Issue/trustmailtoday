import Stripe from "stripe";

/**
 * Stripe client + helpers.
 *
 * Like the Google/Razorpay integrations before it, this degrades gracefully
 * when keys are absent so the app still builds and runs in demo mode.
 *
 * Topology: a single Stripe India account.
 *   - International customers are charged in USD on Visa/Mastercard/Amex.
 *   - Indian customers can pay with UPI, which Stripe presents/settles in INR
 *     (UPI is INR-only by NPCI rules; recurring UPI/AutoPay is capped at
 *     ₹15,000 per charge, so keep monthly prices under ~$170 to stay eligible).
 *
 * Hosted Checkout + Billing + the Customer Portal are the source of truth;
 * the webhook (constructWebhookEvent) authoritatively drives plan state.
 */

let _stripe = null;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!isStripeConfigured()) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local."
    );
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Pin the API version so behaviour is stable across SDK upgrades.
      apiVersion: "2025-03-31.basil",
      appInfo: { name: "Trustmailtoday" },
    });
  }
  return _stripe;
}

/** Map an internal plan key to its configured Stripe recurring Price id. */
export function priceIdFor(planKey) {
  const map = {
    pro: process.env.STRIPE_PRICE_PRO,
    premium: process.env.STRIPE_PRICE_PREMIUM,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  };
  return map[planKey] || null;
}

/** Reverse of priceIdFor: resolve a Stripe Price id back to our plan key. */
export function planKeyForPrice(priceId) {
  if (!priceId) return null;
  const entries = {
    pro: process.env.STRIPE_PRICE_PRO,
    premium: process.env.STRIPE_PRICE_PREMIUM,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  };
  for (const [key, id] of Object.entries(entries)) {
    if (id && id === priceId) return key;
  }
  return null;
}

/**
 * Verify + parse a webhook payload against the Stripe-Signature header using
 * the RAW request body. Throws if the signature is invalid.
 */
export function constructWebhookEvent(rawBody, signature) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  return getStripe().webhooks.constructEvent(rawBody, signature, secret);
}

/** How many trial days to grant on a new subscription (0 = no trial). */
export function trialDays() {
  const n = Number.parseInt(process.env.STRIPE_TRIAL_DAYS ?? "7", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
