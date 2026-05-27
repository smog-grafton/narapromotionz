import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Flame, Search, Shield, Trophy } from "lucide-react";
import { BoxerCard } from "@/components/boxers/BoxerCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { getBoxers, getRankings } from "@/services/api";
import type { Boxer } from "@/types/platform";

export const metadata: Metadata = {
  title: "Boxers | Nara Promotionz",
  description: "Explore Nara Promotionz professional boxers, records, rankings, weight classes, and upcoming fight profiles.",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function wins(boxer: Boxer) {
  return boxer.record?.wins ?? boxer.record_wins ?? 0;
}

function kos(boxer: Boxer) {
  return boxer.record?.knockouts ?? boxer.knockouts ?? 0;
}

function ranking(boxer: Boxer) {
  return boxer.ranking ?? 9999;
}

function BoxerRail({ title, kicker, boxers }: { title: string; kicker: string; boxers: Boxer[] }) {
  if (!boxers.length) return null;

  return (
    <section className="section-shell pt-0">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h2 className="section-title-tight">{title}</h2>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {boxers.slice(0, 4).map((boxer) => (
          <BoxerCard key={boxer.id} boxer={boxer} />
        ))}
      </div>
    </section>
  );
}

export default async function BoxersPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const search = first(params.search) ?? "";
  const weightClass = first(params.weight_class) ?? "";
  const nationality = first(params.nationality) ?? "";
  const sort = first(params.sort) ?? "ranking";

  const [boxers, rankings] = await Promise.all([
    getBoxers({ search, weight_class: weightClass, nationality, sort, per_page: 24 }),
    getRankings(),
  ]);

  const roster = boxers.data;
  const divisions = Array.from(new Set(rankings.map((group) => group.division).filter(Boolean)));
  const nationalities = Array.from(new Set(roster.map((boxer) => boxer.nationality ?? boxer.country).filter(Boolean))) as string[];
  const featured = roster.filter((boxer) => boxer.ranking_label || boxer.ranking).sort((a, b) => ranking(a) - ranking(b));
  const topRanked = (featured.length ? featured : roster).slice(0, 4);
  const ugandanFighters = roster.filter((boxer) => `${boxer.nationality ?? boxer.country ?? ""}`.toLowerCase().includes("uganda")).sort((a, b) => ranking(a) - ranking(b));
  const mostKos = [...roster].sort((a, b) => kos(b) - kos(a)).slice(0, 4);
  const mostWins = [...roster].sort((a, b) => wins(b) - wins(a)).slice(0, 4);
  const unbeaten = roster.filter((boxer) => (boxer.record?.losses ?? boxer.record_losses ?? 0) === 0 && wins(boxer) > 0).slice(0, 4);
  const dayIndex = roster.length ? new Date().getDate() % roster.length : 0;
  const fighterOfDay = roster[dayIndex];
  const divisionHighlights = divisions
    .map((division) => ({
      division,
      boxers: roster.filter((boxer) => boxer.weight_class === division).slice(0, 3),
    }))
    .filter((group) => group.boxers.length)
    .slice(0, 4);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <div className="absolute inset-0 bg-[url('/assets/images/silders/herbat-matovu.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative mx-auto grid min-h-[480px] max-w-7xl items-end gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="section-kicker">Nara Roster</p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black uppercase leading-none text-white sm:text-6xl lg:text-7xl">
              Fighters, rankings, records, and the next names to watch.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              Follow the Nara Promotionz roster by division, country, form, knockout power, and upcoming fight-night matchups.
            </p>
          </div>
          {fighterOfDay ? (
            <Link href={`/boxers/${fighterOfDay.slug}`} className="group border border-white/10 bg-[#101010] transition hover:border-[#e1252b]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#171717]">
                <SafeImage src={fighterOfDay.image_url} fallbackSrc="/assets/images/boxers/boxer-1.jpg" alt={fighterOfDay.name} fill priority sizes="420px" className="object-cover object-top transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">
                  <Flame size={14} />
                  Fighter of the Day
                </p>
                <h2 className="clamp-2 mt-3 text-3xl font-black uppercase leading-none text-white">{fighterOfDay.name}</h2>
                <p className="mt-2 text-sm text-zinc-400">{fighterOfDay.weight_class ?? "Professional boxing"} · {fighterOfDay.nationality ?? fighterOfDay.country ?? "Nara fighter"}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase">
                  <span className="border border-emerald-500/35 bg-emerald-500/15 px-3 py-2 text-emerald-300">{wins(fighterOfDay)} Wins</span>
                  <span className="border border-[#d7b46a]/35 bg-[#d7b46a]/10 px-3 py-2 text-[#d7b46a]">{kos(fighterOfDay)} KOs</span>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="section-shell">
        <form className="grid gap-3 border border-white/10 bg-[#101010] p-4 md:grid-cols-[1fr_auto_auto_auto_auto]" action="/boxers">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search boxer, nickname, country"
              className="min-h-11 w-full border border-white/10 bg-black pl-10 pr-3 text-sm text-white outline-none focus:border-[#e1252b]"
          />
          </label>
          <select name="weight_class" defaultValue={weightClass} className="min-h-11 border border-white/10 bg-black px-3 text-sm text-white">
            <option value="">All divisions</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
          <select name="nationality" defaultValue={nationality} className="min-h-11 border border-white/10 bg-black px-3 text-sm text-white">
            <option value="">All nations</option>
            {nationalities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} className="min-h-11 border border-white/10 bg-black px-3 text-sm text-white">
            <option value="ranking">Ranking</option>
            <option value="name">Name</option>
            <option value="wins">Wins</option>
            <option value="knockouts">Knockouts</option>
          </select>
          <button className="primary-button" type="submit">
            Filter
          </button>
        </form>

        {boxers.data.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boxers.data.map((boxer, index) => (
              <BoxerCard key={boxer.id} boxer={boxer} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">
            No boxers matched those filters. Clear the search or adjust the division.
          </div>
        )}
      </section>

      <BoxerRail title="Top-ranked fighters" kicker="Ranking Watch" boxers={topRanked} />
      <BoxerRail title="Ugandan fighters to follow" kicker="Home Corner" boxers={ugandanFighters.length ? ugandanFighters : topRanked} />
      <BoxerRail title="Most knockout power" kicker="Finishing Touch" boxers={mostKos.length ? mostKos : topRanked} />

      {divisionHighlights.length ? (
        <section className="section-shell pt-0">
          <div className="section-heading">
            <div>
              <p className="section-kicker">By Weight Class</p>
              <h2 className="section-title-tight">Divisions shaping the next fight cards</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {divisionHighlights.map((group) => (
              <div key={group.division} className="border border-white/10 bg-[#101010] p-5">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">
                  <Shield size={14} />
                  {group.division}
                </p>
                <div className="mt-4 grid gap-3">
                  {group.boxers.map((boxer, index) => (
                    <Link key={boxer.id} href={`/boxers/${boxer.slug}`} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                      <span className="text-2xl font-black text-[#e1252b]">{index + 1}</span>
                      <span>
                        <strong className="clamp-1 block text-sm font-black uppercase text-white">{boxer.name}</strong>
                        <span className="text-xs uppercase tracking-[0.12em] text-zinc-500">{wins(boxer)} wins · {kos(boxer)} KOs</span>
                      </span>
                      <ArrowUpRight size={15} className="text-zinc-500" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-shell pt-0">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="info-panel lg:col-span-1">
            <Trophy className="text-[#d7b46a]" />
            <h3>Most wins</h3>
            <p>The form table for fighters building momentum across the Nara Promotionz roster.</p>
          </div>
          <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
            {[...(mostWins.length ? mostWins : topRanked), ...(unbeaten.length ? unbeaten : [])].slice(0, 4).map((boxer) => (
              <Link key={`${boxer.id}-shortlist`} href={`/boxers/${boxer.slug}`} className="grid grid-cols-[72px_1fr] gap-4 border border-white/10 bg-[#101010] p-3 transition hover:border-[#e1252b]">
                <div className="relative aspect-square overflow-hidden bg-[#171717]">
                  <SafeImage src={boxer.image_url} fallbackSrc="/assets/images/boxers/boxer-1.jpg" alt={boxer.name} fill sizes="72px" className="object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="clamp-1 text-lg font-black uppercase leading-tight text-white">{boxer.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">{boxer.weight_class ?? "Professional boxing"}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black uppercase">
                    <span className="border border-emerald-500/35 bg-emerald-500/15 px-2 py-1 text-emerald-300">{wins(boxer)} Wins</span>
                    <span className="border border-[#d7b46a]/35 bg-[#d7b46a]/10 px-2 py-1 text-[#d7b46a]">{kos(boxer)} KOs</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
