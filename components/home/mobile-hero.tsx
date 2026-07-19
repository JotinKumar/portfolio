"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Article,
  Briefcase,
  CaretRight,
  Code,
  EnvelopeSimple,
  FolderOpen,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useState } from "react";

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

type MobileHeroProps = {
  heroContent: HeroContent;
  siteConfig: SiteConfig | null;
};

export function MobileHero({ heroContent, siteConfig }: MobileHeroProps) {
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
    <section className="relative flex min-w-0 w-full justify-center overflow-x-hidden px-3 py-2">
      <Glassmorphism
        noShadow
        className="min-w-0 w-full max-w-[26rem] overflow-hidden px-4 py-4 sm:px-5"
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
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.2,
              ease: "easeOut",
            }}
            className="flex min-h-[34rem] min-w-0 flex-col"
          >
            {view === "choice" ? (
              <ChoiceView
                heroContent={heroContent}
                returnFocus={returnFocus}
                onSelect={showDetail}
              />
            ) : (
              <DetailView
                contextLabel={
                  isProfessional
                    ? heroContent.exploreProfessionalLabel
                    : heroContent.exploreTechLabel
                }
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

function ChoiceView({
  heroContent,
  returnFocus,
  onSelect,
}: {
  heroContent: HeroContent;
  returnFocus: DetailViewKind | null;
  onSelect: (view: DetailViewKind) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="border-b border-border/70 pb-3 text-center">
        <p className="type-card-title line-clamp-2 text-balance text-[1rem] [overflow-wrap:anywhere]">
          {heroContent.displayName}
        </p>
        <div className="mx-auto mt-2 h-px w-10 bg-primary" />
      </header>

      <div className="flex min-w-0 w-full flex-1 flex-col items-center justify-center py-5">
        <div className="relative aspect-square w-36 overflow-hidden rounded-[1.4rem] border border-border/70 bg-muted shadow-lg">
          <Image
            src={heroContent.techImageUrl}
            alt={`${heroContent.displayName} portrait`}
            fill
            priority
            sizes="(max-width: 767px) 144px, 1px"
            className="object-cover"
          />
        </div>

        <h1 className="type-card-title mt-4 line-clamp-3 max-w-full text-balance text-center text-[clamp(1.45rem,7vw,1.85rem)] leading-tight [overflow-wrap:anywhere]">
          Hi, I&apos;m {heroContent.displayName}
        </h1>
        <div className="type-body mt-2 min-w-0 w-full max-w-full text-balance text-center text-sm text-muted-foreground">
          <p className="line-clamp-2 [overflow-wrap:anywhere]">
            {heroContent.professionalTitle}
          </p>
          <p className="line-clamp-2 [overflow-wrap:anywhere]">
            {heroContent.techTitle}
          </p>
        </div>

        <div className="mt-5 grid min-w-0 w-full gap-2">
          <ChoiceCard
            icon={<Briefcase aria-hidden="true" size={25} weight="light" />}
            label={heroContent.exploreProfessionalLabel}
            description="Experience, Skills, Resume"
            autoFocus={returnFocus === "professional"}
            onClick={() => onSelect("professional")}
          />
          <ChoiceCard
            icon={<Code aria-hidden="true" size={25} weight="light" />}
            label={heroContent.exploreTechLabel}
            description="Projects, Blogs, Tech Stack"
            autoFocus={returnFocus === "tech"}
            onClick={() => onSelect("tech")}
          />
        </div>

        <nav aria-label="Portfolio shortcuts" className="mt-3 flex gap-2">
          <IconAction
            href="/contact"
            label={heroContent.getInTouchLabel}
            icon={<EnvelopeSimple aria-hidden="true" size={19} />}
          />
          <IconAction
            href="/projects"
            label={heroContent.viewProjectsLabel}
            icon={<FolderOpen aria-hidden="true" size={19} />}
          />
          <IconAction
            href="/blogs"
            label={heroContent.viewArticlesLabel}
            icon={<Article aria-hidden="true" size={19} />}
          />
        </nav>
      </div>
    </div>
  );
}

function ChoiceCard({
  icon,
  label,
  description,
  autoFocus,
  onClick,
}: {
  icon: ReactNode;
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
      className="group flex min-h-16 min-w-0 w-full items-center gap-3 border border-control-border bg-background/55 px-3 py-3 text-left shadow-sm transition-[transform,background-color,border-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-primary/50 hover:bg-accent/70 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:translate-y-0"
    >
      <span className="grid size-10 shrink-0 place-items-center text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-body line-clamp-2 font-medium text-foreground [overflow-wrap:anywhere]">
          {label}
        </span>
        <span className="type-body mt-0.5 line-clamp-2 text-xs text-muted-foreground [overflow-wrap:anywhere]">
          {description}
        </span>
      </span>
      <CaretRight
        aria-hidden="true"
        size={18}
        className="shrink-0 text-muted-foreground transition-transform duration-[var(--duration-quick)] group-hover:translate-x-1 group-hover:text-primary"
      />
    </button>
  );
}

function IconAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="grid size-10 place-items-center border border-control-border bg-background/55 text-foreground transition-[transform,color,background-color,border-color] duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:-translate-y-px hover:border-primary/50 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0"
    >
      {icon}
    </Link>
  );
}

function DetailView({
  contextLabel,
  title,
  subtitle,
  skills,
  resetViewLabel,
  onBack,
  actions,
}: {
  contextLabel: string;
  title: string;
  subtitle: string;
  skills: string[];
  resetViewLabel: string;
  onBack: () => void;
  actions: DetailAction[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex min-w-0 items-center justify-between gap-3 border-b border-border/70 pb-3">
        <button
          type="button"
          onClick={onBack}
          aria-label={resetViewLabel}
          autoFocus
          className="type-nav inline-flex min-h-11 min-w-0 max-w-[60%] items-center gap-2 px-1 text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <ArrowLeft aria-hidden="true" size={18} className="shrink-0" />
          <span className="line-clamp-2 text-left [overflow-wrap:anywhere]">
            {resetViewLabel}
          </span>
        </button>
        <p className="type-nav min-w-0 max-w-[40%] line-clamp-2 text-right text-sm text-muted-foreground [overflow-wrap:anywhere]">
          {contextLabel}
        </p>
      </header>

      <div className="flex min-w-0 flex-1 flex-col justify-center py-6">
        <h1 className="type-section-title line-clamp-3 max-w-[18ch] text-balance text-[clamp(1.8rem,9vw,2.4rem)] leading-[1.08] [overflow-wrap:anywhere]">
          {title}
        </h1>
        <div className="mt-3 h-px w-12 bg-primary" />
        <p className="type-body mt-5 line-clamp-4 text-pretty text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
          {subtitle}
        </p>

        <div className="mt-6 flex min-w-0 max-w-full flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="min-w-0 max-w-full shrink whitespace-normal bg-background/45 px-2.5 py-1 text-left text-xs [overflow-wrap:anywhere]"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid min-w-0 gap-2 border-t border-border/70 pt-4">
        {actions.map((action) => (
          <Button
            key={`${action.href}-${action.label}`}
            asChild
            variant={action.primary ? "default" : "outline"}
            size="lg"
            className="min-h-11 h-auto min-w-0 w-full whitespace-normal px-4 py-3 text-center [overflow-wrap:anywhere]"
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
