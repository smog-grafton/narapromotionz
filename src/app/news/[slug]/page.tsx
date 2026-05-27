import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock3, Play, Ticket, UserRound } from "lucide-react";
import { RelatedBoxerCard, RelatedEventCard, RelatedVideoCard } from "@/components/news/ArticleContextCards";
import { NewsCard, articleCategory } from "@/components/news/NewsCard";
import { ShareTools } from "@/components/news/ShareTools";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDate, stripHtml } from "@/lib/utils";
import { getNewsArticle } from "@/services/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getNewsArticle(slug);
  const description = article.seo?.description || article.seo?.og_description || stripHtml(article.excerpt) || `${article.title} from Nara Promotionz.`;
  const image = article.seo?.og_image ?? article.featured_image_url ?? article.image_url ?? null;

  return {
    title: article.seo?.title || article.seo?.og_title || `${article.title} | Nara Promotionz News`,
    description,
    alternates: article.seo?.canonical ? { canonical: article.seo.canonical } : undefined,
    openGraph: {
      type: "article",
      title: article.seo?.og_title || article.seo?.title || article.title,
      description: article.seo?.og_description || description,
      images: image ? [{ url: image, alt: article.title }] : undefined,
      publishedTime: article.published_at ?? undefined,
      authors: article.author?.name ? [article.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo?.og_title || article.title,
      description: article.seo?.og_description || description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const { article, related = [], more_from_category = [] } = await getNewsArticle(slug);
  const articleHtml = article.body || article.content;
  const shareUrl = article.links?.frontend ?? article.seo?.canonical;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <SafeImage
          src={article.featured_image_url ?? article.image_url}
          fallbackSrc="/assets/images/banner/news_oagebanner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="section-kicker">{articleCategory(article)}</p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-none text-white sm:text-6xl lg:text-7xl">{article.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{stripHtml(article.excerpt)}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="tag">
                <CalendarDays size={14} />
                {formatDate(article.published_at)}
              </span>
              <span className="tag">
                <UserRound size={14} />
                {article.author?.name ?? "Nara Editorial"}
              </span>
              <span className="tag">
                <Clock3 size={14} />
                {article.reading_time ?? 3} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article>
          <div className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-[#171717]">
            <SafeImage
              src={article.featured_image_url ?? article.image_url}
              fallbackSrc="/assets/images/banner/news_oagebanner.jpg"
              alt={article.title}
              fill
              priority
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Share this ringside story</p>
            <ShareTools title={article.title} url={shareUrl ?? undefined} />
          </div>

          <div className="mt-8 border border-white/10 bg-[#101010] p-5 sm:p-8">
            {articleHtml ? (
              <div
                className="space-y-6 text-base leading-8 text-zinc-300 [&_a]:text-[#d7b46a] [&_blockquote]:border-l-4 [&_blockquote]:border-[#e1252b] [&_blockquote]:bg-black [&_blockquote]:p-5 [&_blockquote]:text-xl [&_blockquote]:font-bold [&_h2]:pt-4 [&_h2]:text-3xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:text-white [&_h3]:text-xl [&_h3]:font-black [&_h3]:uppercase [&_h3]:text-white [&_img]:w-full"
                dangerouslySetInnerHTML={{ __html: articleHtml }}
              />
            ) : (
              <p className="text-base leading-8 text-zinc-300">
                Stay close to Nara Promotionz for the full fight-night story, official updates, and ringside reaction from the next event.
              </p>
            )}
          </div>

          {article.related_event ? (
            <div className="mt-8 grid gap-5 border border-white/10 bg-[#100607] p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="section-kicker">Follow the Fight Night</p>
                <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-white">{article.related_event.name}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Secure your place for the next chapter and watch the action unfold live with Nara Promotionz.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/tickets" className="primary-button">
                  <Ticket size={18} />
                  Buy Ticket
                </Link>
                {article.related_event.streaming?.has_stream ? (
                  <Link href={`/watch?event=${article.related_event.slug}`} className="secondary-button">
                    <Play size={18} />
                    Watch
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="grid content-start gap-5">
          <RelatedEventCard event={article.related_event} />
          <RelatedBoxerCard boxer={article.related_boxer} />
          <RelatedVideoCard video={article.related_video} />

          <div className="info-panel">
            <h3>More from {articleCategory(article)}</h3>
            <div className="grid gap-3">
              {(more_from_category.length ? more_from_category : related).slice(0, 4).map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <strong className="clamp-2 block text-sm font-black uppercase leading-snug text-white">{item.title}</strong>
                  <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-zinc-500">{formatDate(item.published_at)}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {related.length ? (
        <section className="section-shell pt-0">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Keep Reading</p>
              <h2 className="section-title-tight">More ringside coverage</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {related.slice(0, 4).map((item) => (
              <NewsCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
