import Link from "next/link";
import { CalendarClock, MapPin, Play, Shield, Ticket } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, money } from "@/lib/utils";
import type { Boxer, Event, Video } from "@/types/platform";

export function RelatedEventCard({ event }: { event?: Event | null }) {
  if (!event) return null;

  return (
    <aside className="info-panel">
      <CalendarClock className="text-[#e1252b]" />
      <h3>Related Fight Night</h3>
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#171717]">
          <SafeImage src={event.images?.poster ?? event.images?.banner} fallbackSrc="/assets/images/events/event1.webp" alt={event.name} fill sizes="120px" className="object-cover" />
        </div>
        <div>
          <strong className="clamp-2 block text-xl font-black uppercase leading-tight text-white">{event.name}</strong>
          <p className="mt-2 flex items-center gap-2">
            <MapPin size={14} />
            {event.venue ?? "Venue TBA"}, {event.city ?? "Uganda"}
          </p>
          <p className="mt-1">{formatDate(event.event_date)} · {money(event.ticketing?.min_price, "UGX")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/events/${event.slug}`} className="mini-button">
              Event details
            </Link>
            <Link href="/tickets" className="mini-button">
              <Ticket size={14} />
              Tickets
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function RelatedBoxerCard({ boxer }: { boxer?: Boxer | null }) {
  if (!boxer) return null;

  const wins = boxer.record?.wins ?? boxer.record_wins ?? 0;
  const losses = boxer.record?.losses ?? boxer.record_losses ?? 0;
  const draws = boxer.record?.draws ?? boxer.record_draws ?? 0;

  return (
    <aside className="info-panel">
      <Shield className="text-[#d7b46a]" />
      <h3>Boxer Focus</h3>
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#171717]">
          <SafeImage src={boxer.image_url} fallbackSrc="/assets/images/boxers/boxer-1.jpg" alt={boxer.name} fill sizes="120px" className="object-cover object-top" />
        </div>
        <div>
          <strong className="clamp-2 block text-xl font-black uppercase leading-tight text-white">{boxer.name}</strong>
          <p className="mt-2">{boxer.ring_name ?? boxer.weight_class ?? "Nara Promotionz boxer"}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black uppercase">
            <span className="border border-emerald-500/35 bg-emerald-500/15 px-2 py-1 text-emerald-300">{wins} Wins</span>
            <span className="border border-[#e1252b]/40 bg-[#e1252b]/15 px-2 py-1 text-red-200">{losses} Losses</span>
            <span className="border border-sky-400/35 bg-sky-400/15 px-2 py-1 text-sky-200">{draws} Draws</span>
          </div>
          <p className="mt-2">{boxer.nationality ?? "Uganda"}</p>
          <Link href={`/boxers/${boxer.slug}`} className="mini-button mt-4">
            Fighter profile
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function RelatedVideoCard({ video }: { video?: Video | null }) {
  if (!video) return null;

  return (
    <aside className="info-panel">
      <Play className="text-[#e1252b]" />
      <h3>Watch the Story</h3>
      <Link href={`/videos/${video.slug}`} className="group grid gap-3">
        <div className="relative aspect-video overflow-hidden bg-[#171717]">
          <SafeImage src={video.thumbnail_url} fallbackSrc="/assets/images/videos/video1.webp" alt={video.title} fill sizes="320px" className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 grid place-items-center bg-black/25">
            <div className="grid h-12 w-12 place-items-center border border-white/40 bg-black/70 text-white">
              <Play size={20} />
            </div>
          </div>
        </div>
        <strong className="clamp-2 text-lg font-black uppercase leading-tight text-white">{video.title}</strong>
      </Link>
    </aside>
  );
}
