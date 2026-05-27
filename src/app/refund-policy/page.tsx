import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Nara Promotionz",
  description: "Refund and payment support information for Nara Promotionz tickets and online viewing passes.",
};

export default function RefundPolicyPage() {
  return (
    <main className="section-shell">
      <article className="mx-auto max-w-4xl border border-white/10 bg-[#101010] p-6 sm:p-8">
        <p className="section-kicker">Refund Policy</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">Clear support for ticket and payment issues.</h1>
        <div className="mt-6 grid gap-5 text-sm leading-7 text-zinc-400">
          <p>Confirmed tickets are tied to the event and access benefits purchased. Refund handling depends on event status, ticket type, payment confirmation, and official Nara Promotionz event rules.</p>
          <p>If a payment was charged but your ticket did not appear, contact support with your order number, payment reference, account email, and phone number.</p>
          <p>Duplicate payments, failed payment reversals, event cancellation cases, and confirmed support issues are reviewed by the Nara Promotionz team.</p>
          <p>For help, email info@narapromotionz.com or use the contact details on the support page.</p>
        </div>
      </article>
    </main>
  );
}
