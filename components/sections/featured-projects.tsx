import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import type { ProjectCardData } from "@/lib/server/queries";

interface FeaturedProjectsProps {
  projects: ProjectCardData[];
  title: string;
  viewAllLabel: string;
}

export function FeaturedProjects({ projects, title, viewAllLabel }: FeaturedProjectsProps) {
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            {title}
          </h2>
          <Link href="/projects" passHref>
            <Button variant="outline">{viewAllLabel}</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
