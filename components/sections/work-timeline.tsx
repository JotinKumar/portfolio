"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowUpRight, Building, Calendar, MapPin } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export function WorkTimeline({
  experiences,
  title,
}: {
  experiences: Experience[];
  title: string;
}) {
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const parseYear = (value?: string): number | null => {
    if (!value) {
      return null;
    }

    const yearMatch = value.match(/\b(19|20)\d{2}\b/);
    if (!yearMatch) {
      return null;
    }

    const parsedYear = Number.parseInt(yearMatch[0], 10);
    return Number.isNaN(parsedYear) ? null : parsedYear;
  };

  const parseSkills = (skills: Experience["skills"]): string[] => {
    if (Array.isArray(skills)) {
      return skills;
    }
    try {
      const parsed = JSON.parse(skills || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseAchievements = (achievements: Experience["achievements"]): string[] => {
    if (Array.isArray(achievements)) {
      return achievements;
    }
    try {
      const parsed = JSON.parse(achievements || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const currentExperience =
    experiences.find((experience) => experience.current) ?? experiences[0] ?? null;
  const previousExperiences = currentExperience
    ? experiences.filter((experience) => experience.id !== currentExperience.id)
    : experiences;
  const currentYear = new Date().getFullYear();
  const startYear = experiences.reduce((earliest, experience) => {
    const parsedYear = parseYear(experience.startDate);
    if (parsedYear === null) {
      return earliest;
    }
    return Math.min(earliest, parsedYear);
  }, currentYear);
  const timelineYears = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );
  const milestoneYears = new Set(
    experiences
      .map((experience) => parseYear(experience.startDate))
      .filter((year): year is number => year !== null)
  );
  const cadenceYears = new Set(
    timelineYears.filter((year, index) => {
      const isEdgeYear = index === 0 || year === currentYear;
      return isEdgeYear || (year - startYear) % 2 === 0;
    })
  );
  const visibleYears = timelineYears.reduce<(number | "...")[]>((acc, year, index) => {
    const isEdgeYear = index === 0 || year === currentYear;
    const isMilestone = milestoneYears.has(year);
    const isCadenceYear = cadenceYears.has(year);

    if (isEdgeYear || isMilestone || isCadenceYear) {
      const previous = acc[acc.length - 1];
      if (typeof previous === "number" && year - previous > 1) {
        acc.push("...");
      }
      acc.push(year);
    }

    return acc;
  }, []);
  const selectedExperience = useMemo(
    () => previousExperiences.find((experience) => experience.id === selectedExperienceId) ?? null,
    [previousExperiences, selectedExperienceId]
  );

  return (
    <section className="py-16 md:py-20">
      <div className="space-y-10 md:space-y-12">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-end">
          <div className="space-y-4">
            <p className="kicker text-muted-foreground">Experience</p>
            <h2 className="type-section-title">{title}</h2>
          </div>
          <p className="type-body-lg max-w-3xl text-muted-foreground">
            The current role gets the full editorial treatment. Earlier roles stay visible, but lighter, so the section
            reads like a progression rather than a stack of equal cards.
          </p>
        </header>

        <div className="rounded-[1.5rem] border border-border/70 bg-card/60 px-4 py-4 shadow-sm md:px-5">
          <div className="flex flex-wrap items-center gap-2 whitespace-nowrap md:gap-3">
              {visibleYears.map((year, index) => {
                if (year === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="inline-flex items-center px-1 font-mono text-[0.82rem] text-muted-foreground md:text-[0.94rem]"
                    >
                      ...
                    </span>
                  );
                }

                const isMilestone = milestoneYears.has(year);

                return (
                  <span
                    key={year}
                    className={`inline-flex items-center rounded-none border px-2.5 py-1 font-mono text-[0.76rem] font-medium tracking-[0.08em] md:text-[0.9rem] ${
                      isMilestone
                        ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                        : "border-border/70 bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {year}
                  </span>
                );
              })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
          {currentExperience ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.25 }}
              className="h-full [content-visibility:auto]"
            >
              <article className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90 p-7 shadow-md md:p-10">
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <Badge variant="outline" className="type-meta tracking-[0.08em] text-muted-foreground">Current role</Badge>
                  <div className="type-meta space-y-2 text-left text-muted-foreground md:text-right">
                    <p className="flex items-center gap-1.5 md:justify-end">
                      <Calendar className="h-4 w-4" />
                      {currentExperience.startDate} - {currentExperience.endDate || "Present"}
                    </p>
                    <p className="flex items-center gap-1.5 md:justify-end">
                      <MapPin className="h-4 w-4" />
                      {currentExperience.location}
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <p className="type-meta text-muted-foreground">Primary experience</p>
                    <h3 className="font-serif text-[clamp(2.3rem,3vw+1.2rem,4.5rem)] leading-[0.95] tracking-[-0.04em]">
                      <Link href={`/profile#experience-${currentExperience.id}`} className="transition-colors hover:text-primary">
                        {currentExperience.role}
                      </Link>
                    </h3>
                  </div>
                  <p className="type-body inline-flex items-center gap-2 text-muted-foreground md:text-[1.02rem]">
                    <Building className="h-4 w-4" />
                    {currentExperience.company}
                  </p>
                </div>

                <p className="type-body-lg mt-8 max-w-2xl text-muted-foreground">
                  {currentExperience.description}
                </p>

                <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.8fr)]">
                  <div className="space-y-4">
                    <p className="type-meta text-muted-foreground">Selected impact</p>
                    <ul className="space-y-3">
                      {parseAchievements(currentExperience.achievements).slice(0, 3).map((achievement) => (
                        <li key={achievement} className="type-body flex gap-3 text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <p className="type-meta text-muted-foreground">Core focus</p>
                    <div className="flex flex-wrap gap-2">
                      {parseSkills(currentExperience.skills).slice(0, 5).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="type-meta whitespace-nowrap tracking-[0.08em] text-muted-foreground"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          ) : null}

          <div className="space-y-4 md:space-y-5">
            {previousExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.2 }}
                className="[content-visibility:auto]"
              >
                <article className="border-b border-border/65 pb-5 last:border-b-0 last:pb-0">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-2">
                        <h3 className="type-card-title text-[1.3rem] leading-tight md:text-[1.55rem]">
                          <Link href={`/profile#experience-${exp.id}`} className="transition-colors hover:text-primary">
                            {exp.role}
                          </Link>
                        </h3>
                        <p className="type-meta flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          {exp.company}
                        </p>
                      </div>
                      <div className="type-meta min-w-[11rem] space-y-1 text-left text-muted-foreground md:text-right">
                        <p className="flex items-center gap-1.5 md:justify-end">
                          <Calendar className="h-4 w-4" />
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                        <p className="flex items-center gap-1.5 md:justify-end">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </p>
                      </div>
                    </div>
                    <p className="type-body text-muted-foreground">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {parseSkills(exp.skills).slice(0, 2).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="type-meta whitespace-nowrap tracking-[0.08em] text-muted-foreground"
                        >
                          {skill}
                        </Badge>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedExperienceId(exp.id)}
                        className="type-meta inline-flex items-center gap-1.5 text-muted-foreground/80 transition-colors hover:text-primary"
                      >
                        View chronology
                        <ArrowUpRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Sheet
        open={selectedExperience !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedExperienceId(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto border-l border-border/70 bg-background sm:max-w-xl">
          {selectedExperience ? (
            <>
              <SheetHeader className="space-y-3 border-b border-border/60 pb-6">
                <Badge variant="outline" className="type-meta w-fit tracking-[0.08em] text-muted-foreground">
                  Experience chronology
                </Badge>
                <SheetTitle className="font-serif text-[clamp(1.8rem,1.6vw+1rem,2.8rem)] leading-[0.98] tracking-[-0.03em]">
                  {selectedExperience.role}
                </SheetTitle>
                <SheetDescription className="type-body text-muted-foreground">
                  {selectedExperience.company} · {selectedExperience.startDate} - {selectedExperience.endDate || "Present"}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-8 p-4 md:p-6">
                <div className="space-y-4">
                  <p className="type-meta text-muted-foreground">Summary</p>
                  <p className="type-body text-muted-foreground">{selectedExperience.description}</p>
                </div>

                <div className="space-y-4">
                  <p className="type-meta text-muted-foreground">All skills</p>
                  <div className="flex flex-wrap gap-2">
                    {parseSkills(selectedExperience.skills).map((skill) => (
                      <Badge
                        key={`${selectedExperience.id}-sheet-skill-${skill}`}
                        variant="secondary"
                        className="type-meta whitespace-nowrap tracking-[0.08em] text-muted-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {parseAchievements(selectedExperience.achievements).length > 0 ? (
                  <div className="space-y-4">
                    <p className="type-meta text-muted-foreground">Key achievements</p>
                    <ul className="space-y-3">
                      {parseAchievements(selectedExperience.achievements).map((achievement) => (
                        <li key={`${selectedExperience.id}-sheet-achievement-${achievement}`} className="type-body flex gap-3 text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Button variant="outline" className="type-nav" asChild>
                  <Link href={`/profile#experience-${selectedExperience.id}`} onClick={() => setSelectedExperienceId(null)}>
                    Open full profile section
                  </Link>
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </section>
  );
}
