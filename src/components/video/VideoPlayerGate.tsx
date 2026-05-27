"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NaraVideoPlayer } from "@/components/video/NaraVideoPlayer";
import { useAuth } from "@/components/auth/AuthProvider";
import { getVideo } from "@/services/api";
import type { Video } from "@/types/platform";

type Props = {
  slug: string;
  initialVideo: Video;
  embedUrl?: string | null;
};

export function VideoPlayerGate({ slug, initialVideo, embedUrl }: Props) {
  const { token, loading } = useAuth();
  const [video, setVideo] = useState(initialVideo);

  useEffect(() => {
    if (loading || !token) return;

    let cancelled = false;

    getVideo(slug, token)
      .then((payload) => {
        if (!cancelled) setVideo(payload.video);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [loading, slug, token]);

  const playableSrc = video.hls_url ?? video.replay_url ?? video.video_url;
  const locked = video.can_watch === false || Boolean((video.is_premium || video.access_type !== "free") && !playableSrc && !embedUrl);
  const showEmbed = locked ? null : embedUrl;

  return (
    <div>
      <NaraVideoPlayer
        src={showEmbed ? null : playableSrc}
        poster={video.thumbnail_url}
        title={video.title}
        sourceType={video.source_type}
        youtubeEmbedUrl={showEmbed}
        premium={locked}
      />
      {locked ? (
        <div className="mt-4 grid gap-3 border border-[#d7b46a]/30 bg-[#171006] p-4 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-zinc-300">
            Unlock this premium Nara Promotionz video with a fight pass or confirmed event access.
          </p>
          <Link href="/subscriptions" className="primary-button justify-center">
            Choose fight pass
          </Link>
        </div>
      ) : null}
    </div>
  );
}
