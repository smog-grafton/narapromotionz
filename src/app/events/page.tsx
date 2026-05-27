import type { Metadata } from "next";
import { EventCard } from "@/components/events/EventCard";
import { getEvents } from "@/services/api";

export const metadata: Metadata = {
  title: "Events | Nara Promotionz",
  description: "Upcoming and past Nara Promotionz boxing events, fight cards, ticket access, and live stream availability.",
};

export default async function EventsPage() {
  const events = await getEvents({ per_page: 30, include_fight_card: 1, include_tickets: 1 });
  const upcoming = events.data.filter((event) => ["upcoming", "live", "scheduled"].includes(event.status ?? "upcoming"));
  const past = events.data.filter((event) => ["completed", "ended", "replay_available"].includes(event.status ?? ""));

  return (
    <main>
      <section className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="section-kicker">Fight Nights</p>
          <h1 className="section-title-tight">Events built for the venue, the stream, and the replay.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            Follow every Nara Promotionz fight night from the first announcement to the final bell, with tickets, fight cards, live streams, and replay access in one place.
          </p>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Schedule</p>
            <h2 className="section-title-tight">Upcoming Events</h2>
          </div>
        </div>
        {upcoming.length ? (
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event, index) => (
              <div key={event.id} className="w-[84vw] shrink-0 snap-start sm:w-auto">
                <EventCard event={event} priority={index === 0} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">The next Nara Promotionz date is being lined up. Stay close for the official announcement.</div>
        )}
      </section>

      <section className="section-shell pt-0">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Archive</p>
            <h2 className="section-title-tight">Past events and replay nights</h2>
          </div>
        </div>
        {past.length ? (
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-2 xl:grid-cols-3">
            {past.map((event) => (
              <div key={event.id} className="w-[84vw] shrink-0 snap-start sm:w-auto">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">Replay nights and past event highlights live here once the action is ready to revisit.</div>
        )}
      </section>
    </main>
  );
}
