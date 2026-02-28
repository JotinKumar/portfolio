import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedArticleBySlug } from "@/lib/server/queries";
import type { Article } from "@/lib/db-types";

export const dynamic = "force-dynamic";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  let article: Article | null = null;

  try {
    article = await getPublishedArticleBySlug(slug);
  } catch {
    article = null;
  }

  if (!article) {
    return (
      <section className="py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Article not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This article does not exist or is not published yet.
            </p>
            <Link href="/articles" className="text-primary hover:underline">
              Back to all articles
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <article className="py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="space-y-4 mb-8">
          <Badge variant="secondary">{article.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
          <div className="text-sm text-muted-foreground">
            {new Date(article.publishedAt || article.createdAt).toLocaleDateString()} - {article.readTime} min read
          </div>
        </div>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap dark:prose-invert">
          {article.content}
        </div>
      </div>
    </article>
  );
}
