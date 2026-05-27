"use client";

import { useRef, useState } from "react";
import { Maximize2, MessageSquare, Pause, Play, Volume2, VolumeX } from "lucide-react";

type Props = {
  src: string;
  title: string;
  chatOpen?: boolean;
  onToggleChat?: () => void;
};

export function EmbedLivePlayer({ src, title, chatOpen, onToggleChat }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  function command(func: string, args: unknown[] = []) {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  }

  function togglePlay() {
    const nextPlaying = !playing;
    command(nextPlaying ? "playVideo" : "pauseVideo");
    setPlaying(nextPlaying);
  }

  function toggleMute() {
    const nextMuted = !muted;
    command(nextMuted ? "mute" : "unMute");
    setMuted(nextMuted);
  }

  async function enterFullscreen() {
    await playerRef.current?.requestFullscreen?.();
  }

  return (
    <div
      ref={playerRef}
      className="group/player relative aspect-video w-full overflow-hidden bg-black fullscreen:aspect-auto fullscreen:h-screen fullscreen:w-screen"
      onContextMenu={(event) => event.preventDefault()}
    >
      <iframe
        ref={frameRef}
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
          <p className="mt-1 hidden text-xs text-zinc-300 sm:block">Official Nara Promotionz broadcast.</p>
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <button type="button" className="grid h-11 w-11 place-items-center border border-white/15 bg-black/80 text-white transition hover:border-[#e1252b]" onClick={togglePlay} aria-label={playing ? "Pause stream" : "Play stream"}>
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center border border-white/15 bg-black/80 text-white transition hover:border-[#e1252b]" onClick={toggleMute} aria-label={muted ? "Unmute stream" : "Mute stream"}>
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          {onToggleChat ? (
            <button
              type="button"
              className={`grid h-11 w-11 place-items-center border bg-black/80 text-white transition hover:border-[#e1252b] ${chatOpen ? "border-[#e1252b]" : "border-white/15"}`}
              onClick={onToggleChat}
              aria-label={chatOpen ? "Hide fight chat" : "Show fight chat"}
            >
              <MessageSquare size={17} />
            </button>
          ) : null}
          <button type="button" className="grid h-11 w-11 place-items-center border border-white/15 bg-black/80 text-white transition hover:border-[#e1252b]" onClick={enterFullscreen} aria-label="Fullscreen player">
            <Maximize2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
