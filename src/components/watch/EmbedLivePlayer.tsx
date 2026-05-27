"use client";

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
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="pointer-events-none absolute left-3 top-3 border border-[#e1252b]/60 bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
        Nara Promotionz Live
      </div>
    </div>
  );
}
