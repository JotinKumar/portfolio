import { cn } from "@/lib/utils";
import { PAGE_CONTENT_CLASS } from "@/lib/layout";

export function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(PAGE_CONTENT_CLASS, className)}>{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  centered = true,
  className,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <header className={cn("space-y-3", centered ? "text-center" : "text-left", className)}>
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
      {subtitle ? (
        <p
          className={cn(
            "text-base text-muted-foreground md:text-xl",
            centered ? "mx-auto max-w-2xl" : "max-w-3xl"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
