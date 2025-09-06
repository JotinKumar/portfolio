import { prisma } from '@/lib/prisma';
import { ProjectCard } from '@/components/sections/project-card';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  });

  // Get unique categories for filter
  const categories = await prisma.project.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  const uniqueCategories = categories.map(c => c.category);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my latest work in web development, automation, and digital transformation.
          </p>
        </div>

        {/* Filter Section */}
        {uniqueCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <a 
              href="/projects"
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-muted hover:bg-muted/80"
            >
              All
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
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground">
              Projects will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}