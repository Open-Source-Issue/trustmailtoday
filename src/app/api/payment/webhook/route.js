import { NextResponse } from "next/server";
import {
  findSessionByStripeCustomerId,
  findSessionBySubscriptionId,
  updateSessionById,
} from "@/lib/session";
import { constructWebhookEvent, planKeyForPrice } from "@/lib/stripe";
import { isPaidPlan } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * POST /api/payment/webhook
 *
 * Stripe billing webhook — the single source of truth for plan state. Verified
 * against STRIPE_WEBHOOK_SECRET using the RAW request body.
 *
 * IMPORTANT: the shape of a webhook's event payload is governed by the API
 * version configured on the Stripe account/endpoint, which we don't control
 * from here. The `basil` release (2025-03-31+) moved several fields:
 *   - subscription period end  -> subscription.items.data[].current_period_end
 *   - invoice's subscription id -> invoice.parent.subscription_details.subscription
 *   - invoice line price        -> line.pricing.price_details.price
 * So every read below is defensive and falls back to the older top-level
 * location, making the handler correct on both Acacia- and Basil-era payloads.
 *
 * Entitlement policy: a user keeps their paid plan while the subscription is
 * active, trialing, OR past_due (we let Stripe's Smart Retries / dunning run).
 * Access is only revoked on a terminal status or the deleted event.
 *
 * Handled events:
 *   checkout.session.completed        -> link subscription id to the user
 *   customer.subscription.created     -> activate (covers trialing)
 *   customer.subscription.updated     -> sync status / plan / period / cancel
 *   invoice.paid                      -> extend the paid period (renewals)
 *   invoice.payment_failed            -> mark past_due (access retained)
 *   customer.subscription.deleted     -> downgrade to free
 *
 * Any unhandled event is acknowledged with 200 so Stripe stops retrying.
 */

const ENTITLED_STATUSES = new Set(["active", "trialing", "past_due"]);

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = constructWebhookEvent(rawBody, signature);
  } catch (err) {
    console.error("stripe webhook signature check failed:", err?.message || err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object;
        const record = await locateUser({
          customerId: idOf(cs.customer),
          subscriptionId: idOf(cs.subscription),
        });
        if (record) {
          const plan = cs.metadata?.plan || record.pendingCheckout?.plan || null;
          const entitled = isPaidPlan(plan);
          await updateSessionById(record._id, {
            stripeCustomerId: idOf(cs.customer) || record.stripeCustomerId,
            subscription: {
              ...(record.subscription || {}),
              id: idOf(cs.subscription) || record.subscription?.id || null,
              status: "active",
              ...(entitled ? { plan } : {}),
            },
            ...(entitled ? { plan } : {}),
            pendingCheckout: null,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const record = await locateUser({
          customerId: idOf(sub.customer),
          subscriptionId: sub.id,
        });
        if (record) {
          const priceId = subscriptionPriceId(sub);
          const plan =
            planKeyForPrice(priceId) ||
            sub.metadata?.plan ||
            record.subscription?.plan ||
            null;
          const entitled = ENTITLED_STATUSES.has(sub.status) && isPaidPlan(plan);
          const periodEnd = subscriptionPeriodEnd(sub);
          await updateSessionById(record._id, {
            plan: entitled ? plan : "free",
            subscription: {
              id: sub.id,
              status: sub.status,
              plan: isPaidPlan(plan) ? plan : null,
              priceId: priceId || null,
              currentPeriodEnd: periodEnd ? periodEnd * 1000 : null,
              cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
            },
            pendingCheckout: null,
          });
        }
        break;
      }

      case "invoice.paid": {
        const inv = event.data.object;
        const record = await locateUser({
          customerId: idOf(inv.customer),
          subscriptionId: invoiceSubscriptionId(inv),
        });
        if (record) {
          const line = inv.lines?.data?.[0];
          const priceId = invoiceLinePriceId(line);
          const plan =
            planKeyForPrice(priceId) || record.subscription?.plan || null;
          const periodEnd = line?.period?.end;
          const entitled = isPaidPlan(plan);
          await updateSessionById(record._id, {
            ...(entitled ? { plan } : {}),
            subscription: {
              ...(record.subscription || {}),
              id:
                invoiceSubscriptionId(inv) || record.subscription?.id || null,
              status: "active",
              ...(entitled ? { plan } : {}),
              ...(periodEnd ? { currentPeriodEnd: periodEnd * 1000 } : {}),
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object;
        const record = await locateUser({
          customerId: idOf(inv.customer),
          subscriptionId: invoiceSubscriptionId(inv),
        });
        if (record) {
          // Retain access during Stripe's Smart Retries / dunning window. The
          // plan is only downgraded on subscription.deleted (or a terminal
          // status arriving via customer.subscription.updated).
          await updateSessionById(record._id, {
            subscription: {
              ...(record.subscription || {}),
              status: "past_due",
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const record = await locateUser({
          customerId: idOf(sub.customer),
          subscriptionId: sub.id,
        });
        if (record) {
          await updateSessionById(record._id, {
            plan: "free",
            subscription: {
              ...(record.subscription || {}),
              id: sub.id,
              status: "canceled",
              cancelAtPeriodEnd: false,
              endedAt: Date.now(),
            },
          });
        }
        break;
      }

      default:
        // Unhandled event — acknowledge so Stripe stops retrying.
        break;
    }
  } catch (err) {
    // Log and 500 so Stripe retries; we never want to silently drop state.
    console.error("stripe webhook handler error:", err?.message || err);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/* ------------------------------- helpers ------------------------------- */

/** Stripe fields may be a string id or an expanded object; normalise to id. */
function idOf(v) {
  if (!v) return null;
  return typeof v === "object" ? v.id ?? null : v;
}

/** Locate the owning session by customer id first, then subscription id. */
async function locateUser({ customerId, subscriptionId }) {
  if (customerId) {
    const byCustomer = await findSessionByStripeCustomerId(customerId);
    if (byCustomer) return byCustomer;
  }
  if (subscriptionId) {
    return findSessionBySubscriptionId(subscriptionId);
  }
  return null;
}

/** Price id from a Subscription (price stays on the item across versions). */
function subscriptionPriceId(sub) {
  const item = sub?.items?.data?.[0];
  return item?.price?.id ?? item?.plan?.id ?? null;
}

/**
 * Current period end (unix seconds) from a Subscription. Basil moved this to
 * the item level; fall back to the legacy top-level field.
 */
function subscriptionPeriodEnd(sub) {
  return (
    sub?.items?.data?.[0]?.current_period_end ?? sub?.current_period_end ?? null
  );
}

/**
 * Subscription id referenced by an Invoice. Basil moved this under
 * parent.subscription_details; fall back to the legacy top-level field.
 */
function invoiceSubscriptionId(inv) {
  return (
    idOf(inv?.parent?.subscription_details?.subscription) ??
    idOf(inv?.subscription) ??
    null
  );
}

/**
 * Price id from an Invoice line. Basil replaced line.price with line.pricing;
 * fall back to the legacy field.
 */
function invoiceLinePriceId(line) {
  return (
    line?.pricing?.price_details?.price ??
    idOf(line?.price) ??
    line?.plan?.id ??
    null
  );
}
