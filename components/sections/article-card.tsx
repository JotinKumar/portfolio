import Link from 'next/link';
import Image from 'next/image';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { FileText } from 'lucide-react';
import type { ArticleCardData } from '@/lib/server/queries';

interface ArticleCardProps {
  article: ArticleCardData;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const publishedDate = new Date(
    article.publishedAt || article.createdAt
  ).toLocaleDateString();

  if (featured) {
    return (
      <Card className="group h-full overflow-hidden border-border/70 bg-card/90 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg [content-visibility:auto]">
        <Link href={`/blogs/${article.slug}`} className="relative block aspect-[4/3] overflow-hidden border-b border-border/60 bg-muted">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
              <FileText className="h-7 w-7" />
              <span className="type-meta tracking-[0.08em]">Editorial Feature</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <Badge variant="outline" className="type-meta mb-4 w-fit border-white/25 bg-black/20 tracking-[0.08em] text-white backdrop-blur-sm">
              {article.category}
            </Badge>
            <h3 className="max-w-[12ch] font-serif text-[clamp(2rem,2vw+1rem,3.35rem)] leading-[0.95] tracking-[-0.04em] text-white">
              {article.title}
            </h3>
          </div>
        </Link>
        <CardHeader className="flex-1 gap-4 pb-4 pt-5">
          <p className="type-body-lg max-w-[40ch] text-muted-foreground">
            {article.excerpt}
          </p>
        </CardHeader>
        <CardFooter className="justify-between gap-4 border-t border-border/60 pt-4 pb-6 text-muted-foreground">
          <div className="type-meta flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {publishedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} min read
            </span>
          </div>
          <Link
            href={`/blogs/${article.slug}`}
            className="type-nav inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            Read essay
            <ArrowUpRight className="size-4" />
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="group border-border/55 bg-card/55 transition-colors duration-300 ease-out hover:border-border/80 hover:bg-card/82 [content-visibility:auto]">
      <Link href={`/blogs/${article.slug}`} className="grid gap-4 p-4 sm:grid-cols-[5.75rem_minmax(0,1fr)] sm:items-start">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
              <FileText className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
            <Badge variant="secondary" className="type-meta w-fit tracking-[0.08em] text-muted-foreground">
              {article.category}
            </Badge>
            <span className="type-meta inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {publishedDate}
            </span>
            <span className="type-meta inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {article.readTime} min read
            </span>
          </div>
          <h3 className="type-card-title line-clamp-2 text-[1.45rem] transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <div className="flex items-start justify-between gap-4">
            <p className="type-body line-clamp-2 max-w-[44ch] text-muted-foreground">
              {article.excerpt}
            </p>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </div>
        </div>
      </Link>
    </Card>
  );
}

