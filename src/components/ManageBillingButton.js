"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

/**
 * Opens the Stripe Customer Portal for the connected user (update card, change
 * or cancel plan, download invoices). All of that UI lives on Stripe's side,
 * so this is just a redirect trigger.
 */
export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openPortal = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/payment/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return; // navigating away
      }
      setError(
        data.error === "no_customer"
          ? "No billing account yet — subscribe to a paid plan first."
          : "Couldn't open billing. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={openPortal}
        disabled={loading}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#243044] bg-[#111827] px-5 py-2.5 text-sm font-semibold text-[#cbd5e1] transition hover:border-[#22c55e]/40 hover:text-white disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e]"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        Manage billing
      </button>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
