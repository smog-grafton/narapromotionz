import { Shield } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Event } from "@/types/platform";

type Props = {
  event?: Event | null;
};

export function FightCardPreview({ event }: Props) {
  const red = event?.main_event?.red_corner;
  const blue = event?.main_event?.blue_corner;
  const title = red || blue ? `${red?.name ?? "Red corner"} vs ${blue?.name ?? "Blue corner"}` : event?.main_event?.title;

  return (
    <section className="bg-[#0d0d0d]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div>
          <p className="section-kicker">Featured Fight Card</p>
          <h2 className="section-title-tight">{title ?? "Main event to be announced"}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
            Study the corners, the stakes, and the fighters before the bell. Every Nara card is built around the matchups that move the crowd.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="tag">{event?.main_event?.weight_class ?? "Professional Boxing"}</span>
            <span className="tag">{event?.main_event?.rounds ?? 10} rounds</span>
            <span className="tag">{event?.main_event?.belt_title ?? "Nara Promotionz"}</span>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] border border-white/10 bg-black/45 sm:hidden">
            {[red, blue].map((boxer, index) => (
              <Link key={boxer?.slug ?? index} href={boxer?.slug ? `/boxers/${boxer.slug}` : "/boxers"} className="min-w-0 p-3">
                <div className="relative aspect-[1.12/1] overflow-hidden border border-white/10 bg-[#151515]">
                  <SafeImage
                    src={boxer?.image_url}
                    fallbackSrc={index === 0 ? "/assets/images/profiles/fighter1.jpg" : "/assets/images/profiles/fighter2.jpg"}
                    alt={boxer?.name ?? "Fighter"}
                    fill
                    sizes="42vw"
                    className="object-cover object-top"
                  />
                </div>
                <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[#d7b46a]">{index === 0 ? "Red corner" : "Blue corner"}</p>
                <h3 className="clamp-2 mt-1 text-sm font-black uppercase leading-tight text-white">{boxer?.name ?? "Fighter TBA"}</h3>
                <p className="clamp-1 mt-1 text-xs text-zinc-400">{boxer?.record?.display ?? "0-0-0"} · {boxer?.nationality ?? "International"}</p>
              </Link>
            ))}
            <div className="col-start-2 row-start-1 grid place-items-center border-x border-white/10 bg-[#080808]">
              <span className="grid h-10 w-10 place-items-center border border-[#e1252b] text-sm font-black text-white">VS</span>
            </div>
          </div>

        <div className="hidden items-stretch gap-4 sm:grid sm:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)]">
          {[red, blue].map((boxer, index) => (
            <div key={boxer?.slug ?? index} className={`fighter-panel ${index === 1 ? "sm:col-start-3" : ""}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#151515]">
                <SafeImage
                  src={boxer?.image_url}
                  fallbackSrc={index === 0 ? "/assets/images/profiles/fighter1.jpg" : "/assets/images/profiles/fighter2.jpg"}
                  alt={boxer?.name ?? "Fighter"}
                  fill
                  sizes="(min-width: 1024px) 24vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#d7b46a]">{index === 0 ? "Red corner" : "Blue corner"}</p>
                <h3 className="mt-1 text-2xl font-black uppercase text-white">{boxer?.name ?? "Fighter TBA"}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {boxer?.record?.display ?? "0-0-0"} · {boxer?.nationality ?? "International"}
                </p>
              </div>
            </div>
          ))}
          <div className="hidden items-center justify-center sm:col-start-2 sm:row-start-1 sm:flex">
            <div className="flex h-16 w-16 items-center justify-center border border-[#e1252b] bg-black text-lg font-black text-white">
              VS
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">
            <Shield size={16} /> Versus
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
