import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PageContent } from "@/components/layout/page-primitives";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPageContent, getProjectCategories, getProjects } from "@/lib/server/queries";
import type { Project } from "@/lib/db-types";
import { ProjectsShowcaseHero } from "@/components/sections/projects/projects-showcase-hero";
import { ProjectsCaseStudyLead } from "@/components/sections/projects/projects-case-study-lead";
import { ProjectsStatusRail } from "@/components/sections/projects/projects-status-rail";
import { ProjectsArchiveGrid } from "@/components/sections/projects/projects-archive-grid";

export const dynamic = "force-dynamic";

interface ProjectsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  let projects: Project[] = [];
  let uniqueCategories: string[] = [];
  let pageContent: Awaited<ReturnType<typeof getPageContent>> = null;

  try {
    projects = (await getProjects()) as Project[];
    uniqueCategories = await getProjectCategories();
    pageContent = await getPageContent("PROJECTS");
  } catch {
    console.log("Database not available, using empty state");
  }

  const filteredProjects = params.category
    ? projects.filter((project) => project.category === params.category)
    : projects;

  const featuredProject = filteredProjects.find((project) => project.featured) ?? filteredProjects[0];
  const remainingProjects = featuredProject
    ? filteredProjects.filter((project) => project.id !== featuredProject.id)
    : filteredProjects;
  const activeProjects = remainingProjects.filter((project) => project.status.toLowerCase() !== "completed").slice(0, 4);
  const activeProjectIds = new Set(activeProjects.map((project) => project.id));
  const archiveProjects = remainingProjects.filter((project) => !activeProjectIds.has(project.id));

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <PageContent className="space-y-10">
        <ProjectsShowcaseHero
          title={pageContent?.title ?? "Projects"}
          subtitle={pageContent?.subtitle ?? ""}
          projectCount={filteredProjects.length}
          categoryCount={uniqueCategories.length}
        />

        {uniqueCategories.length > 0 && (
          <FilterTabs
            basePath="/projects"
            allLabel={pageContent?.primaryCta ?? "All"}
            options={uniqueCategories.map((category) => ({ label: category, value: category }))}
            queryKey="category"
            activeValue={params.category}
          />
        )}

        {filteredProjects.length > 0 ? (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_22rem] xl:items-start">
              <ProjectsCaseStudyLead project={featuredProject} supportingProjects={archiveProjects.slice(0, 4)} />

              <aside className="space-y-6">
                <ProjectsStatusRail
                  title="Now Building"
                  projects={activeProjects}
                  emptyText="Active builds and upcoming ideas will appear here as they move into execution."
                />
                <section className="border border-border/70 bg-card/72 p-5">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="kicker text-muted-foreground">Categories</p>
                      <h2 className="type-card-title text-[1.5rem]">Browse the archive</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uniqueCategories.map((category) => (
                        <Badge key={category} variant={params.category === category ? "default" : "outline"} asChild>
                          <Link href={`/projects?category=${encodeURIComponent(category)}`}>{category}</Link>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            <ProjectsArchiveGrid projects={archiveProjects.slice(4)} />
          </>
        ) : (
          <div className="border border-border/70 bg-card/72 p-8 text-center">
            <h3 className="type-card-title mb-2 text-[1.7rem]">{pageContent?.emptyTitle ?? "No projects yet"}</h3>
            <p className="type-body text-muted-foreground">
              {params.category
                ? pageContent?.emptyMessage ?? "Try a different category to see more projects."
                : pageContent?.emptyMessage ?? "Projects will appear here once they are added."}
            </p>
          </div>
        )}

        {featuredProject ? (
          <div className="flex justify-end">
            <Link href={`/projects/${featuredProject.slug}`} className="type-nav inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary">
              Open selected case
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </PageContent>
    </section>
  );
}
