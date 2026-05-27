import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Gift, MapPin, Play, Ticket } from "lucide-react";
import { BoxerCard } from "@/components/boxers/BoxerCard";
import { NewsCard } from "@/components/news/NewsCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, formatTime, money, stripHtml } from "@/lib/utils";
import { getEvent } from "@/services/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  const description = event.seo?.description || stripHtml(event.description || event.full_description) || `${event.name} boxing event, tickets, fight card, and live stream access.`;
  const ogImage = event.seo?.og_image ?? event.images?.banner ?? event.images?.poster ?? null;

  return {
    title: event.seo?.title || `${event.name} | Nara Promotionz`,
    description,
    alternates: event.seo?.canonical ? { canonical: event.seo.canonical } : undefined,
    openGraph: {
      type: "website",
      title: event.seo?.title || event.name,
      description,
      images: ogImage ? [{ url: ogImage, alt: event.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: event.seo?.title || event.name,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  const tickets = event.tickets ?? [];
  const availableTickets = tickets.filter((ticket) => ticket.is_available);
  const fights = event.fight_card ?? [];
  const eventBoxers = [
    event.main_event?.red_corner,
    event.main_event?.blue_corner,
    ...fights.flatMap((fight) => [fight.red_corner, fight.blue_corner]),
  ]
    .filter(Boolean)
    .filter((boxer, index, all) => all.findIndex((item) => item?.id === boxer?.id) === index)
    .slice(0, 4);

  return (
    <main>
      <section className="relative overflow-hidden bg-black">
        <SafeImage
          src={event.images?.banner ?? event.images?.poster}
          fallbackSrc="/assets/images/banner/event_banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div>
            <p className="section-kicker">{event.status ?? "Upcoming"} Event</p>
            <h1 className="hero-title mt-3">{event.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{event.tagline ?? stripHtml(event.description)}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="info-panel">
                <CalendarClock className="text-[#e1252b]" />
                <h3>Date and Time</h3>
                <p>{formatDate(event.event_date)} · {formatTime(event.event_time)}</p>
              </div>
              <div className="info-panel">
                <MapPin className="text-[#d7b46a]" />
                <h3>Venue</h3>
                <p>{event.venue ?? "Venue TBA"}, {event.city ?? "Uganda"}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={availableTickets[0] ? `/checkout/${event.slug}?ticket=${availableTickets[0].id}` : `/tickets`} className="primary-button">
                <Ticket size={18} />
                {availableTickets.length ? "Buy Ticket" : "Ticket Updates"}
              </Link>
              {event.streaming?.has_stream ? (
                <Link href={`/watch?event=${event.slug}`} className="secondary-button">
                  <Play size={18} />
                  Watch Live
                </Link>
              ) : null}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-[#101010]">
            <SafeImage
              src={event.images?.poster ?? event.images?.banner}
              fallbackSrc="/assets/images/events/event1.webp"
              alt={event.name}
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="section-kicker">Fight Card</p>
          <h2 className="section-title-tight">{event.main_event?.title ?? "Main event"}</h2>
          <div className="mt-6 grid gap-3">
            {fights.length ? (
              fights.map((fight) => (
                <div key={fight.id} className="grid gap-3 border border-white/10 bg-[#101010] p-4 md:grid-cols-[56px_1fr_auto] md:items-center">
                  <div className="text-xs font-black uppercase text-[#d7b46a]">#{fight.bout_order ?? "-"}</div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-white">
                      {fight.red_corner?.name ?? "TBA"} vs {fight.blue_corner?.name ?? "TBA"}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {fight.weight_class ?? "Division TBA"} · {fight.rounds ?? event.main_event?.rounds ?? 0} rounds · {fight.belt_title ?? "Nara Promotionz"}
                    </p>
                  </div>
                  <span className="tag w-fit">{fight.status ?? "scheduled"}</span>
                </div>
              ))
            ) : (
              <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">The card is being shaped by the Nara matchmakers. Confirmed bouts will land here as fight night gets closer.</div>
            )}
          </div>
        </div>

        <aside className="grid content-start gap-5">
          <div className="info-panel">
            <Ticket className="text-[#e1252b]" />
            <h3>Tickets</h3>
            {tickets.length ? (
              <div className="grid gap-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-white/10 bg-black p-3">
                    <strong className="clamp-2 block uppercase text-white">{ticket.name}</strong>
                    <p>{ticket.formatted_price ?? money(ticket.price, ticket.currency)} · {ticket.access_label ?? ticket.access_type ?? "Venue entry"}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase">
                      {ticket.grants_live_access ? <span className="tag">Live stream</span> : null}
                      {ticket.allows_venue_entry ? <span className="tag">Venue</span> : null}
                      {!ticket.is_available ? <span className="tag">Sales closed</span> : null}
                    </div>
                    {ticket.is_available ? (
                      <Link href={`/checkout/${event.slug}?ticket=${ticket.id}`} className="mini-button mt-3 w-fit">
                        Secure pass
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p>Ticket windows open as the fight night approaches. Check back for official Nara Promotionz passes.</p>
            )}
          </div>

          <div className="info-panel">
            <Play className="text-[#d7b46a]" />
            <h3>Watch Access</h3>
            <p>{event.streaming?.has_stream ? "Buy an online pass and step into the broadcast when the fight night goes live." : "Watch details will be announced with the official event broadcast plan."}</p>
            <Link href={`/watch?event=${event.slug}`} className="mini-button w-fit">
              Watch room
            </Link>
          </div>

          <div className="info-panel">
            <Gift className="text-[#e1252b]" />
            <h3>Prize Draw</h3>
            <p>Confirmed ticket holders can be part of official Nara Promotionz rewards when prize draws are active for this event.</p>
          </div>
        </aside>
      </section>

      <section className="section-shell pt-0">
        <p className="section-kicker">Event Story</p>
        <h2 className="section-title-tight">About the night</h2>
        <p className="mt-5 max-w-4xl text-sm leading-7 text-zinc-400">
          {stripHtml(event.full_description || event.description) || "This fight night brings the Nara Promotionz crowd closer to the ring, the fighters, and the moments that define the card."}
        </p>
      </section>

      {eventBoxers.length ? (
        <section className="section-shell pt-0">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Fighters</p>
              <h2 className="section-title-tight">Boxers on the card</h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {eventBoxers.map((boxer) => (
              <BoxerCard key={boxer!.id} boxer={boxer!} />
            ))}
          </div>
        </section>
      ) : null}

      {event.news?.length ? (
        <section className="section-shell pt-0">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Event Coverage</p>
              <h2 className="section-title-tight">Stories around this fight night</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {event.news.slice(0, 3).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
