import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ExternalLink, MapPin, Play, Ticket } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { VideoCard } from "@/components/video/VideoCard";
import { formatDate, stripHtml } from "@/lib/utils";
import { getBoxer } from "@/services/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const boxer = (await getBoxer(slug)).profile;
  const description = boxer.seo?.description || stripHtml(boxer.bio || boxer.full_bio) || `${boxer.name} boxer profile, record, ranking, fight history, and upcoming events.`;

  return {
    title: boxer.seo?.title || `${boxer.name} | Boxer Profile | Nara Promotionz`,
    description,
    alternates: boxer.seo?.canonical ? { canonical: boxer.seo.canonical } : undefined,
    openGraph: {
      type: "profile",
      title: boxer.seo?.title || `${boxer.name} | Nara Promotionz`,
      description,
      images: boxer.seo?.og_image || boxer.image_url ? [{ url: boxer.seo?.og_image ?? boxer.image_url!, alt: boxer.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: boxer.seo?.title || `${boxer.name} | Nara Promotionz`,
      description,
      images: boxer.seo?.og_image || boxer.image_url ? [boxer.seo?.og_image ?? boxer.image_url!] : undefined,
    },
  };
}

export default async function BoxerDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBoxer(slug);
  const boxer = detail.profile;
  const record = boxer.record?.display ?? `${boxer.record_wins ?? 0}-${boxer.record_losses ?? 0}-${boxer.record_draws ?? 0}`;
  const upcoming = boxer.upcoming_fight ?? detail.events?.find((event) => event.status === "upcoming");
  const socials = Array.isArray(boxer.social_links)
    ? boxer.social_links
    : Object.entries(boxer.social_links ?? {}).map(([platform, url]) => ({ platform, url }));

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <SafeImage
          src={boxer.image_url}
          fallbackSrc="/assets/images/page-title-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-25"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="relative aspect-[4/5] max-h-[640px] overflow-hidden border border-white/10 bg-[#111]">
            <SafeImage
              src={boxer.image_url}
              fallbackSrc="/assets/images/boxers/boxer-1.jpg"
              alt={boxer.name}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="section-kicker">{boxer.weight_class ?? "Professional Boxing"}</p>
            <h1 className="hero-title mt-3">{boxer.name}</h1>
            {boxer.ring_name ? <p className="mt-3 text-2xl font-bold uppercase text-[#d7b46a]">“{boxer.ring_name}”</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="tag">{boxer.ranking_label ?? "Unranked"}</span>
              <span className="tag">{boxer.nationality ?? boxer.country ?? "Nationality TBA"}</span>
              <span className="tag">{boxer.status ?? "Professional"}</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
              {[
                ["Record", record],
                ["Wins", boxer.record?.wins ?? boxer.record_wins ?? 0],
                ["Losses", boxer.record?.losses ?? boxer.record_losses ?? 0],
                ["Draws", boxer.record?.draws ?? boxer.record_draws ?? 0],
                ["KO", boxer.record?.knockouts ?? boxer.knockouts ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="stat-box">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {upcoming ? (
                <Link href={`/events/${upcoming.slug}`} className="primary-button">
                  <Ticket size={18} />
                  Buy Ticket
                </Link>
              ) : null}
              {upcoming ? (
                <Link href={`/watch?event=${upcoming.slug}`} className="secondary-button">
                  <Play size={18} />
                  Watch Event
                </Link>
              ) : (
                <Link href="/events" className="secondary-button">
                  View Events
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="section-kicker">Profile</p>
            <h2 className="section-title-tight">Fighter file</h2>
            <p className="mt-5 text-sm leading-7 text-zinc-400">{stripHtml(boxer.full_bio || boxer.bio) || "Every fighter has a story. Follow this profile for the record, the next assignment, and the moments that shape the Nara roster."}</p>
          {boxer.titles?.length ? (
            <div className="mt-6 border border-[#d7b46a]/40 bg-[#141006] p-5">
              <h3 className="text-xl font-black uppercase text-white">Titles and achievements</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {boxer.titles.map((title) => (
                  <span key={title} className="tag text-[#d7b46a]">{title}</span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["Stance", boxer.stance ?? "TBA"],
              ["Height", boxer.height ?? "TBA"],
              ["Reach", boxer.reach ?? "TBA"],
              ["Age", boxer.age ?? "TBA"],
              ["KO %", `${boxer.knockout_percentage ?? boxer.record?.ko_rate ?? 0}%`],
              ["Win %", `${boxer.win_percentage ?? boxer.record?.win_rate ?? 0}%`],
            ].map(([label, value]) => (
              <div key={label} className="info-panel">
                <h3>{label}</h3>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid content-start gap-5">
          {upcoming ? (
            <div className="info-panel">
              <Calendar className="text-[#e1252b]" />
              <h3>Upcoming Fight</h3>
              <p>{upcoming.name}</p>
              <p>
                {formatDate(upcoming.event_date)} · {upcoming.venue ?? "Venue TBA"}, {upcoming.city ?? "Uganda"}
              </p>
              <Link href={`/events/${upcoming.slug}`} className="mini-button w-fit">
                Event details
              </Link>
            </div>
          ) : null}

          <div className="info-panel">
            <MapPin className="text-[#d7b46a]" />
            <h3>Related Events</h3>
            <div className="grid gap-3">
              {(detail.events ?? boxer.related_events ?? []).slice(0, 4).map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`} className="border border-white/10 bg-black p-3 text-sm text-zinc-300 hover:border-[#e1252b]">
                  <strong className="block uppercase text-white">{event.name}</strong>
                  {formatDate(event.event_date)} · {event.venue ?? "Venue TBA"}
                </Link>
              ))}
            </div>
          </div>

          {socials.length ? (
            <div className="info-panel">
              <ExternalLink className="text-[#e1252b]" />
              <h3>Social Links</h3>
              <div className="flex flex-wrap gap-2">
                {socials.map((item) => (
                  <a key={`${item.platform}-${item.url}`} href={item.url} target="_blank" rel="noreferrer" className="tag">
                    {item.platform ?? "Profile"}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Fight History</p>
            <h2 className="section-title-tight">Recent results</h2>
          </div>
        </div>
        <div className="grid gap-3">
          {(detail.fight_history ?? boxer.recent_fights ?? []).length ? (
            (detail.fight_history ?? boxer.recent_fights ?? []).slice(0, 8).map((fight) => (
              <div key={fight.id} className="grid gap-3 border border-white/10 bg-[#101010] p-4 text-sm text-zinc-300 md:grid-cols-[80px_1fr_1fr_1fr]">
                <strong className="uppercase text-white">{fight.result?.result ?? fight.status ?? "Scheduled"}</strong>
                <span>{fight.red_corner?.name ?? boxer.name} vs {fight.blue_corner?.name ?? "TBA"}</span>
                <span>{fight.weight_class ?? boxer.weight_class ?? "Division TBA"}</span>
                <span>{fight.result?.method ?? fight.belt_title ?? "Official result pending"}</span>
              </div>
            ))
          ) : (
            <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">Official fight history appears here as the boxer&apos;s Nara journey grows.</div>
          )}
        </div>
      </section>

      {(detail.videos?.length || detail.news?.length) ? (
        <section className="section-shell pt-0 grid gap-8 lg:grid-cols-2">
          {detail.videos?.length ? (
            <div>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Video</p>
                  <h2 className="section-title-tight">Watch {boxer.name}</h2>
                </div>
              </div>
              <div className="grid items-stretch gap-5 sm:grid-cols-2">
                {detail.videos.slice(0, 4).map((video) => (
                  <VideoCard key={video.id} video={video} compact />
                ))}
              </div>
            </div>
          ) : null}

          {detail.news?.length ? (
            <div>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Coverage</p>
                  <h2 className="section-title-tight">Latest stories</h2>
                </div>
              </div>
              <div className="grid gap-4">
                {detail.news.slice(0, 4).map((article) => (
                  <NewsCard key={article.id} article={article} variant="row" />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
