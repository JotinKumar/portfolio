import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProfessionalHero({ current = false }: { current?: boolean }) {
  const gridCols = current
    ? "grid-cols-[1fr_336px_64px]"
    : "grid-cols-[1fr_336px_1fr]";
  return (
    <section className="w-full h-full min-h-[80vh] bg-background">
      <div
        className={`grid ${gridCols} w-full h-full min-h-[80vh] rounded-xl shadow-lg bg-card`}
      >
        {/* Left: Professional Content */}
        <div className="flex flex-col justify-center items-start p-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Jotin Kumar Madugula
          </h1>
          <h2 className="text-xl mb-4 text-muted-foreground">
            Business Process Expert
          </h2>
          <p className="mb-4 text-lg text-muted-foreground">
            Transforming operations through intelligent automation and strategic
            process optimization
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              "Process Optimization",
              "Team Leadership",
              "AI Integration",
              "Strategic Planning",
            ].map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <a href="/resume.pdf">Download Resume</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </div>
        {/* Middle: Rectangular Image */}
        <div className="flex items-center justify-center">
          <div className="w-[336px] h-[432px] rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
            <Image
              src="/images/professional-portrait.jpg"
              alt="Professional Portrait"
              width={336}
              height={432}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        {/* Right: Empty, only in initial state */}
        {<div></div>}
      </div>
    </section>
  );
}
