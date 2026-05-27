"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2, Smartphone, Ticket, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SafeImage } from "@/components/ui/SafeImage";
import { checkoutSubscription, checkoutTicket, getPaymentGateways, getPaymentStatus, getSubscriptionPlans } from "@/services/api";
import { money } from "@/lib/utils";
import type { PaymentGateway, SubscriptionPlan, Ticket as TicketType, WatchAccess } from "@/types/platform";

type Props = {
  eventSlug: string;
  access: WatchAccess;
  open: boolean;
  onClose: () => void;
};

type Gateway = "iotec" | "flutterwave";
type Product = { kind: "ticket"; ticket: TicketType } | { kind: "subscription"; plan: SubscriptionPlan };

const fallbackGateways: PaymentGateway[] = [
  {
    id: 1,
    code: "iotec",
    name: "ioTec",
    display_name: "Mobile Money",
    description: "Pay quickly with mobile money and unlock your fight-night pass.",
    status: "active",
    is_default: true,
    supports_mobile_money: true,
    supports_card: false,
    supports_redirect_checkout: false,
    supported_currencies: ["UGX"],
    public_label: "Recommended",
    button_label: "Pay with Mobile Money",
  },
  {
    id: 2,
    code: "flutterwave",
    name: "Flutterwave",
    display_name: "Card & Mobile Money",
    description: "Pay securely with Flutterwave.",
    status: "active",
    is_default: false,
    supports_mobile_money: true,
    supports_card: true,
    supports_redirect_checkout: true,
    supported_currencies: ["UGX", "USD"],
  },
];

export function InstantPayModal({ eventSlug, access, open, onClose }: Props) {
  const { token, loading } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [gateways, setGateways] = useState<PaymentGateway[]>(fallbackGateways);
  const [gateway, setGateway] = useState<Gateway>("iotec");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    Promise.all([
      getSubscriptionPlans().catch(() => []),
      getPaymentGateways().catch(() => fallbackGateways),
    ]).then(([planItems, gatewayItems]) => {
      if (cancelled) return;
      setPlans(planItems);
      setGateways(gatewayItems.length ? gatewayItems : fallbackGateways);
      const firstGateway = (gatewayItems.length ? gatewayItems : fallbackGateways).find((item) => item.is_default) ?? (gatewayItems.length ? gatewayItems : fallbackGateways)[0];
      if (firstGateway?.code === "iotec" || firstGateway?.code === "flutterwave") {
        setGateway(firstGateway.code);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const products = useMemo<Product[]>(() => {
    const ticketProducts = (access.ticket_options ?? [])
      .filter((ticket) => ticket.is_available !== false)
      .map((ticket) => ({ kind: "ticket" as const, ticket }));
    const planProducts = plans.map((plan) => ({ kind: "subscription" as const, plan }));

    return [...ticketProducts, ...planProducts];
  }, [access.ticket_options, plans]);

  const fallbackSelectedKey = products[0]
    ? products[0].kind === "ticket"
      ? `ticket:${products[0].ticket.id}`
      : `subscription:${products[0].plan.id}`
    : "";
  const activeSelectedKey = selectedKey || fallbackSelectedKey;
  const selectedProduct = products.find((product) =>
    product.kind === "ticket" ? activeSelectedKey === `ticket:${product.ticket.id}` : activeSelectedKey === `subscription:${product.plan.id}`,
  ) ?? products[0];

  async function poll(reference: string) {
    setMessage("We are checking your payment. Keep this page open.");

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

    setMessage("Your payment is still being confirmed. Your dashboard will update as soon as the provider confirms it.");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (loading || !selectedProduct) return;

    if (!token) {
      window.location.href = `/account?next=${encodeURIComponent(`/watch?event=${eventSlug}`)}`;
      return;
    }

    setBusy(true);

    try {
      const checkout = selectedProduct.kind === "ticket"
        ? await checkoutTicket(
            eventSlug,
            {
              event_ticket_id: selectedProduct.ticket.id,
              quantity: 1,
              gateway,
              phone: phone || undefined,
              coupon_code: couponCode.trim() || undefined,
              holder: { phone: phone || undefined },
            },
            token,
          )
        : await checkoutSubscription(
            {
              subscription_plan_id: selectedProduct.plan.id,
              gateway,
              phone: phone || undefined,
            },
            token,
          );

      localStorage.setItem("nara_latest_payment_reference", checkout.transaction_reference);

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
      setError(caught instanceof Error ? caught.message : "We could not start payment right now. Please try again or contact support.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl border border-white/10 bg-[#101010] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="section-kicker">Unlock the stream</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">Choose your access.</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Secure an event pass or subscription and return straight to the live room.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center border border-white/10 text-white hover:border-[#e1252b]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map((product) => {
              const key = product.kind === "ticket" ? `ticket:${product.ticket.id}` : `subscription:${product.plan.id}`;
              const title = product.kind === "ticket" ? product.ticket.name : product.plan.name;
              const price = product.kind === "ticket"
                ? product.ticket.formatted_price ?? money(product.ticket.price, product.ticket.currency)
                : product.plan.formatted_price ?? money(product.plan.price, product.plan.currency);
              const checked = key === activeSelectedKey;

              return (
                <label key={key} className={`cursor-pointer border p-4 ${checked ? "border-[#e1252b] bg-[#1a0708]" : "border-white/10 bg-black"}`}>
                  <input className="sr-only" type="radio" name="product" checked={checked} onChange={() => setSelectedKey(key)} />
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <strong className="block font-black uppercase text-white">{title}</strong>
                      <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-zinc-500">{product.kind === "ticket" ? "Event pass" : `${product.plan.duration_days} day access`}</span>
                    </span>
                    <span className="font-black text-[#d7b46a]">{price}</span>
                  </span>
                  {product.kind === "subscription" && product.plan.features?.length ? (
                    <span className="clamp-2 mt-3 block text-xs leading-5 text-zinc-400">{product.plan.features[0]}</span>
                  ) : null}
                </label>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {gateways.map((item) => {
              const supported = item.code === "iotec" || item.code === "flutterwave";
              const Icon = item.supports_card ? CreditCard : Smartphone;

              return (
                <button
                  key={item.code}
                  type="button"
                  disabled={!supported}
                  onClick={() => supported && setGateway(item.code as Gateway)}
                  className={`relative min-h-28 border p-4 text-left ${gateway === item.code ? "border-[#e1252b] bg-[#1a0708]" : "border-white/10 bg-black"} ${supported ? "" : "opacity-50"}`}
                >
                  {item.public_label ? <span className="absolute right-3 top-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#d7b46a]">{item.public_label}</span> : null}
                  <span className="flex h-9 w-9 items-center justify-center border border-white/10">
                    {item.logo_url ? <SafeImage src={item.logo_url} fallbackSrc="/assets/images/logo-2.png" alt={item.display_name} width={24} height={24} className="h-6 w-6 object-contain" /> : <Icon size={20} />}
                  </span>
                  <strong className="mt-3 block uppercase text-white">{item.display_name}</strong>
                  <span className="line-clamp-2 text-xs leading-5 text-zinc-400">{item.description}</span>
                </button>
              );
            })}
          </div>

          {gateway === "iotec" ? (
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Mobile money number
              <input value={phone} onChange={(event) => setPhone(event.target.value)} required className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]" placeholder="07XX XXX XXX" />
            </label>
          ) : null}

          {selectedProduct?.kind === "ticket" ? (
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Fighter or fan code
              <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]" placeholder="Enter code" />
            </label>
          ) : null}

          {message ? <div className="border border-[#d7b46a]/50 bg-[#d7b46a]/10 p-3 text-sm font-bold text-[#d7b46a]">{message}</div> : null}
          {error ? <div className="border border-[#e1252b]/50 bg-[#e1252b]/10 p-3 text-sm font-bold text-white">{error}</div> : null}

          {token ? (
            <button className="primary-button w-full justify-center" disabled={busy || !selectedProduct}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : <Ticket size={18} />}
              {busy ? "Confirming..." : "Unlock access"}
            </button>
          ) : (
            <Link href={`/account?next=${encodeURIComponent(`/watch?event=${eventSlug}`)}`} className="primary-button justify-center">
              Sign in to continue
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
