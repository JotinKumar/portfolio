import { cn } from "@/lib/utils";

export function ProfileSidebarBlock({
  title,
  children,
  className,
  bordered = true,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section className={cn("space-y-4", bordered && "border-b border-border/60 pb-6", className)}>
      <p className="kicker text-muted-foreground">{title}</p>
      {children}
    </section>
  );
}
