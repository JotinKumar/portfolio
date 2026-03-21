import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BlogsEditorialHero({
  title,
  subtitle,
  search,
  category,
  tag,
  topicsCount,
  publishedCount,
}: {
  title: string;
  subtitle: string;
  search?: string;
  category?: string;
  tag?: string;
  topicsCount: number;
  publishedCount: number;
}) {
  return (
    <header className="animate-in fade-in slide-in-from-bottom-3 duration-500 grid gap-8 border border-border/70 bg-card/72 p-5 md:p-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
      <div className="space-y-4">
        <p className="kicker text-muted-foreground">Journal</p>
        <h1 className="type-display max-w-[12ch] text-[clamp(3.2rem,4vw+1.2rem,5.6rem)]">{title}</h1>
        <p className="type-body-lg max-w-[48ch] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-5 border-t border-border/60 pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
        <form action="/blogs" className="grid gap-3">
          <label htmlFor="blogs-search" className="kicker text-muted-foreground">
            Search
          </label>
          <div className="flex gap-2">
            <Input
              id="blogs-search"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search essays, ideas, or topics"
              className="h-10 rounded-none"
            />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 border border-border/60 bg-background/70 p-4">
            <p className="kicker text-muted-foreground">Topics</p>
            <p className="type-section-title text-[1.75rem]">{topicsCount}</p>
          </div>
          <div className="space-y-1 border border-border/60 bg-background/70 p-4">
            <p className="kicker text-muted-foreground">Published</p>
            <p className="type-section-title text-[1.75rem]">{publishedCount}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
