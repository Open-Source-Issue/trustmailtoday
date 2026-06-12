import { NextResponse } from "next/server";
import { findSessionBySubscriptionId, updateSessionById } from "@/lib/session";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { isPaidPlan } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * POST /api/payment/webhook
 * Razorpay subscription webhook. Verified against RAZORPAY_WEBHOOK_SECRET using
 * the RAW request body. This is the source of truth for plan state.
 *
 * Handled events:
 *   subscription.activated / subscription.charged  -> activate paid plan
 *   subscription.cancelled / subscription.completed / .halted -> downgrade
 */
export async function POST(request) {
  // Raw body is required for an accurate signature check.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const event = payload.event;
  const subEntity = payload.payload?.subscription?.entity;
  const subscriptionId = subEntity?.id;
  const plan = subEntity?.notes?.plan;

  if (!subscriptionId) {
    // Not a subscription event we track; acknowledge so Razorpay stops retrying.
    return NextResponse.json({ received: true });
  }

  // Locate the user this subscription belongs to.
  const record = await findSessionBySubscriptionId(subscriptionId);

  if (!record) {
    // User session not found (e.g. expired). Ack anyway so Razorpay stops retrying.
    return NextResponse.json({ received: true, matched: false });
  }
  const id = record._id;

  switch (event) {
    case "subscription.activated":
    case "subscription.charged":
      if (isPaidPlan(plan)) {
        await updateSessionById(id, {
          plan,
          subscription: {
            id: subscriptionId,
            status: "active",
            activatedAt: Date.now(),
          },
          pendingSubscription: null,
        });
      }
      break;

    case "subscription.cancelled":
    case "subscription.completed":
    case "subscription.halted":
      await updateSessionById(id, {
        plan: "free",
        subscription: {
          id: subscriptionId,
          status: event.split(".")[1],
          endedAt: Date.now(),
        },
      });
      break;

    default:
      // Unhandled event — acknowledge.
      break;
  }

  return NextResponse.json({ received: true });
}
