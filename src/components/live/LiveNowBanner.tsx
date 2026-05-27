"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { getActiveLiveEvents } from "@/services/api";
import type { Event } from "@/types/platform";

export function LiveNowBanner() {
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(null);
  const isPlayerRoute = pathname === "/watch" || pathname.startsWith("/watch/");

  useEffect(() => {
    let mounted = true;

    if (process.env.NEXT_PUBLIC_ENABLE_LIVE_BANNER === "false" || isPlayerRoute) {
      return;
    }

    getActiveLiveEvents(1)
      .then((events) => {
        if (mounted) setEvent(events[0] ?? null);
      })
      .catch(() => {
        if (mounted) setEvent(null);
      });

    return () => {
      mounted = false;
    };
  }, [isPlayerRoute, pathname]);

  if (!event || isPlayerRoute) {
    return null;
  }

  return (
    <div className="border-b border-[#e1252b]/40 bg-[#170607]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-[#e1252b] text-[#e1252b]">
            <Radio size={17} />
          </span>
          <p className="min-w-0 font-black uppercase tracking-[0.08em] text-white">
            <span className="text-[#d7b46a]">Live now:</span> <span className="clamp-1 inline">{event.name}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={`/watch?event=${event.slug}`} className="mini-button justify-center">
            <Radio size={15} />
            Watch live
          </Link>
          <Link href="/tickets" className="mini-button justify-center">
            <Ticket size={15} />
            Get access
          </Link>
        </div>
      </div>
    </div>
  );
}
