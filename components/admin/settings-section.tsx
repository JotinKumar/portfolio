import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SettingsSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden border-border/70 bg-card/80 shadow-sm", className)}>
      <CardHeader className="gap-4 border-b border-border/60 bg-muted/25 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-[1.4rem]">{title}</CardTitle>
          {description ? <p className="type-body max-w-3xl text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-5 md:p-6">{children}</CardContent>
    </Card>
  );
}
