import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon, LayoutGrid } from "lucide-react";

export function BlogsTaxonomyRail({
  categories,
  tags,
  activeCategory,
  activeTag,
}: {
  categories: string[];
  tags: string[];
  activeCategory?: string;
  activeTag?: string;
}) {
  return (
    <section className="space-y-8 border-l border-border/60 pl-0 md:pl-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="kicker text-muted-foreground uppercase tracking-widest text-[0.65rem] font-bold">Discovery</p>
          <h2 className="type-card-title text-[1.85rem] font-serif leading-none">Browse by topics / tags</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-foreground/40 font-sans">
              <LayoutGrid className="size-3" />
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat} href={`/blogs?category=${encodeURIComponent(cat)}`}>
                  <Badge 
                    variant={activeCategory === cat ? "default" : "outline"}
                    className="px-3 py-1 text-[0.7rem] font-bold tracking-tight transition-all hover:bg-primary/10 hover:border-primary/30 active:scale-95"
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-foreground/40 font-sans">
              <TagIcon className="size-3" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>
                  <Badge 
                    variant={activeTag === tag ? "default" : "secondary"}
                    className="px-3 py-1 text-[0.65rem] font-bold transition-all hover:bg-primary/5 hover:text-primary active:scale-95"
                  >
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
