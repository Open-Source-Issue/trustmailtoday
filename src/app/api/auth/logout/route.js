import { NextResponse } from "next/server";
import { destroySession, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

/** POST /api/auth/logout — destroy the session and clear the cookie. */
export async function POST(request) {
  const base = process.env.APP_BASE_URL || new URL(request.url).origin;
  const current = request.cookies.get(SESSION_COOKIE)?.value;
  await destroySession(current);

  const res = NextResponse.redirect(`${base}/`, { status: 303 });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
