import { cn } from "@/lib/utils";
import { PAGE_CONTENT_CLASS, PAGE_READABLE_CLASS } from "@/lib/layout";

export function PageContent({
  children,
  className,
  readable = false,
}: {
  children: React.ReactNode;
  className?: string;
  readable?: boolean;
}) {
  return <div className={cn(PAGE_CONTENT_CLASS, readable && PAGE_READABLE_CLASS, className)}>{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  centered = true,
  className,
  readable = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  readable?: boolean;
}) {
  return (
    <header
      className={cn(
        "space-y-3",
        centered ? "text-center" : "text-left",
        readable && PAGE_READABLE_CLASS,
        className
      )}
    >
      <h1 className="type-section-title">{title}</h1>
      {subtitle ? (
        <p
          className={cn(
            "type-body-lg text-muted-foreground",
            centered ? "mx-auto max-w-2xl" : "max-w-3xl"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
