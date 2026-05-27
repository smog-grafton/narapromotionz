"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Ticket } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { TicketPurchase } from "@/types/platform";
import { getMyTickets } from "@/services/api";
import { formatDate, money } from "@/lib/utils";

export function MyTicketsClient() {
  const [tickets, setTickets] = useState<TicketPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    async function loadTickets() {
      if (authLoading) return;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMyTickets(token);
        setTickets(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, [authLoading, token]);

  if (authLoading || loading) {
    return (
      <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">
        <Loader2 className="mb-4 animate-spin text-[#d7b46a]" />
        Loading your fight-night tickets.
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="border border-white/10 bg-[#101010] p-8">
        <h2 className="text-2xl font-black uppercase text-white">Sign in for your tickets</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">Your confirmed fight-night passes stay ready inside your Nara Promotionz account.</p>
        <Link href="/account?next=/dashboard/tickets" className="primary-button mt-5 w-fit">
          Sign in
        </Link>
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="grid gap-5">
        <div className="border border-white/10 bg-[#101010] p-8">
          <h2 className="text-2xl font-black uppercase text-white">Your fight-night passes</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">Once you secure a Nara Promotionz ticket, it appears here with event details, watch access, and confirmation status.</p>
        </div>
        <Link href="/tickets" className="primary-button w-fit">
          Buy tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <article key={ticket.id} className="grid gap-4 border border-white/10 bg-[#101010] p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">{ticket.event?.event_date ? formatDate(ticket.event.event_date) : "Fight night"}</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">{ticket.event?.name ?? ticket.ticket?.name ?? "Nara Promotionz ticket"}</h2>
            <p className="mt-2 text-sm text-zinc-400">
              {ticket.ticket?.name ?? "Official pass"} · {money(ticket.grand_total, ticket.currency)} · {ticket.payment_status === "completed" ? "Confirmed" : "Awaiting confirmation"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em]">
              <span className="tag">{ticket.access_status === "unlocked" ? "Access unlocked" : "Access locked"}</span>
              {ticket.allows_live_stream ? <span className="tag">Live stream</span> : null}
              {ticket.allows_replay ? <span className="tag">Replay</span> : null}
              {ticket.allows_venue_entry ? <span className="tag">Venue entry</span> : null}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={ticket.event?.slug ? `/events/${ticket.event.slug}` : "/events"} className="secondary-button justify-center">
              Event details
            </Link>
            {ticket.allows_live_stream && ticket.event?.slug ? (
              <Link href={`/watch?event=${ticket.event.slug}`} className="primary-button justify-center">
                Watch
              </Link>
            ) : null}
          </div>
          <Ticket className="hidden text-[#e1252b]/40 md:block" size={32} />
        </article>
      ))}
    </div>
  );
}
