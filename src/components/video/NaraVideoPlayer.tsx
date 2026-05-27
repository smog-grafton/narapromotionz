"use client";

import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import { AlertTriangle, PlayCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

type Props = {
  src?: string | null;
  poster?: string | null;
  title: string;
  sourceType?: string | null;
  youtubeEmbedUrl?: string | null;
  premium?: boolean;
};

function sourceTypeFor(src: string) {
  if (src.includes(".m3u8")) return "application/x-mpegurl";
  if (src.includes(".mp4")) return "video/mp4";
  if (src.includes(".webm")) return "video/webm";
  return undefined;
}

export function NaraVideoPlayer({ src, poster, title, sourceType, youtubeEmbedUrl, premium = false }: Props) {
  if (youtubeEmbedUrl && !premium) {
    return (
      <div className="relative aspect-video overflow-hidden border border-white/10 bg-black">
        <iframe
          src={youtubeEmbedUrl}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (!src || premium) {
    return (
      <div className="relative grid aspect-video place-items-center overflow-hidden border border-white/10 bg-black">
        {poster ? <SafeImage src={poster} fallbackSrc="/assets/images/videos/video1.webp" alt="" fill sizes="100vw" className="object-cover opacity-35" /> : null}
        <div className="relative max-w-md p-6 text-center">
          {premium ? <PlayCircle className="mx-auto text-[#d7b46a]" size={42} /> : <AlertTriangle className="mx-auto text-[#e1252b]" size={42} />}
          <h2 className="mt-5 text-2xl font-black uppercase text-white">
            {premium ? "Premium video access" : "Video unavailable"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            {premium
              ? "Choose a Nara Promotionz fight pass or sign in with confirmed access to watch this premium coverage."
              : "This video is not ready to play right now. Explore more interviews, highlights, and fight-night media from Nara Promotionz."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <MediaPlayer
      className="nara-player aspect-video w-full overflow-hidden border border-white/10"
      title={title}
      src={sourceType || sourceTypeFor(src) ? ({ src, type: sourceType || sourceTypeFor(src) } as never) : src}
      viewType="video"
      streamType={src.includes(".m3u8") ? "on-demand" : "on-demand"}
      crossOrigin
      playsInline
      controlsDelay={2200}
      hideControlsOnMouseLeave
      storage={`narapromotionz-video-${title}`}
    >
      <MediaProvider>
        {poster ? <Poster className="absolute inset-0 block h-full w-full object-cover opacity-100 data-[hidden]:opacity-0" src={poster} alt={title} /> : null}
      </MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
