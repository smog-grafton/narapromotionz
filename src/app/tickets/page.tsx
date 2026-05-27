import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CreditCard, MapPin, Play, ShieldCheck, Ticket, Tv } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, money } from "@/lib/utils";
import { getEvents } from "@/services/api";
import type { Boxer, Event, Fight, Ticket as TicketType } from "@/types/platform";

export const metadata: Metadata = {
  title: "Tickets | Nara Promotionz",
  description: "Buy Nara Promotionz venue tickets and online PPV tickets for live boxing events and replay access.",
};

function ticketStatus(ticket: TicketType) {
  if (ticket.status === "sold_out" || (ticket.remaining_quantity ?? 1) <= 0) return "Sold out";
  if (ticket.sales_started === false) return "Opens soon";
  if (ticket.sales_ended) return "Sales closed";
  if (!ticket.is_available) return "Unavailable";
  return "Available";
}

function record(boxer?: Boxer | null) {
  return boxer?.record?.display ?? [boxer?.record_wins ?? 0, boxer?.record_losses ?? 0, boxer?.record_draws ?? 0].join("-");
}

function FighterMini({ boxer, corner, fallback }: { boxer?: Boxer | null; corner: string; fallback: string }) {
  return (
    <Link href={boxer?.slug ? `/boxers/${boxer.slug}` : "/boxers"} className="group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#171717] sm:aspect-[4/4.5]">
        <SafeImage
          src={boxer?.image_url}
          fallbackSrc={fallback}
          alt={boxer?.name ?? `${corner} fighter`}
          fill
          sizes="(min-width: 1024px) 210px, 42vw"
          className="object-cover object-top transition duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#d7b46a]">{corner}</p>
      <h4 className="clamp-2 mt-1 text-sm font-black uppercase leading-tight text-white sm:text-lg">{boxer?.name ?? "Fighter TBA"}</h4>
      <p className="mt-1 text-xs text-zinc-400">{record(boxer)} · {boxer?.weight_class ?? boxer?.nationality ?? "Professional boxing"}</p>
    </Link>
  );
}

function MainMatchup({ event }: { event: Event }) {
  const red = event.main_event?.red_corner;
  const blue = event.main_event?.blue_corner;
  const hasMatchup = Boolean(red || blue);

  if (!hasMatchup) {
    return (
      <div className="border border-white/10 bg-black p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">Main event</p>
        <h4 className="mt-2 text-xl font-black uppercase text-white">{event.main_event?.title ?? "Main event announcement coming soon"}</h4>
        <p className="mt-2 text-sm text-zinc-400">{event.main_event?.weight_class ?? "Full fight card will be confirmed by Nara Promotionz."}</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-black p-3 sm:p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_58px_minmax(0,1fr)] sm:items-center">
        <FighterMini boxer={red} corner="Red corner" fallback="/assets/images/profiles/fighter1.jpg" />
        <div className="grid h-full place-items-center border-x border-white/10">
          <span className="grid h-10 w-10 place-items-center border border-[#e1252b] bg-[#080808] text-sm font-black uppercase text-white shadow-[0_0_24px_rgba(225,37,43,.28)] sm:h-12 sm:w-12">
            VS
          </span>
        </div>
        <FighterMini boxer={blue} corner="Blue corner" fallback="/assets/images/profiles/fighter2.jpg" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.1em]">
        <span className="tag">{event.main_event?.weight_class ?? "Main event"}</span>
        {event.main_event?.rounds ? <span className="tag">{event.main_event.rounds} rounds</span> : null}
        {event.main_event?.belt_title ? <span className="tag">{event.main_event.belt_title}</span> : null}
      </div>
    </div>
  );
}

function BoutRow({ fight }: { fight: Fight }) {
  const red = fight.red_corner?.name ?? "Red corner TBA";
  const blue = fight.blue_corner?.name ?? "Blue corner TBA";

  return (
    <li className="grid gap-2 border-t border-white/10 py-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <span className="clamp-1 font-black uppercase text-white">{red}</span>
      <span className="w-fit border border-[#e1252b]/60 px-2 py-1 text-xs font-black uppercase text-white">vs</span>
      <span className="clamp-1 font-black uppercase text-white sm:text-right">{blue}</span>
      <span className="text-xs uppercase tracking-[0.12em] text-zinc-500 sm:col-span-3">
        {[fight.weight_class, fight.rounds ? `${fight.rounds} rounds` : null, fight.status].filter(Boolean).join(" · ")}
      </span>
    </li>
  );
}

function TicketCard({ event, ticket }: { event: Event; ticket: TicketType }) {
  const status = ticketStatus(ticket);
  const currency = ticket.currency || event.ticketing?.currency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "UGX";

  return (
    <div className={`grid border bg-black p-4 ${ticket.is_available ? "border-white/10" : "border-white/5 opacity-75"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="clamp-2 font-black uppercase text-white">{ticket.name}</h4>
          <p className="mt-1 text-xs uppercase text-zinc-500 tracking-[0.12em]">{ticket.access_label ?? ticket.access_type ?? "Fight-night access"}</p>
        </div>
        <strong className="shrink-0 text-right text-[#d7b46a]">{ticket.formatted_price ?? money(ticket.price, currency)}</strong>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.1em]">
        <span className="tag">{status}</span>
        {ticket.grants_live_access ? <span className="tag">Live stream</span> : null}
        {ticket.grants_replay_access ? <span className="tag">Replay</span> : null}
        {ticket.allows_venue_entry ? <span className="tag">Venue</span> : null}
      </div>
      {ticket.features?.length ? (
        <ul className="mt-3 grid gap-1 text-xs leading-5 text-zinc-400">
          {ticket.features.slice(0, 3).map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      ) : null}
      {ticket.is_available ? (
        <Link href={`/checkout/${event.slug}?ticket=${ticket.id}`} className="mini-button mt-4">
          <CreditCard size={15} />
          Secure pass
        </Link>
      ) : null}
    </div>
  );
}

function EventTicketBlock({ event }: { event: Event }) {
  const isLive = event.status === "live" || event.streaming?.status === "live";

  return (
    <article className="grid overflow-hidden border border-white/10 bg-[#101010] lg:grid-cols-[360px_1fr]">
      <div className="relative min-h-64 bg-[#171717] lg:min-h-full">
        <SafeImage
          src={event.images?.poster ?? event.images?.banner}
          fallbackSrc="/assets/images/events/event1.webp"
          alt={event.name}
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          className="object-cover"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {isLive ? <span className="bg-[#e1252b] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">Live now</span> : null}
          <span className="bg-black/80 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">{formatDate(event.event_date)}</span>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:p-6">
        <div>
          <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.12em] text-zinc-400">
            <span className="inline-flex items-center gap-2"><CalendarDays size={14} />{formatDate(event.event_date)}</span>
            <span className="inline-flex items-center gap-2"><MapPin size={14} />{event.venue ?? "Venue TBA"}</span>
          </div>
          <h3 className="clamp-2 mt-2 text-2xl font-black uppercase text-white sm:text-3xl">{event.name}</h3>
        </div>

        <MainMatchup event={event} />

        {event.fight_card?.length ? (
          <div className="border border-white/10 bg-[#0b0b0b] p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">Fight card</p>
            <ul className="mt-2">
              {event.fight_card.slice(0, 5).map((fight) => (
                <BoutRow key={fight.id} fight={fight} />
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(event.tickets ?? []).map((ticket) => (
            <TicketCard key={ticket.id} event={event} ticket={ticket} />
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isLive ? (
            <Link href={`/watch?event=${event.slug}`} className="primary-button justify-center">
              <Play size={18} />
              Watch live
            </Link>
          ) : null}
          <Link href={`/events/${event.slug}`} className="secondary-button justify-center">
            View event
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function TicketsPage() {
  const events = await getEvents({ status: "upcoming", include_tickets: 1, include_fight_card: 1, per_page: 20 });
  const liveEvents = await getEvents({ status: "live", include_tickets: 1, include_fight_card: 1, per_page: 3 });
  const eventsWithTickets = [...liveEvents.data, ...events.data]
    .filter((event, index, all) => event.tickets?.length && all.findIndex((item) => item.id === event.id) === index);

  return (
    <main>
      <section className="border-b border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <p className="section-kicker">Fight Tickets</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-none text-white sm:text-5xl">Choose your fight-night pass.</h1>
        </div>
      </section>

      <section className="section-shell">
        {eventsWithTickets.length ? (
          <div className="grid gap-6">
            {eventsWithTickets.map((event) => (
              <EventTicketBlock key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">
            Ticket windows open around confirmed Nara Promotionz events. Check back for the next official release.
          </div>
        )}
      </section>

      <section className="section-shell pt-0 grid gap-3 sm:gap-5 md:grid-cols-3">
        <div className="info-panel">
          <Ticket className="text-[#e1252b]" />
          <h3>Venue Tickets</h3>
          <p>Take your place in the arena with the Nara boxing crowd.</p>
        </div>
        <div className="info-panel">
          <Tv className="text-[#d7b46a]" />
          <h3>Online PPV</h3>
          <p>Watch live from wherever you are when your pass includes stream access.</p>
        </div>
        <div className="info-panel">
          <ShieldCheck className="text-[#e1252b]" />
          <h3>Verified Access</h3>
          <p>Your account keeps tickets, payments, and watch access ready.</p>
        </div>
      </section>
    </main>
  );
}
