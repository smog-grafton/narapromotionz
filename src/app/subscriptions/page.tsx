import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { SubscriptionCheckoutClient } from "@/components/subscriptions/SubscriptionCheckoutClient";
import { getSubscriptionPlans } from "@/services/api";

export const metadata: Metadata = {
  title: "Fight Passes | Nara Promotionz",
  description: "Choose a daily, weekly, or monthly Nara Promotionz fight pass for live streams, replays, and premium boxing video.",
};

export default async function SubscriptionsPage() {
  const plans = await getSubscriptionPlans().catch(() => []);

  return (
    <main>
      <section className="border-b border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <p className="section-kicker">Nara Fight Pass</p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl">Follow more than one fight night.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Choose a pass for live broadcasts, premium replays, interviews, and fight-night video where subscriptions are accepted.
          </p>
        </div>
      </section>

      <section className="section-shell">
        {plans.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.id} className="border border-white/10 bg-[#101010] p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">{plan.duration_days} day access</p>
                <h2 className="mt-3 text-3xl font-black uppercase text-white">{plan.name}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{plan.description}</p>
                <p className="mt-5 text-4xl font-black text-white">{plan.formatted_price}</p>
                {plan.features?.length ? (
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-zinc-300">
                    {plan.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-[#e1252b]" size={17} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <SubscriptionCheckoutClient plan={plan} />
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">
            Fight passes open around premium Nara Promotionz coverage windows.
          </div>
        )}
      </section>
    </main>
  );
}
