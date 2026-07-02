import { NextResponse } from "next/server";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import { isPaidPlan } from "@/lib/plans";
import {
  isStripeConfigured,
  getStripe,
  priceIdFor,
  trialDays,
} from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * POST /api/payment/checkout   body: { plan: "pro" | "premium" | "enterprise" }
 *
 * Creates (or reuses) a Stripe Customer for the connected user and opens a
 * hosted Checkout Session in subscription mode. Card (USD) and UPI (INR) are
 * offered automatically based on the customer's location — no per-method code.
 *
 * Returns { url } for the client to redirect to. Plan state is granted by the
 * webhook on checkout.session.completed / customer.subscription.*, never here.
 */
export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    /* empty body */
  }
  const plan = body.plan;
  if (!isPaidPlan(plan)) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "billing_not_configured" },
      { status: 503 }
    );
  }

  const priceId = priceIdFor(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: "price_id_not_set", detail: `Set STRIPE_PRICE_${plan.toUpperCase()}` },
      { status: 503 }
    );
  }

  const baseUrl = process.env.APP_BASE_URL || new URL(request.url).origin;

  try {
    const stripe = getStripe();

    // Reuse the customer if we've created one before; otherwise create it now
    // and remember it on the session so renewals + the portal can find it.
    let customerId = session.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.email || undefined,
        metadata: { sessionId: String(session._id ?? "") },
      });
      customerId = customer.id;
      await updateSession(cookie, { stripeCustomerId: customerId });
    }

    const days = trialDays();
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      // Let Stripe surface every eligible method (cards + UPI) for the customer.
      automatic_tax: { enabled: false },
      subscription_data: {
        ...(days > 0 ? { trial_period_days: days } : {}),
        metadata: { plan },
      },
      client_reference_id: String(session._id ?? ""),
      metadata: { plan },
      allow_promotion_codes: true,
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=cancel`,
    });

    // Track the pending checkout so we can reconcile if needed.
    await updateSession(cookie, {
      pendingCheckout: { sessionId: checkout.id, plan },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("checkout failed:", err?.message || err);
    return NextResponse.json(
      { error: "checkout_create_failed" },
      { status: 502 }
    );
  }
}
