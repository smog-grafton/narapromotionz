import Link from "next/link";
import { CreditCard, Dumbbell, Gift, LifeBuoy, Repeat, Ticket, User, Video } from "lucide-react";

const sections = [
  { href: "/dashboard/tickets", label: "My Tickets", icon: Ticket },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/subscriptions", label: "Fight Passes", icon: Repeat },
  { href: "/dashboard/prize-entries", label: "Prize Entries", icon: Gift },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/fighter-application", label: "Fighter Pathway", icon: Dumbbell },
];

export function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main>
      <section className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="section-kicker">Account</p>
          <h1 className="section-title-tight">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            Your Nara Promotionz corner for tickets, live streams, replays, payment history, prize entries, and event support.
          </p>
        </div>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="grid content-start gap-3">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
            {sections.map((section) => (
              <Link key={section.href} href={section.href} className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-white/10 bg-[#101010] px-4 text-xs font-black uppercase tracking-[0.12em] text-white">
                <section.icon size={15} className="text-[#d7b46a]" />
                {section.label}
              </Link>
            ))}
          </div>
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="hidden items-center gap-3 border border-white/10 bg-[#101010] p-4 text-sm font-black uppercase text-white hover:border-[#e1252b] lg:flex">
              <section.icon size={18} className="text-[#d7b46a]" />
              {section.label}
            </Link>
          ))}
          <div className="info-panel">
            <LifeBuoy className="text-[#e1252b]" />
            <h3>Support</h3>
            <p>Need payment or access help? Contact support with your order number and event name.</p>
          </div>
          <div className="info-panel">
            <Video className="text-[#d7b46a]" />
            <h3>Watch Access</h3>
            <p>Secure an online fight-night pass and your live or replay access stays ready from this account.</p>
          </div>
        </aside>
        <div>{children}</div>
      </section>
    </main>
  );
}
