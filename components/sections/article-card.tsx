import Link from 'next/link';
import Image from 'next/image';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import type { ArticleCardData } from '@/lib/server/queries';

interface ArticleCardProps {
  article: ArticleCardData;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = new Date(
    article.publishedAt || article.createdAt
  ).toLocaleDateString();

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow [content-visibility:auto]">
      {article.coverImage && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={article.coverImage} 
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="flex-1">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            {article.category}
          </Badge>
          <h3 className="font-semibold text-lg line-clamp-2">
            <Link 
              href={`/articles/${article.slug}`}
              className="hover:underline"
            >
              {article.title}
            </Link>
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </CardHeader>
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

