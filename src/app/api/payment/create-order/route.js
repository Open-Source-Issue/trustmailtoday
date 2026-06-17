import { NextResponse } from "next/server";
import { getSession, SESSION_COOKIE } from "@/lib/session";
import { isRazorpayConfigured, getRazorpay } from "@/lib/razorpay";

export const runtime = "nodejs";

/**
 * POST /api/payment/create-order
 * body: { amount (in paise), currency?, receipt?, notes? }
 *
 * Creates a Razorpay order for a ONE-TIME payment. Session-gated, mirroring the
 * subscription flow (/api/payment/subscribe) so both payment systems share the
 * same security model: the caller must have a connected inbox.
 *
 * Returns { orderId, amount, currency, keyId, email } on success.
 */
export async function POST(request) {
  // 1. Require a connected session (same gate as the subscription route).
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  // 2. Parse + validate the request body.
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { amount, currency = "INR", receipt, notes } = body;

  // Amount must be an integer number of paise, minimum 100 (₹1).
  if (!Number.isInteger(amount) || amount < 100) {
    return NextResponse.json(
      {
        error: "invalid_amount",
        detail: "Amount must be an integer >= 100 paise (₹1).",
      },
      { status: 400 }
    );
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "billing_not_configured" },
      { status: 503 }
    );
  }

  // 3. Create the order with Razorpay.
  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        email: session.email || "",
        ...(notes && typeof notes === "object" ? notes : {}),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      email: session.email || "",
    });
  } catch (err) {
    console.error("create-order failed:", err?.error || err?.message || err);
    // Surface Razorpay auth failures distinctly from generic gateway errors.
    const status = err?.statusCode === 401 ? 401 : 502;
    return NextResponse.json(
      { error: status === 401 ? "razorpay_auth_failed" : "order_create_failed" },
      { status }
    );
  }
}
