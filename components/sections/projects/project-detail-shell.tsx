import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Blocks, Layers3, Tag } from "lucide-react";
import { PageContent } from "@/components/layout/page-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectDetailShellProps = {
  title: string;
  summary: string;
  category: string;
  status: string;
  description: string;
  coverImage?: string | null;
  screenshots: string[];
  techStack: string[];
  concepts: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
};

export function ProjectDetailShell({
  title,
  summary,
  category,
  status,
  description,
  coverImage,
  screenshots,
  techStack,
  concepts,
  liveUrl,
  githubUrl,
}: ProjectDetailShellProps) {
  const galleryItems = screenshots.length > 0 ? screenshots : coverImage ? [coverImage] : [];
  const hasActions = Boolean(liveUrl || githubUrl);

  return (
    <PageContent className="space-y-10">
      <header className="grid gap-8 border-b border-border/70 pb-8 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,0.42fr)] xl:items-end">
        <div className="space-y-5">
          <Button variant="outline" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant={status.toLowerCase() === "completed" ? "default" : "outline"}>{status}</Badge>
          </div>

          <div className="space-y-4">
            <p className="kicker text-muted-foreground">Case Study</p>
            <h1 className="type-section-title max-w-[14ch] text-[2.7rem] leading-[0.92] md:text-[4.4rem]">
              {title}
            </h1>
            <p className="type-body-lg max-w-[46rem] text-muted-foreground">{summary}</p>
          </div>
        </div>

        <aside className="space-y-5 border border-border/70 bg-card/64 p-5">
          <div className="space-y-3">
            <div>
              <p className="type-meta text-muted-foreground">Build status</p>
              <p className="type-body mt-1 text-foreground">{status}</p>
            </div>
            <div>
              <p className="type-meta text-muted-foreground">Surface area</p>
              <p className="type-body mt-1 inline-flex items-center gap-2 text-foreground">
                <Layers3 className="h-4 w-4 text-muted-foreground" />
                {galleryItems.length} visual {galleryItems.length === 1 ? "artifact" : "artifacts"}
              </p>
            </div>
            <div>
              <p className="type-meta text-muted-foreground">Stack depth</p>
              <p className="type-body mt-1 inline-flex items-center gap-2 text-foreground">
                <Blocks className="h-4 w-4 text-muted-foreground" />
                {techStack.length} technologies
              </p>
            </div>
          </div>

          {hasActions ? (
            <div className="flex flex-wrap gap-3 border-t border-border/60 pt-4">
              {liveUrl ? (
                <Button asChild>
                  <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                    Live Demo
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              {githubUrl ? (
                <Button variant="outline" asChild>
                  <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                    Source Code
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </aside>
      </header>

      {galleryItems.length > 0 ? (
        <section className="space-y-5" data-testid="project-gallery">
          <div className="space-y-2">
            <p className="kicker text-muted-foreground">Pages And Screens</p>
            <h2 className="type-section-title text-[2rem] md:text-[2.4rem]">What the product actually looks like.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((src, index) => (
              <figure
                key={`${title}-gallery-${index}`}
                className={`group relative overflow-hidden border border-border/70 bg-muted ${index === 0 && galleryItems.length > 2 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <div className={`relative ${index === 0 && galleryItems.length > 2 ? "aspect-[16/11] h-full min-h-[20rem]" : "aspect-[16/10]"}`}>
                  <Image
                    src={src}
                    alt={`${title} screen ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(15rem,0.4fr)] xl:items-start">
        <div className="space-y-8">
          <section className="space-y-4 border border-border/70 bg-card/58 p-6 md:p-7">
            <div className="space-y-2">
              <p className="kicker text-muted-foreground">Overview</p>
              <h2 className="type-card-title text-[1.7rem] md:text-[2rem]">What this project is trying to do.</h2>
            </div>
            <p className="type-body whitespace-pre-wrap leading-8 text-muted-foreground">{description}</p>
          </section>

          {concepts.length > 0 ? (
            <section className="space-y-4 border border-border/70 bg-card/50 p-6">
              <div className="space-y-2">
                <p className="kicker text-muted-foreground">Focus Areas</p>
                <h2 className="type-card-title text-[1.7rem]">Themes shaping the build.</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {concepts.map((concept) => (
                  <Badge key={concept} variant="outline" className="px-3 py-1.5">
                    <Tag className="mr-1 h-3 w-3" />
                    {concept}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-28">
          {techStack.length > 0 ? (
            <section className="space-y-4 border border-border/70 bg-card/64 p-5" data-testid="project-stack">
              <div className="space-y-1">
                <p className="kicker text-muted-foreground">Technology Stack</p>
                <h2 className="type-card-title text-[1.35rem]">Tools behind the build</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1.5">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-4 border border-border/70 bg-card/50 p-5">
            <div className="space-y-1">
              <p className="kicker text-muted-foreground">Delivery Notes</p>
              <h2 className="type-card-title text-[1.35rem]">How to read this case.</h2>
            </div>
            <p className="type-body text-muted-foreground">
              This page prioritizes shipped interface evidence first, then technical context and build intent.
            </p>
            {!hasActions ? (
              <p className="type-body text-muted-foreground">
                External links are not available for this project yet.
              </p>
            ) : null}
          </section>
        </aside>
      </section>
    </PageContent>
  );
}
