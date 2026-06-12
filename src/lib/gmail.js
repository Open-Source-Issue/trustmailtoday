import { OAuth2Client } from "google-auth-library";

/**
 * Real Gmail helpers built on the OAuth tokens captured during connect.
 * Uses the Gmail REST API via the authenticated OAuth2 client (no extra deps).
 *
 * The client auto-refreshes the access token when it expires (it has the
 * refresh_token). We surface any refreshed tokens so the caller can persist
 * them.
 */

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

function clientFor(tokens) {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials(tokens);
  let refreshed = null;
  client.on("tokens", (t) => {
    refreshed = { ...tokens, ...t };
  });
  return { client, getRefreshed: () => refreshed };
}

/** Encode a string to base64url (Gmail's raw message format). */
function toBase64Url(str) {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Build a minimal RFC 5322 message. */
function buildRaw({ from, to, subject, text }) {
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
  ];
  return `${headers.join("\r\n")}\r\n\r\n${text}`;
}

/**
 * Send an email from the connected account.
 * @returns {{ id, threadId, labelIds, refreshedTokens }}
 */
export async function sendEmail(tokens, { from, to, subject, text }) {
  const { client, getRefreshed } = clientFor(tokens);
  const raw = toBase64Url(buildRaw({ from, to, subject, text }));

  const res = await client.request({
    url: `${GMAIL_BASE}/messages/send`,
    method: "POST",
    data: { raw },
  });

  return {
    id: res.data?.id,
    threadId: res.data?.threadId,
    labelIds: res.data?.labelIds ?? [],
    refreshedTokens: getRefreshed(),
  };
}

/**
 * Inspect a received message to extract authentication results and placement.
 * Reads the Authentication-Results header (SPF/DKIM/DMARC) and the labelIds
 * (SPAM vs INBOX / CATEGORY_*).
 * @returns {{ authPass, spf, dkim, dmarc, placement, refreshedTokens }}
 */
export async function inspectMessage(tokens, messageId) {
  const { client, getRefreshed } = clientFor(tokens);

  const res = await client.request({
    url: `${GMAIL_BASE}/messages/${messageId}`,
    params: {
      format: "metadata",
      metadataHeaders: ["Authentication-Results"],
    },
  });

  const labelIds = res.data?.labelIds ?? [];
  const headers = res.data?.payload?.headers ?? [];
  const authHeader =
    headers.find(
      (h) => h.name?.toLowerCase() === "authentication-results"
    )?.value || "";

  const spf = /spf=pass/i.test(authHeader);
  const dkim = /dkim=pass/i.test(authHeader);
  const dmarc = /dmarc=pass/i.test(authHeader);

  const placement = labelIds.includes("SPAM") ? "spam" : "inbox";

  return {
    authPass: spf && dkim && dmarc,
    spf,
    dkim,
    dmarc,
    placement,
    labelIds,
    refreshedTokens: getRefreshed(),
  };
}



/** Map Gmail labelIds to a human "folder"/placement for inbox-check results. */
export function placementFromLabels(labelIds = []) {
  if (labelIds.includes("SPAM")) return "spam";
  if (labelIds.includes("TRASH")) return "trash";
  if (labelIds.includes("CATEGORY_PROMOTIONS")) return "promotions";
  if (labelIds.includes("CATEGORY_SOCIAL")) return "social";
  if (labelIds.includes("CATEGORY_UPDATES")) return "updates";
  if (labelIds.includes("CATEGORY_FORUMS")) return "forums";
  if (labelIds.includes("INBOX")) return "inbox"; // Primary
  return "unknown";
}

/**
 * List message ids matching a Gmail search query (e.g. 'subject:MW-abc').
 * @returns {{ ids: string[], refreshedTokens }}
 */
export async function listMessages(tokens, query, maxResults = 10) {
  const { client, getRefreshed } = clientFor(tokens);
  const res = await client.request({
    url: `${GMAIL_BASE}/messages`,
    params: { q: query, maxResults },
  });
  return {
    ids: (res.data?.messages ?? []).map((m) => m.id),
    refreshedTokens: getRefreshed(),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Find the *delivered* copy of a tagged self-test email and report where it
 * landed. Polls briefly because delivery isn't instant. Skips the SENT copy so
 * we measure the recipient-side placement, not the outbound copy.
 *
 * @param {string} token - unique tag included in the test subject
 * @returns {{ found, placement, auth, messageId, labelIds, refreshedTokens }}
 */
export async function findDeliveredMessage(tokens, token, opts = {}) {
  const attempts = opts.attempts ?? 5;
  const delayMs = opts.delayMs ?? 1500;
  let current = tokens;

  for (let i = 0; i < attempts; i++) {
    const { ids, refreshedTokens } = await listMessages(
      current,
      `subject:${token} newer_than:1d`,
      10
    );
    if (refreshedTokens) current = refreshedTokens;

    for (const id of ids) {
      const insp = await inspectMessage(current, id);
      if (insp.refreshedTokens) current = insp.refreshedTokens;
      // Skip the outbound copy; we want the delivered one.
      if (insp.labelIds.includes("SENT") && !insp.labelIds.includes("INBOX")) {
        continue;
      }
      return {
        found: true,
        placement: placementFromLabels(insp.labelIds),
        auth: {
          spf: insp.spf,
          dkim: insp.dkim,
          dmarc: insp.dmarc,
          pass: insp.authPass,
        },
        messageId: id,
        labelIds: insp.labelIds,
        refreshedTokens: current === tokens ? null : current,
      };
    }
    if (i < attempts - 1) await sleep(delayMs);
  }

  return {
    found: false,
    placement: "unknown",
    auth: { spf: false, dkim: false, dmarc: false, pass: false },
    messageId: null,
    labelIds: [],
    refreshedTokens: current === tokens ? null : current,
  };
}
