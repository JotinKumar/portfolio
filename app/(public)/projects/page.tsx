import { ProjectCard } from '@/components/sections/project-card';
import { getPageContent, getProjectCategories, getProjects } from '@/lib/server/queries';
import type { Project } from '@/lib/db-types';

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
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

  return (
    <section className="py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{pageContent?.title ?? "Projects"}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {pageContent?.subtitle ?? ""}
          </p>
        </div>

        {/* Filter Section */}
        {uniqueCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <a 
              href="/projects"
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-muted hover:bg-muted/80"
            >
              {pageContent?.primaryCta ?? "All"}
            </a>
            {uniqueCategories.map((category) => (
              <a 
                key={category}
                href={`/projects?category=${encodeURIComponent(category)}`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-muted hover:bg-muted/80"
              >
                {category}
              </a>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">{pageContent?.emptyTitle ?? "No projects yet"}</h3>
            <p className="text-muted-foreground">
              {pageContent?.emptyMessage ?? "Projects will appear here once they are added."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
