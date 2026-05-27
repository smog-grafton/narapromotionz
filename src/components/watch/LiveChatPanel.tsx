"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquare, Pin, Send, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getLiveStreamComments, postLiveStreamComment } from "@/services/api";
import { cn } from "@/lib/utils";
import type { LiveStreamCommentsPayload } from "@/types/platform";

type Props = {
  eventSlug: string;
  className?: string;
  onClose?: () => void;
};

const emptyPayload: LiveStreamCommentsPayload = {
  settings: {
    comments_enabled: true,
    slow_mode_enabled: false,
    slow_mode_seconds: 15,
    require_login_to_comment: true,
  },
  pinned: [],
  comments: [],
};

export function LiveChatPanel({ eventSlug, className, onClose }: Props) {
  const { token, user } = useAuth();
  const [payload, setPayload] = useState<LiveStreamCommentsPayload>(emptyPayload);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allComments = useMemo(() => [...payload.pinned, ...payload.comments], [payload]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getLiveStreamComments(eventSlug).catch(() => emptyPayload);
      if (!cancelled) {
        setPayload(data);
        setLoading(false);
      }
    }

    load();
    const interval = window.setInterval(load, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [eventSlug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;

    if (!token) {
      setMessage("Sign in to join the Nara Promotionz live conversation.");
      return;
    }

    setPosting(true);
    setMessage(null);

    try {
      const comment = await postLiveStreamComment(eventSlug, body.trim(), token);
      setPayload((current) => ({ ...current, comments: [...current.comments, comment] }));
      setBody("");
    } catch {
      setMessage("We could not send that comment. Please try again in a moment.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <aside className={cn("flex max-h-[620px] min-h-[420px] flex-col border border-white/10 bg-[#0d0d0d] lg:sticky lg:top-24", className)}>
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-[#e1252b]" size={20} />
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">Fight Chat</h2>
          </div>
          {onClose ? (
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center border border-white/10 text-zinc-300 transition hover:border-[#e1252b] hover:text-white" aria-label="Close fight chat">
              <X size={16} />
            </button>
          ) : null}
        </div>
        {payload.settings.pinned_announcement ? (
          <p className="mt-3 border border-[#d7b46a]/30 bg-[#d7b46a]/10 p-3 text-xs font-bold leading-5 text-[#d7b46a]">
            {payload.settings.pinned_announcement}
          </p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <div className="grid h-full place-items-center text-zinc-400">
            <Loader2 className="animate-spin text-[#d7b46a]" />
          </div>
        ) : allComments.length ? (
          allComments.map((comment) => (
            <div key={comment.id} className={`border p-3 ${comment.is_pinned ? "border-[#d7b46a]/40 bg-[#d7b46a]/10" : "border-white/10 bg-black"}`}>
              <div className="flex items-center justify-between gap-3">
                <strong className="truncate text-xs uppercase tracking-[0.14em] text-white">{comment.user?.name ?? "Fight fan"}</strong>
                {comment.is_pinned ? <Pin size={14} className="shrink-0 text-[#d7b46a]" /> : null}
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-zinc-300">{comment.body}</p>
            </div>
          ))
        ) : (
          <div className="grid h-full place-items-center text-center">
            <p className="max-w-xs text-sm leading-6 text-zinc-400">The live room is open. Be the first to bring the fight-night energy.</p>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t border-white/10 p-3">
        {message ? <p className="mb-2 text-xs font-bold text-[#d7b46a]">{message}</p> : null}
        <div className="flex gap-2">
          <input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={!payload.settings.comments_enabled || posting}
            maxLength={500}
            className="min-h-11 flex-1 border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-[#e1252b]"
            placeholder={user ? "Join the live conversation" : "Sign in to comment"}
          />
          <button type="submit" disabled={!payload.settings.comments_enabled || posting || !body.trim()} className="grid h-11 w-11 place-items-center border border-[#e1252b] bg-[#e1252b] text-white disabled:cursor-not-allowed disabled:opacity-50">
            {posting ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
          </button>
        </div>
      </form>
    </aside>
  );
}
