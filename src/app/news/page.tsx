import type { Metadata } from "next";
import Link from "next/link";
import { Mail, PlayCircle, Search, Ticket } from "lucide-react";
import { BreakingStrip } from "@/components/news/BreakingStrip";
import { NewsCard } from "@/components/news/NewsCard";
import { EventCard } from "@/components/events/EventCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, stripHtml } from "@/lib/utils";
import { getBreakingNews, getEvents, getFeaturedNews, getNews, getNewsCategories, getTrendingNews, getVideos } from "@/services/api";
import type { NewsArticle } from "@/types/platform";

export const metadata: Metadata = {
  title: "Boxing News | Nara Promotionz",
  description: "Latest Nara Promotionz boxing news, fight previews, interviews, results, event coverage, and ringside video.",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function SectionLane({ title, kicker, articles }: { title: string; kicker: string; articles: NewsArticle[] }) {
  if (!articles.length) return null;

  return (
    <section className="section-shell pt-0">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{kicker}</p>
          <h2 className="section-title-tight">{title}</h2>
        </div>
      </div>
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-2 xl:grid-cols-4">
        {articles.slice(0, 4).map((article) => (
          <div key={article.id} className="w-[82vw] shrink-0 snap-start sm:w-auto">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function NewsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const search = first(params.search) ?? "";
  const type = first(params.type) ?? "";
  const category = first(params.category) ?? "";

  const [news, featured, breaking, trending, categories, events, videos] = await Promise.all([
    getNews({ search, type, category, per_page: 18 }),
    getFeaturedNews(8),
    getBreakingNews(8),
    getTrendingNews(8),
    getNewsCategories(),
    getEvents({ status: "upcoming", include_tickets: 1, include_fight_card: 1, per_page: 3 }),
    getVideos({ per_page: 3, featured: 1 }),
  ]);

  const lead = featured[0] ?? news.data[0];
  const topStories = (featured.length ? featured : news.data).filter((article) => article.id !== lead?.id).slice(0, 6);
  const previews = news.data.filter((article) => ["preview", "fight_preview"].includes(article.content_type ?? "")).slice(0, 4);
  const results = news.data.filter((article) => article.content_type === "result").slice(0, 4);
  const interviews = news.data.filter((article) => article.content_type === "interview").slice(0, 4);
  const features = news.data.filter((article) => ["feature", "opinion"].includes(article.content_type ?? "") || article.is_editors_pick).slice(0, 4);
  const eventPromo = events.data[0];
  const videoLead = videos.data[0];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        {lead ? (
          <SafeImage
            src={lead.featured_image_url ?? lead.image_url}
            fallbackSrc="/assets/images/banner/news_oagebanner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-end gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="section-kicker">Nara Boxing Newsroom</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black uppercase leading-none text-white sm:text-6xl lg:text-7xl">
              Ringside stories, fight-night coverage, and boxer voices.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              Follow the build-up, the bell, and the aftermath with Nara Promotionz coverage from the fighters, the fans, and the events shaping Ugandan boxing.
            </p>
          </div>
          <form className="border border-white/10 bg-[#101010] p-4" action="/news">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">Find a story</p>
            <div className="grid gap-3">
              <label className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Search fighters, events, interviews"
                  className="min-h-12 w-full border border-white/10 bg-black pl-10 pr-3 text-sm text-white outline-none focus:border-[#e1252b]"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="category" defaultValue={category} className="min-h-12 border border-white/10 bg-black px-3 text-sm text-white">
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select name="type" defaultValue={type} className="min-h-12 border border-white/10 bg-black px-3 text-sm text-white">
                  <option value="">All coverage</option>
                  <option value="news">News</option>
                  <option value="preview">Previews</option>
                  <option value="result">Results</option>
                  <option value="interview">Interviews</option>
                  <option value="feature">Features</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>
              <button className="primary-button" type="submit">
                Search newsroom
              </button>
            </div>
          </form>
        </div>
      </section>

      <BreakingStrip articles={breaking.length ? breaking : trending} />

      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {[
            ["All", "/news"],
            ["Previews", "/news?type=preview"],
            ["Results", "/news?type=result"],
            ["Interviews", "/news?type=interview"],
            ["Features", "/news?type=feature"],
            ["Opinion", "/news?type=opinion"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="shrink-0 border border-white/10 bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-[#e1252b]">
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell">
        {lead ? <NewsCard article={lead} variant="feature" priority /> : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="section-heading">
              <div>
                <p className="section-kicker">Top Stories</p>
                <h2 className="section-title-tight">The latest from the Nara corner</h2>
              </div>
            </div>
            {topStories.length ? (
              <div className="grid gap-4">
                <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-2">
                  {topStories.slice(0, 4).map((article) => (
                    <div key={article.id} className="w-[82vw] shrink-0 snap-start sm:w-auto">
                      <NewsCard article={article} />
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 border border-white/10 bg-[#0b0b0b] p-3 lg:hidden">
                  {topStories.slice(4, 8).map((article) => (
                    <NewsCard key={article.id} article={article} variant="row" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-white/10 bg-[#101010] p-8 text-sm leading-7 text-zinc-400">
                Fresh Nara Promotionz coverage is on the way. Stay close to the next fight night and follow every confirmed update here.
              </div>
            )}
          </div>

          <aside className="grid content-start gap-5">
            <div className="info-panel">
              <h3>Most Read</h3>
              <div className="grid gap-3">
                {(trending.length ? trending : topStories).slice(0, 5).map((article, index) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="grid grid-cols-[34px_1fr] gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-2xl font-black text-[#e1252b]">{index + 1}</span>
                    <span>
                      <strong className="clamp-2 block text-sm font-black uppercase leading-snug text-white">{article.title}</strong>
                      <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-zinc-500">{formatDate(article.published_at)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {eventPromo ? <EventCard event={eventPromo} /> : null}
          </aside>
        </div>
      </section>

      <SectionLane title="Fight previews" kicker="Before the bell" articles={previews.length ? previews : topStories.slice(0, 4)} />
      <SectionLane title="Results and reaction" kicker="After the final bell" articles={results.length ? results : trending.slice(0, 4)} />

      <section className="section-shell pt-0">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="info-panel">
            <p className="section-kicker">Video Desk</p>
            <h2 className="section-title-tight">Interviews, clips, and fight-night media</h2>
            <p>
              Get closer to the fighters with Nara Promotionz video coverage, from training-camp moments to post-fight reaction.
            </p>
            <Link href="/videos" className="primary-button w-fit">
              <PlayCircle size={18} />
              Watch videos
            </Link>
          </div>
          {videoLead ? (
            <Link href={`/videos/${videoLead.slug}`} className="video-card group transition hover:border-[#e1252b]">
              <div className="relative aspect-video overflow-hidden">
                <SafeImage src={videoLead.thumbnail_url} fallbackSrc="/assets/images/videos/video1.webp" alt={videoLead.title} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 grid place-items-center bg-black/25">
                  <div className="grid h-16 w-16 place-items-center border border-white/40 bg-black/70 text-white">
                    <PlayCircle size={30} />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">{videoLead.category ?? "Video"}</p>
                <h3 className="clamp-2 mt-2 text-2xl font-black uppercase text-white">{videoLead.title}</h3>
                <p className="clamp-3 mt-2 text-sm leading-6 text-zinc-400">{stripHtml(videoLead.description)}</p>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <SectionLane title="Interviews" kicker="Voices from camp" articles={interviews.length ? interviews : topStories.slice(0, 4)} />
      <SectionLane title="Features and opinion" kicker="Deeper reads" articles={features.length ? features : topStories.slice(0, 4)} />

      <section className="section-shell pt-0">
        <div className="grid gap-5 border border-white/10 bg-[#100607] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="section-kicker">Fight-Night Access</p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-white">Never miss the next Nara Promotionz moment.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
              Join the community for ticket drops, weigh-in coverage, interviews, live stream alerts, and official fight-night rewards.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/tickets" className="primary-button">
              <Ticket size={18} />
              Buy tickets
            </Link>
            <Link href="/account" className="secondary-button">
              <Mail size={18} />
              Join Nara
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
