"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { WatchExperience } from "@/components/watch/WatchExperience";
import { getStream } from "@/services/api";
import type { StreamPayload } from "@/types/platform";

type Props = {
  eventSlug: string;
};

export function WatchRoomClient({ eventSlug }: Props) {
  const { token, loading: authLoading } = useAuth();
  const [stream, setStream] = useState<StreamPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStream() {
      if (authLoading) return;

      setLoading(true);

      const payload = await getStream(eventSlug, token ?? undefined);

      if (!cancelled) {
        setStream(payload);
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

  return <WatchExperience stream={stream} eventSlug={eventSlug} />;
}
