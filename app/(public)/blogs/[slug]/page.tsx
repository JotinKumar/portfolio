import Link from "next/link";
import { BlogDetailShell } from "@/components/blogs/blog-detail-shell";
import { PageContent } from "@/components/layout/page-primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPreviewArticle } from "@/lib/preview-detail-content";
import { getPublishedArticleBySlug } from "@/lib/server/queries";
import type { Article } from "@/lib/db-types";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
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

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let article: Article | null = getPreviewArticle(slug);

  if (!article) {
    try {
      article = await getPublishedArticleBySlug(slug);
    } catch {
      article = null;
    }
  }

  if (!article) {
    return (
      <section className={PAGE_SECTION_Y_CLASS}>
        <PageContent>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Blog not found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This blog does not exist or is not published yet.
              </p>
              <Link href="/blogs" className="text-primary hover:underline">
                Back to all blogs
              </Link>
            </CardContent>
          </Card>
        </PageContent>
      </section>
    );
  }

  const publishedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString();
  const tags = parseTags(article.tags);

  return (
    <article className={PAGE_SECTION_Y_CLASS}>
      <BlogDetailShell
        title={article.title}
        category={article.category}
        authorName={article.authorName}
        authorAvatar={article.authorAvatar}
        excerpt={article.excerpt}
        publishedDate={publishedDate}
        readTime={article.readTime}
        tags={tags}
        coverImage={article.coverImage}
        content={article.content}
      />
    </article>
  );
}
