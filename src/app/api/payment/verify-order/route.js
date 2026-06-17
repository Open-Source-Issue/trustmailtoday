import { NextResponse } from "next/server";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import {
  isRazorpayConfigured,
  getRazorpay,
  verifyPaymentSignature,
} from "@/lib/razorpay";

export const runtime = "nodejs";

/**
 * POST /api/payment/verify-order
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Verifies a ONE-TIME payment after Checkout succeeds, then records it against
 * the session — consistent with how /api/payment/verify upgrades a subscription.
 *
 *   - Signature mismatch -> 400, payment NOT recorded
 *   - Missing fields     -> 400
 *   - Valid              -> records { orderId, paymentId, amount, currency } and
 *                           returns { ok: true, payment }
 *
 * The authoritative amount/currency are read back from Razorpay (orders.fetch)
 * rather than trusted from the client.
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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Cryptographic proof the payment came from Razorpay. Never mark paid without it.
  if (
    !verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
  ) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  // Read authoritative order details (don't trust client-supplied amounts).
  let amount = null;
  let currency = "INR";
  if (isRazorpayConfigured()) {
    try {
      const razorpay = getRazorpay();
      const order = await razorpay.orders.fetch(razorpay_order_id);
      amount = order?.amount ?? null;
      currency = order?.currency ?? "INR";
    } catch (err) {
      // Signature already proved authenticity; log and continue with nulls.
      console.error(
        "verify-order: order fetch failed:",
        err?.error || err?.message || err
      );
    }
  }

  // Append the verified payment to the session's payment history.
  const existing = Array.isArray(session.payments) ? session.payments : [];
  const record = {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amount,
    currency,
    status: "paid",
    paidAt: Date.now(),
  };
  await updateSession(cookie, { payments: [...existing, record] });

  return NextResponse.json({ ok: true, valid: true, payment: record });
}
