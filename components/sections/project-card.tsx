import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileImage, Github } from 'lucide-react';
import type { ProjectCardData } from '@/lib/server/queries';

interface ProjectCardProps {
  project: ProjectCardData;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const techStack = project.techStack
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);

  if (featured) {
    return (
      <Card className="group h-full overflow-hidden border-border/70 bg-card/90 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg [content-visibility:auto]">
        <div className="relative aspect-[21/8] overflow-hidden border-b border-border/60 bg-muted">
          <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10" aria-label={`Open ${project.title}`} />
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
              <FileImage className="h-7 w-7" />
              <span className="type-meta tracking-[0.08em]">Selected Work</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/40 to-black/22" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
            <div className="max-w-[36rem] space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="type-meta border-white/20 bg-black/20 tracking-[0.08em] text-white backdrop-blur-sm">
                  {project.category}
                </Badge>
                <span className="type-meta text-white/76">{project.status}</span>
              </div>
              <h3 className="font-serif text-[clamp(1.65rem,1.4vw+1rem,2.55rem)] leading-[0.98] tracking-[-0.03em] text-white">
                <Link href={`/projects/${project.slug}`} className="relative z-20 transition-colors hover:text-white/88">
                  {project.title}
                </Link>
              </h3>
              <p className="type-body max-w-[46ch] text-white/82">{project.shortDesc}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {techStack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="secondary" className="type-meta border-white/14 bg-white/10 tracking-[0.06em] text-white/84">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.liveUrl ? (
                  <Button size="sm" className="relative z-20 type-nav bg-white text-black hover:bg-white/90" asChild>
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View live
                    </Link>
                  </Button>
                ) : null}
                {project.githubUrl ? (
                  <Button size="sm" variant="outline" className="relative z-20 type-nav border-white/30 bg-black/10 text-white hover:bg-white/10 hover:text-white" asChild>
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-1" />
                      Source
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group h-full flex flex-col border-border/65 bg-card/80 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-md md:min-h-[20rem] [content-visibility:auto]">
      <Link href={`/projects/${project.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
            <FileImage className="h-6 w-6" />
            <span className="type-meta tracking-[0.08em]">No cover image</span>
          </div>
        )}
      </Link>
      
      <CardHeader className="flex-1 gap-3 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="type-meta tracking-[0.08em] text-muted-foreground">{project.category}</Badge>
            <span className="type-meta text-muted-foreground/80">{project.status}</span>
          </div>
          <h3 className="type-card-title">
            <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-primary">
              {project.title}
            </Link>
          </h3>
          <p className="type-body text-muted-foreground">{project.shortDesc}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3">
        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="type-meta tracking-[0.06em] text-muted-foreground">
              {tech}
            </Badge>
          ))}
          {techStack.length > 3 && (
            <Badge variant="secondary" className="type-meta tracking-[0.06em] text-muted-foreground">
              +{techStack.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex-wrap gap-3 pt-1 pb-5">
        {project.liveUrl && (
          <Button size="sm" className="type-nav" asChild>
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              View live
            </Link>
          </Button>
        )}
        {project.githubUrl && (
          <Button size="sm" variant="outline" className="type-nav" asChild>
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-1" />
              Source
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

