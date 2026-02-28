import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, FileImage, Layers3, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  let project: Project | null = null;

  try {
    project = await getProjectBySlug(slug);
  } catch {
    project = null;
  }

  if (!project) {
    return (
      <section className="py-12">
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
      </section>
    );
  }

  const screenshots = parseList(project.screenshots);
  const techStack = parseList(project.techStack);
  const concepts = parseList(project.tags);

  return (
    <article className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <header className="space-y-5 rounded-2xl border bg-card/70 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.category}</Badge>
            <Badge variant={project.status === "completed" ? "default" : "outline"}>{project.status}</Badge>
          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">{project.title}</h1>
          <p className="text-base text-muted-foreground md:text-lg">{project.shortDesc}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              Timeline: Timeline not specified
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers3 className="h-4 w-4" />
              {techStack.length} technologies
            </span>
          </div>
        </header>

        <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border bg-muted">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
              <FileImage className="h-8 w-8" />
              <span className="text-xs uppercase tracking-widest">Project Cover</span>
            </div>
          )}
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {screenshots.length > 0
            ? screenshots.map((src, index) => (
                <div key={`${project.id}-shot-${index}`} className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`${project.id}-placeholder-${index}`}
                  className="relative aspect-video overflow-hidden rounded-xl border bg-gradient-to-br from-muted to-muted/60"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileImage className="h-6 w-6" />
                    <span className="text-xs uppercase tracking-wide">No screenshot</span>
                  </div>
                </div>
              ))}
        </section>

        <section className="space-y-4 rounded-2xl border bg-background/80 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Project Overview</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{project.description}</p>
        </section>

        <section className="space-y-3 rounded-2xl border bg-card/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Technology Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.length > 0 ? (
              techStack.map((tech) => (
                <Badge key={`${project.id}-tech-${tech}`} variant="secondary" className="px-3 py-1">
                  {tech}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Technology list not specified.</span>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border bg-card/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Concepts & Tags</h2>
          <div className="flex flex-wrap gap-2">
            {concepts.length > 0 ? (
              concepts.map((tagName) => (
                <Badge key={`${project.id}-tag-${tagName}`} variant="outline" className="px-3 py-1">
                  <Tag className="mr-1 h-3 w-3" />
                  {tagName}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Concept tags not specified.</span>
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border bg-card/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Project Timeline</h2>
          <p className="text-sm text-muted-foreground">Timeline not specified.</p>
        </section>

        <section className="flex flex-wrap gap-3 rounded-2xl border bg-card/70 p-5">
          {project.liveUrl ? (
            <Button asChild>
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
              </Link>
            </Button>
          ) : null}
          {project.githubUrl ? (
            <Button variant="outline" asChild>
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                Source Code
              </Link>
            </Button>
          ) : null}
        </section>
      </div>
    </article>
  );
}