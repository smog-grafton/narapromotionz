import Link from "next/link";
import { Radio } from "lucide-react";
import type { NewsArticle } from "@/types/platform";

type Props = {
  articles: NewsArticle[];
};

export function BreakingStrip({ articles }: Props) {
  const items = articles.slice(0, 5);

  if (!items.length) return null;

  return (
    <section className="border-y border-white/10 bg-[#100607]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="flex shrink-0 items-center gap-2 bg-[#e1252b] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
          <Radio size={14} />
          Ringside Wire
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {items.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="shrink-0 border border-white/10 bg-black/50 px-4 py-2 text-sm font-bold text-zinc-100 transition hover:border-[#d7b46a] hover:text-[#d7b46a]">
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
