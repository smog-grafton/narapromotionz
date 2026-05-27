import type { Metadata } from "next";
import { BoxerSpotlight } from "@/components/home/BoxerSpotlight";
import { CountdownStrip } from "@/components/home/CountdownStrip";
import { EventRail } from "@/components/home/EventRail";
import { FightCardPreview } from "@/components/home/FightCardPreview";
import { HeroSection } from "@/components/home/HeroSection";
import { MediaGrid } from "@/components/home/MediaGrid";
import { PlatformBlocks } from "@/components/home/PlatformBlocks";
import { SponsorStrip } from "@/components/home/SponsorStrip";
import { getFeaturedBoxers, getHome } from "@/services/api";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();

  return {
    title: home.seo?.title ?? "Nara Promotionz | Boxing Events, News, Tickets and Live Streams",
    description: home.seo?.description ?? "Nara Promotionz is a premium Ugandan boxing platform for events, tickets, PPV streams, boxer profiles, and news.",
    alternates: home.seo?.canonical ? { canonical: home.seo.canonical } : undefined,
    openGraph: {
      title: home.seo?.title ?? "Nara Promotionz",
      description: home.seo?.description ?? undefined,
      images: home.seo?.og_image ? [{ url: home.seo.og_image }] : undefined,
    },
  };
}

export default async function Home() {
  const [home, featuredBoxers] = await Promise.all([getHome(), getFeaturedBoxers(4)]);
  const heroEvent = home.hero_event;

  return (
    <>
      <HeroSection event={heroEvent} slides={home.hero_slides} />
      <CountdownStrip date={heroEvent?.event_date} time={heroEvent?.event_time} venue={heroEvent?.venue} />
      <EventRail events={home.upcoming_events} />
      <FightCardPreview event={home.featured_fight_card ?? heroEvent} />
      <PlatformBlocks />
      <MediaGrid
        news={home.latest_news}
        breaking={home.breaking_news}
        trending={home.trending_news}
        previews={home.fight_previews}
        interviews={home.interviews}
        videos={home.featured_videos}
      />
      <BoxerSpotlight boxers={featuredBoxers.length ? featuredBoxers : home.boxer_spotlight} />
      <SponsorStrip sponsors={home.sponsors} />
    </>
  );
}
