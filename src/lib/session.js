import crypto from "crypto";
import { isDbConfigured, getCollection } from "@/lib/db";

/**
 * Session + token store.
 *
 * Backed by MongoDB when MONGODB_URI is set; otherwise falls back to an
 * in-memory Map so the app still runs in demo mode. All public functions are
 * async so the two backends are interchangeable.
 *
 * Security model:
 *   - Refresh/access tokens never leave the server.
 *   - The browser only holds an httpOnly, signed session id cookie.
 *
 * PRODUCTION NOTE: encrypt `tokens.refresh_token` at rest before storing.
 */

export const SESSION_COOKIE = "mw_session";
const COLLECTION = "sessions";

// In-memory fallback (survives hot-reload via globalThis).
const memStore =
  globalThis.__mwSessionStore || (globalThis.__mwSessionStore = new Map());

async function collection() {
  return getCollection(COLLECTION);
}

/* ----------------------------- cookie signing ---------------------------- */

function secret() {
  return process.env.SESSION_SECRET || "dev-insecure-secret-change-me";
}

function sign(value) {
  const sig = crypto
    .createHmac("sha256", secret())
    .update(value)
    .digest("base64url");
  return `${value}.${sig}`;
}

/** Verify a signed cookie value; returns the session id or null. */
export function unsign(signed) {
  if (!signed || !signed.includes(".")) return null;
  const idx = signed.lastIndexOf(".");
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto
    .createHmac("sha256", secret())
    .update(value)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

/* ------------------------------- operations ------------------------------ */

/** Create a session record and return { id, cookieValue }. */
export async function createSession(data) {
  const id = crypto.randomBytes(18).toString("base64url");
  const doc = { _id: id, ...data, createdAt: Date.now() };
  if (isDbConfigured()) {
    const col = await collection();
    await col.insertOne(doc);
  } else {
    memStore.set(id, doc);
  }
  return { id, cookieValue: sign(id) };
}

export async function getSession(signedCookieValue) {
  const id = unsign(signedCookieValue);
  if (!id) return null;
  if (isDbConfigured()) {
    const col = await collection();
    return col.findOne({ _id: id });
  }
  return memStore.get(id) || null;
}

/** Merge `patch` into a session by its raw (unsigned) id. */
export async function updateSessionById(id, patch) {
  if (!id) return null;
  const update = { ...patch, updatedAt: Date.now() };
  if (isDbConfigured()) {
    const col = await collection();
    const res = await col.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { returnDocument: "after" }
    );
    return res?.value ?? res ?? null;
  }
  const current = memStore.get(id);
  if (!current) return null;
  const next = { ...current, ...update };
  memStore.set(id, next);
  return next;
}

/** Merge `patch` into the session identified by a signed cookie value. */
export async function updateSession(signedCookieValue, patch) {
  const id = unsign(signedCookieValue);
  return updateSessionById(id, patch);
}

export async function destroySession(signedCookieValue) {
  const id = unsign(signedCookieValue);
  if (!id) return;
  if (isDbConfigured()) {
    const col = await collection();
    await col.deleteOne({ _id: id });
  } else {
    memStore.delete(id);
  }
}

/**
 * Find a session by the Razorpay subscription id it owns (active or pending).
 * Used by the billing webhook, which has no cookie to identify the user.
 */
export async function findSessionBySubscriptionId(subscriptionId) {
  if (!subscriptionId) return null;
  if (isDbConfigured()) {
    const col = await collection();
    return col.findOne({
      $or: [
        { "subscription.id": subscriptionId },
        { "pendingSubscription.id": subscriptionId },
      ],
    });
  }
  for (const record of memStore.values()) {
    if (
      record?.subscription?.id === subscriptionId ||
      record?.pendingSubscription?.id === subscriptionId
    ) {
      return record;
    }
  }
  return null;
}

/* --------------------------------- cookie -------------------------------- */

/** Standard cookie options for the session cookie. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
