import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageContent } from "@/components/layout/page-primitives";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPageContent, getPublishedArticleCategories, getPublishedArticles } from "@/lib/server/queries";
import type { Article } from "@/lib/db-types";
import { BlogsEditorialHero } from "@/components/sections/blogs/blogs-editorial-hero";
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
  const heroLeftArticles = articles.slice(0, 2);
  const leadArticle = articles[2];
  const visualRowArticles = articles.slice(4, 7);
  const recentArticles = articles.slice(7, 10);
  const archiveArticles = articles.slice(10);
  const topicPreviews = uniqueCategories.slice(0, 8).map((entry) => ({
    category: entry,
    href: `/blogs?category=${encodeURIComponent(entry)}`,
    image: articles.find((article) => article.category === entry)?.coverImage ?? null,
  }));

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <PageContent className="space-y-10 md:space-y-12">
        <BlogsEditorialHero
          title={pageContent?.title ?? "Thinking Out Loud"}
          subtitle={pageContent?.subtitle ?? ""}
          search={params.search}
          category={params.category}
          tag={params.tag}
          topicsCount={uniqueCategories.length}
          publishedCount={articles.length}
          categories={uniqueCategories}
          leadArticle={leadArticle}
          leftColumnArticles={heroLeftArticles}
        />

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
            <BlogsTopicCluster topics={topicPreviews} activeCategory={params.category} />

            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_24rem] xl:items-start">
              <div className="space-y-6">
                {visualRowArticles.length > 0 ? (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <p className="kicker text-muted-foreground">Visual Notes</p>
                      <h2 className="type-section-title text-[2.1rem] md:text-[2.8rem]">A curated run of images, observations, and longer thoughts.</h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {visualRowArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                ) : null}

                {archiveArticles.length > 0 ? (
                  <section className="space-y-5 border-t border-border/70 pt-8">
                    <div className="space-y-2">
                      <p className="kicker text-muted-foreground">Archive</p>
                      <h2 className="type-section-title text-[2rem] md:text-[2.45rem]">More writing from the journal.</h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      {archiveArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="xl:sticky xl:top-24">
                <BlogsRecentRail articles={recentArticles} />
              </aside>
            </div>

            {visualRowArticles.length === 0 && archiveArticles.length === 0 ? (
              <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-5 border-t border-border/70 pt-8">
                <div className="space-y-2">
                  <p className="kicker text-muted-foreground">Archive</p>
                  <h2 className="type-section-title text-[2rem] md:text-[2.4rem]">More writing will appear as the journal grows.</h2>
                </div>
                <p className="type-body text-muted-foreground">There are no additional archive entries beyond the featured editorial selection yet.</p>
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
