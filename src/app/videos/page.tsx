import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle, Search, Sparkles } from "lucide-react";
import { VideoCard } from "@/components/video/VideoCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate } from "@/lib/utils";
import { getVideos } from "@/services/api";
import type { Video } from "@/types/platform";

export const metadata: Metadata = {
  title: "Boxing Videos | Nara Promotionz",
  description: "Watch Nara Promotionz fight highlights, interviews, training footage, event videos, and premium boxing media.",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function byCategory(videos: Video[], names: string[]) {
  const needles = names.map((name) => name.toLowerCase());

  return videos.filter((video) => {
    const haystack = [video.category, video.video_type, video.title, video.description].filter(Boolean).join(" ").toLowerCase();
    return needles.some((needle) => haystack.includes(needle));
  });
}

function uniqueVideos(videos: Video[]) {
  return videos.filter((video, index, all) => all.findIndex((item) => item.id === video.id) === index);
}

export default async function VideosPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const search = first(params.search) ?? "";
  const category = first(params.category) ?? "";
  const videos = await getVideos({ search, category, per_page: 24 });
  const allVideos = videos.data;
  const featured = allVideos.find((video) => video.is_premium) ?? allVideos[0];
  const latest = allVideos.filter((video) => video.id !== featured?.id).slice(0, 8);
  const interviews = byCategory(allVideos, ["interview", "reaction", "press"]).slice(0, 6);
  const highlights = byCategory(allVideos, ["highlight", "knockout", "ko", "replay"]).slice(0, 6);
  const training = byCategory(allVideos, ["training", "camp", "weigh", "behind"]).slice(0, 6);
  const watchRows = uniqueVideos([...highlights, ...interviews, ...training, ...latest]).slice(0, 10);

  return (
    <main>
      <section className="border-b border-white/10 bg-[#050505]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="section-kicker">Nara Video</p>
            <h1 className="section-title-tight">Fight videos, highlights, and ringside stories.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
              Watch the latest Nara Promotionz fight coverage, boxer access, event moments, and official media from the road to fight night.
            </p>
            <form className="mt-6 grid gap-3 border border-white/10 bg-[#101010] p-3 sm:mt-7 sm:grid-cols-[1fr_auto_auto]" action="/videos">
              <label className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Search videos, interviews, boxers"
                  className="min-h-11 w-full border border-white/10 bg-black pl-10 pr-3 text-sm text-white outline-none focus:border-[#e1252b]"
                />
              </label>
              <select name="category" defaultValue={category} className="min-h-11 border border-white/10 bg-black px-3 text-sm text-white">
                <option value="">All videos</option>
                <option value="interview">Interviews</option>
                <option value="highlight">Highlights</option>
                <option value="training">Training</option>
                <option value="event">Events</option>
              </select>
              <button className="primary-button" type="submit">
                Filter
              </button>
            </form>
          </div>

          {featured ? (
            <Link href={`/videos/${featured.slug}`} className="group overflow-hidden border border-white/10 bg-[#101010] transition hover:border-[#e1252b]">
              <div className="relative aspect-video bg-[#171717]">
                <SafeImage
                  src={featured.thumbnail_url}
                  fallbackSrc="/assets/images/videos/video1.webp"
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-2 bg-[#e1252b] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">
                    <Sparkles size={14} />
                    Featured
                  </span>
                  <h2 className="clamp-2 mt-3 text-2xl font-black uppercase leading-tight text-white sm:text-3xl">{featured.title}</h2>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">{formatDate(featured.published_at)}</p>
                </div>
                <div className="absolute right-4 top-4 grid h-14 w-14 place-items-center border border-white/30 bg-black/70 text-white">
                  <PlayCircle size={27} />
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      {allVideos.length ? (
        <>
          <section className="section-shell">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Latest Uploads</p>
                <h2 className="section-title-tight">Fresh from the Nara media wall</h2>
              </div>
            </div>
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 xl:grid-cols-4">
              {latest.slice(0, 8).map((video, index) => (
                <div key={video.id} className="w-[82vw] shrink-0 snap-start sm:w-auto">
                  <VideoCard video={video} priority={index < 2} />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#0b0b0b]">
            <div className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="section-kicker">Fight-Night Playlist</p>
                <h2 className="section-title-tight">Highlights, knockouts, and replays</h2>
                <div className="mt-7 -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 xl:grid-cols-3">
                  {(highlights.length ? highlights : latest).slice(0, 6).map((video) => (
                    <div key={video.id} className="w-[82vw] shrink-0 snap-start sm:w-auto">
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
              <aside className="grid content-start gap-3">
                <h3 className="text-2xl font-black uppercase text-white">Trending now</h3>
                {watchRows.slice(0, 6).map((video) => (
                  <Link key={video.id} href={`/videos/${video.slug}`} className="media-row">
                    <div className="relative h-20 w-32 shrink-0 overflow-hidden bg-[#171717]">
                      <SafeImage src={video.thumbnail_url} fallbackSrc="/assets/images/videos/video1.webp" alt={video.title} fill sizes="128px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#d7b46a]">{video.category ?? "Video"}</p>
                      <h4 className="clamp-2 mt-1 text-sm font-black uppercase leading-snug text-white">{video.title}</h4>
                    </div>
                  </Link>
                ))}
              </aside>
            </div>
          </section>

          <section className="section-shell grid gap-6 lg:grid-cols-2">
            {[
              ["Interviews and Reactions", interviews],
              ["Training, Weigh-ins, and Behind the Scenes", training],
            ].map(([title, items]) => (
              <div key={title as string} className="border border-white/10 bg-[#101010] p-5">
                <h2 className="text-2xl font-black uppercase text-white">{title as string}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {((items as Video[]).length ? (items as Video[]) : latest).slice(0, 4).map((video) => (
                    <VideoCard key={video.id} video={video} compact />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      ) : (
        <section className="section-shell">
          <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">
            No videos matched those filters. Try another search or return to the full Nara media wall.
          </div>
        </section>
      )}

      <section className="section-shell pt-0">
        <div className="border border-[#e1252b]/30 bg-[#100607] p-6 sm:p-8">
          <p className="section-kicker">Stay ringside</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-white">New fight clips, interviews, and event coverage land here first.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            Follow the fighters before the bell, relive the best moments after the final round, and keep the Nara Promotionz media wall close.
          </p>
        </div>
      </section>
    </main>
  );
}
