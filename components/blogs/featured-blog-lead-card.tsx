import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleCardData } from "@/lib/server/queries";

export function FeaturedBlogLeadCard({
  article,
  hrefPrefix = "/blogs",
}: {
  article: ArticleCardData;
  hrefPrefix?: string;
}) {
  const coverImageSrc = article.coverImage || "/images/placeholders/blog-card-placeholder.svg";
  const [month, day] = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  })
    .format(new Date(article.publishedAt || article.createdAt))
    .replace(",", "")
    .split(" ");

  return (
    <Link
      href={`${hrefPrefix}/${article.slug}`}
      className="group relative block h-full"
      data-testid="featured-blog-card"
    >
      <div className="rounded-[2.4rem] bg-muted/40 dark:bg-[color:oklch(0.23_0.02_45)] px-0 py-8 transition-shadow duration-500 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] dark:group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.18)] sm:px-0 lg:px-0 h-full flex flex-col">
        <article className="relative mx-auto flex w-full max-w-[64rem] flex-col overflow-visible rounded-[0.25rem] border border-white/10 bg-card text-foreground shadow-[0_32px_80px_rgba(0,0,0,0.12)] lg:flex-row flex-1">
          <div
            className="relative mx-4 -mt-12 aspect-square overflow-hidden rounded-none border-[6px] border-white/10 shadow-[0_28px_56px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:-translate-y-1 sm:mx-6 lg:ml-10 lg:mr-0 lg:mt-[-2.5rem] lg:h-[24rem] lg:w-[24rem] lg:flex-shrink-0"
            data-testid="featured-blog-media"
          >
            <Image
              src={coverImageSrc}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 24rem"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
          </div>

          <div className="flex flex-1 flex-col px-6 pb-36 pt-10 sm:px-8 lg:pl-14 lg:pr-16 lg:pt-14">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-primary font-sans">
                  {article.category}
                </span>
                <span className="rounded-full bg-muted/60 border border-border/40 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted-foreground font-sans">
                  {article.readTime} min read
                </span>
              </div>

              <div className="space-y-5">
                <h2 className="max-w-[22ch] font-serif text-[clamp(1.95rem,3.2vw+0.8rem,3.6rem)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:-translate-y-0.5">
                  {article.title}
                </h2>
              </div>

              <div className="w-full border-t border-border/50" />

              <p className="type-body line-clamp-6 max-w-[46ch] text-[1.08rem] leading-relaxed text-muted-foreground/90 font-sans">
                {article.excerpt}
              </p>
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-0 flex h-32 items-end pb-10 px-6 sm:px-8 lg:px-14"
            data-testid="featured-blog-utility-strip"
          >
            <div className="flex items-center gap-14" data-testid="featured-blog-date">
              <div className="flex flex-col items-start leading-none font-serif">
                <span className="text-[4.8rem] font-bold text-foreground/[0.08] leading-none">{day}</span>
                <span className="type-meta -mt-1 text-[0.8rem] font-black uppercase tracking-[0.35em] text-foreground/50 font-sans">{month}</span>
              </div>
            </div>

            <div className="ml-auto hidden lg:flex items-end gap-3 pb-1">
              <div className="flex flex-col items-end pb-1.5">
                <span className="type-meta text-[0.72rem] font-bold tracking-[0.1em] text-foreground/90 font-sans">{article.authorName}</span>
              </div>
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border/60 shadow-sm bg-muted flex items-center justify-center">
                {article.authorAvatar ? (
                  <Image src={article.authorAvatar} alt={article.authorName} fill className="object-cover" />
                ) : (
                  <span className="text-[0.75rem] font-bold uppercase text-foreground/40">{(article.authorName ?? "J").charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
        </article>

        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-10 z-30 flex h-[2.78rem] w-[2.78rem] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(0,0,0,0.18)] transition-all duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.04] group-hover:shadow-[0_12px_22px_rgba(0,0,0,0.22)] lg:bottom-[3.25rem]"
          data-testid="featured-blog-fab"
        >
          <ArrowUpRight className="size-[1.02rem] transition-transform duration-500 group-hover:translate-x-[0.06rem] group-hover:-translate-y-[0.06rem] group-hover:rotate-[-4deg]" />
        </span>
      </div>
    </Link>
  );
}
