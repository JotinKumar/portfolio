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
    title: "Systems, process, and technical writing",
    description:
      "The writing archive captures operating design, AI experimentation, and practical lessons from delivery work.",
    href: "/blogs",
    ctaLabel: "Browse Archive",
  },
  {
    eyebrow: "Field Notes",
    title: "Ideas behind the work",
    description:
      "Short notes and longer essays explain the thinking behind systems, products, and implementation choices.",
    href: "/blogs",
    ctaLabel: "Read All Blogs",
  },
  {
    eyebrow: "Recent Topics",
    title: "Strategy, AI, and process",
    description:
      "Expect writing shaped by delivery practice rather than filler content or trend summaries.",
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
              Essays on systems, AI, operating design, and the ideas shaping the work behind the portfolio.
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
