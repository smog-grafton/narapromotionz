import { CalendarClock } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

type Props = {
  date?: string | null;
  time?: string | null;
  venue?: string | null;
};

export function CountdownStrip({ date, time, venue }: Props) {
  return (
    <div className="border-y border-white/10 bg-[#111]">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <CalendarClock size={18} className="text-[#e1252b]" />
          <span className="font-semibold text-white">Next bell:</span> {formatDate(date)} at {formatTime(time)}
        </div>
        <div className="text-sm text-zinc-300 md:text-center">
          Venue: <span className="font-semibold text-white">{venue ?? "To be confirmed"}</span>
        </div>
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7b46a] md:text-right">
          Live gate and PPV access managed in one ticket
        </div>
      </div>
    </div>
  );
}
