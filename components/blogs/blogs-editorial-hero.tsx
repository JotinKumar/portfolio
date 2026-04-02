import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ArticleCardData } from "@/lib/server/queries";
import { FeaturedBlogLeadCard } from "@/components/blogs/featured-blog-lead-card";
import { ArticleCard } from "@/components/ui/article-card";

export function BlogsEditorialHero({
  title,
  subtitle,
  search,
  tag,
  topicsCount,
  publishedCount,
  leadArticle,
  leftColumnArticles,
}: {
  title: string;
  subtitle: string;
  search?: string;
  tag?: string;
  topicsCount: number;
  publishedCount: number;
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
            <div key={article.id} className={cn(index === 0 ? "xl:mt-4" : "")}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>

        <div className="grid gap-4">
          {leadArticle ? (
            <FeaturedBlogLeadCard article={leadArticle} />
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
