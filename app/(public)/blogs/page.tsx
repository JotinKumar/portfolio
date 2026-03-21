import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PageContent } from "@/components/layout/page-primitives";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPageContent, getPublishedArticleCategories, getPublishedArticles } from "@/lib/server/queries";
import type { Article } from "@/lib/db-types";
import { BlogsEditorialHero } from "@/components/sections/blogs/blogs-editorial-hero";
import { BlogsLeadStory } from "@/components/sections/blogs/blogs-lead-story";
import { BlogsRecentRail } from "@/components/sections/blogs/blogs-recent-rail";
import { BlogsTopicCluster } from "@/components/sections/blogs/blogs-topic-cluster";
import { ArticleCard } from "@/components/sections/article-card";

export const dynamic = "force-dynamic";

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
    console.log("Database not available, using empty state");
  }

  const content = (pageContent?.content as Record<string, unknown> | null) ?? null;
  const defaultEmptyMessage =
    typeof content?.defaultEmptyMessage === "string" ? content.defaultEmptyMessage : "Blogs will appear here once they are published.";
  const tagLabel = typeof content?.tagLabel === "string" ? content.tagLabel : "Tag:";
  const [featuredArticle, ...restArticles] = articles;
  const recentArticles = restArticles.slice(0, 3);
  const archiveArticles = restArticles.slice(3);

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <PageContent className="space-y-10">
        <BlogsEditorialHero
          title={pageContent?.title ?? "Blogs"}
          subtitle={pageContent?.subtitle ?? ""}
          search={params.search}
          category={params.category}
          tag={params.tag}
          topicsCount={uniqueCategories.length}
          publishedCount={articles.length}
        />

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
          <div className="flex flex-wrap items-center gap-2">
            <span className="type-meta text-muted-foreground">{tagLabel}</span>
            <Badge asChild>
              <Link href={`/blogs?tag=${encodeURIComponent(params.tag)}`}>#{params.tag}</Link>
            </Badge>
            <Link href="/blogs" className="type-nav text-muted-foreground transition-colors hover:text-foreground">
              {pageContent?.secondaryCta ?? "Clear"}
            </Link>
          </div>
        ) : null}

        {articles.length > 0 ? (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 grid gap-8 xl:grid-cols-[minmax(0,1.06fr)_22rem] xl:items-start">
              <BlogsLeadStory featuredArticle={featuredArticle} supportingArticles={archiveArticles.slice(0, 4)} />

              <aside className="space-y-6">
                <BlogsRecentRail articles={recentArticles} />
                <BlogsTopicCluster categories={uniqueCategories} activeCategory={params.category} />
              </aside>
            </div>

            {archiveArticles.length > 4 ? (
              <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-5 border-t border-border/70 pt-8">
                <div className="space-y-2">
                  <p className="kicker text-muted-foreground">Archive</p>
                  <h2 className="type-section-title text-[2rem] md:text-[2.4rem]">More writing from the journal.</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {archiveArticles.slice(4).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <div className="border border-border/70 bg-card/72 p-8 text-center">
            <h3 className="type-card-title mb-2 text-[1.7rem]">{pageContent?.emptyTitle ?? "No blogs found"}</h3>
            <p className="type-body text-muted-foreground">
              {params.search || params.category || params.tag
                ? pageContent?.emptyMessage ?? "Try adjusting your filters to see more blogs."
                : defaultEmptyMessage}
            </p>
          </div>
        )}
      </PageContent>
    </section>
  );
}
