"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { WatchExperience } from "@/components/watch/WatchExperience";
import { getActiveStream, getEvents, getStream } from "@/services/api";
import type { StreamPayload } from "@/types/platform";

type Props = {
  eventSlug?: string;
};

export function WatchRoomClient({ eventSlug }: Props) {
  const { token, loading: authLoading } = useAuth();
  const [stream, setStream] = useState<StreamPayload | null>(null);
  const [resolvedSlug, setResolvedSlug] = useState(eventSlug ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStream() {
      if (authLoading) return;

      setLoading(true);

      let slug = eventSlug;

      if (!slug) {
        const active = await getActiveStream(token ?? undefined).catch(() => null);

        if (active?.event && active.stream) {
          if (!cancelled) {
            setStream(active.stream);
            setResolvedSlug(active.event?.slug ?? "");
            setLoading(false);
          }
          return;
        }

        slug = active?.event?.slug;
      }

      if (!slug) {
        const upcoming = await getEvents({ status: "upcoming", per_page: 1 }).catch(() => ({ data: [] }));
        slug = upcoming.data[0]?.slug;
      }

      if (!slug) {
        const anyEvent = await getEvents({ per_page: 1 }).catch(() => ({ data: [] }));
        slug = anyEvent.data[0]?.slug;
      }

      if (!slug) {
        if (!cancelled) {
          setStream({
            status: "unavailable",
            access: {
              authenticated: Boolean(token),
              can_watch_live: false,
              can_watch_replay: false,
              reason: "stream_unavailable",
              requires_payment: false,
              message: "The next Nara Promotionz live room will appear here as soon as a fight night is ready.",
            },
            stream: null,
          });
          setResolvedSlug("");
          setLoading(false);
        }
        return;
      }

      const payload = await getStream(slug, token ?? undefined);
      const normalizedPayload = token && payload.access.reason === "login_required"
        ? {
            ...payload,
            access: {
              ...payload.access,
              authenticated: true,
              reason: "ticket_required",
              requires_payment: true,
              message: payload.access.message ?? "Choose a fight-night pass to unlock this live room.",
            },
          }
        : payload;

      if (!cancelled) {
        setStream(normalizedPayload);
        setResolvedSlug(slug);
        setLoading(false);
      }
    }

    loadStream();

    return () => {
      cancelled = true;
    };
  }, [authLoading, eventSlug, token]);

  if (authLoading || loading || !stream) {
    return (
      <section className="section-shell">
        <div className="grid min-h-[360px] place-items-center border border-white/10 bg-[#101010] p-8 text-center">
          <div>
            <Loader2 className="mx-auto animate-spin text-[#d7b46a]" size={34} />
            <h2 className="mt-5 text-3xl font-black uppercase text-white">Opening the live room</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">Your fight-night access is being checked so the broadcast opens in the right place.</p>
          </div>
        </div>
      </section>
    );
  }

  return <WatchExperience stream={stream} eventSlug={resolvedSlug || eventSlug || ""} />;
}
