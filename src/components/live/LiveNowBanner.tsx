import Link from "next/link";
import { Radio, Ticket } from "lucide-react";
import { getActiveLiveEvents } from "@/services/api";

export async function LiveNowBanner() {
  if (process.env.NEXT_PUBLIC_ENABLE_LIVE_BANNER === "false") {
    return null;
  }

  const events = await getActiveLiveEvents(1);
  const event = events[0];

  if (!event) {
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
