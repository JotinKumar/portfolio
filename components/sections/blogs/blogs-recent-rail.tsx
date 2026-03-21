import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ArticleCardData } from "@/lib/server/queries";

export function BlogsRecentRail({ articles }: { articles: ArticleCardData[] }) {
  return (
    <section className="border border-border/70 bg-card/72 p-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="kicker text-muted-foreground">Recent Blogs</p>
          <h2 className="type-card-title text-[1.5rem]">Fresh from the archive</h2>
        </div>
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${article.slug}`}
                className="group block border-t border-border/60 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="space-y-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <h3 className="type-card-title text-[1.2rem] transition-colors group-hover:text-primary">{article.title}</h3>
                  <p className="type-body text-muted-foreground line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="type-body text-muted-foreground">Recent writing will appear here as more posts are published.</p>
          )}
        </div>
      </div>
    </section>
  );
}
