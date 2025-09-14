import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TechHero({ current = false }: { current?: boolean }) {
  const gridCols = current
    ? "grid-cols-[64px_336px_1fr]"
    : "grid-cols-[1fr_336px_1fr]";
  return (
    <section className="w-full h-full min-h-[80vh] bg-background">
      <div
        className={`grid ${gridCols} w-full h-full min-h-[80vh] rounded-xl shadow-lg bg-card`}
      >
        {/* Left: Empty, only in initial state */}
        {<div></div>}
        {/* Middle: Rectangular Image */}
        <div className="flex items-center justify-center">
          <div className="w-[336px] h-[432px] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
            <Image
              src="/images/tech-portrait.jpg"
              alt="Tech Hero"
              width={336}
              height={432}
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        </div>
        {/* Right: Tech Content */}
        <div className="flex flex-col justify-center items-end p-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Jotin Kumar Madugula
          </h1>
          <h2 className="text-xl mb-4 text-muted-foreground">
            Tech enthusiast
          </h2>
          <p className="mb-4 text-lg text-muted-foreground">
            Building scalable solutions with modern technologies and
            cutting-edge development practices
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {["Next.js", "React", "TypeScript", "Python", "AI/ML", "Cloud"].map(
              (skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              )
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <a href="/projects">View Projects</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/articles">View Articles</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
