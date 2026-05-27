import { WatchRoomClient } from "@/components/watch/WatchRoomClient";

type WatchPageProps = {
  searchParams: Promise<{
    event?: string;
  }>;
};

export const metadata = {
  title: "Watch Live | Nara Promotionz",
  description: "Watch Nara Promotionz live boxing streams and official event replays with ticket-gated access.",
};

export default async function WatchPage({ searchParams }: WatchPageProps) {
  const params = await searchParams;
  const eventSlug = params.event ?? "fight-night-kampala";

  return (
    <div className="bg-black">
      <section className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="section-kicker">Watch</p>
          <h1 className="section-title-tight">Your Nara Promotionz live room.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Step into the broadcast, follow the fight card, and return for official replays when your ticket includes watch access.
          </p>
        </div>
      </section>
      <WatchRoomClient eventSlug={eventSlug} />
    </div>
  );
}
