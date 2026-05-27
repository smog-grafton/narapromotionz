import Link from "next/link";
import { CalendarClock, MapPin, Play, Ticket } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, formatTime, money } from "@/lib/utils";
import type { Event } from "@/types/platform";

type Props = {
  event: Event;
  priority?: boolean;
};

export function EventCard({ event, priority = false }: Props) {
  const status = event.streaming?.status ?? event.status ?? "upcoming";
  const ticketPrice = event.ticketing?.min_formatted_price ?? money(event.ticketing?.min_price, event.ticketing?.currency ?? "UGX");

  return (
    <article className="event-card group">
      <Link href={`/events/${event.slug}`} className="grid grid-cols-[128px_1fr] sm:block">
        <div className="relative min-h-[190px] overflow-hidden sm:aspect-[16/10] sm:min-h-0">
          <SafeImage
            src={event.images?.poster ?? event.images?.banner}
            fallbackSrc="/assets/images/events/event1.webp"
            alt={event.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 128px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 bg-[#e1252b] px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.14em]">
            {status}
          </div>
        </div>
        <div className="grid min-w-0 gap-3 p-3 sm:gap-4 sm:p-5">
          <div>
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#d7b46a] sm:text-xs sm:tracking-[0.14em]">
              <CalendarClock size={14} /> {formatDate(event.event_date)} · {formatTime(event.event_time)}
            </p>
            <h3 className="clamp-2 mt-2 text-lg font-black uppercase leading-tight text-white sm:text-2xl">{event.name}</h3>
            <p className="clamp-1 mt-2 flex items-center gap-2 text-sm text-zinc-400">
              <MapPin size={15} /> {event.venue ?? "Venue TBA"}, {event.city ?? "Uganda"}
            </p>
          </div>
          <div className="border-t border-white/10 pt-3 sm:pt-4">
            <p className="clamp-2 text-sm text-zinc-400">{event.main_event?.title ?? "Fight card announcement soon"}</p>
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              <span className="mini-button">
                <Ticket size={15} />
                {event.ticketing?.available ? ticketPrice : "Tickets soon"}
              </span>
              {event.streaming?.has_stream ? (
                <span className="mini-button">
                  <Play size={15} />
                  Watch
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
