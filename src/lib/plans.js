/**
 * Subscription plan definitions and entitlement helpers.
 *
 * The daily cap is the product's core gate: Free is limited to 10 warmup
 * emails/day; paid tiers lift that limit (bounded by the warmup ramp, which
 * never exceeds DEFAULT_RAMP.max for safety regardless of plan).
 *
 * Pricing model: monthly USD subscriptions billed via Stripe. `price` is the
 * headline USD amount shown to every visitor. Indian users may pay with UPI,
 * which Stripe presents/settles in the INR equivalent (UPI is INR-only). All
 * paid prices are kept under the ₹15,000 UPI AutoPay cap so UPI works on
 * every tier. The authoritative amount lives on the Stripe Price object; the
 * value here is for display and must match STRIPE_PRICE_* in Stripe.
 */

export const PLAN_KEYS = ["free", "pro", "premium", "enterprise"];

export const CURRENCY = "USD";

export const PLANS = {
  free: {
    key: "free",
    name: "Free",
    price: 0, // USD/month
    dailyCap: 10, // emails/day
    inboxes: 1,
    features: { reputation: true, inboxCheck: false, api: false, team: false },
  },
  pro: {
    key: "pro",
    name: "Pro",
    price: 19, // USD/month
    dailyCap: Infinity, // bounded by the warmup ramp
    inboxes: 1,
    features: { reputation: true, inboxCheck: false, api: false, team: false },
  },
  premium: {
    key: "premium",
    name: "Premium",
    price: 49, // USD/month
    dailyCap: Infinity,
    inboxes: 3,
    features: { reputation: true, inboxCheck: true, api: false, team: false },
  },
  enterprise: {
    key: "enterprise",
    name: "Enterprise",
    price: 149, // USD/month (kept under the ~$170 UPI AutoPay ceiling)
    dailyCap: Infinity,
    inboxes: Infinity,
    features: { reputation: true, inboxCheck: true, api: true, team: true },
  },
};

export function getPlan(planKey) {
  return PLANS[planKey] || PLANS.free;
}

/** Daily email cap for a plan key. */
export function dailyCap(planKey) {
  return getPlan(planKey).dailyCap;
}

/** Is this a valid PAID plan key we can subscribe to? */
export function isPaidPlan(planKey) {
  return ["pro", "premium", "enterprise"].includes(planKey);
}

/** Does this plan include a given feature flag? */
export function planHasFeature(planKey, feature) {
  return Boolean(getPlan(planKey).features?.[feature]);
}

/** Serializable plan summary for API responses (Infinity -> null). */
export function planSummary(planKey) {
  const p = getPlan(planKey);
  return {
    key: p.key,
    name: p.name,
    price: p.price,
    dailyCap: p.dailyCap === Infinity ? null : p.dailyCap,
    inboxes: p.inboxes === Infinity ? null : p.inboxes,
    features: p.features,
  };
}
