import { Badge } from "@/components/ui/badge";

type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
};

export function ProfileTimelineBlock({
  title,
  subtitle,
  achievementsTitle,
  skillsTitle,
  experiences,
}: {
  title: string;
  subtitle: string;
  achievementsTitle: string;
  skillsTitle: string;
  experiences: ExperienceEntry[];
}) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-6 border border-border/70 bg-card/62 p-6 md:p-8">
      <div className="space-y-3 border-b border-border/60 pb-5">
        <p className="type-meta text-muted-foreground">Experience</p>
        <h2 className="type-section-title">{title}</h2>
        <p className="type-body text-muted-foreground">{subtitle}</p>
      </div>

      <div className="space-y-8">
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <article
              key={experience.id}
              id={`experience-${experience.id}`}
              className="relative space-y-4 border-t border-border/60 pt-6 first:border-t-0 first:pt-0"
            >
              <span className="absolute left-0 top-6 h-full w-px bg-border/60" />
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2 pl-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="type-card-title">{experience.role}</h3>
                    {experience.current ? <Badge>Current</Badge> : null}
                  </div>
                  <p className="type-body text-muted-foreground">{experience.company}</p>
                </div>
                <div className="space-y-1 text-left md:text-right">
                  <p className="type-meta text-muted-foreground">
                    {experience.startDate} - {experience.endDate || "Present"}
                  </p>
                  <p className="type-body text-muted-foreground">{experience.location}</p>
                </div>
              </div>

              <p className="type-body pl-6 text-muted-foreground">{experience.description}</p>

              {experience.achievements.length > 0 ? (
                <div className="space-y-3 pl-6">
                  <p className="type-meta text-muted-foreground">{achievementsTitle}</p>
                  <ul className="space-y-2">
                    {experience.achievements.map((achievement, index) => (
                      <li key={`${experience.id}-${index}`} className="type-body flex gap-3 text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 bg-primary" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {experience.skills.length > 0 ? (
                <div className="space-y-3 pl-6">
                  <p className="type-meta text-muted-foreground">{skillsTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill) => (
                      <Badge key={`${experience.id}-${skill}`} variant="secondary" className="text-muted-foreground">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <p className="type-body text-muted-foreground">Experience entries will appear here once they are added.</p>
        )}
      </div>
    </section>
  );
}
