import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, PlayCircle, Share2 } from "lucide-react";
import { VideoCard } from "@/components/video/VideoCard";
import { VideoPlayerGate } from "@/components/video/VideoPlayerGate";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, stripHtml } from "@/lib/utils";
import { getVideo } from "@/services/api";
import type { Video } from "@/types/platform";

type Props = {
  params: Promise<{ slug: string }>;
};

function youtubeEmbedUrl(video: Video) {
  const id = video.video_id?.trim();
  if (id && (video.source_type === "youtube" || !id.includes("/"))) {
    return withYouTubeParams(`https://www.youtube.com/embed/${id}`);
  }

  if (!video.video_url) return null;

  try {
    const url = new URL(video.video_url);

    if (url.hostname.includes("youtu.be")) {
      return withYouTubeParams(`https://www.youtube.com/embed/${url.pathname.replace("/", "")}`);
    }

    if (url.hostname.includes("youtube.com")) {
      const watchId = url.searchParams.get("v");
      if (watchId) return withYouTubeParams(`https://www.youtube.com/embed/${watchId}`);
      if (url.pathname.startsWith("/embed/")) return withYouTubeParams(video.video_url);
    }

    return null;
  } catch {
    return null;
  }
}

function withYouTubeParams(value: string) {
  try {
    const url = new URL(value);
    url.searchParams.set("controls", "0");
    url.searchParams.set("modestbranding", "1");
    url.searchParams.set("rel", "0");
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("disablekb", "1");
    url.searchParams.set("iv_load_policy", "3");
    return url.toString();
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { video } = await getVideo(slug);
  const description = video.seo?.description || stripHtml(video.description) || `${video.title} from Nara Promotionz video coverage.`;
  const image = video.seo?.og_image ?? video.thumbnail_url ?? null;

  return {
    title: video.seo?.title || `${video.title} | Nara Promotionz Videos`,
    description,
    alternates: video.seo?.canonical ? { canonical: video.seo.canonical } : undefined,
    openGraph: {
      title: video.seo?.title || video.title,
      description,
      images: image ? [{ url: image, alt: video.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: video.seo?.title || video.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const { video, related = [] } = await getVideo(slug);
  const embedUrl = youtubeEmbedUrl(video);
  const locked = video.can_watch === false || Boolean((video.is_premium || video.access_type !== "free") && !(video.hls_url ?? video.replay_url ?? video.video_url) && !embedUrl);

  return (
    <main>
      <section className="border-b border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <VideoPlayerGate slug={slug} initialVideo={video} embedUrl={embedUrl} />
            </div>

            <aside className="grid content-start gap-3">
              <div className="info-panel bg-[#100607]">
                <PlayCircle className="text-[#d7b46a]" />
                <h3>Nara Video Wall</h3>
                <p>Watch interviews, highlights, training footage, and fight-night stories from the Nara Promotionz corner.</p>
                <Link href="/videos" className="mini-button w-fit">
                  More videos
                </Link>
              </div>
              {related.slice(0, 4).map((item) => (
                <Link key={item.id} href={`/videos/${item.slug}`} className="media-row">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden bg-[#171717]">
                    <SafeImage src={item.thumbnail_url} fallbackSrc="/assets/images/videos/video1.webp" alt={item.title} fill sizes="128px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#d7b46a]">{item.category ?? "Video"}</p>
                    <h3 className="clamp-2 mt-1 text-sm font-black uppercase leading-snug text-white">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <div className="flex flex-wrap gap-3">
            <span className="tag">{video.category ?? video.video_type ?? "Video"}</span>
            {video.access_type && video.access_type !== "free" ? <span className="tag">{video.access_type === "ppv" ? "Premium replay" : "Subscriber video"}</span> : null}
            <span className="tag">
              <CalendarDays size={14} />
              {formatDate(video.published_at)}
            </span>
            {video.duration ? <span className="tag">{video.duration}</span> : null}
          </div>
          <h1 className="mt-5 max-w-5xl text-3xl font-black uppercase leading-tight text-white sm:text-4xl lg:text-5xl">{video.title}</h1>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-zinc-400">
            {stripHtml(video.description) || "Stay close to the Nara media wall for the latest interviews, highlights, and fight-night clips."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {locked ? (
              <Link href="/subscriptions" className="primary-button">
                Unlock video
              </Link>
            ) : null}
            <button className="secondary-button" type="button">
              <Share2 size={17} />
              Share
            </button>
            <Link href="/tickets" className="primary-button">
              Fight-night tickets
            </Link>
          </div>
        </article>

        <aside className="info-panel">
          <h3>Watch next</h3>
          <p>Keep following the build-up, the ring walk, and the aftermath with Nara Promotionz video coverage.</p>
        </aside>
      </section>

      {related.length ? (
        <section className="section-shell pt-0">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Related Videos</p>
              <h2 className="section-title-tight">More from the Nara media wall</h2>
            </div>
          </div>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.slice(0, 8).map((item) => (
              <VideoCard key={item.id} video={item} compact />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
