import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleCardData } from "@/lib/server/queries";

export type ArchiveItem =
  | { type: "article"; article: ArticleCardData }
  | { type: "placeholder"; placeholder: { title: string; category: string; excerpt: string; href: string } };

export function ArchiveCard({ item, index }: { item: ArchiveItem; index: number }) {
  const isImageLeft = index % 2 === 0;
  
  const isArticle = item.type === "article";
  const title = isArticle ? item.article.title : item.placeholder.title;
  const category = isArticle ? item.article.category : item.placeholder.category;
  const excerpt = isArticle ? item.article.excerpt : item.placeholder.excerpt;
  const href = isArticle ? `/blogs/${item.article.slug}` : item.placeholder.href;
  const coverImageSrc = isArticle ? (item.article.coverImage || "/images/placeholders/blog-card-placeholder.svg") : null;

  return (
    <Link
      href={href}
      data-testid={`home-secondary-blog-card-${index}`}
      data-image-side={isImageLeft ? "left" : "right"}
      className="group relative mb-4 block h-[180px] w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-border/70 bg-card shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-[2px] hover:shadow-md"
    >
      <div 
        className={`pointer-events-none absolute inset-0 opacity-[0.08] transition-opacity duration-200 ${
          isImageLeft
            ? "bg-gradient-to-br from-primary/70 via-primary/10 to-transparent"
            : "bg-gradient-to-bl from-primary/70 via-primary/10 to-transparent"
        }`}
      />

      <div className="absolute inset-0 flex">
        {/* Image Section */}
        <div 
          className={`relative h-full w-[160px] overflow-hidden transition-transform duration-200 ease-in-out flex-shrink-0 ${isImageLeft ? "order-1" : "order-2"} ${!coverImageSrc ? "bg-muted/30" : ""}`}
        >
          {coverImageSrc ? (
            <Image
              src={coverImageSrc}
              alt={title}
              fill
              sizes="160px"
              className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-[1.05] group-hover:rotate-[1deg]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground/50">Preview</span>
            </div>
          )}
        </div>

        {/* Text Section */}
        <div 
          className={`relative h-full flex-1 flex flex-col justify-between px-5 py-4 min-w-0 ${isImageLeft ? "order-2" : "order-1"}`}
        >
          {/* Slashed Geometry Decorator */}
          <div 
            aria-hidden="true"
            className={`pointer-events-none absolute top-[-20%] z-0 h-[140%] w-[50px] bg-card transition-transform duration-200 ${
              isImageLeft ? "left-[-25px] rotate-[8deg]" : "right-[-25px] rotate-[-8deg]"
            }`}
          />

          <div className="relative z-10 space-y-1.5 min-w-0">
            <h3 className="type-card-title line-clamp-2 text-[1.05rem] leading-[1.15] text-foreground">
              {title}
            </h3>
            <p className="type-meta text-muted-foreground">
              {category}
            </p>
            <div className="h-[4px] w-[40px] rounded-none bg-primary transition-all duration-200 ease-in-out group-hover:w-[60px]" />
            <p className="type-body line-clamp-2 text-[0.78rem] leading-snug text-muted-foreground">
              {excerpt}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-auto">
             <div className="flex gap-2">
               <span className="type-meta inline-block rounded-none bg-muted px-2 py-0.5 text-muted-foreground">
                  {category}
               </span>
               {isArticle && (
                 <span className="type-meta inline-block rounded-none bg-muted px-2 py-0.5 text-muted-foreground">
                    {item.article.readTime} min
                 </span>
               )}
             </div>
             <span className="type-nav inline-flex items-center gap-1 rounded-none text-foreground transition-colors group-hover:text-primary">
                Read
                <ArrowUpRight className="size-3" />
              </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
