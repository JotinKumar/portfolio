import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturePlaceholderCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  minHeightClassName?: string;
  className?: string;
  compact?: boolean;
}

export function FeaturePlaceholderCard({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  minHeightClassName,
  className,
  compact = false,
}: FeaturePlaceholderCardProps) {
  return (
    <Card
      className={`relative h-full overflow-hidden border-dashed border-border/55 bg-gradient-to-br from-card via-card to-muted/25 shadow-sm ${minHeightClassName ?? ""} ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/18 to-transparent" />
      <CardHeader className={`flex-1 ${compact ? "pb-3" : "pb-5"}`}>
        <div className="space-y-3">
          <Badge variant="outline" className="type-meta w-fit tracking-[0.08em] text-muted-foreground">
            {eyebrow}
          </Badge>
          <h3 className="type-card-title max-w-[14ch]">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className={`pt-0 ${compact ? "pb-1" : "pb-3"}`}>
        <p className="type-body max-w-[32ch] text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className={`${compact ? "pt-2 pb-5" : "pt-3 pb-6"}`}>
        <Button variant="outline" size="sm" className="type-nav" asChild>
          <Link href={href}>
            {ctaLabel}
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
