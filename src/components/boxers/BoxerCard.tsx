import Link from "next/link";
import { ArrowUpRight, Medal } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Boxer } from "@/types/platform";

type Props = {
  boxer: Boxer;
  priority?: boolean;
};

export function BoxerCard({ boxer, priority = false }: Props) {
  const wins = boxer.record?.wins ?? boxer.record_wins ?? 0;
  const losses = boxer.record?.losses ?? boxer.record_losses ?? 0;
  const draws = boxer.record?.draws ?? boxer.record_draws ?? 0;
  const knockouts = boxer.record?.knockouts ?? boxer.knockouts ?? 0;
  const koRate = boxer.knockout_percentage ?? boxer.record?.ko_rate ?? 0;

  return (
    <article className="group flex min-h-full flex-col border border-white/10 bg-[#0e0e0e] transition hover:border-[#e1252b]">
      <Link href={`/boxers/${boxer.slug}`} className="grid h-full grid-cols-[126px_1fr] sm:flex sm:flex-col">
        <div className="relative min-h-[178px] overflow-hidden bg-[#171717] sm:aspect-[4/5] sm:min-h-0">
          <SafeImage
            src={boxer.image_url}
            fallbackSrc="/assets/images/boxers/boxer-1.jpg"
            alt={boxer.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 126px"
            className="object-cover object-top transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 sm:p-4">
            <div className="inline-flex items-center gap-1.5 border border-[#d7b46a]/50 bg-black/75 px-2 py-1.5 text-[9px] font-black uppercase text-[#d7b46a] sm:gap-2 sm:px-3 sm:py-2 sm:text-[11px]">
              <Medal size={13} />
              {boxer.ranking_label ?? boxer.status ?? "Professional"}
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 sm:text-xs sm:tracking-[0.14em]">{boxer.weight_class ?? "Professional Boxing"}</p>
          <h3 className="clamp-2 mt-2 text-lg font-black uppercase leading-tight text-white sm:text-2xl sm:leading-none">{boxer.name}</h3>
          <p className="clamp-1 mt-2 min-h-5 text-sm text-zinc-400">{boxer.ring_name ?? boxer.nationality ?? "Nara Promotionz boxer"}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <span className="border border-emerald-500/35 bg-emerald-500/15 px-1.5 py-1.5 text-[9px] font-black uppercase tracking-[0.06em] text-emerald-300 sm:px-2 sm:py-2 sm:text-[11px]">
              {wins} Wins
            </span>
            <span className="border border-[#e1252b]/40 bg-[#e1252b]/15 px-1.5 py-1.5 text-[9px] font-black uppercase tracking-[0.06em] text-red-200 sm:px-2 sm:py-2 sm:text-[11px]">
              {losses} Losses
            </span>
            <span className="border border-sky-400/35 bg-sky-400/15 px-1.5 py-1.5 text-[9px] font-black uppercase tracking-[0.06em] text-sky-200 sm:px-2 sm:py-2 sm:text-[11px]">
              {draws} Draws
            </span>
          </div>
          <div className="mt-3 hidden grid-cols-3 border border-white/10 text-center sm:grid">
            <div className="border-r border-white/10 p-2">
              <span className="block text-[10px] font-bold uppercase text-zinc-500">KO</span>
              <strong className="text-sm text-white">{knockouts}</strong>
            </div>
            <div className="border-r border-white/10 p-2">
              <span className="block text-[10px] font-bold uppercase text-zinc-500">KO Rate</span>
              <strong className="text-sm text-white">{koRate}%</strong>
            </div>
            <div className="p-2">
              <span className="block text-[10px] font-bold uppercase text-zinc-500">Nation</span>
              <strong className="clamp-1 text-sm text-white">{boxer.nationality ?? boxer.country ?? "UG"}</strong>
            </div>
          </div>
          {boxer.upcoming_fight ? (
            <p className="clamp-1 mt-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Next: {boxer.upcoming_fight.name}</p>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-black uppercase text-[#d7b46a] tracking-[0.12em]">
            View profile <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </article>
  );
}
