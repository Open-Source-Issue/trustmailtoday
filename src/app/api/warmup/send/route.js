import { NextResponse } from "next/server";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import { warmupProgress } from "@/lib/warmup";
import { runWarmupBatch } from "@/lib/warmup-runner";
import { dailyCap } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * POST /api/warmup/send
 * Manually trigger a warmup batch for the connected inbox. Shares its core
 * logic with the background scheduler (see lib/warmup-runner.js and
 * /api/cron/warmup) so manual and automated sends behave identically.
 */
export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }
  if (!session.warmup?.startedAt) {
    return NextResponse.json({ error: "not_started" }, { status: 400 });
  }
  if (!session.email) {
    return NextResponse.json({ error: "no_sender_address" }, { status: 400 });
  }

  const cap = dailyCap(session.plan || "free");
  const result = await runWarmupBatch(session, { cap });

  if (result.skipped) {
    const progress = warmupProgress(session.warmup, { cap });
    return NextResponse.json({
      ok: true,
      sent: 0,
      note: result.capReached
        ? `Free plan limit reached (${cap}/day). Upgrade for unlimited warmup.`
        : "Daily warmup target already met.",
      progress,
    });
  }

  await updateSession(cookie, {
    warmup: result.warmup,
    ...result.credentialUpdate,
  });

  return NextResponse.json({
    ok: result.errors.length === 0,
    sent: result.sent,
    errors: result.errors,
    progress: result.progress,
  });
}
