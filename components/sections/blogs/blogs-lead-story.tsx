import { ArticleCard } from "@/components/sections/article-card";
import type { ArticleCardData } from "@/lib/server/queries";

export function BlogsLeadStory({
  featuredArticle,
  supportingArticles,
}: {
  featuredArticle?: ArticleCardData;
  supportingArticles: ArticleCardData[];
}) {
  return (
    <div className="space-y-6">
      {featuredArticle ? <ArticleCard article={featuredArticle} featured /> : null}

      {supportingArticles.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {supportingArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
