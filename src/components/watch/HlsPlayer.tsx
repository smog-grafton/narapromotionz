"use client";

import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";

type Props = {
  src?: string | null;
  poster?: string;
  title?: string;
  live?: boolean;
};

export function HlsPlayer({ src, poster, title = "Nara Promotionz Live", live = false }: Props) {
  if (!src) return null;

  return (
    <MediaPlayer
      className="aspect-video w-full overflow-hidden bg-black text-white"
      title={title}
      src={src}
      viewType="video"
      streamType={live ? "live" : "on-demand"}
      logLevel="warn"
      crossOrigin
      playsInline
    >
      <MediaProvider>
        <Poster className="absolute inset-0 block h-full w-full object-cover opacity-100 data-[hidden]:opacity-0" src={poster} alt={title} />
      </MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
