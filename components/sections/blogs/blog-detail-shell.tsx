import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { PageContent } from "@/components/layout/page-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BlogDetailShellProps = {
  title: string;
  category: string;
  excerpt?: string | null;
  publishedDate: string;
  readTime: number;
  tags: string[];
  coverImage?: string | null;
  content: string;
};

export function BlogDetailShell({
  title,
  category,
  excerpt,
  publishedDate,
  readTime,
  tags,
  coverImage,
  content,
}: BlogDetailShellProps) {
  return (
    <PageContent className="grid gap-8 xl:grid-cols-[minmax(13rem,0.22fr)_minmax(0,0.78fr)] xl:items-start">
      <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start" data-testid="blog-meta-rail">
        <Button variant="outline" size="sm" asChild>
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>

        <section className="space-y-4 border border-border/70 bg-card/68 p-5">
          <div className="space-y-1">
            <p className="kicker text-muted-foreground">Filed Under</p>
            <Badge variant="secondary" className="w-fit">
              {category}
            </Badge>
          </div>

          <div className="space-y-3 border-t border-border/60 pt-4 text-muted-foreground">
            <div>
              <p className="type-meta">Published</p>
              <p className="type-body mt-1 inline-flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {publishedDate}
              </p>
            </div>
            <div>
              <p className="type-meta">Reading time</p>
              <p className="type-body mt-1 inline-flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {readTime} min read
              </p>
            </div>
          </div>
        </section>

        {tags.length > 0 ? (
          <section className="space-y-4 border border-border/70 bg-card/68 p-5">
            <div className="space-y-1">
              <p className="kicker text-muted-foreground">Tags</p>
              <h2 className="type-card-title text-[1.3rem]">Explore nearby ideas</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="hover:bg-accent">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </aside>

      <article className="space-y-10" data-testid="blog-article-body">
        <div className="space-y-4">
          <p className="kicker text-muted-foreground">Journal Entry</p>
          <h1 className="type-section-title max-w-[16ch] text-[2.65rem] leading-[0.92] md:text-[4.4rem]">
            {title}
          </h1>
          {excerpt ? <p className="type-body-lg max-w-[44rem] text-muted-foreground">{excerpt}</p> : null}
        </div>

        {coverImage ? (
          <figure
            className="grid gap-4 border border-border/70 bg-card/56 p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(14rem,0.9fr)] md:items-end"
            data-testid="blog-supporting-media"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 38rem"
                className="object-cover"
              />
            </div>
            <figcaption className="space-y-2">
              <p className="kicker text-muted-foreground">Supporting Visual</p>
              <p className="type-body text-muted-foreground">
                A small visual reference that complements the writing instead of taking over the page.
              </p>
            </figcaption>
          </figure>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6">
            <div className="type-body text-[1.04rem] leading-8 text-muted-foreground whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
      </article>
    </PageContent>
  );
}
