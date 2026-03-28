import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ArticleCardData } from "@/lib/server/queries";

const articleDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatPublishedDate(article: ArticleCardData) {
  return articleDateFormatter.format(new Date(article.publishedAt || article.createdAt));
}

export function BlogsRecentRail({ articles }: { articles: ArticleCardData[] }) {
  return (
    <section className="space-y-5 border-l border-border/60 pl-0 md:pl-6">
      <div className="space-y-2">
        <p className="kicker text-muted-foreground">Recent Reading</p>
        <h2 className="type-card-title text-[1.85rem]">A quieter digest of fresh essays and notes.</h2>
      </div>

      {articles.length > 0 ? (
        <div className="space-y-1">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blogs/${article.slug}`}
              className="group grid gap-4 border-t border-border/60 py-4 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_7.5rem] sm:items-center"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="type-meta text-muted-foreground">{article.readTime} min read</span>
                  <span className="type-meta text-muted-foreground">{formatPublishedDate(article)}</span>
                </div>
                <h3 className="font-serif text-[1.7rem] leading-[1.02] tracking-[-0.03em] transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="type-body max-w-[42ch] text-muted-foreground">{article.excerpt}</p>
              </div>

              <div className="relative hidden aspect-[1.08] overflow-hidden rounded-[1.55rem] border border-border/60 bg-muted sm:block">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,rgba(188,143,108,0.2),rgba(87,71,58,0.65))]" />
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="type-body text-muted-foreground">Recent writing will appear here as more posts are published.</p>
      )}
    </section>
  );
}
