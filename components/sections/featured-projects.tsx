"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { FeaturePlaceholderCard } from "./feature-placeholder-card";
import type { ProjectCardData } from "@/lib/server/queries";

interface FeaturedProjectsProps {
  projects: ProjectCardData[];
  title: string;
  viewAllLabel: string;
}

const PROJECT_PLACEHOLDERS = [
  {
    eyebrow: "Workbench",
    title: "More selected work is on the way",
    description:
      "Featured launches, internal systems, and product experiments will rotate in here as the portfolio grows.",
    href: "/projects",
    ctaLabel: "Browse Projects",
  },
  {
    eyebrow: "Case Study",
    title: "Deeper builds live in the archive",
    description:
      "The complete project index already holds more context, including implementation details, stack choices, and live links.",
    href: "/projects",
    ctaLabel: "View Archive",
  },
  {
    eyebrow: "In Progress",
    title: "Systems, tooling, and product studies",
    description:
      "This slot is reserved for upcoming work spanning dashboards, automation, and pragmatic full-stack builds.",
    href: "/projects",
    ctaLabel: "Explore What Is Live",
  },
] as const;

const formatGroupLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function FeaturedProjects({ projects, title, viewAllLabel }: FeaturedProjectsProps) {
  const completedProjects = projects.filter((project) => project.status.toLowerCase() === "completed");
  const inProgressProjects = projects.filter((project) => project.status.toLowerCase() === "in-progress");
  const plannedProjects = projects.filter((project) => {
    const normalized = project.status.toLowerCase();
    return normalized !== "completed" && normalized !== "in-progress";
  });
  const placeholders = PROJECT_PLACEHOLDERS.slice(0, Math.max(0, 1 - completedProjects.length));
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = completedProjects[activeIndex] ?? null;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? completedProjects.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === completedProjects.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    if (completedProjects.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current === completedProjects.length - 1 ? 0 : current + 1));
    }, 5500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [completedProjects.length]);

  return (
    <section className="py-16 md:py-20">
      <div className="space-y-10 md:space-y-12">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <p className="kicker text-muted-foreground">Projects</p>
            <h2 className="type-section-title">{title}</h2>
            <p className="type-body-lg text-muted-foreground">
              Completed work gets the full-width spotlight. In-progress and other categories stay visible below as a
              lighter reading list.
            </p>
          </div>
          <Link
            href="/projects"
            className="type-nav inline-flex items-center self-start text-foreground transition-colors hover:text-primary lg:self-end"
          >
            {viewAllLabel}
          </Link>
        </header>

        <div className="space-y-6">
          {activeProject ? (
            <div className="relative">
              <ProjectCard project={activeProject} featured />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
                <div className="rounded-none border border-white/16 bg-black/28 px-3 py-2 text-white backdrop-blur-sm">
                  <p className="type-meta text-white/72">Completed</p>
                  <p className="type-body text-white/90">
                    {activeIndex + 1} of {completedProjects.length}
                  </p>
                </div>
                {completedProjects.length > 1 ? (
                  <div className="pointer-events-auto flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPrevious}
                      aria-label="Previous completed project"
                      className="border-white/20 bg-black/24 text-white hover:bg-white/10 hover:text-white"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNext}
                      aria-label="Next completed project"
                      className="border-white/20 bg-black/24 text-white hover:bg-white/10 hover:text-white"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            placeholders.map((placeholder) => (
              <FeaturePlaceholderCard
                key={placeholder.title}
                eyebrow={placeholder.eyebrow}
                title={placeholder.title}
                description={placeholder.description}
                href={placeholder.href}
                ctaLabel={placeholder.ctaLabel}
                minHeightClassName="min-h-[32rem]"
              />
            ))
          )}
        </div>

        <div className="grid gap-8 border-t border-border/65 pt-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="type-meta text-muted-foreground">In Progress</p>
              <h3 className="font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-foreground">
                In Progress Projects
              </h3>
            </div>
            <div className="space-y-4">
              {inProgressProjects.length > 0 ? (
                inProgressProjects.map((project) => (
                  <div key={project.id} className="border-b border-border/55 pb-4 last:border-b-0 last:pb-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block space-y-2 text-foreground transition-colors hover:text-primary"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="type-card-title text-[1.3rem]">{project.title}</span>
                        <span className="type-meta shrink-0 text-muted-foreground transition-colors group-hover:text-primary">
                          Open
                        </span>
                      </div>
                      <p className="type-body max-w-[52ch] text-muted-foreground">{project.shortDesc}</p>
                      <p className="type-meta text-muted-foreground">
                        {project.techStack
                          .split(",")
                          .map((tech) => tech.trim())
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="type-body text-muted-foreground">
                  Nothing active here yet. This column is reserved for work currently being built.
                </p>
              )}
            </div>
            <Link href="/projects" className="type-nav inline-flex items-center text-foreground transition-colors hover:text-primary">
              {viewAllLabel}
            </Link>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="type-meta text-muted-foreground">Planned</p>
              <h3 className="font-serif text-[1.6rem] leading-tight tracking-[-0.02em] text-foreground">
                Planned Projects
              </h3>
            </div>
            <div className="space-y-4">
              {plannedProjects.length > 0 ? (
                plannedProjects.map((project) => (
                  <div key={project.id} className="border-b border-border/55 pb-4 last:border-b-0 last:pb-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block space-y-2 text-foreground transition-colors hover:text-primary"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="type-card-title text-[1.3rem]">{project.title}</span>
                        <span className="type-meta shrink-0 text-muted-foreground transition-colors group-hover:text-primary">
                          Open
                        </span>
                      </div>
                      <p className="type-body max-w-[52ch] text-muted-foreground">{project.shortDesc}</p>
                      <p className="type-meta text-muted-foreground">{formatGroupLabel(project.status)}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="type-body text-muted-foreground">
                  Planned work will appear here as the roadmap expands beyond the current live portfolio.
                </p>
              )}
            </div>
            <Link href="/projects" className="type-nav inline-flex items-center text-foreground transition-colors hover:text-primary">
              {viewAllLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
