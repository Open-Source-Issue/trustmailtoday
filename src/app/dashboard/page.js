import Link from "next/link";
import { cookies } from "next/headers";
import { CheckCircle2, Inbox, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { getSession, SESSION_COOKIE } from "@/lib/session";
import { getPlan } from "@/lib/plans";
import WarmupPanel from "@/components/WarmupPanel";
import InboxCheck from "@/components/InboxCheck";
import AuthSetup from "@/components/AuthSetup";
import ManageBillingButton from "@/components/ManageBillingButton";

export const metadata = { title: "Dashboard — Trustmailtoday" };

// Session is read per-request from cookies, so render dynamically.
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore.get(SESSION_COOKIE)?.value);

  return (
    <main className="bg-dotted relative min-h-screen overflow-x-clip">
      <div className="glow glow--teal glow--top-left" aria-hidden />
      <header className="relative z-10 border-b border-[#243044] bg-[#111827]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Trustmailtoday Logo"
              height={36} 
              width={36} 
              className="h-9 w-9 rounded-xl"
            />
            <span className="text-xl font-bold text-white">Trustmailtoday</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#CBD5E1] hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-12 sm:px-8">
        {session ? (
          <ConnectedView session={session} />
        ) : (
          <NotConnectedView />
        )}
      </div>
    </main>
  );
}

function ConnectedView({ session }) {
  const scopes = session.tokens?.scope?.split(" ") ?? [];
  const plan = getPlan(session.plan || "free");
  return (
    <>
      <div className="card-ring flex items-center gap-3 rounded-2xl bg-[#111827] p-6">
        <CheckCircle2 className="h-10 w-10 shrink-0 text-[#22c55e]" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-white">Inbox connected</h1>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                plan.key === "free"
                  ? "bg-[#1E293B] text-[#CBD5E1] ring-1 ring-[#243044]"
                  : "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25"
              }`}
            >
              {plan.name} plan
            </span>
          </div>
          <p className="text-sm text-[#CBD5E1]">
            {session.email ? (
              <>
                <span className="font-medium text-[#cbd5e1]">
                  {session.email}
                </span>{" "}
                is connected via Google OAuth.
              </>
            ) : (
              "Your Google account is connected via OAuth."
            )}
            {plan.key === "free" && (
              <>
                {" "}
                <a href="/#pricing" className="font-medium text-[#22c55e] hover:underline">
                  Upgrade for unlimited warmup →
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <WarmupPanel />
      </div>

      <div className="mt-6">
        <InboxCheck locked={!plan.features?.inboxCheck} />
      </div>

      <div className="mt-6">
        <AuthSetup />
      </div>

      {(plan.key !== "free" || session.stripeCustomerId) && (
        <div className="card-ring mt-6 rounded-2xl bg-[#111827] p-6">
          <h2 className="text-lg font-bold text-white">Billing</h2>
          <p className="mt-1 text-sm text-[#CBD5E1]">
            {(() => {
              const sub = session.subscription || {};
              const when = sub.currentPeriodEnd
                ? new Date(sub.currentPeriodEnd).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null;
              if (sub.status === "trialing") {
                return when
                  ? `You're on a free trial of ${plan.name}. First charge on ${when}.`
                  : `You're on a free trial of ${plan.name}.`;
              }
              if (sub.cancelAtPeriodEnd) {
                return when
                  ? `${plan.name} is set to cancel on ${when}. You keep access until then.`
                  : `${plan.name} is set to cancel at the end of the period.`;
              }
              if (sub.status === "past_due") {
                return "Your last payment failed. Update your card to keep your plan active.";
              }
              if (plan.key !== "free") {
                return when
                  ? `${plan.name} plan — renews on ${when}.`
                  : `${plan.name} plan — billed monthly.`;
              }
              return "Manage your payment method, invoices, and subscription.";
            })()}
          </p>
          <div className="mt-4">
            <ManageBillingButton />
          </div>
        </div>
      )}

      <details className="card-ring mt-6 rounded-2xl bg-[#111827] p-6">
        <summary className="flex cursor-pointer items-center gap-2 font-semibold text-white">
          <ShieldCheck className="h-5 w-5 text-[#22c55e]" /> Granted permissions
        </summary>
        <ul className="mt-3 space-y-1 text-sm text-[#CBD5E1]">
          {scopes.length ? (
            scopes.map((s) => (
              <li key={s} className="truncate">
                {s.replace("https://www.googleapis.com/auth/", "")}
              </li>
            ))
          ) : (
            <li>No scope information available.</li>
          )}
        </ul>
      </details>

      <form action="/api/auth/logout" method="post" className="mt-8">
        <button
          type="submit"
          className="rounded-lg border border-[#243044] bg-[#111827] px-5 py-2.5 text-sm font-semibold text-[#cbd5e1] transition hover:border-[#22c55e]/40 hover:text-white"
        >
          Disconnect inbox
        </button>
      </form>
    </>
  );
}

function NotConnectedView() {
  return (
    <div className="card-ring rounded-2xl bg-[#111827] p-10 text-center">
      <Inbox className="mx-auto h-12 w-12 text-[#3a4a5a]" />
      <h1 className="mt-4 text-xl font-bold text-white">No inbox connected</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#CBD5E1]">
        Connect your inbox with Google to start warming it up. We use OAuth —
        we never see or store your password.
      </p>
      <Link
        href="/#start"
        className="mt-6 inline-block rounded-lg bg-brand-gradient px-6 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
      >
        Connect your inbox
      </Link>
    </div>
  );
}
