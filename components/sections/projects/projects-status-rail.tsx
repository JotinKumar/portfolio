import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ProjectCardData } from "@/lib/server/queries";

const formatStatus = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function ProjectsStatusRail({
  title,
  projects,
  emptyText,
}: {
  title: string;
  projects: ProjectCardData[];
  emptyText: string;
}) {
  return (
    <section className="border border-border/70 bg-card/72 p-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="kicker text-muted-foreground">{title}</p>
          <h2 className="type-card-title text-[1.5rem]">{title === "Now Building" ? "Active and upcoming work" : "Browse the archive"}</h2>
        </div>
        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block border-t border-border/60 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="space-y-2">
                  <Badge variant="outline">{formatStatus(project.status)}</Badge>
                  <h3 className="type-card-title text-[1.2rem] transition-colors group-hover:text-primary">{project.title}</h3>
                  <p className="type-body text-muted-foreground line-clamp-2">{project.shortDesc}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="type-body text-muted-foreground">{emptyText}</p>
          )}
        </div>
      </div>
    </section>
  );
}
