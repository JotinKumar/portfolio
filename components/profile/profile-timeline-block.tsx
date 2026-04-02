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

function ExperienceCard({
  experience,
  achievementsTitle,
  skillsTitle,
}: {
  experience: ExperienceEntry;
  achievementsTitle: string;
  skillsTitle: string;
}) {
  return (
    <article
      key={experience.id}
      id={`experience-${experience.id}`}
      className="relative space-y-5 border-l border-border/60 py-8 pl-6 md:pl-7"
    >
      <div className="absolute left-[-5px] top-8 size-2.5 border border-primary bg-background" />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_11rem] md:gap-6">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="type-card-title">{experience.role}</h3>
            {experience.current ? <Badge>Current</Badge> : null}
          </div>
          <p className="type-body text-muted-foreground">{experience.company}</p>
        </div>
        <div className="space-y-1 border-t border-border/50 pt-3 text-left md:border-t-0 md:pt-0 md:text-right">
          <p className="type-meta text-muted-foreground">
            {experience.startDate} - {experience.endDate || "Present"}
          </p>
          <p className="type-body text-muted-foreground">{experience.location}</p>
        </div>
      </div>

      <p className="type-body text-muted-foreground">{experience.description}</p>

      {experience.achievements.length > 0 ? (
        <div className="space-y-3">
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
        <div className="space-y-3">
          <p className="type-meta text-muted-foreground">{skillsTitle}</p>
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill) => (
              <Badge
                key={`${experience.id}-${skill}`}
                variant="outline"
                className="border-border/70 bg-transparent px-2 py-1 text-[0.62rem] tracking-[0.12em] text-muted-foreground"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

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
    <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 overflow-hidden px-6 md:px-8">
      <div className="space-y-6 lg:grid lg:grid-cols-[2.75rem_minmax(0,1fr)] lg:gap-5 lg:space-y-0">
        <div className="flex items-center gap-3 pb-5 lg:self-stretch lg:flex-col lg:items-center lg:justify-start lg:gap-3 lg:pt-24 lg:pb-0">
          <p className="type-meta text-muted-foreground lg:[writing-mode:vertical-rl] lg:rotate-180 lg:tracking-[0.18em]">
            Work Experience
          </p>
          <span className="h-0.5 flex-1 self-center bg-foreground/50 lg:w-0.5" />
        </div>
        <div className="space-y-0">
          <div className="space-y-3 pb-7">
            <h2 className="type-section-title">{title}</h2>
            <p className="max-w-[40rem] text-[0.98rem] leading-7 text-muted-foreground">{subtitle}</p>
          </div>

          <div className="pt-0">
            {experiences.length > 0 ? (
              <div className="space-y-0">
                {experiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                    achievementsTitle={achievementsTitle}
                    skillsTitle={skillsTitle}
                  />
                ))}
              </div>
            ) : (
              <p className="type-body text-muted-foreground">Experience entries will appear here once they are added.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
