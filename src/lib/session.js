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

const DEV_SECRET = "dev-insecure-secret-change-me";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s === DEV_SECRET) {
    // Never run on an insecure/default secret in production.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET must be set to a strong, unique value in production."
      );
    }
    return DEV_SECRET;
  }
  return s;
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

/* --------------------------- token encryption ---------------------------- *
 * Long-lived OAuth secrets (refresh/access tokens) are encrypted at rest with
 * AES-256-GCM. The key is derived from SESSION_SECRET, so no new environment
 * variable is required. Encrypted values are tagged with ENC_PREFIX so reads
 * can transparently pass through any older PLAINTEXT tokens during rollout —
 * nothing breaks for already-connected users.
 */

const ENC_PREFIX = "enc:v1:";

function encKey() {
  // 32-byte key for AES-256, derived deterministically from the app secret.
  return crypto.createHash("sha256").update(secret()).digest();
}

function encryptSecret(plain) {
  if (typeof plain !== "string" || plain.length === 0) return plain;
  if (plain.startsWith(ENC_PREFIX)) return plain; // already encrypted (idempotent)
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encKey(), iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return (
    ENC_PREFIX + [iv, tag, ct].map((b) => b.toString("base64url")).join(":")
  );
}

function decryptSecret(value) {
  // Pass through anything that isn't one of our encrypted values (incl. legacy
  // plaintext tokens), so existing sessions keep working.
  if (typeof value !== "string" || !value.startsWith(ENC_PREFIX)) return value;
  try {
    const [ivB64, tagB64, ctB64] = value.slice(ENC_PREFIX.length).split(":");
    const iv = Buffer.from(ivB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const ct = Buffer.from(ctB64, "base64url");
    const decipher = crypto.createDecipheriv("aes-256-gcm", encKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString(
      "utf8"
    );
  } catch (err) {
    // Corrupt/key-mismatch: don't crash. The token will be invalid and the
    // user is prompted to reconnect — far safer than throwing here.
    console.error("token decrypt failed:", err?.message || err);
    return value;
  }
}

const SECRET_TOKEN_FIELDS = ["refresh_token", "access_token"];

function mapTokenFields(tokens, fn) {
  if (!tokens || typeof tokens !== "object") return tokens;
  const out = { ...tokens };
  for (const field of SECRET_TOKEN_FIELDS) {
    if (typeof out[field] === "string" && out[field]) out[field] = fn(out[field]);
  }
  return out;
}

const encryptTokens = (tokens) => mapTokenFields(tokens, encryptSecret);
const decryptTokens = (tokens) => mapTokenFields(tokens, decryptSecret);

/** Return a shallow copy of a session doc with its token secrets decrypted. */
function withDecryptedTokens(doc) {
  if (!doc || !doc.tokens) return doc;
  return { ...doc, tokens: decryptTokens(doc.tokens) };
}


/** Create a session record and return { id, cookieValue }. */
export async function createSession(data) {
  const id = crypto.randomBytes(18).toString("base64url");
  const stored = { ...data };
  if (stored.tokens) stored.tokens = encryptTokens(stored.tokens);
  const doc = { _id: id, ...stored, createdAt: Date.now() };
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
    return withDecryptedTokens(await col.findOne({ _id: id }));
  }
  return withDecryptedTokens(memStore.get(id) || null);
}

/** Merge `patch` into a session by its raw (unsigned) id. */
export async function updateSessionById(id, patch) {
  if (!id) return null;
  const update = { ...patch, updatedAt: Date.now() };
  if (update.tokens) update.tokens = encryptTokens(update.tokens);
  if (isDbConfigured()) {
    const col = await collection();
    const res = await col.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { returnDocument: "after" }
    );
    return withDecryptedTokens(res?.value ?? res ?? null);
  }
  const current = memStore.get(id);
  if (!current) return null;
  const next = { ...current, ...update };
  memStore.set(id, next);
  return withDecryptedTokens(next);
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
    return withDecryptedTokens(
      await col.findOne({
        $or: [
          { "subscription.id": subscriptionId },
          { "pendingSubscription.id": subscriptionId },
        ],
      })
    );
  }
  for (const record of memStore.values()) {
    if (
      record?.subscription?.id === subscriptionId ||
      record?.pendingSubscription?.id === subscriptionId
    ) {
      return withDecryptedTokens(record);
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
