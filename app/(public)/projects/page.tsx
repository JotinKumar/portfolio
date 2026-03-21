import { ProjectCard } from '@/components/sections/project-card';
import { PageContent, PageHeader } from "@/components/layout/page-primitives";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPageContent, getProjectCategories, getProjects } from '@/lib/server/queries';
import type { Project } from '@/lib/db-types';

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

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
    console.log('Database not available, using empty state');
  }

  const filteredProjects = params.category
    ? projects.filter((project) => project.category === params.category)
    : projects;

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <PageContent className="space-y-8">
        <PageHeader
          title={pageContent?.title ?? "Projects"}
          subtitle={pageContent?.subtitle ?? ""}
        />

        {/* Filter Section */}
        {uniqueCategories.length > 0 && (
          <FilterTabs
            basePath="/projects"
            allLabel={pageContent?.primaryCta ?? "All"}
            options={uniqueCategories.map((category) => ({ label: category, value: category }))}
            queryKey="category"
            activeValue={params.category}
          />
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">{pageContent?.emptyTitle ?? "No projects yet"}</h3>
            <p className="text-muted-foreground">
              {params.category
                ? pageContent?.emptyMessage ?? "Try a different category to see more projects."
                : pageContent?.emptyMessage ?? "Projects will appear here once they are added."}
            </p>
          </div>
        )}
      </PageContent>
    </section>
  );
}
