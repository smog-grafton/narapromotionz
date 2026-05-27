"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { verifyFlutterwaveCallback } from "@/services/api";

function FlutterwaveCallbackContent() {
  const search = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<"checking" | "success" | "failed">("checking");
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    async function confirmPayment() {
      if (authLoading) return;

      const txRef = search.get("tx_ref") || search.get("reference") || localStorage.getItem("nara_latest_payment_reference") || undefined;
      const transactionId = search.get("transaction_id") || undefined;
      const status = search.get("status") || undefined;

      if (!txRef || (status && ["cancelled", "canceled", "failed"].includes(status))) {
        setState("failed");
        return;
      }

      try {
        const payment = await verifyFlutterwaveCallback({ tx_ref: txRef, transaction_id: transactionId, status }, token ?? undefined);

        if (payment.status === "successful") {
          setState("success");
          setTimeout(() => router.replace(`/payments/success?reference=${encodeURIComponent(payment.reference)}`), 900);
        } else if (["failed", "cancelled", "expired"].includes(payment.status)) {
          setState("failed");
        } else {
          setTimeout(() => router.replace(`/dashboard/payments`), 1400);
        }
      } catch {
        setState("failed");
      }
    }

    confirmPayment();
  }, [authLoading, router, search, token]);

  return (
    <main className="section-shell">
      <div className="mx-auto max-w-xl border border-white/10 bg-[#101010] p-8 text-center">
        {state === "checking" ? <Loader2 className="mx-auto animate-spin text-[#d7b46a]" size={36} /> : null}
        {state === "success" ? <CheckCircle2 className="mx-auto text-[#d7b46a]" size={36} /> : null}
        {state === "failed" ? <XCircle className="mx-auto text-[#e1252b]" size={36} /> : null}
        <h1 className="mt-5 text-3xl font-black uppercase text-white">
          {state === "failed" ? "Payment needs attention" : "Confirming your ticket"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          {state === "failed"
            ? "We could not confirm this payment yet. Please try again or contact Nara Promotionz support with your order details."
            : "Your payment is being confirmed. This usually takes a few moments before your ticket opens."}
        </p>
        {state === "failed" ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/tickets" className="primary-button justify-center">
              Try another ticket
            </Link>
            <Link href="/dashboard/payments" className="secondary-button justify-center">
              View payments
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default function FlutterwaveCallbackPage() {
  return (
    <Suspense fallback={<main className="section-shell"><div className="mx-auto max-w-xl border border-white/10 bg-[#101010] p-8 text-center text-sm text-zinc-400">Confirming your ticket.</div></main>}>
      <FlutterwaveCallbackContent />
    </Suspense>
  );
}
