import { ProjectCard } from "@/components/sections/project-card";
import type { ProjectCardData } from "@/lib/server/queries";

export function ProjectsArchiveGrid({ projects }: { projects: ProjectCardData[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-5 border-t border-border/70 pt-8">
      <div className="space-y-2">
        <p className="kicker text-muted-foreground">Archive</p>
        <h2 className="type-section-title text-[2rem] md:text-[2.4rem]">More work from the broader portfolio.</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
