import { NextResponse } from "next/server";
import { getSession, SESSION_COOKIE } from "@/lib/session";
import { isStripeConfigured, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * POST /api/payment/portal
 *
 * Opens a Stripe Customer Portal session for the connected user's customer.
 * The portal is where users update cards, change/cancel plans (with automatic
 * proration), and download invoices — so we don't build any of that UI.
 *
 * Returns { url } to redirect to. 409 if the user has no Stripe customer yet
 * (i.e. never subscribed).
 */
export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "billing_not_configured" },
      { status: 503 }
    );
  }

  const customerId = session.stripeCustomerId;
  if (!customerId) {
    return NextResponse.json({ error: "no_customer" }, { status: 409 });
  }

  const baseUrl = process.env.APP_BASE_URL || new URL(request.url).origin;

  try {
    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("portal failed:", err?.message || err);
    return NextResponse.json({ error: "portal_create_failed" }, { status: 502 });
  }
}
