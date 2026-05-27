"use client";

import Link from "next/link";
import { Maximize2, Radio } from "lucide-react";

type Props = {
  src: string;
  title: string;
};

export function EmbedLivePlayer({ src, title }: Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black" onContextMenu={(event) => event.preventDefault()}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="absolute inset-0 z-10 cursor-default bg-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-black/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-black/85 to-transparent" />
      <div className="pointer-events-none absolute left-3 top-3 z-30 flex items-center gap-2 border border-[#e1252b]/60 bg-black/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white sm:left-5 sm:top-5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping bg-[#e1252b] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 bg-[#e1252b]" />
        </span>
        Nara Promotionz Live
      </div>
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
        <div className="pointer-events-none min-w-0">
          <p className="clamp-1 text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">{title}</p>
          <p className="mt-1 hidden text-xs text-zinc-300 sm:block">You are watching inside the official Nara Promotionz live room.</p>
        </div>
        <Link href="/watch" className="pointer-events-auto inline-flex shrink-0 items-center gap-2 border border-white/15 bg-black/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#e1252b]">
          <Radio size={13} />
          Live room
        </Link>
        <button type="button" className="pointer-events-auto hidden shrink-0 items-center gap-2 border border-white/15 bg-black/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#e1252b] sm:inline-flex" onClick={() => document.documentElement.requestFullscreen?.()}>
          <Maximize2 size={13} />
          Fullscreen
        </button>
      </div>
    </div>
  );
}
