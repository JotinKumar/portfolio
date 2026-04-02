import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleCardData } from "@/lib/server/queries";

const CARD_ACCENTS = ["#0088FF", "#D62F1F", "#40BD00", "#F5AF41"] as const;

export type ArchiveItem =
  | { type: "article"; article: ArticleCardData }
  | { type: "placeholder"; placeholder: { title: string; category: string; excerpt: string; href: string } };

export function ArchiveCard({ item, index }: { item: ArchiveItem; index: number }) {
  const isImageLeft = index % 2 === 0;
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  
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
      className="group block relative w-full h-[180px] mb-4 rounded-[8px] bg-white border border-[#ddd] overflow-hidden cursor-pointer shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-[2px] hover:shadow-md"
    >
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none transition-opacity duration-200"
        style={{ 
          backgroundImage: `linear-gradient(${isImageLeft ? "-70deg" : "-250deg"}, ${accent}, transparent 50%)` 
        }}
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
            className={`absolute top-[-20%] h-[140%] w-[50px] bg-white pointer-events-none z-0 transition-transform duration-200 ${
              isImageLeft ? "left-[-25px] rotate-[8deg]" : "right-[-25px] rotate-[-8deg]"
            }`}
          />

          <div className="relative z-10 space-y-1.5 min-w-0">
            <h3 className="font-serif text-[1.05rem] font-bold leading-[1.15] text-[#333] line-clamp-2">
              {title}
            </h3>
            <p className="font-sans text-[#888] text-[0.65rem] uppercase tracking-wider">
              {category}
            </p>
            <div 
              className="h-[4px] w-[40px] rounded-[5px] transition-all duration-200 ease-in-out group-hover:w-[60px]"
              style={{ backgroundColor: accent }}
            />
            <p className="text-[0.78rem] leading-snug text-[#424242] line-clamp-2">
              {excerpt}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-auto">
             <div className="flex gap-2">
               <span className="inline-block bg-[#F0F0F0] text-[#777] rounded-[2px] px-2 py-0.5 text-[0.6rem] font-medium">
                  {category}
               </span>
               {isArticle && (
                 <span className="inline-block bg-[#F0F0F0] text-[#777] rounded-[2px] px-2 py-0.5 text-[0.6rem] font-medium">
                    {item.article.readTime} min
                 </span>
               )}
             </div>
             <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.05em] text-[#3f352f] transition-colors group-hover:text-primary">
                Read
                <ArrowUpRight className="size-3" />
              </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
