import Link from "next/link";
import { ProjectDetailShell } from "@/components/projects/project-detail-shell";
import { PageContent } from "@/components/layout/page-primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import { getPreviewProject } from "@/lib/preview-detail-content";
import { getProjectBySlug } from "@/lib/server/queries";
import type { Project } from "@/lib/db-types";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

const parseList = (raw: string): string[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((value) => String(value).trim()).filter(Boolean);
    }
  } catch {
    // Fallback to CSV parsing.
  }

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  let project: Project | null = getPreviewProject(slug);

  if (!project) {
    try {
      project = await getProjectBySlug(slug);
    } catch {
      project = null;
    }
  }

  if (!project) {
    return (
      <section className={PAGE_SECTION_Y_CLASS}>
        <PageContent>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Project not found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This project does not exist or is not available.
              </p>
              <Link href="/projects" className="text-primary hover:underline">
                Back to all projects
              </Link>
            </CardContent>
          </Card>
        </PageContent>
      </section>
    );
  }

  const screenshots = parseList(project.screenshots);
  const techStack = parseList(project.techStack);
  const concepts = parseList(project.tags);

  return (
    <article className={PAGE_SECTION_Y_CLASS}>
      <ProjectDetailShell
        title={project.title}
        summary={project.shortDesc}
        category={project.category}
        status={project.status}
        description={project.description}
        coverImage={project.coverImage}
        screenshots={screenshots}
        techStack={techStack}
        concepts={concepts}
        liveUrl={project.liveUrl}
        githubUrl={project.githubUrl}
      />
    </article>
  );
}
