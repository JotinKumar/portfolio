import { ArchiveCard, type ArchiveItem } from "@/components/ui/archive-card";

export function FeaturedArticlesSlider({ items }: { items: ArchiveItem[] }) {
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
            <ArchiveCard item={item} index={index} />
          </div>
        ))}
      </div>

      {/* Desktop: Vertical Stack */}
      <div className="hidden lg:flex flex-col gap-0">
        {items.map((item, index) => (
          <ArchiveCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
