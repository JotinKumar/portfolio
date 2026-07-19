import { MagnifyingGlass as Search } from "@phosphor-icons/react/ssr";
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
          <h1 className="type-display flex flex-col items-center justify-center gap-y-1 text-center text-[clamp(2.35rem,12vw,3.1rem)] uppercase sm:flex-row sm:items-end sm:gap-x-2 sm:gap-y-0 sm:text-[clamp(2.6rem,6.2vw,5.4rem)] md:gap-x-4">
            <span className="text-foreground">THINKING</span>
            <span className="text-muted-foreground">
              OUT
            </span>
            <span className="text-foreground">LOUD</span>
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
                className="flex h-11 min-w-[18rem] items-center rounded-none border border-control-border bg-background/80 pr-1 shadow-sm transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50"
                data-testid="blogs-editorial-search"
              >
                <Input
                  id="blogs-search-inline"
                  name="search"
                  aria-label="Search articles"
                  defaultValue={search ?? ""}
                  placeholder="Search"
                  className="h-full border-0 bg-transparent px-4 shadow-none focus-visible:ring-0"
                />
                <Button type="submit" size="icon" aria-label="Search articles" className="h-9 w-9 rounded-none">
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
            <div className="flex min-h-[32rem] items-end rounded-[var(--radius-layout)] border border-border/60 bg-card/70 p-6">
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
