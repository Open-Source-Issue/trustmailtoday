import { NextResponse } from "next/server";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import { isPaidPlan } from "@/lib/plans";
import {
  isRazorpayConfigured,
  getRazorpay,
  planIdFor,
} from "@/lib/razorpay";

export const runtime = "nodejs";

/**
 * POST /api/payment/subscribe   body: { plan: "pro" | "premium" | "enterprise" }
 * Creates a Razorpay subscription and returns the id + public key for Checkout.
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

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "billing_not_configured" },
      { status: 503 }
    );
  }

  const planId = planIdFor(plan);
  if (!planId) {
    return NextResponse.json(
      { error: "plan_id_not_set", detail: `Set RAZORPAY_PLAN_${plan.toUpperCase()}` },
      { status: 503 }
    );
  }

  try {
    const razorpay = getRazorpay();
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // bill monthly for up to 12 cycles
      notes: { email: session.email || "", plan },
    });

    // Remember the pending subscription against the session.
    await updateSession(cookie, {
      pendingSubscription: { id: subscription.id, plan },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      plan,
      email: session.email || "",
    });
  } catch (err) {
    console.error("subscribe failed:", err?.error || err?.message || err);
    return NextResponse.json(
      { error: "subscription_create_failed" },
      { status: 502 }
    );
  }
}
