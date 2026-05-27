import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms | Nara Promotionz",
  description: "Terms for Nara Promotionz tickets, live streams, replays, accounts, and event access.",
};

export default function TermsPage() {
  return (
    <main className="section-shell">
      <article className="mx-auto max-w-4xl border border-white/10 bg-[#101010] p-6 sm:p-8">
        <p className="section-kicker">Terms of Service</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">Official access for Nara Promotionz events and media.</h1>
        <div className="mt-6 grid gap-5 text-sm leading-7 text-zinc-400">
          <p>By using Nara Promotionz, you agree to use your account, tickets, live streams, replays, and event information responsibly and only for lawful personal access.</p>
          <p>Tickets are issued for the named event, ticket type, and access benefits shown at purchase. Online viewing, venue entry, replays, and prize draw eligibility depend on the ticket type and event rules.</p>
          <p>Do not share, restream, resell, or misuse live broadcast access. Nara Promotionz may revoke access where fraud, abuse, chargebacks, or unauthorized distribution are detected.</p>
          <p>Event times, fight cards, venues, broadcast details, and streaming availability may change as boxing operations require. Nara Promotionz will communicate important event updates through official channels.</p>
        </div>
      </article>
    </main>
  );
}
