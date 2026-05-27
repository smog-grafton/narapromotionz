import type { Metadata } from "next";
import Link from "next/link";
import { Award, Radio, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Nara Promotionz",
  description: "Nara Promotionz produces professional boxing events, ticketed fight nights, boxer profiles, and ringside media in Uganda.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="section-kicker">About Nara Promotionz</p>
          <h1 className="section-title-tight">Professional boxing events, broadcast-ready fight nights, and a stronger stage for fighters.</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-400">
            Nara Promotionz brings fans closer to Ugandan boxing through live events, official tickets, boxer profiles, fight-night media, and online viewing built for the modern fight fan.
          </p>
        </div>
      </section>
      <section className="section-shell grid gap-5 md:grid-cols-3">
        <div className="info-panel">
          <Ticket className="text-[#e1252b]" />
          <h3>Fight nights</h3>
          <p>Events shaped around credible matchups, strong production, and a crowd that understands the sport.</p>
        </div>
        <div className="info-panel">
          <Radio className="text-[#d7b46a]" />
          <h3>Live access</h3>
          <p>Online tickets, live streams, and replays keep fans connected wherever fight night finds them.</p>
        </div>
        <div className="info-panel">
          <Award className="text-[#e1252b]" />
          <h3>Fighter platform</h3>
          <p>Boxer profiles, media coverage, and event storytelling help athletes build their names beyond the bell.</p>
        </div>
      </section>
      <section className="section-shell pt-0">
        <div className="border border-[#e1252b]/30 bg-[#100607] p-6 sm:p-8">
          <h2 className="text-3xl font-black uppercase text-white">Step into the next Nara Promotionz event.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">Browse upcoming events, secure your ticket, and follow the fighters making noise across the Nara ring.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/events" className="primary-button">View events</Link>
            <Link href="/tickets" className="secondary-button">Buy tickets</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
