import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleCardData } from "@/lib/server/queries";

const CARD_ACCENTS = ["#0088FF", "#D62F1F", "#40BD00", "#F5AF41"] as const;

export function ArchiveCard({ article, index }: { article: ArticleCardData; index: number }) {
  const isImageLeft = index % 2 === 0;
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const coverImageSrc = article.coverImage || "/images/placeholders/blog-card-placeholder.svg";

  return (
    <Link
      href={`/blogs/${article.slug}`}
      data-testid={`home-secondary-blog-card-${index}`}
      data-image-side={isImageLeft ? "left" : "right"}
      className="group block relative w-full h-[300px] mb-6 rounded-[10px] bg-white border-2 border-[#ddd] overflow-hidden cursor-pointer shadow-[0_4px_21px_-12px_rgba(0,0,0,0.66)] transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_34px_32px_-33px_rgba(0,0,0,0.18)]"
    >
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none transition-opacity duration-200"
        style={{ 
          backgroundImage: `linear-gradient(${isImageLeft ? "-70deg" : "-250deg"}, ${accent}, transparent 50%)` 
        }}
      />

      <div className="absolute inset-0">
        <div 
          className={`absolute top-0 bottom-0 w-[400px] overflow-hidden transition-transform duration-200 ease-in-out ${isImageLeft ? "left-0" : "right-0"}`}
        >
          <Image
            src={coverImageSrc}
            alt={article.title}
            fill
            sizes="400px"
            className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-[1.05] group-hover:rotate-[1deg]"
          />
        </div>

        <div 
          className={`absolute top-[7%] bottom-[7%] w-[calc(100%-470px)] flex flex-col justify-between ${isImageLeft ? "left-[430px]" : "right-[430px]"}`}
        >
          <div 
            aria-hidden="true"
            className={`absolute top-[-20%] h-[140%] w-[60px] bg-white rotate-[8deg] pointer-events-none z-0 ${isImageLeft ? "left-[-55px]" : "right-[-55px]"}`}
          />

          <div className="relative z-10 space-y-2">
            <h3 className="font-serif text-2xl font-bold leading-tight text-[#333]">
              {article.title}
            </h3>
            <p className="font-sans text-[#888] text-sm uppercase tracking-wider">
              {article.category}
            </p>
            <div 
              className="h-[5px] w-[50px] rounded-[5px] transition-all duration-200 ease-in-out group-hover:w-[70px]"
              style={{ backgroundColor: accent }}
            />
            <p className="text-[15px] leading-relaxed text-[#424242] line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="relative z-10 flex gap-4 mt-4">
             <span className="inline-block bg-[#E0E0E0] text-[#777] rounded-[3px] px-3 py-1 text-xs relative overflow-visible after:content-[''] after:absolute after:right-[-10px] after:top-0 after:border-y-[13px] after:border-y-transparent after:border-l-[10px] after:border-l-[#E0E0E0]">
                {article.category}
             </span>
             <span className="inline-block bg-[#E0E0E0] text-[#777] rounded-[3px] px-3 py-1 text-xs relative overflow-visible after:content-[''] after:absolute after:right-[-10px] after:top-0 after:border-y-[13px] after:border-y-transparent after:border-l-[10px] after:border-l-[#E0E0E0]">
                {article.readTime} min
             </span>
             <span className="ml-auto inline-flex items-center gap-1 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-[#3f352f] transition-colors group-hover:text-primary">
                Read Essay
                <ArrowUpRight className="size-3.5" />
              </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
