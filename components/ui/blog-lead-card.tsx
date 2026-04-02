"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Tag, Clock, ArrowRight } from "lucide-react";
import type { ArticleCardData } from "@/lib/server/queries";

interface BlogLeadCardProps {
  article: ArticleCardData;
}

export function BlogLeadCard({ article }: BlogLeadCardProps) {
  const publishedDate = article.publishedAt || article.createdAt;
  const dateLabel = publishedDate
    ? new Date(publishedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date TBD";

  const cardVariants = {
    initial: {},
    hover: {},
  };

  const titleVariants = {
    initial: { marginTop: "170px" },
    hover: { marginTop: "70px" },
  };

  const lineVariants = {
    initial: { width: "10%" },
    hover: { width: "80%" },
  };

  const infoVariants = {
    initial: { bottom: "-40px", opacity: 0 },
    hover: { bottom: "100px", opacity: 1 },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      className="relative block w-full overflow-hidden rounded-none shadow-lg h-[500px]"
    >
      <Link href={`/blogs/${article.slug}`} className="absolute inset-0 z-30" aria-label={`Read ${article.title}`} />
      
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1 }
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src={article.coverImage || "/images/placeholders/blog-card-placeholder.svg"}
          alt={article.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </motion.div>

      {/* Color Overlay */}
      <motion.div 
        className="absolute inset-0 z-10"
        variants={{
          initial: { backgroundColor: "rgba(64, 84, 94, 0.45)" },
          hover: { backgroundColor: "rgba(64, 64, 70, 0.8)" }
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-x-0 top-[350px] bottom-0 z-15 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Title Content */}
      <motion.div 
        className="absolute inset-x-0 top-0 z-20 flex flex-col items-center text-center px-6 pointer-events-none"
        variants={titleVariants}
        transition={{ duration: 0.6, ease: [0.33, 0.66, 0.66, 1] }}
      >
        <div className="relative inline-block">
          <h3 className="font-serif text-3xl md:text-3xl font-normal tracking-wide text-white drop-shadow-md">
            {article.title}
          </h3>
          {/* Animated Underline */}
          <motion.div 
            className="h-[2px] bg-[#BDA26B] mx-auto mt-5"
            variants={lineVariants}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 text-[#ddd] italic text-sm md:text-base font-serif">
          {article.category}
        </div>
      </motion.div>

      {/* Card Info (Excerpt) */}
      <motion.div 
        className="absolute inset-x-0 z-20 px-8 md:px-12 text-center pointer-events-none"
        variants={infoVariants}
        transition={{ duration: 0.64, ease: [0.33, 0.66, 0.66, 1] }}
      >
        <p className="text-white/90 text-sm md:text-[16px] leading-relaxed line-clamp-3 mb-4 font-serif">
          {article.excerpt}
        </p>
        <div className="inline-block bg-white text-[#444] px-3 py-1 rounded-sm text-xs font-medium transition-colors hover:bg-[#8e7c49] hover:text-white pointer-events-auto">
          Read Article
        </div>
      </motion.div>

      {/* Utility Info (Footer) */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-start pb-4 px-6 pointer-events-none">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8em] text-white font-serif list-none m-0 p-0">
          <li className="flex items-center gap-1.5 opacity-80">
             <Calendar className="size-3.5" />
             {dateLabel}
          </li>
          <li className="flex items-center gap-1.5 opacity-80">
             <Tag className="size-3.5" />
             {article.category}
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

