import { ProjectCard } from "@/components/sections/project-card";
import type { ProjectCardData } from "@/lib/server/queries";

export function ProjectsCaseStudyLead({ project, supportingProjects }: { project?: ProjectCardData; supportingProjects: ProjectCardData[] }) {
  return (
    <div className="space-y-6">
      {project ? <ProjectCard project={project} featured /> : null}

      {supportingProjects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {supportingProjects.map((supportingProject) => (
            <ProjectCard key={supportingProject.id} project={supportingProject} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
