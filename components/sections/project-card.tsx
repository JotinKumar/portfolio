import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileImage, Github } from 'lucide-react';
import type { ProjectCardData } from '@/lib/server/queries';

interface ProjectCardProps {
  project: ProjectCardData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const techStack = project.techStack
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow [content-visibility:auto]">
      <Link href={`/projects/${project.slug}`} className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
            <FileImage className="h-6 w-6" />
            <span className="text-xs uppercase tracking-wide">No cover image</span>
          </div>
        )}
      </Link>
      
      <CardHeader className="flex-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{project.category}</Badge>
            <Badge variant={
              project.status === 'completed' ? 'default' : 
              project.status === 'in-progress' ? 'secondary' : 
              'outline'
            }>
              {project.status}
            </Badge>
          </div>
          <h3 className="font-semibold text-xl">
            <Link href={`/projects/${project.slug}`} className="hover:underline">
              {project.title}
            </Link>
          </h3>
          <p className="text-muted-foreground">{project.shortDesc}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          {techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {techStack.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{techStack.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 space-x-2">
        {project.liveUrl && (
          <Button size="sm" asChild>
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              Live Demo
            </Link>
          </Button>
        )}
        {project.githubUrl && (
          <Button size="sm" variant="outline" asChild>
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-1" />
              Code
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

