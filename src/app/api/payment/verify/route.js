import { NextResponse } from "next/server";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import { verifySubscriptionSignature } from "@/lib/razorpay";
import { isPaidPlan, planSummary } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * POST /api/payment/verify
 * body: { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }
 *
 * Confirms the Checkout signature client-side success. The webhook remains the
 * source of truth for activation/renewal/cancellation, but verifying here lets
 * us upgrade the UI immediately after a successful payment.
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
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!verifySubscriptionSignature(body)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  // Resolve which plan this subscription was for.
  const pending = session.pendingSubscription;
  const plan =
    pending?.id === body.razorpay_subscription_id ? pending.plan : null;
  if (!isPaidPlan(plan)) {
    return NextResponse.json({ error: "plan_mismatch" }, { status: 400 });
  }

  await updateSession(cookie, {
    plan,
    subscription: {
      id: body.razorpay_subscription_id,
      paymentId: body.razorpay_payment_id,
      status: "active",
      activatedAt: Date.now(),
    },
    pendingSubscription: null,
  });

  return NextResponse.json({ ok: true, plan: planSummary(plan) });
}
