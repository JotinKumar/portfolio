import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageContent } from "@/components/layout/page-primitives";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPageContent, getPublishedArticleCategories, getPublishedArticleTags, getPublishedArticles } from "@/lib/server/queries";
import type { Article } from "@/lib/db-types";
import { BlogsEditorialHero } from "@/components/blogs/blogs-editorial-hero";
import { BlogsTaxonomyRail } from "@/components/blogs/blogs-taxonomy-rail";
import { ArticleCard } from "@/components/ui/article-card";

export const dynamic = "force-dynamic";

interface BlogsPageProps {
  searchParams: Promise<{ category?: string; search?: string; tag?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  let articles: Article[] = [];
  let uniqueCategories: string[] = [];
  let uniqueTags: string[] = [];
  let pageContent: Awaited<ReturnType<typeof getPageContent>> = null;

  try {
    articles = (await getPublishedArticles(params.category, params.search, params.tag)) as Article[];
    uniqueCategories = await getPublishedArticleCategories();
    uniqueTags = await getPublishedArticleTags();
    pageContent = await getPageContent("ARTICLES");
  } catch {
    console.log("Database not available, using empty state");
  }

  const content = (pageContent?.content as Record<string, unknown> | null) ?? null;
  const defaultEmptyMessage =
    typeof content?.defaultEmptyMessage === "string" ? content.defaultEmptyMessage : "Blogs will appear here once they are published.";
  const tagLabel = typeof content?.tagLabel === "string" ? content.tagLabel : "Tag:";
  const leadArticle = articles[0];
  const heroLeftArticles = articles.slice(1, 3);
  const visualRowArticles = articles.slice(3, 6);
  const archiveArticles = articles.slice(6);

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <PageContent className="space-y-10 md:space-y-12">
        <BlogsEditorialHero
          title={pageContent?.title ?? "Thinking Out Loud"}
          subtitle={pageContent?.subtitle ?? ""}
          search={params.search}
          tag={params.tag}
          topicsCount={uniqueCategories.length}
          publishedCount={articles.length}
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
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_24rem] xl:items-start">
              <div className="space-y-12">
                {visualRowArticles.length > 0 || archiveArticles.length > 0 ? (
                  <section className="space-y-4">
                    <div className="space-y-2 border-b border-border/60 pb-4">
                      <p className="kicker text-muted-foreground uppercase tracking-widest text-[0.65rem] font-bold">Journal</p>
                      <h2 className="type-section-title text-[2.1rem] md:text-[2.8rem]">More writing from the journal.</h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 pt-4">
                      {[...visualRowArticles, ...archiveArticles].map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="xl:sticky xl:top-24">
                <BlogsTaxonomyRail 
                  categories={uniqueCategories} 
                  tags={uniqueTags} 
                  activeCategory={params.category}
                  activeTag={params.tag}
                />
              </aside>
            </div>
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
