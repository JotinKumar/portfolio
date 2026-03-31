import { ArchiveCard } from "./archive-card";
import type { ArticleCardData } from "@/lib/server/queries";

type SecondaryRailItem =
  | {
      type: "article";
      article: ArticleCardData;
    }
  | {
      type: "placeholder";
      placeholder: {
        eyebrow: string;
        title: string;
        description: string;
        href: string;
        ctaLabel: string;
      };
    };

export function FeaturedArticlesSlider({ items }: { items: SecondaryRailItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full" data-testid="home-secondary-blogs-rail">
      <p className="type-meta text-muted-foreground mb-4">More from the archive</p>
      
      {/* Mobile/Tablet: Horizontal Scroll */}
      <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide">
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-[90vw] sm:w-[500px] snap-center">
            {item.type === "article" ? (
              <ArchiveCard article={item.article} index={index} />
            ) : (
              <div className="h-[300px] w-full rounded-[10px] bg-muted flex items-center justify-center border-2 border-dashed">
                <p className="type-meta text-muted-foreground">{item.placeholder.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: Vertical Stack */}
      <div className="hidden lg:flex flex-col gap-2">
        {items.map((item, index) =>
          item.type === "article" ? (
            <ArchiveCard key={item.article.id} article={item.article} index={index} />
          ) : (
            <div key={index} className="h-[300px] w-full rounded-[10px] bg-muted flex items-center justify-center border-2 border-dashed">
                <p className="type-meta text-muted-foreground">{item.placeholder.title}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
