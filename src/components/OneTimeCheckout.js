"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { startOneTimeCheckout } from "@/lib/checkout-onetime";

/**
 * Example component for one-time payment checkout.
 * Demonstrates how to use the startOneTimeCheckout function.
 *
 * Usage:
 *   <OneTimeCheckout
 *     amount={10000}
 *     label="Pay ₹100"
 *     onSuccess={(result) => console.log("Payment successful:", result)}
 *   />
 */
export default function OneTimeCheckout({
  amount = 10000, // Default: ₹100 (in paise)
  label = "Pay Now",
  description = "One-time payment",
  customerEmail = "",
  customerName = "",
  onSuccess,
  onError,
  onCancel,
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setStatus(null);
    setMessage("");
    setLoading(true);

    try {
      const result = await startOneTimeCheckout({
        amount,
        currency: "INR",
        description,
        customerEmail,
        customerName,
      });

      if (result.status === "success") {
        setStatus("success");
        setMessage(`Payment successful! Payment ID: ${result.paymentId}`);
        onSuccess?.(result);
      } else if (result.status === "needs_connect") {
        setStatus("info");
        setMessage("Connect your inbox first, then pay.");
        setTimeout(() => (window.location.href = "/#start"), 1200);
      } else if (result.status === "cancelled") {
        setStatus("cancelled");
        setMessage("Payment cancelled.");
        onCancel?.();
      } else if (result.status === "error") {
        setStatus("error");
        setMessage(result.message || "Payment failed.");
        onError?.(result);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 rounded-lg bg-brand-gradient py-2.5 px-4 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22c55e] ${className}`}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </button>

      {message && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            status === "success"
              ? "bg-[#22c55e]/10 text-[#22c55e] ring-1 ring-[#22c55e]/25"
              : status === "error"
              ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/25"
              : "bg-[#0A64BC]/20 text-[#93C5FD] ring-1 ring-[#0A64BC]/40"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
