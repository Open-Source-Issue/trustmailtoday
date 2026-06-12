import { NextResponse } from "next/server";
import { getSession, SESSION_COOKIE } from "@/lib/session";
import { computeReputation, emptySignals } from "@/lib/reputation";

export const runtime = "nodejs";

/**
 * GET /api/reputation
 * Returns the current 0–100 reputation score with a per-factor breakdown,
 * plus the raw signals it was computed from.
 */
export async function GET(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  const signals = session.warmup?.signals ?? emptySignals();
  return NextResponse.json({
    ...computeReputation(signals),
    signals,
  });
}
