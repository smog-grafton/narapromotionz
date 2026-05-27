"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { checkoutSubscription, getPaymentStatus } from "@/services/api";
import type { SubscriptionPlan } from "@/types/platform";

type Props = {
  plan: SubscriptionPlan;
};

export function SubscriptionCheckoutClient({ plan }: Props) {
  const { token, loading } = useAuth();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function poll(reference: string) {
    setMessage("We are waiting for confirmation from your mobile money provider.");

    for (let attempt = 0; attempt < 24; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const payment = await getPaymentStatus(reference, token ?? undefined).catch(() => null);

      if (payment?.status === "successful") {
        window.location.href = `/payments/success?reference=${encodeURIComponent(reference)}`;
        return;
      }

      if (payment && ["failed", "cancelled", "expired"].includes(payment.status)) {
        window.location.href = `/payments/failed?reference=${encodeURIComponent(reference)}`;
        return;
      }
    }
  }

  async function startCheckout() {
    if (!token || loading) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const checkout = await checkoutSubscription(
        {
          subscription_plan_id: plan.id,
          gateway: "iotec",
          phone: phone || undefined,
        },
        token,
      );

      if (checkout.checkout_url) {
        window.location.href = checkout.checkout_url;
        return;
      }

      if (checkout.requires_polling) {
        await poll(checkout.transaction_reference);
        return;
      }

      window.location.href = `/payments/success?reference=${encodeURIComponent(checkout.transaction_reference)}`;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not start this pass right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <Link href={`/account?next=${encodeURIComponent("/subscriptions")}`} className="primary-button mt-5 w-full justify-center">
        Sign in to choose this pass
      </Link>
    );
  }

  return (
    <div className="mt-5 grid gap-3">
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        className="min-h-12 border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-[#e1252b]"
        placeholder="Mobile money number"
      />
      {message ? <div className="border border-[#d7b46a]/50 bg-[#d7b46a]/10 p-3 text-xs font-bold text-[#d7b46a]">{message}</div> : null}
      {error ? <div className="border border-[#e1252b]/50 bg-[#e1252b]/10 p-3 text-xs font-bold text-white">{error}</div> : null}
      <button type="button" onClick={startCheckout} disabled={busy || !phone.trim()} className="primary-button w-full justify-center">
        {busy ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
        {busy ? "Confirming..." : "Pay with Mobile Money"}
      </button>
    </div>
  );
}
