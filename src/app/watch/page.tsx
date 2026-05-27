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
  const eventSlug = params.event;

  return (
    <div className="bg-black">
      <WatchRoomClient eventSlug={eventSlug} />
      <section className="border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="section-kicker">Fight Card</p>
            <p className="mt-2 text-sm text-zinc-400">Bouts, corners, and results in one place.</p>
          </div>
          <div>
            <p className="section-kicker">Replay</p>
            <p className="mt-2 text-sm text-zinc-400">Return after the final bell.</p>
          </div>
          <div>
            <p className="section-kicker">Support</p>
            <p className="mt-2 text-sm text-zinc-400">Ticket help stays close to the stream.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
