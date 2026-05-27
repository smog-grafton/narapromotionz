"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Lock, MessageSquare, Radio, RefreshCw, ShieldCheck, Ticket } from "lucide-react";
import { EmbedLivePlayer } from "@/components/watch/EmbedLivePlayer";
import { HlsPlayer } from "@/components/watch/HlsPlayer";
import { InstantPayModal } from "@/components/watch/InstantPayModal";
import { LiveChatPanel } from "@/components/watch/LiveChatPanel";
import type { StreamPayload } from "@/types/platform";

type Props = {
  stream: StreamPayload;
  eventSlug: string;
  poster?: string;
};

const stateCopy = {
  login_required: {
    title: "Login to enter the watch room",
    body: "Sign in to access your tickets, live events, replays, and fight-night rewards.",
    cta: "Login or register",
    href: "/account",
    icon: Lock,
  },
  ticket_required: {
    title: "Ticket required for this stream",
    body: "Buy an online fight-night pass to unlock the live broadcast from wherever you are.",
    cta: "Buy ticket",
    href: "/tickets",
    icon: Ticket,
  },
  scheduled: {
    title: "The fight night has not started yet",
    body: "Your stream opens here when the event goes live. Keep your ticket ready and return before the first bell.",
    cta: "View event details",
    href: "/events",
    icon: Clock,
  },
  replay_available: {
    title: "Replay is available",
    body: "Return to the official Nara Promotionz replay and catch the moments you want to see again.",
    cta: "Open replay",
    href: "/watch",
    icon: RefreshCw,
  },
  stream_unavailable: {
    title: "The live room is getting ready",
    body: "The next Nara Promotionz broadcast will open here as soon as the stream is ready.",
    cta: "View events",
    href: "/events",
    icon: Radio,
  },
  unavailable: {
    title: "The live room is getting ready",
    body: "The next Nara Promotionz broadcast will open here as soon as the stream is ready.",
    cta: "View events",
    href: "/events",
    icon: Radio,
  },
};

export function WatchExperience({ stream, eventSlug, poster = "/assets/images/banner/videos_banner.jpg" }: Props) {
  const playbackUrl = stream.stream?.hls_url ?? stream.stream?.playback_url ?? stream.stream?.replay_url;
  const embedUrl = stream.stream?.embed_url;
  const hasPlayableSource = Boolean(playbackUrl || embedUrl);
  const previewPlaybackOpen = Boolean(stream.access.preview_active && stream.access.can_watch_live && hasPlayableSource);
  const canShowPlayer = hasPlayableSource && (stream.status === "live" || previewPlaybackOpen || stream.access.can_watch_live || stream.access.can_watch_replay);
  const [paywallOpen, setPaywallOpen] = useState(Boolean(stream.access.requires_payment && !previewPlaybackOpen && !stream.access.can_watch_live));
  const [chatOpen, setChatOpen] = useState(false);
  const reason = stream.access.reason;
  const copy = stateCopy[reason as keyof typeof stateCopy] ?? stateCopy[stream.status as keyof typeof stateCopy] ?? stateCopy.scheduled;
  const Icon = copy.icon;
  const showPreviewPrompt = Boolean(stream.access.preview_active && stream.access.access_type === "free_preview" && !stream.access.user_has_ticket);
  const accessLabel = stream.access.user_has_ticket || stream.access.access_type === "paid_ticket" ? "Pass active" : stream.access.access_type === "free_preview" ? "Free preview" : stream.status === "live" ? "Live now" : "Watch room";

  return (
    <section className="section-shell">
      <InstantPayModal eventSlug={eventSlug} access={stream.access} open={paywallOpen} onClose={() => setPaywallOpen(false)} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 border border-[#e1252b]/50 bg-[#e1252b]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">
          <Radio size={14} />
          {stream.stream?.title ?? "Nara Promotionz Live"}
        </span>
        <span className="inline-flex items-center gap-2 border border-[#d7b46a]/40 bg-[#d7b46a]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">
          <ShieldCheck size={14} />
          {accessLabel}
        </span>
      </div>
      {showPreviewPrompt ? (
        <div className="mb-4 border border-[#d7b46a]/40 bg-[#d7b46a]/10 p-3 text-xs font-black uppercase tracking-[0.12em] text-[#d7b46a]">
          Free preview. Stay for the main card with a fight-night pass.
        </div>
      ) : null}
      <div className="grid gap-6">
        <div className="relative border border-white/10 bg-black">
          {canShowPlayer && embedUrl ? (
            <EmbedLivePlayer src={embedUrl} title={stream.stream?.title ?? "Nara Promotionz Live"} chatOpen={chatOpen} onToggleChat={() => setChatOpen((value) => !value)} />
          ) : canShowPlayer ? (
            <div className="relative">
              <HlsPlayer src={playbackUrl} poster={poster} title={stream.stream?.title ?? "Nara Promotionz Live"} live={stream.status === "live"} />
              <button
                type="button"
                onClick={() => setChatOpen((value) => !value)}
                className="absolute bottom-4 right-4 z-30 grid h-11 w-11 place-items-center border border-white/15 bg-black/80 text-white transition hover:border-[#e1252b]"
                aria-label={chatOpen ? "Hide fight chat" : "Show fight chat"}
              >
                <MessageSquare size={17} />
              </button>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-[#090909] p-8 text-center">
              <div className="max-w-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#e1252b] text-[#e1252b]">
                  <Icon size={28} />
                </div>
                <h1 className="mt-6 text-3xl font-black uppercase text-white">{copy.title}</h1>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{copy.body}</p>
                {stream.access.requires_payment ? (
                  <button type="button" onClick={() => setPaywallOpen(true)} className="primary-button mt-6 inline-flex">
                    {copy.cta}
                  </button>
                ) : (
                  <Link href={copy.href} className="primary-button mt-6 inline-flex">
                    {copy.cta}
                  </Link>
                )}
              </div>
            </div>
          )}
          {canShowPlayer && chatOpen ? (
            <div className="absolute inset-0 z-40 flex items-end justify-end bg-black/25 sm:items-stretch">
              <LiveChatPanel
                eventSlug={eventSlug}
                onClose={() => setChatOpen(false)}
                className="h-[82%] min-h-0 w-full max-w-none border-b-0 border-l border-r-0 border-t bg-[#0b0b0b]/95 shadow-2xl backdrop-blur sm:h-full sm:w-[390px] sm:border-b sm:border-r"
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="info-panel">
            <Radio size={20} className="text-[#e1252b]" />
            <h3>Status</h3>
            <p>{canShowPlayer ? (stream.status === "live" ? "Live now." : "Stream open.") : copy.title}</p>
          </div>
          <div className="info-panel">
            <Ticket size={20} className="text-[#d7b46a]" />
            <h3>Access</h3>
            <p>{stream.access.user_has_ticket ? "Your pass is active." : showPreviewPrompt ? "Preview is open." : stream.access.requires_payment ? "Pass required." : "Ready."}</p>
            {stream.access.requires_payment && !stream.access.user_has_ticket ? (
              <button type="button" onClick={() => setPaywallOpen(true)} className="mini-button w-fit">
                Unlock
              </button>
            ) : null}
          </div>
          <div className="info-panel">
            <MessageSquare size={20} className="text-zinc-300" />
            <h3>Chat</h3>
            <p>Fight chat opens over the player.</p>
            {canShowPlayer ? (
              <button type="button" onClick={() => setChatOpen(true)} className="mini-button w-fit">
                Open chat
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
