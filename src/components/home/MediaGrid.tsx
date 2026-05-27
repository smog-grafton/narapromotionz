"use client";

import Link from "next/link";
import { PlayCircle, Radio, Ticket } from "lucide-react";
import { useMemo, useState } from "react";
import { NewsCard } from "@/components/news/NewsCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { VideoCard } from "@/components/video/VideoCard";
import { stripHtml } from "@/lib/utils";
import type { NewsArticle, Video } from "@/types/platform";

type Props = {
  news?: NewsArticle[];
  breaking?: NewsArticle[];
  trending?: NewsArticle[];
  previews?: NewsArticle[];
  interviews?: NewsArticle[];
  videos?: Video[];
};

export function MediaGrid({ news = [], breaking = [], trending = [], previews = [], interviews = [], videos = [] }: Props) {
  const lead = news[0] ?? trending[0] ?? breaking[0];
  const topStories = news.filter((article) => article.id !== lead?.id).slice(0, 4);
  const videoLead = videos[0];
  const tabs = useMemo(
    () => [
      { key: "latest", label: "Latest", items: news.slice(0, 6), type: "news" as const },
      { key: "previews", label: "Previews", items: previews.length ? previews.slice(0, 6) : news.slice(0, 6), type: "news" as const },
      { key: "interviews", label: "Interviews", items: interviews.length ? interviews.slice(0, 6) : trending.slice(0, 6), type: "news" as const },
      { key: "videos", label: "Video", items: videos.slice(0, 6), type: "video" as const },
    ],
    [interviews, news, previews, trending, videos],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "latest");
  const selectedTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Nara Newsroom</p>
          <h2 className="section-title-tight">Fight-night news, interviews, and ringside video</h2>
        </div>
        <Link href="/news" className="text-link">
          Open newsroom
        </Link>
      </div>

      <div className="md:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${activeTab === tab.key ? "border-[#e1252b] bg-[#e1252b] text-white" : "border-white/10 bg-[#101010] text-zinc-400"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3">
          {selectedTab?.type === "video"
            ? (selectedTab.items as Video[]).map((video) => <VideoCard key={video.id} video={video} compact />)
            : (selectedTab?.items as NewsArticle[]).map((article) => <NewsCard key={article.id} article={article} />)}
        </div>
      </div>

      <div className="hidden gap-6 md:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          {lead ? <NewsCard article={lead} variant="feature" /> : null}
          <div className="grid gap-4">
            {topStories.map((article) => (
              <NewsCard key={article.id} article={article} variant="row" />
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-5">
          {breaking.length ? (
            <div className="info-panel">
              <Radio className="text-[#e1252b]" />
              <h3>Ringside Wire</h3>
              <div className="grid gap-3">
                {breaking.slice(0, 4).map((article) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="border-b border-white/10 pb-3 text-sm font-black uppercase leading-snug text-white hover:text-[#d7b46a] last:border-0 last:pb-0">
                    {article.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {videoLead ? (
            <Link href={`/videos/${videoLead.slug}`} className="video-card group transition hover:border-[#e1252b]">
              <div className="relative aspect-video overflow-hidden">
                <SafeImage src={videoLead.thumbnail_url} fallbackSrc="/assets/images/videos/video1.webp" alt={videoLead.title} fill sizes="360px" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 grid place-items-center bg-black/25">
                  <div className="grid h-14 w-14 place-items-center border border-white/40 bg-black/70 text-white">
                    <PlayCircle size={26} />
                  </div>
                </div>
              </div>
              <div className="video-card-body min-h-[180px]">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">{videoLead.category ?? "Video"}</p>
                <h3 className="clamp-2 mt-2 text-xl font-black uppercase leading-tight text-white">{videoLead.title}</h3>
                <p className="clamp-3 mt-2 text-sm leading-6 text-zinc-400">{stripHtml(videoLead.description)}</p>
              </div>
            </Link>
          ) : null}

          <div className="info-panel bg-[#100607]">
            <Ticket className="text-[#d7b46a]" />
            <h3>Next Fight Night</h3>
            <p>Get ticket alerts, event coverage, interviews, and replay updates from the Nara Promotionz corner.</p>
            <Link href="/tickets" className="mini-button w-fit">
              Buy tickets
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {[["Fight Previews", previews], ["Interviews", interviews]].map(([title, articles]) => (
          <div key={title as string} className="border border-white/10 bg-[#101010] p-5">
            <h3 className="text-2xl font-black uppercase text-white">{title as string}</h3>
            <div className="mt-4 grid gap-3">
              {(articles as NewsArticle[]).slice(0, 3).map((article) => (
                <NewsCard key={article.id} article={article} variant="row" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {videos.length > 1 ? (
        <div className="mt-8">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Latest Video</p>
              <h3 className="section-title-tight">Fresh Nara fight clips</h3>
            </div>
            <Link href="/videos" className="text-link">
              Watch more
            </Link>
          </div>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {videos.slice(1, 5).map((video) => (
              <VideoCard key={video.id} video={video} compact />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
