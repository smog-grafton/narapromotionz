import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getEvent } from "@/services/api";

type Props = {
  params: Promise<{ eventSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = await getEvent(eventSlug);

  return {
    title: `Checkout | ${event.name} | Nara Promotionz`,
    description: `Secure your Nara Promotionz ticket for ${event.name}.`,
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { eventSlug } = await params;
  const event = await getEvent(eventSlug);

  return (
    <main className="section-shell">
      <Suspense fallback={<div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">Preparing your fight-night checkout.</div>}>
        <CheckoutClient event={event} />
      </Suspense>
    </main>
  );
}
