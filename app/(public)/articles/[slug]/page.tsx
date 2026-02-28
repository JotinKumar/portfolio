import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedArticleBySlug } from "@/lib/server/queries";
import type { Article } from "@/lib/db-types";

export const dynamic = "force-dynamic";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

const parseTags = (raw: string): string[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((tag) => String(tag).trim()).filter(Boolean);
    }
  } catch {
    // Fallback to comma-separated parsing.
  }

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

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

  const publishedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString();
  const tags = parseTags(article.tags);

  return (
    <article className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div>

        <header className="space-y-5 rounded-2xl border bg-card/70 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{article.category}</Badge>
            {tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/articles?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="hover:bg-accent">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {publishedDate}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} min read
            </span>
          </div>
        </header>

        <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border bg-muted">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
              <FileText className="h-8 w-8" />
              <span className="text-xs uppercase tracking-widest">Article</span>
            </div>
          )}
        </div>

        <div className="prose prose-neutral max-w-none rounded-2xl border bg-background/80 p-6 whitespace-pre-wrap dark:prose-invert md:p-8">
          {article.content}
        </div>

        {tags.length > 0 ? (
          <section className="space-y-3 rounded-2xl border bg-card/60 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Explore by tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag} href={`/articles?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className="px-3 py-1 hover:bg-accent">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}