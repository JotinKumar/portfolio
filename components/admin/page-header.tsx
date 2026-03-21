import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="type-section-title text-[2rem] md:text-[2.5rem]">{title}</h1>
        {description ? <p className="type-body text-muted-foreground md:max-w-3xl">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
