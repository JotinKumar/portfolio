"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CaretRight,
  Code,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import {
  getProfessionalActions,
  type DetailAction,
} from "@/components/home/responsive-hero-model";
import type { HeroContent, SiteConfig } from "@/lib/db-types";

type HeroView = "choice" | "professional" | "tech";
type DetailViewKind = Exclude<HeroView, "choice">;

type TabletHeroProps = {
  heroContent: HeroContent;
  siteConfig: SiteConfig | null;
};

export function TabletHero({ heroContent, siteConfig }: TabletHeroProps) {
  const [view, setView] = useState<HeroView>("choice");
  const [returnFocus, setReturnFocus] = useState<DetailViewKind | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isProfessional = view === "professional";
  const professionalActions = getProfessionalActions({
    resumeUrl: siteConfig?.resumeUrl,
    downloadResumeLabel: heroContent.downloadResumeLabel,
    getInTouchLabel: heroContent.getInTouchLabel,
  });

  const showDetail = (nextView: DetailViewKind) => {
    setReturnFocus(nextView);
    setView(nextView);
  };

  return (
    <section className="relative flex w-full justify-center overflow-x-hidden px-4 py-2">
      <Glassmorphism
        noShadow
        className="w-full max-w-5xl overflow-hidden px-8 py-7 sm:px-10 sm:py-8"
      >
        <p role="status" aria-atomic="true" className="sr-only">
          {view === "choice"
            ? heroContent.displayName
            : isProfessional
              ? heroContent.professionalTitle
              : heroContent.techTitle}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.24,
              ease: "easeOut",
            }}
            className="mx-auto flex min-h-[620px] w-full max-w-3xl flex-col"
          >
            {view === "choice" ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <header className="w-full max-w-3xl text-center">
                  <h1 className="type-card-title text-balance text-[clamp(1.65rem,3.8vw,2.35rem)]">
                    {heroContent.displayName}
                  </h1>
                  <div className="mx-auto mt-3 h-px w-12 bg-primary" />
                </header>

                <div
                  role="img"
                  aria-label={`${heroContent.displayName}, professional and technology portrait`}
                  className="relative mt-7 aspect-[4/5] w-52 overflow-hidden rounded-[2rem] border border-border/70 bg-muted shadow-xl sm:w-60"
                >
                  <Image
                    src={heroContent.professionalImageUrl}
                    alt=""
                    fill
                    priority
                    sizes="240px"
                    className="object-cover [clip-path:inset(0_50%_0_0)]"
                  />
                  <Image
                    src={heroContent.techImageUrl}
                    alt=""
                    fill
                    priority
                    sizes="240px"
                    className="object-cover [clip-path:inset(0_0_0_50%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary/45"
                  />
                </div>

                <div className="mt-7 grid w-full gap-3">
                  <ChoiceCard
                    icon={<Briefcase aria-hidden="true" size={28} weight="light" />}
                    label={heroContent.exploreProfessionalLabel}
                    description="Pricing, Strategy, Operations"
                    autoFocus={returnFocus === "professional"}
                    onClick={() => showDetail("professional")}
                  />
                  <ChoiceCard
                    icon={<Code aria-hidden="true" size={28} weight="light" />}
                    label={heroContent.exploreTechLabel}
                    description="Projects, Blogs, Tech Stack"
                    autoFocus={returnFocus === "tech"}
                    onClick={() => showDetail("tech")}
                  />
                </div>
              </div>
            ) : (
              <DetailView
                displayName={heroContent.displayName}
                title={
                  isProfessional
                    ? heroContent.professionalTitle
                    : heroContent.techTitle
                }
                subtitle={
                  isProfessional
                    ? heroContent.professionalSubtitle
                    : heroContent.techSubtitle
                }
                skills={
                  isProfessional
                    ? heroContent.professionalSkills
                    : heroContent.techSkills
                }
                resetViewLabel={heroContent.resetViewLabel}
                onBack={() => setView("choice")}
                actions={
                  isProfessional
                    ? professionalActions
                    : [
                        {
                          href: "/projects",
                          label: heroContent.viewProjectsLabel,
                          primary: true,
                        },
                        {
                          href: "/blogs",
                          label: heroContent.viewArticlesLabel,
                        },
                      ]
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Glassmorphism>
    </section>
  );
}

function ChoiceCard({
  icon,
  label,
  description,
  autoFocus,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  autoFocus: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus={autoFocus}
      className="group flex min-h-20 w-full items-center gap-5 border border-control-border bg-background/55 px-5 py-4 text-left shadow-sm transition-[transform,background-color,border-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-primary/50 hover:bg-accent/70 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:translate-y-0"
    >
      <span className="grid size-12 shrink-0 place-items-center border border-primary/25 bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-body block font-medium text-foreground">
          {label}
        </span>
        <span className="type-body mt-0.5 block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
      <CaretRight
        aria-hidden="true"
        size={20}
        className="shrink-0 text-muted-foreground transition-transform duration-[var(--duration-quick)] group-hover:translate-x-1 group-hover:text-primary"
      />
    </button>
  );
}

function DetailView({
  displayName,
  title,
  subtitle,
  skills,
  resetViewLabel,
  onBack,
  actions,
}: {
  displayName: string;
  title: string;
  subtitle: string;
  skills: string[];
  resetViewLabel: string;
  onBack: () => void;
  actions: DetailAction[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-border/70 pb-5">
        <button
          type="button"
          onClick={onBack}
          aria-label={resetViewLabel}
          autoFocus
          className="type-nav inline-flex min-h-11 items-center gap-2 px-1 text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <ArrowLeft aria-hidden="true" size={19} />
          <span>{resetViewLabel}</span>
        </button>
        <p className="type-card-title min-w-0 truncate text-right text-[1.2rem] sm:text-[1.45rem]">
          {displayName}
        </p>
      </header>

      <div className="flex flex-1 flex-col justify-center py-9">
        <div className="max-w-2xl">
          <h1 className="type-section-title text-balance text-[clamp(2.1rem,5vw,3.35rem)]">
            {title}
          </h1>
          <div className="mt-4 h-px w-16 bg-primary" />
          <p className="type-body-lg mt-6 line-clamp-4 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 flex max-w-full flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="max-w-full shrink whitespace-normal break-words bg-background/45 px-3 py-1.5 text-left"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-3 border-t border-border/70 pt-6">
        {actions.map((action) => (
          <Button
            key={`${action.href}-${action.label}`}
            asChild
            variant={action.primary ? "default" : "outline"}
            size="lg"
            className="min-h-12 w-full whitespace-normal px-4 text-center"
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
