import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "./article-card";
import type { Article } from "@/lib/db-types";

interface FeaturedArticlesProps {
  articles: Article[];
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Articles
          </h2>
          <Link href="/articles" passHref>
            <Button variant="outline">View All Articles</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
