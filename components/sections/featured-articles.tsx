import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "./article-card";
import type { ArticleCardData } from "@/lib/server/queries";

interface FeaturedArticlesProps {
  articles: ArticleCardData[];
  title: string;
  viewAllLabel: string;
}

export function FeaturedArticles({ articles, title, viewAllLabel }: FeaturedArticlesProps) {
  return (
    <section className="py-10 md:py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          <Link href="/blogs" passHref>
            <Button variant="outline">{viewAllLabel}</Button>
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
