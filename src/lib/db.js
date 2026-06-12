import { MongoClient } from "mongodb";

/**
 * Cached MongoDB connection.
 *
 * In dev, Next.js hot-reloads modules constantly; without caching we'd open a
 * new connection on every reload and exhaust the pool. We hang the connect
 * promise off globalThis so it's reused.
 *
 * If MONGODB_URI is not set, the app falls back to an in-memory store (see
 * lib/session.js) so it still runs in demo mode.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "Trustmailtoday";

export function isDbConfigured() {
  return Boolean(uri);
}

function clientPromise() {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!globalThis.__mwMongoPromise) {
    const client = new MongoClient(uri, {
      // Reasonable timeouts so a misconfigured URI fails fast.
      serverSelectionTimeoutMS: 8000,
    });
    globalThis.__mwMongoPromise = client.connect();
  }
  return globalThis.__mwMongoPromise;
}

export async function getDb() {
  const client = await clientPromise();
  return client.db(dbName);
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
