import { cn } from "@/lib/utils";

export function ProfileSidebarBlock({
  title,
  children,
  className,
  compact = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative space-y-4 pt-6 before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/60 before:to-transparent lg:grid lg:grid-cols-[2.75rem_minmax(0,1fr)] lg:gap-5 lg:space-y-0",
        className
      )}
    >
      <div className={cn("flex items-center gap-3 lg:self-stretch lg:flex-col lg:items-center lg:justify-start lg:gap-3", compact && "lg:gap-2")}>
        <p className="kicker text-muted-foreground lg:[writing-mode:vertical-rl] lg:rotate-180 lg:tracking-[0.18em]">
          {title}
        </p>
        <span className={cn("h-0.5 flex-1 self-center bg-foreground/70 lg:w-0.5", compact && "lg:min-h-10")} />
      </div>
      <div>{children}</div>
    </section>
  );
}
