import { NextResponse } from "next/server";
import { getSession, SESSION_COOKIE } from "@/lib/session";
import { warmupProgress, buildSchedule, DEFAULT_RAMP } from "@/lib/warmup";
import { computeReputation, emptySignals } from "@/lib/reputation";
import { dailyCap, planSummary } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * GET /api/warmup/status
 * Returns connection state, warmup ramp progress, reputation and recent log.
 */
export async function GET(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const planKey = session.plan || "free";
  const cap = dailyCap(planKey);
  const warmup = session.warmup ?? null;
  const signals = warmup?.signals ?? emptySignals();

  return NextResponse.json({
    connected: true,
    email: session.email ?? null,
    plan: planSummary(planKey),
    started: Boolean(warmup?.startedAt),
    progress: warmup
      ? warmupProgress(warmup, { cap })
      : warmupProgress({ ramp: DEFAULT_RAMP }, { cap }),
    reputation: computeReputation(signals),
    schedule: buildSchedule(warmup?.ramp ?? DEFAULT_RAMP),
    log: (warmup?.log ?? []).slice(-10).reverse(),
  });
}
