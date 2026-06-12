import { NextResponse } from "next/server";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import { DEFAULT_RAMP, warmupProgress } from "@/lib/warmup";
import { emptySignals } from "@/lib/reputation";

export const runtime = "nodejs";

/**
 * POST /api/warmup/start
 * Begins (or resumes) the warmup for the connected inbox.
 */
export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  if (session.warmup?.startedAt) {
    return NextResponse.json({
      ok: true,
      already: true,
      progress: warmupProgress(session.warmup),
    });
  }

  const warmup = {
    startedAt: Date.now(),
    ramp: DEFAULT_RAMP,
    dailySent: {}, // { 'YYYY-MM-DD': count }
    totalSent: 0,
    signals: emptySignals(),
    log: [], // recent send/inspect events
  };

  await updateSession(cookie, { warmup });

  return NextResponse.json({ ok: true, progress: warmupProgress(warmup) });
}
