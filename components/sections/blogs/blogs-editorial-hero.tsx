import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Eye, Heart, Mail, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/server/queries";

const articleDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatPublishedDate(article: ArticleCardData) {
  return articleDateFormatter.format(new Date(article.publishedAt || article.createdAt));
}

function StoryPill({
  category,
  date,
}: {
  category: string;
  date: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em]">
      <span
        className="rounded-full border border-white/30 bg-black/20 px-3 py-1 text-white backdrop-blur-sm"
      >
        {category}
      </span>
      <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-white/80">{date}</span>
    </div>
  );
}

function EditorialStoryCard({
  article,
  index,
  compact = false,
  className,
}: {
  article: ArticleCardData;
  index: number;
  compact?: boolean;
  className?: string;
}) {
  const publishedDate = formatPublishedDate(article);

  return (
    <Link
      href={`/blogs/${article.slug}`}
      className={cn(
        "group relative isolate block text-card-foreground transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out-quart)] hover:-translate-y-1",
        compact ? "min-h-[18rem] overflow-visible pr-9 pb-7" : "min-h-[24rem] overflow-hidden rounded-[2.2rem] border border-border/60 bg-card shadow-sm hover:border-primary/25 hover:shadow-lg lg:min-h-[35rem] sm:rounded-[2.8rem]",
        className
      )}
    >
      {compact ? (
        <>
          <div className="absolute inset-0 overflow-hidden rounded-[1.95rem] rounded-tr-[1.2rem] rounded-br-[2.8rem] border border-border/60 bg-card shadow-[0_12px_28px_rgba(59,40,30,0.12)]">
            <div className="absolute inset-0">
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 20rem"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(196,112,66,0.22),transparent_45%),linear-gradient(135deg,rgba(116,97,79,0.18),rgba(30,24,20,0.82))]" />
              )}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,28,24,0.08)_0%,rgba(35,28,24,0.2)_40%,rgba(24,18,16,0.9)_100%)]" />

            <div className="relative flex h-full flex-col justify-between p-4">
              <div className="flex items-start justify-between gap-3">
                <StoryPill category={article.category} date={publishedDate} />
              </div>

              <div className="max-w-[12rem] space-y-2">
                <p className="type-meta text-white/68">{String(index).padStart(3, "0")}</p>
                <h2 className="font-serif text-[clamp(1.8rem,1.6vw+1rem,2.7rem)] leading-[0.92] tracking-[-0.05em] text-white">
                  {article.title}
                </h2>
              </div>
            </div>
          </div>

          <span className="absolute bottom-0 right-0 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--background)_92%,white)] text-foreground shadow-[0_16px_30px_rgba(50,35,26,0.18)] transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight className="size-5" />
          </span>
        </>
      ) : (
        <>
          <div className="absolute inset-0">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="(max-width: 1280px) 100vw, 50rem"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(196,112,66,0.22),transparent_45%),linear-gradient(135deg,rgba(116,97,79,0.18),rgba(30,24,20,0.82))]" />
            )}
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,28,24,0.06)_0%,rgba(35,28,24,0.14)_36%,rgba(24,18,16,0.92)_100%)]" />

          <div className="relative flex h-full flex-col justify-between p-4 sm:p-5 lg:p-7">
            <div className="flex items-start justify-between gap-3">
              <StoryPill category={article.category} date={publishedDate} />
              <span className="type-meta text-white/70">{String(index).padStart(2, "0")}</span>
            </div>

            <div className="max-w-[16rem] space-y-3 sm:max-w-[28rem]">
              <h2 className="font-serif text-[clamp(2.7rem,4vw+1rem,4.85rem)] leading-[0.9] tracking-[-0.045em] text-white transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out-quart)] group-hover:translate-y-[-2px]">
                {article.title}
              </h2>

              <p className="type-body-lg max-w-[34ch] text-white/84">{article.excerpt}</p>
            </div>

            <div className="flex items-end justify-between gap-4">
              <p className="type-meta text-white/78">{article.readTime} min read</p>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[0_8px_24px_rgba(38,27,20,0.18)] transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out-quart)] group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
          </div>
        </>
      )}
    </Link>
  );
}

function LeadEditorialFeature({ article, index }: { article: ArticleCardData; index: number }) {
  const publishedDate = formatPublishedDate(article);
  const coverImageSrc = article.coverImage || "/images/placeholders/blog-card-placeholder.svg";
  const [month, day, year] = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  })
    .format(new Date(article.publishedAt || article.createdAt))
    .replace(",", "")
    .split(" ");

  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group relative block rounded-[2.35rem]"
      data-testid="featured-blog-card"
    >
      <div className="rounded-[2.1rem] bg-[linear-gradient(135deg,rgba(66,48,38,0.94),rgba(113,84,62,0.88))] p-5 pb-16 shadow-[0_28px_70px_rgba(41,28,21,0.22)] sm:p-7 sm:pb-20">
        <article className="relative mx-auto flex min-h-[20rem] w-full max-w-[58rem] flex-col overflow-visible rounded-[1.85rem] border border-[rgba(118,93,76,0.18)] bg-[linear-gradient(180deg,rgba(250,245,239,0.98),rgba(244,235,226,0.98))] text-foreground shadow-[0_18px_42px_rgba(25,16,12,0.22)] lg:min-h-[18rem] lg:flex-row">
          <div
            className="relative mx-4 -mt-5 h-[14rem] overflow-hidden rounded-[1.45rem] shadow-[0_16px_34px_rgba(26,17,12,0.28)] sm:mx-6 sm:h-[16rem] lg:-ml-4 lg:mr-0 lg:mt-[-1.35rem] lg:h-[18rem] lg:w-[24.5rem] lg:flex-shrink-0"
            data-testid="featured-blog-media"
          >
            <Image
              src={coverImageSrc}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 26rem"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
          </div>

          <div className="flex flex-1 flex-col px-5 pb-16 pt-5 sm:px-7 lg:pl-10 lg:pr-8 lg:pt-6">
            <div className="space-y-3">
              <h2 className="max-w-[24ch] font-serif text-[clamp(1.55rem,1.2vw+1.1rem,2.4rem)] leading-[1.02] tracking-[-0.05em] text-[color:oklch(0.3_0.018_38)] transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:-translate-y-0.5">
                {article.title}
              </h2>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(192,141,92,0.95),rgba(150,91,57,0.95))] px-1.5 py-1 pr-3 text-white shadow-[0_8px_18px_rgba(149,90,54,0.24)]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,248,240,0.9)] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[color:oklch(0.45_0.06_55)]">
                  J
                </span>
                <span className="type-meta text-[0.68rem] tracking-[0.14em] text-white/92">Jotin Journal</span>
              </div>

              <div className="border-t border-[rgba(132,106,87,0.22)]" />

              <p className="type-body line-clamp-5 max-w-[42ch] text-[0.92rem] leading-7 text-[color:oklch(0.42_0.018_42)]">
                {article.excerpt}
              </p>
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-0 flex h-14 items-center border-t border-[rgba(132,106,87,0.14)] bg-[linear-gradient(90deg,rgba(247,241,235,0.96),rgba(252,249,245,0.96))] px-5 sm:px-7 lg:px-6"
            data-testid="featured-blog-utility-strip"
          >
            <div className="flex min-w-[9rem] items-baseline gap-2 text-[color:oklch(0.78_0.01_40)]">
              <span className="font-serif text-[2.35rem] font-semibold leading-none tracking-[-0.05em]">{day}</span>
              <span className="type-meta text-[0.84rem] font-semibold uppercase tracking-[0.16em]">{month}</span>
              <span className="type-meta hidden text-[0.72rem] sm:inline">{year}</span>
            </div>

            <ul className="ml-2 flex items-center gap-4 text-[color:oklch(0.67_0.015_40)] sm:gap-5">
              {[Eye, Heart, Mail, Share2].map((Icon, iconIndex) => (
                <li key={iconIndex}>
                  <span className="flex items-center justify-center transition-colors duration-300 group-hover:text-primary">
                    <Icon className="size-[1.05rem]" />
                  </span>
                </li>
              ))}
            </ul>

            <div className="ml-auto hidden items-center gap-3 lg:flex">
              <span className="type-meta text-[color:oklch(0.55_0.014_42)]">{article.category}</span>
              <span className="type-meta text-[color:oklch(0.62_0.012_42)]">{publishedDate}</span>
              <span className="type-meta text-[color:oklch(0.62_0.012_42)]">{article.readTime} min read</span>
              <span className="type-meta text-[color:oklch(0.58_0.014_42)]">Feature {String(index).padStart(2, "0")}</span>
            </div>
          </div>
        </article>

        <span
          className="absolute bottom-7 right-[max(1.5rem,calc(50%-27.5rem+1.5rem))] z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(158,100,52,0.35),0_4px_14px_rgba(0,0,0,0.22)] transition-all duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.05] group-hover:-translate-y-1 group-hover:shadow-[0_18px_38px_rgba(158,100,52,0.42),0_6px_18px_rgba(0,0,0,0.24)]"
          data-testid="featured-blog-fab"
        >
          <ArrowDown className="size-5" />
        </span>
      </div>
    </Link>
  );
}

export function BlogsEditorialHero({
  title,
  subtitle,
  search,
  category,
  tag,
  topicsCount,
  publishedCount,
  categories,
  leadArticle,
  leftColumnArticles,
}: {
  title: string;
  subtitle: string;
  search?: string;
  category?: string;
  tag?: string;
  topicsCount: number;
  publishedCount: number;
  categories: string[];
  leadArticle?: ArticleCardData;
  leftColumnArticles: ArticleCardData[];
}) {
  return (
    <header className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-6">
      <div className="space-y-5">
        <div className="flex justify-center">
          <h1 className="flex items-end justify-center gap-x-4 text-center text-[clamp(2.6rem,6.2vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]">
            <span className="text-[color:oklch(0.18_0.015_40)] dark:text-[color:oklch(0.94_0.008_70)]">THINKING</span>
            <span className="text-transparent opacity-90 [-webkit-text-stroke:1.4px_oklch(0.38_0.01_40)] dark:opacity-100 dark:[-webkit-text-stroke:1.4px_oklch(0.82_0.01_70)]">
              OUT
            </span>
            <span className="text-[color:oklch(0.18_0.015_40)] dark:text-[color:oklch(0.94_0.008_70)]">LOUD</span>
          </h1>
        </div>

        <div
          className="flex flex-col gap-3 border-y border-border/65 py-4 lg:flex-row lg:items-center lg:justify-between"
          data-testid="blogs-editorial-utility"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="type-meta">
              <span className="text-foreground">{publishedCount}</span> post
            </span>
            <span className="type-meta">
              <span className="text-foreground">{topicsCount}</span> topic
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <form action="/blogs" className="contents">
              <label htmlFor="blogs-topic-select" className="sr-only">
                Browse topics
              </label>
              <select
                id="blogs-topic-select"
                name="category"
                defaultValue={category ?? ""}
                className="type-meta h-11 min-w-[12rem] rounded-full border border-border/70 bg-background/80 px-4 text-foreground outline-none transition-colors hover:border-border focus:border-primary"
                data-testid="blogs-topic-select"
              >
                <option value="">All topics</option>
                {categories.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>

              {tag ? <input type="hidden" name="tag" value={tag} /> : null}

              <div
                className="flex h-11 min-w-[18rem] items-center rounded-full border border-border/70 bg-background/80 pr-1 shadow-[0_8px_20px_rgba(43,28,22,0.04)]"
                data-testid="blogs-editorial-search"
              >
                <Input
                  id="blogs-search-inline"
                  name="search"
                  defaultValue={search ?? ""}
                  placeholder="Search"
                  className="h-full border-0 bg-transparent px-4 shadow-none focus-visible:ring-0"
                />
                <Button type="submit" size="icon" className="h-9 w-9 rounded-full">
                  <Search className="size-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[17.5rem_minmax(0,1fr)] xl:items-stretch">
        <div className="grid gap-4">
          {leftColumnArticles.map((article, index) => (
            <EditorialStoryCard
              key={article.id}
              article={article}
              index={index + 1}
              compact
              className={index === 0 ? "xl:mt-4" : ""}
            />
          ))}
        </div>

        <div className="grid gap-4">
          {leadArticle ? (
            <LeadEditorialFeature article={leadArticle} index={leftColumnArticles.length + 1} />
          ) : (
            <div className="flex min-h-[32rem] items-end rounded-[2.2rem] border border-border/60 bg-card/70 p-6 sm:rounded-[2.8rem]">
              <div className="max-w-[32rem] space-y-3">
                <p className="kicker text-muted-foreground">Journal</p>
                <h1 className="type-display max-w-[10ch] text-[clamp(3rem,4vw+1rem,5.6rem)]">{title}</h1>
                <p className="type-body-lg max-w-[44ch] text-muted-foreground">{subtitle}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
