"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Play, Radio, Ticket } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, money } from "@/lib/utils";
import type { Event, HeroSlide } from "@/types/platform";

type Props = {
  event?: Event | null;
  slides?: HeroSlide[];
};

export function HeroSection({ event, slides = [] }: Props) {
  const fallbackSlide = useMemo<HeroSlide | null>(() => {
    if (!event) return null;

    return {
      id: event.id,
      content_type: "event",
      title: event.name,
      subtitle: event.tagline ?? event.description,
      badge_text: "Fight night",
      image_url: event.images?.banner ?? event.images?.poster,
      cta_text: "Buy Ticket",
      cta_url: event.ticketing?.available ? `/checkout/${event.slug}${event.tickets?.[0]?.id ? `?ticket=${event.tickets[0].id}` : ""}` : `/events/${event.slug}`,
      event,
    };
  }, [event]);

  const activeSlides = slides.length ? slides : fallbackSlide ? [fallbackSlide] : [];
  const [index, setIndex] = useState(0);
  const slide = activeSlides[index] ?? activeSlides[0] ?? fallbackSlide;
  const slideEvent = slide?.event ?? event;
  const main = slideEvent?.main_event;
  const red = main?.red_corner;
  const blue = main?.blue_corner;
  const hasFighters = Boolean(red || blue);
  const boxer = slide?.boxer;
  const matchupTitle = red || blue ? `${red?.name ?? "Red corner"} vs ${blue?.name ?? "Blue corner"}` : main?.title;

  useEffect(() => {
    if (activeSlides.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % activeSlides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [activeSlides.length]);

  const ctaHref = slide?.cta_url && slide.cta_url !== "#" ? slide.cta_url : "/tickets";
  const ctaLabel = slide?.cta_text || (slide?.content_type === "video" ? "Watch Video" : slide?.content_type === "news" ? "Read Story" : "Buy Ticket");

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-black">
      <SafeImage
        src={slide?.image_url ?? slideEvent?.images?.banner ?? slideEvent?.images?.poster}
        fallbackSrc="/assets/images/silders/herbat-matovu.jpg"
        alt={slide?.title ?? slideEvent?.name ?? "Nara Promotionz fight night"}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-58"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.82)_38%,rgba(0,0,0,.2)_100%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.8fr)] lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap gap-3">
            <span className="eyebrow"><Radio size={14} /> {slide?.badge_text ?? "Nara Promotionz"}</span>
            <span className="eyebrow">{slideEvent?.broadcast?.network ?? "Narabox TV"}</span>
            <span className="eyebrow">{slideEvent?.event_date ? formatDate(slideEvent.event_date) : slide?.content_type?.replace("_", " ") ?? "Fight media"}</span>
          </div>
          <h1 className="hero-title">{slide?.title ?? slideEvent?.name ?? "Nara Promotionz Fight Night"}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-200">{slide?.subtitle ?? slideEvent?.tagline ?? slideEvent?.description}</p>

          <div className="mt-8 grid gap-4 border-l-4 border-[#e1252b] bg-black/55 p-4 sm:p-5 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{slide?.content_type === "boxer" ? "Fighter spotlight" : "Main Event"}</p>
              <h2 className="mt-2 text-xl font-black uppercase leading-tight text-white sm:text-2xl">{boxer?.ring_name ?? matchupTitle ?? "Fight card announcement soon"}</h2>
              <p className="mt-2 text-sm text-zinc-400">
                {boxer?.weight_class ?? main?.weight_class ?? "Professional boxing"} {main?.rounds ? `• ${main.rounds} rounds` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="stat-box">
                <span>Tickets from</span>
                <strong>{money(slideEvent?.ticketing?.min_price, slideEvent?.ticketing?.currency ?? "UGX")}</strong>
              </div>
              <div className="stat-box">
                <span>Stream</span>
                <strong>{slideEvent?.streaming?.has_stream ? "Live + Replay" : slide?.content_type === "video" ? "Watch now" : "TBA"}</strong>
              </div>
            </div>
          </div>

          {hasFighters ? (
            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_46px_minmax(0,1fr)] items-stretch border border-white/10 bg-black/70 lg:hidden">
              {[red, blue].map((fighter, fighterIndex) => (
                <Link
                  key={fighter?.slug ?? fighterIndex}
                  href={fighter?.slug ? `/boxers/${fighter.slug}` : "/boxers"}
                  className="group min-w-0 p-3"
                >
                  <div className="relative mx-auto aspect-square max-w-[138px] overflow-hidden border border-white/10 bg-[#151515]">
                    <SafeImage
                      src={fighter?.image_url}
                      fallbackSrc={fighterIndex === 0 ? "/assets/images/profiles/fighter1.jpg" : "/assets/images/profiles/fighter2.jpg"}
                      alt={fighter?.name ?? "Fighter"}
                      fill
                      sizes="42vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#d7b46a]">{fighterIndex === 0 ? "Red corner" : "Blue corner"}</p>
                  <h3 className="clamp-2 mt-1 text-sm font-black uppercase leading-tight text-white">{fighter?.name ?? "Fighter TBA"}</h3>
                  <p className="clamp-1 mt-1 text-xs text-zinc-400">{fighter?.record?.display ?? "0-0-0"} · {fighter?.weight_class ?? main?.weight_class ?? "Boxing"}</p>
                </Link>
              ))}
              <div className="col-start-2 row-start-1 grid place-items-center border-x border-white/10 bg-[#080808]">
                <span className="grid h-10 w-10 place-items-center border border-[#e1252b] text-sm font-black uppercase text-white shadow-[0_0_24px_rgba(225,37,43,.35)]">
                  VS
                </span>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={ctaHref} className="primary-button">
              <Ticket size={19} />
              {ctaLabel}
            </Link>
            <Link href="/watch" className="secondary-button">
              <Play size={19} />
              Watch Live
            </Link>
          </div>

          {activeSlides.length > 1 ? (
            <div className="mt-8 flex gap-2">
              {activeSlides.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Open slide ${itemIndex + 1}`}
                  onClick={() => setIndex(itemIndex)}
                  className={`h-1.5 transition-all ${itemIndex === index ? "w-12 bg-[#e1252b]" : "w-6 bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>
          ) : null}
        </div>

        {hasFighters ? (
          <div className="hidden items-end gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)]">
            {[red, blue].map((boxer, index) => (
              <div key={boxer?.slug ?? index} className={`border border-white/10 bg-black/55 ${index === 1 ? "lg:col-start-3" : ""}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#151515]">
                  <SafeImage
                    src={boxer?.image_url}
                    fallbackSrc={index === 0 ? "/assets/images/profiles/fighter1.jpg" : "/assets/images/profiles/fighter2.jpg"}
                    alt={boxer?.name ?? "Fighter"}
                    fill
                    priority
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d7b46a]">{index === 0 ? "Red corner" : "Blue corner"}</p>
                  <h3 className="mt-2 text-xl font-black uppercase leading-tight text-white">{boxer?.name ?? "Fighter TBA"}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{boxer?.record?.display ?? "0-0-0"} · {boxer?.weight_class ?? main?.weight_class ?? "Boxing"}</p>
                </div>
              </div>
            ))}
            <div className="hidden items-center justify-center lg:col-start-2 lg:row-start-1 lg:flex">
              <div className="grid h-16 w-16 place-items-center border border-[#e1252b] bg-black text-xl font-black uppercase text-white shadow-[0_0_35px_rgba(225,37,43,.35)]">
                VS
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
