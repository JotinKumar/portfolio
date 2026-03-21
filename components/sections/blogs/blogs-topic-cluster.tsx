import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function BlogsTopicCluster({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory?: string;
}) {
  return (
    <section className="border border-border/70 bg-card/72 p-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="kicker text-muted-foreground">Topics</p>
          <h2 className="type-card-title text-[1.5rem]">Browse by area</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant={activeCategory === category ? "default" : "outline"} asChild>
              <Link href={`/blogs?category=${encodeURIComponent(category)}`}>{category}</Link>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
