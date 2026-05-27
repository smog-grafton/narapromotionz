"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { PaymentSummary } from "@/types/platform";
import { getMyPayments, getPaymentStatus } from "@/services/api";
import { money } from "@/lib/utils";

export function MyPaymentsClient() {
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, loading: authLoading, isAuthenticated } = useAuth();

  async function refreshPayment(reference: string) {
    const payment = await getPaymentStatus(reference, token ?? undefined).catch(() => null);

    if (payment) {
      setPayments((items) => items.map((item) => (item.reference === reference ? payment : item)));
    }
  }

  useEffect(() => {
    async function loadPayments() {
      if (authLoading) return;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMyPayments(token);
        setPayments(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, [authLoading, token]);

  if (authLoading || loading) {
    return (
      <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">
        <Loader2 className="mb-4 animate-spin text-[#d7b46a]" />
        Loading your payment history.
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="border border-white/10 bg-[#101010] p-8">
        <h2 className="text-2xl font-black uppercase text-white">Sign in for payment history</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">Your Nara Promotionz account keeps ticket payments and confirmations in one place.</p>
        <Link href="/account?next=/dashboard/payments" className="primary-button mt-5 w-fit">
          Sign in
        </Link>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="border border-white/10 bg-[#101010] p-8">
        <h2 className="text-2xl font-black uppercase text-white">Your Nara payments</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">Ticket confirmations, online viewing passes, and fight-night purchases stay organized here for quick support and easy reference.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {payments.map((payment) => (
        <article key={payment.reference} className="grid gap-4 border border-white/10 bg-[#101010] p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">{payment.gateway}</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">{payment.event?.name ?? "Nara Promotionz payment"}</h2>
            <p className="mt-2 text-sm text-zinc-400">
              {money(payment.amount, payment.currency)} · {payment.status === "successful" ? "Confirmed" : payment.status === "processing" ? "Waiting for confirmation" : payment.status}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{payment.reference}</p>
          </div>
          <div className="flex flex-col gap-3">
            {payment.status === "successful" && payment.event?.slug ? (
              <Link href={`/events/${payment.event.slug}`} className="primary-button justify-center">
                Event details
              </Link>
            ) : (
              <button type="button" onClick={() => refreshPayment(payment.reference)} className="secondary-button justify-center">
                <CreditCard size={18} />
                Check status
              </button>
            )}
            {payment.checkout_url && payment.status !== "successful" ? (
              <a href={payment.checkout_url} className="mini-button justify-center">
                Continue payment
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
