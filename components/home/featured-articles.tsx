import Link from "next/link";
import { BlogLeadCard } from "@/components/ui/blog-lead-card";
import { FeaturedArticlesSlider } from "@/components/blogs/featured-articles-slider";
import { type ArchiveItem } from "@/components/ui/archive-card";
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
  const secondaryItems: ArchiveItem[] = [
    ...secondaryArticles.map((article) => ({ type: "article" as const, article })),
    ...placeholders.slice(0, Math.max(0, 2 - secondaryArticles.length)).map((placeholder) => ({
      type: "placeholder" as const,
      placeholder: {
        title: placeholder.title,
        category: placeholder.eyebrow,
        excerpt: placeholder.description,
        href: placeholder.href
      }
    })),
  ];

  return (
    <section className="py-16 md:py-20 overflow-hidden">
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
        <div className="grid gap-12 lg:grid-cols-[1fr_450px] lg:items-start">
          <div className="lg:sticky lg:top-24">
            {featuredArticle ? (
              <BlogLeadCard article={featuredArticle} />
            ) : (
              <div className="h-[500px] w-full rounded-none bg-muted animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <FeaturedArticlesSlider items={secondaryItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
