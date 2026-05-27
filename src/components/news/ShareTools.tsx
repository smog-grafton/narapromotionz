"use client";

import { Copy, Send, Share2 } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  title: string;
  url?: string;
};

export function ShareTools({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => url || (typeof window !== "undefined" ? window.location.href : ""), [url]);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap gap-2">
      <a className="icon-button" aria-label="Share on X" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">
        <Share2 size={17} />
      </a>
      <a className="icon-button" aria-label="Share on Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">
        <Share2 size={17} />
      </a>
      <a className="icon-button" aria-label="Share on LinkedIn" href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noreferrer">
        <Share2 size={17} />
      </a>
      <a className="icon-button" aria-label="Share on WhatsApp" href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer">
        <Send size={17} />
      </a>
      <button
        className="icon-button"
        type="button"
        aria-label="Copy story link"
        onClick={async () => {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        }}
      >
        <Copy size={17} />
      </button>
      {copied ? <span className="inline-flex items-center px-3 text-xs font-black uppercase tracking-[0.12em] text-[#d7b46a]">Link copied</span> : null}
    </div>
  );
}
