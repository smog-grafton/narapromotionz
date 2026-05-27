"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Lock, Radio, RefreshCw, Ticket } from "lucide-react";
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
  const reason = stream.access.reason;
  const copy = stateCopy[reason as keyof typeof stateCopy] ?? stateCopy[stream.status as keyof typeof stateCopy] ?? stateCopy.scheduled;
  const Icon = copy.icon;

  return (
    <section className="section-shell">
      <InstantPayModal eventSlug={eventSlug} access={stream.access} open={paywallOpen} onClose={() => setPaywallOpen(false)} />
      {stream.access.preview_active ? (
        <div className="mb-4 border border-[#d7b46a]/40 bg-[#d7b46a]/10 p-4 text-sm font-bold leading-6 text-[#d7b46a]">
          {stream.access.message ?? "Free preview is live. Buy your fight-night pass to stay connected for the main card."}
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="border border-white/10 bg-black">
          {canShowPlayer && embedUrl ? (
            <EmbedLivePlayer src={embedUrl} title={stream.stream?.title ?? "Nara Promotionz Live"} />
          ) : canShowPlayer ? (
            <HlsPlayer src={playbackUrl} poster={poster} title={stream.stream?.title ?? "Nara Promotionz Live"} live={stream.status === "live"} />
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
        </div>

        {canShowPlayer ? (
          <LiveChatPanel eventSlug={eventSlug} />
        ) : (
          <aside className="grid content-start gap-4">
            <div className="info-panel">
              <Radio size={22} className="text-[#e1252b]" />
              <h3>Watch Status</h3>
              <p>{stream.access.message ?? (canShowPlayer ? "The broadcast is open. Settle in and enjoy the action." : copy.body)}</p>
            </div>
            <div className="info-panel">
              <Ticket size={22} className="text-[#d7b46a]" />
              <h3>Fight-Night Pass</h3>
              <p>Your Nara Promotionz ticket keeps your event access, live room, and replay path connected to your account.</p>
              {stream.access.requires_payment ? (
                <button type="button" onClick={() => setPaywallOpen(true)} className="mini-button w-fit">
                  Unlock access
                </button>
              ) : null}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
