import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSession, updateSession, SESSION_COOKIE } from "@/lib/session";
import { planHasFeature } from "@/lib/plans";
import { getMailer } from "@/lib/mailer";

export const runtime = "nodejs";
// Polling for delivery takes a few seconds; keep within Vercel's limits
// (Hobby caps at ~10s; raise this on Pro for more headroom).
export const maxDuration = 10;

/**
 * POST /api/inbox-check
 * Sends a uniquely-tagged test email to the connected inbox, finds the
 * delivered copy, and reports placement (Primary / Promotions / Spam / …) plus
 * SPF/DKIM/DMARC results. Premium+ only.
 *
 * Provider-agnostic: works for Gmail (API) and SMTP providers that supplied
 * IMAP settings. Send-only providers (SendGrid/Mailgun/SES, or SMTP without
 * IMAP) can send the probe but can't read placement — reported as unsupported.
 *
 * Results are folded into reputation signals so the score reflects real
 * placement data.
 */
export async function POST(request) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await getSession(cookie);
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }
  if (!session.email) {
    return NextResponse.json({ error: "no_sender_address" }, { status: 400 });
  }
  if (!planHasFeature(session.plan || "free", "inboxCheck")) {
    return NextResponse.json(
      { error: "feature_locked", feature: "inboxCheck" },
      { status: 403 }
    );
  }

  const mailer = getMailer(session);
  if (!mailer.caps?.canRead) {
    return NextResponse.json(
      {
        ok: true,
        found: false,
        unsupported: true,
        placement: "unknown",
        note:
          "This provider is send-only (no mailbox to read). Inbox-placement " +
          "testing needs Gmail or an SMTP account with IMAP configured.",
      },
      { status: 200 }
    );
  }

  // Unique tag so we can find exactly this message.
  const token = `MW-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

  try {
    await mailer.send({
      to: session.email,
      subject: `${token} Trustmailtoday inbox placement test`,
      text: "This is an automated Trustmailtoday inbox-placement test. You can ignore it.",
    });

    const result = await mailer.findDelivered(token, {
      attempts: 4,
      delayMs: 1200,
    });

    // Fold the observation into reputation signals (if warmup is active).
    const credentialUpdate = mailer.credentialUpdate();
    if (session.warmup?.signals && result.found) {
      const signals = { ...session.warmup.signals };
      if (result.placement === "spam") {
        signals.spamFolderCount = (signals.spamFolderCount || 0) + 1;
      } else {
        signals.inboxCount = (signals.inboxCount || 0) + 1;
      }
      if (result.auth && (result.auth.spf || result.auth.dkim || result.auth.dmarc)) {
        signals.authPass = result.auth.pass;
      }
      await updateSession(cookie, {
        warmup: { ...session.warmup, signals },
        ...credentialUpdate,
      });
    } else if (Object.keys(credentialUpdate).length) {
      await updateSession(cookie, credentialUpdate);
    }

    return NextResponse.json({
      ok: true,
      found: result.found,
      placement: result.placement,
      auth: result.auth,
      checkedAt: Date.now(),
      note: result.found
        ? null
        : "Test email sent but not located yet — try again in a moment.",
    });
  } catch (err) {
    const msg =
      err?.response?.data?.error?.message || err?.message || "check_failed";
    console.error("inbox-check failed:", msg);
    return NextResponse.json({ error: "check_failed", detail: msg }, { status: 502 });
  }
}
