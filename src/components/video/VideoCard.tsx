import Link from "next/link";
import { Clock3, Eye, PlayCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, stripHtml } from "@/lib/utils";
import type { Video } from "@/types/platform";

type Props = {
  video: Video;
  priority?: boolean;
  compact?: boolean;
};

export function VideoCard({ video, priority = false, compact = false }: Props) {
  const premiumLabel = video.access_type === "ppv" ? (video.formatted_price ?? "Premium") : video.requires_subscription || video.access_type === "subscription" ? "Subscriber" : video.is_premium ? "Premium" : null;

  return (
    <Link href={`/videos/${video.slug}`} className={`video-card group transition hover:border-[#e1252b] ${compact ? "max-xl:grid max-xl:grid-cols-[170px_1fr] max-sm:grid-cols-[112px_1fr]" : ""}`}>
      <div className={`relative aspect-video overflow-hidden bg-[#171717] ${compact ? "max-xl:aspect-auto max-xl:min-h-[132px] max-sm:min-h-[112px]" : ""}`}>
        <SafeImage
          src={video.thumbnail_url}
          fallbackSrc="/assets/images/videos/video1.webp"
          alt={video.title}
          fill
          priority={priority}
          sizes={compact ? "(min-width: 1280px) 25vw, (min-width: 640px) 170px, 112px" : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-95 transition group-hover:opacity-100 max-sm:hidden">
          <span className="grid h-10 w-10 place-items-center border border-white/35 bg-black/70 text-white sm:h-12 sm:w-12">
            <PlayCircle size={compact ? 20 : 24} />
          </span>
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 max-sm:left-2 max-sm:top-2">
          <span className="bg-[#e1252b] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
            {video.category ?? video.video_type ?? "Video"}
          </span>
          {premiumLabel ? (
            <span className="bg-[#d7b46a] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">{premiumLabel}</span>
          ) : null}
        </div>
        {video.duration ? (
          <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 text-xs font-black text-white max-sm:bottom-2 max-sm:right-2 max-sm:text-[10px]">{video.duration}</span>
        ) : null}
      </div>

      <div className={compact ? "flex min-w-0 flex-1 flex-col p-3 sm:p-4" : "video-card-body"}>
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#d7b46a] sm:text-[11px] sm:tracking-[0.14em]">
          <Clock3 size={13} />
          {formatDate(video.published_at)}
        </p>
        <h3 className={`${compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl"} clamp-2 mt-2 font-black uppercase leading-tight text-white sm:mt-3`}>
          {video.title}
        </h3>
        {!compact ? <p className="clamp-3 mt-3 text-sm leading-6 text-zinc-400">{stripHtml(video.description)}</p> : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 sm:pt-5 sm:text-xs">
          <span>Watch now</span>
          <span className="inline-flex items-center gap-1">
            <Eye size={13} />
            Nara TV
          </span>
        </div>
      </div>
    </Link>
  );
}
