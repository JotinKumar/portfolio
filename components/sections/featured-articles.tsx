import Link from "next/link";
import { ArticleCard } from "./article-card";
import { FeaturePlaceholderCard } from "./feature-placeholder-card";
import type { ArticleCardData } from "@/lib/server/queries";

interface FeaturedArticlesProps {
  articles: ArticleCardData[];
  title: string;
  viewAllLabel: string;
}

const ARTICLE_PLACEHOLDERS = [
  {
    eyebrow: "Archive Preview",
    title: "More writing is on the way",
    description:
      "Fresh notes on systems, automation, and operating design will appear here as new essays are published.",
    href: "/blogs",
    ctaLabel: "Browse Archive",
  },
  {
    eyebrow: "Field Notes",
    title: "Working drafts and sharper takes",
    description:
      "Until the next featured post lands, the full blog archive is the best place to explore the thinking behind the work.",
    href: "/blogs",
    ctaLabel: "Read All Blogs",
  },
  {
    eyebrow: "Editorial Queue",
    title: "Strategy, AI, and process essays",
    description:
      "This column is reserved for deeper perspectives on operations, product thinking, and modern technical execution.",
    href: "/blogs",
    ctaLabel: "See What Is Live",
  },
] as const;

export function FeaturedArticles({ articles, title, viewAllLabel }: FeaturedArticlesProps) {
  const [featuredArticle, ...secondaryArticles] = articles;
  const placeholders = ARTICLE_PLACEHOLDERS.slice(0, Math.max(0, 3 - articles.length));
  const secondaryItems = [
    ...secondaryArticles.map((article) => ({ type: "article" as const, article })),
    ...placeholders.slice(0, Math.max(0, 2 - secondaryArticles.length)).map((placeholder) => ({
      type: "placeholder" as const,
      placeholder,
    })),
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="space-y-10 md:space-y-12">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <p className="kicker text-muted-foreground">Writing</p>
            <h2 className="type-section-title">{title}</h2>
            <p className="type-body-lg text-muted-foreground">
              Notes on systems, AI, operating design, and the thinking behind the work. This section should read like
              perspective, not a blog grid.
            </p>
          </div>
          <Link
            href="/blogs"
            className="type-nav inline-flex items-center self-start text-foreground transition-colors hover:text-primary lg:self-end"
          >
            {viewAllLabel}
          </Link>
        </header>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start">
          <div>
            {featuredArticle ? (
              <ArticleCard article={featuredArticle} featured />
            ) : (
              <FeaturePlaceholderCard
                eyebrow={ARTICLE_PLACEHOLDERS[0].eyebrow}
                title={ARTICLE_PLACEHOLDERS[0].title}
                description={ARTICLE_PLACEHOLDERS[0].description}
                href={ARTICLE_PLACEHOLDERS[0].href}
                ctaLabel={ARTICLE_PLACEHOLDERS[0].ctaLabel}
                minHeightClassName="min-h-[30rem]"
              />
            )}
          </div>
          <div className="grid gap-5">
            {secondaryItems.map((item) =>
              item.type === "article" ? (
                <ArticleCard key={item.article.id} article={item.article} />
              ) : (
                <FeaturePlaceholderCard
                  key={item.placeholder.title}
                  eyebrow={item.placeholder.eyebrow}
                  title={item.placeholder.title}
                  description={item.placeholder.description}
                  href={item.placeholder.href}
                  ctaLabel={item.placeholder.ctaLabel}
                  compact
                  minHeightClassName="min-h-[20rem]"
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
