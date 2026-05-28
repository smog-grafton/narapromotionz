"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Loader2, ShieldCheck, Smartphone, Ticket as TicketIcon } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Event, PaymentGateway } from "@/types/platform";
import { checkoutTicket, getPaymentGateways, getPaymentStatus } from "@/services/api";
import { money } from "@/lib/utils";

type Gateway = "flutterwave" | "iotec";

export function CheckoutClient({ event }: { event: Event }) {
  const tickets = useMemo(() => (event.tickets ?? []).filter((ticket) => ticket.is_available), [event.tickets]);
  const search = useSearchParams();
  const router = useRouter();
  const initialTicket = Number(search.get("ticket")) || tickets[0]?.id;
  const initialCoupon = search.get("coupon") ?? search.get("ref") ?? "";
  const [ticketId, setTicketId] = useState<number | undefined>(initialTicket);
  const [gateway, setGateway] = useState<Gateway>("iotec");
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token, loading: authLoading } = useAuth();

  const selectedTicket = useMemo(() => tickets.find((ticket) => ticket.id === ticketId) ?? tickets[0], [ticketId, tickets]);
  const selectedGateway = gateways.find((item) => item.code === gateway) ?? gateways[0];

  useEffect(() => {
    let cancelled = false;

    getPaymentGateways()
      .then((items) => {
        if (cancelled) return;
        setGateways(items);
        const defaultGateway = items.find((item) => item.is_default) ?? items[0] ?? null;
        if (defaultGateway?.code === "iotec" || defaultGateway?.code === "flutterwave") {
          setGateway(defaultGateway.code);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Payment gateways could not be loaded.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function pollPayment(reference: string, token: string) {
    setMessage("We are waiting for confirmation from your mobile money provider.");

    for (let attempt = 0; attempt < 24; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const payment = await getPaymentStatus(reference, token).catch(() => null);

      if (payment?.status === "successful") {
        router.push(`/payments/success?reference=${encodeURIComponent(reference)}`);
        return;
      }

      if (payment && ["failed", "cancelled", "expired"].includes(payment.status)) {
        router.push(`/payments/failed?reference=${encodeURIComponent(reference)}`);
        return;
      }
    }

    setMessage("Your payment is still being confirmed. You can return to your dashboard at any time to check the ticket.");
  }

  async function onSubmit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (authLoading) {
      setBusy(false);
      return;
    }

    if (!token) {
      const nextParams = new URLSearchParams();
      if (selectedTicket?.id) nextParams.set("ticket", String(selectedTicket.id));
      if (couponCode.trim()) nextParams.set("coupon", couponCode.trim());
      router.push(`/account?next=${encodeURIComponent(`/checkout/${event.slug}${nextParams.size ? `?${nextParams}` : ""}`)}`);
      return;
    }

    if (!selectedTicket) {
      setError("Tickets for this fight night are not open right now.");
      setBusy(false);
      return;
    }

    try {
      const checkout = await checkoutTicket(
        event.slug,
        {
          event_ticket_id: selectedTicket.id,
          quantity: 1,
          gateway,
          phone: phone || undefined,
          coupon_code: couponCode.trim() || undefined,
          holder: { phone: phone || undefined },
        },
        token,
      );

      localStorage.setItem("nara_latest_payment_reference", checkout.transaction_reference);

      if (checkout.checkout_url) {
        window.location.href = checkout.checkout_url;
        return;
      }

      const shouldPoll =
        checkout.requires_polling === true ||
        checkout.gateway === "iotec" ||
        ["processing", "pending"].includes(String(checkout.status).toLowerCase());

      if (String(checkout.status).toLowerCase() === "successful") {
        router.push(`/payments/success?reference=${encodeURIComponent(checkout.transaction_reference)}`);
        return;
      }

      if (["failed", "cancelled", "expired"].includes(String(checkout.status).toLowerCase())) {
        router.push(`/payments/failed?reference=${encodeURIComponent(checkout.transaction_reference)}`);
        return;
      }

      if (shouldPoll) {
        await pollPayment(checkout.transaction_reference, token);
        return;
      }

      router.push(`/payments/success?reference=${encodeURIComponent(checkout.transaction_reference)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not start right now. Please try again or contact Nara Promotionz support.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
      <form onSubmit={onSubmit} className="grid gap-5 border border-white/10 bg-[#101010] p-5 sm:p-7">
        <div>
          <p className="section-kicker">Fight-Night Checkout</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none text-white">Secure your pass for {event.name}</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Choose your ticket, confirm your payment method, and get ready for the next Nara Promotionz bell.
          </p>
        </div>

        <div className="grid gap-3">
          {event.tickets?.length ? (
            (event.tickets ?? []).map((ticket) => (
              <label
                key={ticket.id}
                className={`border p-4 transition ${ticket.is_available ? "cursor-pointer" : "cursor-not-allowed opacity-60"} ${selectedTicket?.id === ticket.id ? "border-[#e1252b] bg-[#1a0708]" : "border-white/10 bg-black hover:border-white/30"}`}
              >
                <input className="sr-only" type="radio" name="ticket" disabled={!ticket.is_available} checked={selectedTicket?.id === ticket.id} onChange={() => setTicketId(ticket.id)} />
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <strong className="block text-lg font-black uppercase text-white">{ticket.name}</strong>
                    <span className="mt-1 block text-sm text-zinc-400">
                      {ticket.access_label ?? (ticket.grants_live_access ? "Live broadcast access" : "Arena access")}
                      {ticket.grants_replay_access ? " and official replay" : ""}
                    </span>
                  </span>
                  <span className="text-right text-lg font-black text-[#d7b46a]">{ticket.formatted_price ?? money(ticket.price, ticket.currency)}</span>
                </span>
                {!ticket.is_available ? <span className="mt-3 block text-xs font-black uppercase tracking-[0.12em] text-zinc-500">Sales closed or sold out</span> : null}
              </label>
            ))
          ) : (
            <div className="border border-white/10 bg-black p-5 text-sm text-zinc-400">Online ticket sales for this fight night are not open yet.</div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {gateways.map((item) => {
            const Icon = item.supports_card ? CreditCard : Smartphone;
            const checked = gateway === item.code;
            const supported = item.code === "iotec" || item.code === "flutterwave";

            return (
              <button
                key={item.code}
                type="button"
                disabled={!supported}
                onClick={() => supported && setGateway(item.code as Gateway)}
                className={`relative min-h-[150px] border p-4 text-left transition ${checked ? "border-[#e1252b] bg-[#1a0708]" : "border-white/10 bg-black hover:border-white/30"} ${supported ? "" : "cursor-not-allowed opacity-50"}`}
              >
                {item.public_label ? (
                  <span className="absolute right-3 top-3 border border-[#d7b46a]/50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#d7b46a]">
                    {item.public_label}
                  </span>
                ) : null}
                <span className="flex h-10 w-10 items-center justify-center border border-white/10 bg-[#080808]">
                  {item.logo_url ? (
                    <SafeImage src={item.logo_url} fallbackSrc="/assets/images/logo-2.png" alt={item.display_name} width={26} height={26} className="h-7 w-7 object-contain" />
                  ) : (
                    <Icon className="text-[#d7b46a]" size={22} />
                  )}
                </span>
                <strong className="mt-4 block uppercase text-white">{item.display_name}</strong>
                <span className="mt-1 block line-clamp-2 text-sm leading-6 text-zinc-400">{item.description}</span>
              </button>
            );
          })}
        </div>
        {!gateways.length ? <div className="border border-white/10 bg-black p-5 text-sm text-zinc-400">No active payment gateways are currently available.</div> : null}

        {gateway === "iotec" ? (
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Mobile money number
            <input value={phone} onChange={(event) => setPhone(event.target.value)} required className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]" placeholder="07XX XXX XXX" />
          </label>
        ) : null}

        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          Fighter or fan code
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
            className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]"
            placeholder="Enter code"
          />
          <span className="text-xs font-normal leading-5 text-zinc-500">Have a fighter code? Add it here before you secure your pass.</span>
        </label>

        {message ? <div className="border border-[#d7b46a]/50 bg-[#d7b46a]/10 p-3 text-sm font-bold text-[#d7b46a]">{message}</div> : null}
        {error ? <div className="border border-[#e1252b]/50 bg-[#e1252b]/10 p-3 text-sm font-bold text-white">{error}</div> : null}

        <button type="submit" className="primary-button w-full justify-center" disabled={busy || !tickets.length || !selectedGateway}>
          {busy ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
          {busy ? "Confirming..." : "Secure my fight-night pass"}
        </button>
      </form>

      <aside className="grid content-start gap-5">
        <div className="info-panel">
          <TicketIcon className="text-[#e1252b]" />
          <h3>Your selected pass</h3>
          <p>{selectedTicket ? `${selectedTicket.name} · ${money(selectedTicket.price, selectedTicket.currency)}` : "Choose an available ticket to continue."}</p>
          {couponCode.trim() ? <p className="mt-2 text-[#d7b46a]">Code ready: {couponCode.trim().toUpperCase()}</p> : null}
        </div>
        <div className="info-panel">
          <ShieldCheck className="text-[#d7b46a]" />
          <h3>Ready for fight night</h3>
          <p>{selectedGateway?.instructions ?? "Your confirmed ticket stays in your Nara Promotionz account with event details, payment status, and watch access."}</p>
          <Link href="/dashboard/tickets" className="mini-button w-fit">
            View my tickets
          </Link>
        </div>
      </aside>
    </div>
  );
}
