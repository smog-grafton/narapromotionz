import Link from "next/link";
import { ArrowUpRight, CalendarDays, Flame, Newspaper } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, stripHtml } from "@/lib/utils";
import type { NewsArticle } from "@/types/platform";

type Props = {
  article: NewsArticle;
  variant?: "feature" | "compact" | "row";
  priority?: boolean;
};

export function articleCategory(article: NewsArticle) {
  return article.category?.name ?? article.categories?.[0]?.name ?? article.content_type ?? "News";
}

export function NewsCard({ article, variant = "compact", priority = false }: Props) {
  if (variant === "row") {
    return (
      <Link href={`/news/${article.slug}`} className="media-row group">
        <div className="relative h-28 w-32 shrink-0 overflow-hidden bg-[#171717] sm:h-32 sm:w-44">
          <SafeImage src={article.featured_image_url ?? article.image_url} fallbackSrc="/assets/images/events/event3.webp" alt={article.title} fill sizes="(min-width: 640px) 176px, 128px" className="object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7b46a]">
            <Newspaper size={13} />
            {articleCategory(article)}
          </p>
          <h3 className="clamp-2 mt-2 text-lg font-black uppercase leading-tight text-white">{article.title}</h3>
          <p className="clamp-2 mt-2 text-sm leading-6 text-zinc-400 max-sm:hidden">{stripHtml(article.excerpt)}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-500">{formatDate(article.published_at)} · {article.reading_time ?? 3} min read</p>
          <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#d7b46a]">
            Read more <ArrowUpRight size={13} />
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <Link href={`/news/${article.slug}`} className="news-lead group grid transition hover:border-[#e1252b] lg:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[360px] overflow-hidden bg-[#171717]">
          <SafeImage
            src={article.featured_image_url ?? article.image_url}
            fallbackSrc="/assets/images/banner/news_oagebanner.jpg"
            alt={article.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {article.is_breaking ? <span className="bg-[#e1252b] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">Breaking</span> : null}
            {article.is_editors_pick ? <span className="bg-[#d7b46a] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-black">Editor&apos;s Pick</span> : null}
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#d7b46a]">
            <Flame size={14} />
            {articleCategory(article)} · {formatDate(article.published_at)}
          </p>
          <h2 className="clamp-3 mt-4 text-4xl font-black uppercase leading-none text-white lg:text-5xl">{article.title}</h2>
          <p className="clamp-3 mt-4 text-sm leading-7 text-zinc-400">{stripHtml(article.excerpt)}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">
            Read the story <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug}`} className="video-card group grid min-h-full transition hover:border-[#e1252b] max-sm:grid-cols-[118px_1fr] max-sm:items-stretch">
      <div className="relative aspect-video overflow-hidden bg-[#171717] max-sm:aspect-auto max-sm:min-h-[132px]">
        <SafeImage
          src={article.featured_image_url ?? article.image_url}
          fallbackSrc="/assets/images/events/event3.webp"
          alt={article.title}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 118px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 bg-black/80 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#d7b46a] sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-xs">
          {articleCategory(article)}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-zinc-500 sm:text-xs sm:tracking-[0.14em]">
          <CalendarDays size={13} />
          {formatDate(article.published_at)} · {article.reading_time ?? 3} min read
        </p>
        <h3 className="clamp-2 mt-2 text-base font-black uppercase leading-tight text-white sm:mt-3 sm:text-2xl">{article.title}</h3>
        <p className="clamp-2 mt-2 text-xs leading-5 text-zinc-400 sm:clamp-3 sm:mt-3 sm:text-sm sm:leading-6">{stripHtml(article.excerpt)}</p>
      </div>
    </Link>
  );
}
