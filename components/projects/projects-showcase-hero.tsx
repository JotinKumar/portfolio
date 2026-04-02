export function ProjectsShowcaseHero({
  title,
  subtitle,
  projectCount,
  categoryCount,
}: {
  title: string;
  subtitle: string;
  projectCount: number;
  categoryCount: number;
}) {
  return (
    <header className="animate-in fade-in slide-in-from-bottom-3 duration-500 grid gap-8 border border-border/70 bg-card/72 p-5 md:p-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
      <div className="space-y-4">
        <p className="kicker text-muted-foreground">Selected Work</p>
        <h1 className="type-display max-w-[12ch] text-[clamp(3.2rem,4vw+1.2rem,5.4rem)]">{title}</h1>
        <p className="type-body-lg max-w-[50ch] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-3 border-t border-border/60 pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
        <div className="space-y-1 border border-border/60 bg-background/70 p-4">
          <p className="kicker text-muted-foreground">Projects</p>
          <p className="type-section-title text-[1.8rem]">{projectCount}</p>
        </div>
        <div className="space-y-1 border border-border/60 bg-background/70 p-4">
          <p className="kicker text-muted-foreground">Categories</p>
          <p className="type-section-title text-[1.8rem]">{categoryCount}</p>
        </div>
      </div>
    </header>
  );
}
