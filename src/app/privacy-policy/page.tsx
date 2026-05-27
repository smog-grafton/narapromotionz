import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Nara Promotionz",
  description: "How Nara Promotionz handles account, ticket, payment, and viewing information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="section-shell">
      <article className="mx-auto max-w-4xl border border-white/10 bg-[#101010] p-6 sm:p-8">
        <p className="section-kicker">Privacy Policy</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">Your account and fight-night access deserve careful handling.</h1>
        <div className="mt-6 grid gap-5 text-sm leading-7 text-zinc-400">
          <p>Nara Promotionz uses account, ticket, payment, and viewing information to provide event access, confirm purchases, support fans, and improve the platform.</p>
          <p>We may collect your name, email, phone number, ticket details, payment references, event access activity, and support messages. Payment secrets are handled by approved payment providers and are not stored in your public account view.</p>
          <p>We use this information to confirm tickets, unlock eligible streams or replays, send event updates, prevent fraud, and support official prize draws where applicable.</p>
          <p>For privacy requests, corrections, or support, contact info@narapromotionz.com with your account email or order number.</p>
        </div>
      </article>
    </main>
  );
}
