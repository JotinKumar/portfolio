import Link from 'next/link';
import Image from 'next/image';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import type { ArticleCardData } from '@/lib/server/queries';

interface ArticleCardProps {
  article: ArticleCardData;
  featured?: boolean;
}

const BLOG_CARD_PLACEHOLDER_IMAGE = '/images/placeholders/blog-card-placeholder.svg';
const BLOG_CARD_FALLBACK_EXCERPT = 'Open the article to read the full piece.';

function formatPublishedDate(article: ArticleCardData) {
  const sourceDate = article.publishedAt || article.createdAt;
  const parsedDate = sourceDate ? new Date(sourceDate) : null;

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatReadTime(readTime: number | null | undefined) {
  return `${String(Math.max(1, readTime ?? 1)).padStart(2, '0')} min read`;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const coverImageSrc = article.coverImage || BLOG_CARD_PLACEHOLDER_IMAGE;
  const publishedDate = formatPublishedDate(article);
  const readTimeLabel = formatReadTime(article.readTime);
  const excerpt = article.excerpt?.trim() || BLOG_CARD_FALLBACK_EXCERPT;

  if (featured) {
    return (
      <Link
        href={`/blogs/${article.slug}`}
        className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Card className="h-full overflow-hidden border-border/70 bg-card/90 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg [content-visibility:auto]">
          <div className="relative block aspect-[4/3] overflow-hidden border-b border-border/60 bg-muted">
            <Image
              src={coverImageSrc}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <Badge variant="outline" className="type-meta mb-4 w-fit border-white/25 bg-black/20 tracking-[0.08em] text-white backdrop-blur-sm">
                {article.category}
              </Badge>
              <h3 className="max-w-[12ch] font-serif text-[clamp(2rem,2vw+1rem,3.35rem)] leading-[0.95] tracking-[-0.04em] text-white">
                {article.title}
              </h3>
            </div>
          </div>
          <CardHeader className="flex-1 gap-4 pb-4 pt-5">
            <p className="type-body-lg max-w-[40ch] text-muted-foreground">
              {excerpt}
            </p>
          </CardHeader>
          <CardFooter className="justify-between gap-4 border-t border-border/60 pt-4 pb-6 text-muted-foreground">
            <div className="type-meta flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {publishedDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readTimeLabel}
              </span>
            </div>
            <span className="type-nav inline-flex items-center gap-2 text-foreground transition-colors group-hover:text-primary">
              Read essay
              <ArrowUpRight className="size-4" />
            </span>
          </CardFooter>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group relative isolate flex aspect-[5/6] w-full overflow-visible rounded-[1.35rem] text-card-foreground motion-reduce:transition-none hover:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [content-visibility:auto]"
    >
      <div
        className="absolute inset-x-0 top-0 z-10 h-full overflow-hidden rounded-[1.35rem] border border-border/55 bg-card/55 shadow-sm transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:z-40 group-hover:border-border/80 group-hover:shadow-[0_28px_60px_rgba(18,12,10,0.3)]"
        data-testid="article-card-shell"
      >
        <Image
          src={coverImageSrc}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-70" />
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 p-3.5 sm:p-4">
          <Badge
            variant="outline"
            className="rounded-full border-white/25 bg-white/14 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm"
          >
            {article.category}
          </Badge>
          <span className="type-meta text-white/80">{publishedDate}</span>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 z-20 p-3.5 transition-[bottom] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:bottom-[calc(50%+0.16rem)] sm:p-4 sm:group-hover:bottom-[calc(50%+0.2rem)]"
          data-testid="article-card-title-block"
        >
          <div className="max-w-[calc(100%-4.55rem)] space-y-1.5">
            <p
              className="type-meta text-white/50 transition-[font-size,line-height,transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[0.58rem] group-hover:leading-[1.2]"
              data-testid="article-card-readtime"
            >
              {readTimeLabel}
            </p>
            <h3
              className="font-serif text-[clamp(1.65rem,2vw,2.05rem)] leading-[0.95] tracking-[-0.04em] text-white transition-[font-size,line-height,letter-spacing] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[0.94rem] group-hover:leading-[1.06] group-hover:tracking-[-0.018em]"
              data-testid="article-card-title"
            >
              {article.title}
            </h3>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 h-1/2 translate-y-full overflow-hidden bg-black transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:translate-y-0"
          data-testid="article-card-surface"
        >
          <div className="flex h-full px-3.5 pb-3.5 pt-3.5 sm:px-4 sm:pb-4 sm:pt-4">
            <div className="flex h-full max-w-[30ch] items-start">
              {article.excerpt ? (
                <p
                  className="type-body invisible max-w-[24ch] overflow-hidden text-[0.84rem] leading-[1.55] text-white/85 opacity-0 transition-[opacity,visibility] duration-300 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:visible group-hover:opacity-100"
                  data-testid="article-card-excerpt"
                >
                  {excerpt}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 z-10 h-[3.2rem] w-[3.2rem] bg-[oklch(0.97_0.01_80)] [border-top-left-radius:1.72rem] sm:h-[3.35rem] sm:w-[3.35rem]">
          <span className="absolute -top-[0.72rem] right-0 h-[0.72rem] w-[0.72rem] rounded-br-[0.72rem] shadow-[10px_10px_0_10px_oklch(0.97_0.01_80)]" />
          <span className="absolute bottom-0 -left-[0.72rem] h-[0.72rem] w-[0.72rem] rounded-br-[0.72rem] shadow-[10px_10px_0_10px_oklch(0.97_0.01_80)]" />
        </div>

        <div className="absolute bottom-0 right-0 z-20 flex h-[3.2rem] w-[3.2rem] items-end justify-end sm:h-[3.35rem] sm:w-[3.35rem]">
          <span className="group/button mb-[0.12rem] mr-[0.12rem] flex h-[2.78rem] w-[2.78rem] items-center justify-center rounded-full bg-[oklch(0.23_0.015_45)] text-white shadow-[0_0_0_0_rgba(36,27,22,0)] transition-[transform,box-shadow,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:translate-x-[0.04rem] group-hover:translate-y-[-0.04rem] group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_10px_20px_rgba(18,12,10,0.18)] group-hover/button:scale-[1.04] group-hover/button:-translate-y-[0.08rem] group-hover/button:shadow-[0_12px_22px_rgba(18,12,10,0.22)]">
            <ArrowUpRight className="size-[1.02rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover/button:translate-x-[0.06rem] group-hover/button:-translate-y-[0.06rem] group-hover/button:rotate-[-4deg]" />
          </span>
        </div>
      </div>
    </Link>
  );
}

