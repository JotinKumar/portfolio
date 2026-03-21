import { ArticleCard } from '@/components/sections/article-card';
import Link from "next/link";
import { PageContent, PageHeader } from "@/components/layout/page-primitives";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPageContent, getPublishedArticleCategories, getPublishedArticles } from '@/lib/server/queries';
import type { Article } from '@/lib/db-types';

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

interface BlogsPageProps {
  searchParams: Promise<{ category?: string; search?: string; tag?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  let articles: Article[] = [];
  let uniqueCategories: string[] = [];
  let pageContent: Awaited<ReturnType<typeof getPageContent>> = null;
  
  try {
    articles = (await getPublishedArticles(params.category, params.search, params.tag)) as Article[];
    uniqueCategories = await getPublishedArticleCategories();
    pageContent = await getPageContent("ARTICLES");
  } catch {
    console.log('Database not available, using empty state');
  }

  const content = (pageContent?.content as Record<string, unknown> | null) ?? null;
  const defaultEmptyMessage =
    typeof content?.defaultEmptyMessage === "string" ? content.defaultEmptyMessage : "Blogs will appear here once they are published.";
  const tagLabel = typeof content?.tagLabel === "string" ? content.tagLabel : "Tag:";

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <PageContent className="space-y-8">
        <PageHeader
          title={pageContent?.title ?? "Blogs"}
          subtitle={pageContent?.subtitle ?? ""}
        />

        {/* Filter Section */}
        {uniqueCategories.length > 0 && (
          <FilterTabs
            basePath="/blogs"
            allLabel={pageContent?.primaryCta ?? "All"}
            options={uniqueCategories.map((category) => ({ label: category, value: category }))}
            queryKey="category"
            activeValue={params.category}
            preservedQuery={{ search: params.search, tag: params.tag }}
          />
        )}

        {params.tag ? (
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">{tagLabel}</span>
            <Link
              href={`/blogs?tag=${encodeURIComponent(params.tag)}`}
              className="rounded-full bg-primary px-3 py-1 text-primary-foreground"
            >
              #{params.tag}
            </Link>
            <Link href="/blogs" className="text-muted-foreground underline hover:text-foreground">
              {pageContent?.secondaryCta ?? "Clear"}
            </Link>
          </div>
        ) : null}

        {/* Blogs Grid */}
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">{pageContent?.emptyTitle ?? "No blogs found"}</h3>
            <p className="text-muted-foreground">
              {params.search || params.category || params.tag
                ? pageContent?.emptyMessage ?? 'Try adjusting your filters to see more blogs.'
                : defaultEmptyMessage}
            </p>
          </div>
        )}
      </PageContent>
    </section>
  );
}
