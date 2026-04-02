"use client";

import Link from "next/link";
import type { FocusEvent, MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollCue } from "@/components/ui/scroll-cue";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowUpRight, Building, Calendar, MapPin } from "lucide-react";
import type { ProfileMilestone } from "@/lib/db-types";

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
  milestones,
  title,
}: {
  experiences: Experience[];
  milestones: ProfileMilestone[];
  title: string;
}) {
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [railMode, setRailMode] = useState<"relaxed" | "tight" | "compact">("relaxed");
  const [hoveredMilestoneId, setHoveredMilestoneId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [priorRolesReady, setPriorRolesReady] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const currentRoleRef = useRef<HTMLDivElement | null>(null);
  const currentRoleInView = useInView(currentRoleRef, { once: true, amount: 0.3 });
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
  const milestoneYears = new Set(milestones.map((milestone) => milestone.year));
  const cadenceYears = new Set(
    timelineYears.filter((year, index) => {
      const isEdgeYear = index === 0 || year === currentYear;
      return isEdgeYear || (year - startYear) % 4 === 0;
    })
  );
  const visibleYears = timelineYears.reduce<(number | "...")[]>((acc, year, index) => {
    const isEdgeYear = index === 0 || year === currentYear;
    const isMilestone = milestoneYears.has(year);
    const isCadenceYear = cadenceYears.has(year);
    const isSuppressedYear = year === 2012;

    if (!isSuppressedYear && (isEdgeYear || isMilestone || isCadenceYear)) {
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
  const hoveredMilestone = milestones.find((milestone) => milestone.id === hoveredMilestoneId) ?? null;
  const milestoneTrackCount = visibleYears.length + 1;

  const updateTooltipFromPointer = (event: MouseEvent<HTMLElement>, milestoneId: string) => {
    const railBounds = railRef.current?.getBoundingClientRect();
    if (!railBounds) {
      return;
    }

    setHoveredMilestoneId(milestoneId);
    setTooltipPosition({
      x: event.clientX - railBounds.left,
      y: event.clientY - railBounds.top - 12,
    });
  };

  const updateTooltipFromFocus = (event: FocusEvent<HTMLElement>, milestoneId: string) => {
    const railBounds = railRef.current?.getBoundingClientRect();
    const targetBounds = event.currentTarget.getBoundingClientRect();
    if (!railBounds) {
      return;
    }

    setHoveredMilestoneId(milestoneId);
    setTooltipPosition({
      x: targetBounds.left - railBounds.left + targetBounds.width / 2,
      y: targetBounds.top - railBounds.top - 10,
    });
  };

  const clearTooltip = () => {
    setHoveredMilestoneId(null);
    setTooltipPosition(null);
  };

  const scrollToBlogs = () => {
    const section = document.querySelector('[data-testid="home-featured-blogs"]');
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const node = railRef.current;
    if (!node) return;

    let frameId = 0;

    const syncRailMode = () => {
      const overflows = node.scrollWidth > node.clientWidth + 1;

      setRailMode((current) => {
        if (!overflows) return current;
        if (current === "relaxed") return "tight";
        if (current === "tight") return "compact";
        return current;
      });
    };

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncRailMode);
    });

    observer.observe(node);
    frameId = requestAnimationFrame(syncRailMode);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [visibleYears.length, milestones.length, railMode]);

  useEffect(() => {
    if (!currentRoleInView) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setPriorRolesReady(true);
    }, 1200);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [currentRoleInView]);

  const formatRailLabel = (year: number) => {
    const isEdgeYear = year === visibleYears[0] || year === visibleYears[visibleYears.length - 1];
    if (isEdgeYear) return String(year);
    return railMode === "compact" ? year.toString().slice(-2) : String(year);
  };

  return (
    <section data-testid="home-work-experience" className="relative scroll-mt-12 py-8 md:py-8">
      <div className="space-y-10 md:space-y-12">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-end">
          <div className="space-y-4">
            <h2 className="type-section-title">{title}</h2>
          </div>
        </header>

        <div data-testid="home-milestone-rail" className="relative px-1 py-2 md:px-2">
          <div
            ref={railRef}
            data-testid="home-milestone-track"
            className={`grid w-full items-center whitespace-nowrap ${
              railMode === "relaxed" ? "gap-2 md:gap-3" : railMode === "tight" ? "gap-1.5 md:gap-2" : "gap-1 md:gap-1.5"
            }`}
            style={{ gridTemplateColumns: `repeat(${milestoneTrackCount}, minmax(0, 1fr))` }}
          >
              {visibleYears.map((year, index) => {
                if (year === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className={`inline-flex w-full items-center justify-center px-0.5 font-mono text-muted-foreground ${
                        railMode === "compact" ? "text-[0.68rem] md:text-[0.74rem]" : "text-[0.78rem] md:text-[0.86rem]"
                      }`}
                    >
                      ...
                    </span>
                  );
                }

                const milestone = milestones.find((item) => item.year === year) ?? null;
                const isMilestone = Boolean(milestone);
                const label = formatRailLabel(year);

                return (
                  <button
                    type="button"
                    key={year}
                    data-testid={
                      milestone
                        ? `milestone-${milestone.id}`
                        : `milestone-year-${label}`
                    }
                    data-milestone-active={isMilestone ? "true" : "false"}
                    onMouseEnter={milestone ? (event) => updateTooltipFromPointer(event, milestone.id) : undefined}
                    onMouseMove={milestone ? (event) => updateTooltipFromPointer(event, milestone.id) : undefined}
                    onMouseLeave={milestone ? clearTooltip : undefined}
                    onFocus={milestone ? (event) => updateTooltipFromFocus(event, milestone.id) : undefined}
                    onBlur={milestone ? clearTooltip : undefined}
                    className={`inline-flex w-full items-center justify-center px-2.5 py-1 font-mono text-[0.76rem] font-medium tracking-[0.08em] md:text-[0.9rem] ${
                      isMilestone
                        ? "bg-primary/10 text-foreground"
                        : "bg-transparent text-muted-foreground"
                    } ${railMode === "compact" ? "px-1.5 py-0.5 text-[0.66rem] md:text-[0.74rem]" : railMode === "tight" ? "px-2 py-0.5 text-[0.7rem] md:text-[0.8rem]" : ""}`}
                  >
                    {label}
                  </button>
                );
              })}
              <span
                className={`inline-flex w-full items-center justify-center px-0.5 font-mono text-muted-foreground ${
                  railMode === "compact" ? "text-[0.68rem] md:text-[0.74rem]" : "text-[0.78rem] md:text-[0.86rem]"
                }`}
              >
                ...
              </span>
          </div>
          <div
            data-testid="home-milestone-hover-role"
            className={`pointer-events-none absolute z-10 whitespace-nowrap bg-background/95 px-2 py-1 text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground transition-opacity duration-150 ${
              hoveredMilestone && tooltipPosition ? "opacity-100" : "opacity-0"
            }`}
            style={
              tooltipPosition
                ? {
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    transform: "translate(-50%, -100%)",
                  }
                : undefined
            }
          >
            {hoveredMilestone ? hoveredMilestone.title : ""}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
          {currentExperience ? (
            <motion.div
              ref={currentRoleRef}
              data-testid="home-current-role-state"
              data-current-role-ready={currentRoleInView ? "true" : "false"}
              initial={{ opacity: 0, y: 24 }}
              animate={currentRoleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="h-full [content-visibility:auto]"
            >
              <article className="relative overflow-hidden p-7 md:p-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <span className="type-meta inline-flex items-center bg-foreground/5 px-2.5 py-1 tracking-[0.08em] text-muted-foreground">
                    Current role
                  </span>
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
                        <span
                          key={skill}
                          className="type-meta whitespace-nowrap bg-foreground/6 px-2.5 py-1 tracking-[0.08em] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          ) : null}

          <div className="lg:grid lg:grid-cols-[2.75rem_minmax(0,1fr)] lg:gap-5">
            <div className="flex items-center gap-3 pb-5 lg:self-stretch lg:flex-col lg:items-center lg:justify-start lg:gap-3 lg:pb-0">
              <p data-testid="home-prior-experience-label" className="type-meta text-muted-foreground lg:[writing-mode:vertical-rl] lg:rotate-180 lg:tracking-[0.18em]">
                Prior Experience
              </p>
              <span className="h-0.5 flex-1 self-center bg-foreground/50 lg:w-0.5" />
            </div>
            <div
              data-testid="home-prior-roles-state"
              data-prior-roles-ready={priorRolesReady ? "true" : "false"}
              className="space-y-4 md:space-y-5"
            >
            {previousExperiences.map((exp, index) => (
              <PriorExperienceItem
                key={exp.id}
                experience={exp}
                index={index}
                isReady={priorRolesReady}
                onOpen={() => setSelectedExperienceId(exp.id)}
                skills={parseSkills(exp.skills).slice(0, 2)}
              />
            ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <ScrollCue
            testId="home-work-to-blogs-cue"
            label="Scroll to featured blogs"
            onClick={scrollToBlogs}
            className="pointer-events-auto"
          />
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

function PriorExperienceItem({
  experience,
  index,
  isReady,
  onOpen,
  skills,
}: {
  experience: Experience;
  index: number;
  isReady: boolean;
  onOpen: () => void;
  skills: string[];
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const rowInView = useInView(rowRef, { once: true, amount: 0.2 });
  const shouldAnimate = isReady && rowInView;

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 18 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ delay: shouldAnimate ? index * 0.07 : 0, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="[content-visibility:auto]"
    >
      <article className="pb-5 opacity-72 transition-opacity hover:opacity-100 last:pb-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <h3 className="type-card-title text-[1.3rem] leading-tight md:text-[1.55rem]">
                <Link href={`/profile#experience-${experience.id}`} className="transition-colors hover:text-primary">
                  {experience.role}
                </Link>
              </h3>
              <p className="type-meta flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                {experience.company}
              </p>
            </div>
            <div className="type-meta min-w-[11rem] space-y-1 text-left text-muted-foreground md:text-right">
              <p className="flex items-center gap-1.5 md:justify-end">
                <Calendar className="h-4 w-4" />
                {experience.startDate} - {experience.endDate || "Present"}
              </p>
              <p className="flex items-center gap-1.5 md:justify-end">
                <MapPin className="h-4 w-4" />
                {experience.location}
              </p>
            </div>
          </div>
          <p className="type-body text-muted-foreground">{experience.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="type-meta whitespace-nowrap bg-foreground/6 px-2.5 py-1 tracking-[0.08em] text-muted-foreground"
              >
                {skill}
              </span>
            ))}
            <button
              type="button"
              onClick={onOpen}
              className="type-meta inline-flex items-center gap-1.5 text-muted-foreground/80 transition-colors hover:text-primary"
            >
              View chronology
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
