import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import type { Event } from "@/types/platform";

type Props = {
  events?: Event[];
};

export function EventRail({ events = [] }: Props) {
  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Schedule</p>
          <h2 className="section-title-tight">Upcoming Events</h2>
        </div>
        <Link href="/events" className="text-link">
          View all events
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
