"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BriefcaseBusiness, Download, Gamepad2, Github, Headphones, Linkedin, Mail, MapPin, Phone, Plane, Podcast, Popcorn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/components/layout/page-primitives";
import { ProfileSidebarBlock } from "@/components/sections/profile/profile-sidebar-block";
import { ProfileTimelineBlock } from "@/components/sections/profile/profile-timeline-block";
import { LanguageRing } from "@/components/sections/profile/language-ring";
import type { SocialLink } from "@/lib/db-types";
import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

type SkillMeterEntry = {
  label: string;
  level: number;
  placeholder?: boolean;
};

type EducationEntry = {
  title: string;
  subtitle?: string;
  meta?: string;
};

type LanguageEntry = {
  label: string;
  proficiency: number;
  rating: number;
};

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

type HobbyPreview = {
  src: string;
  width: number;
  height: number;
};

type HeroMetaItem = {
  label: string;
  icon: LucideIcon;
};

const splitDisplayName = (displayName: string) => {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return { lead: "Your", tail: "Name" };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { lead: parts[0], tail: "" };
  }

  return {
    lead: parts.slice(0, -1).join(" "),
    tail: parts.at(-1) ?? "",
  };
};

const summarizeLine = (value: string, fallback: string) => {
  const normalized = value.trim();
  if (!normalized) return fallback;
  return normalized.length > 44 ? `${normalized.slice(0, 41).trimEnd()}...` : normalized;
};

const HOBBY_PREVIEWS: Record<string, HobbyPreview> = {
  "video games": { src: "/images/gifs/videogame.gif", width: 200, height: 142 },
  podcast: { src: "/images/gifs/podcast.gif", width: 300, height: 300 },
  musci: { src: "/images/gifs/music.gif", width: 200, height: 158 },
  music: { src: "/images/gifs/music.gif", width: 200, height: 158 },
  movies: { src: "/images/gifs/movie.gif", width: 300, height: 300 },
  travel: { src: "/images/gifs/travel.gif", width: 253, height: 266 },
};

export function ProfileEditorialShell({
  displayName,
  displayTitle,
  displaySummary,
  displayLocation,
  displayEmail,
  displayPhone,
  yearsExperience,
  languageEntries,
  professionalSkillMeters,
  technicalSkillMeters,
  displayResumeUrl,
  socialLinks,
  timelineTitle,
  timelineSubtitle,
  achievementsTitle,
  skillsTitle,
  experiences,
  education,
  hobbies,
}: {
  displayName: string;
  displayTitle: string;
  displaySummary: string;
  displayLocation: string;
  displayEmail: string;
  displayPhone: string;
  yearsExperience: number;
  languageEntries: LanguageEntry[];
  professionalSkillMeters: SkillMeterEntry[];
  technicalSkillMeters: SkillMeterEntry[];
  displayResumeUrl: string;
  socialLinks: SocialLink[];
  timelineTitle: string;
  timelineSubtitle: string;
  achievementsTitle: string;
  skillsTitle: string;
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  hobbies: string[];
}) {
  const [nameHovered, setNameHovered] = useState(false);
  const [activeHobbyPreview, setActiveHobbyPreview] = useState<HobbyPreview | null>(null);
  const skillsRef = useRef<HTMLDivElement | null>(null);
  const skillsInView = useInView(skillsRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const { lead: profileLeadName, tail: profileTailName } = splitDisplayName(displayName);
  const heroMeta = [
    displayLocation ? { label: `Based in ${displayLocation}`, icon: MapPin } : null,
    displayEmail ? { label: summarizeLine(displayEmail, "hello@example.com"), icon: Mail } : null,
    displayPhone ? { label: displayPhone, icon: Phone } : null,
    yearsExperience > 0 ? { label: `${yearsExperience}+ yrs experience`, icon: BriefcaseBusiness } : null,
  ].filter((item): item is HeroMetaItem => item !== null);
  const heroQuote = displaySummary.trim() || "Creative profile summary placeholder for your profile introduction.";
  const iconForPlatform = (platform: string) => {
    const normalized = platform.toLowerCase();
    if (normalized.includes("linkedin")) return Linkedin;
    if (normalized.includes("github")) return Github;
    if (normalized.includes("twitter") || normalized === "x" || normalized.includes("x.com")) return XIcon;
    if (normalized.includes("mail") || normalized.includes("email")) return Mail;
    return ExternalIcon;
  };
  const sanitizedPhone = displayPhone.replace(/[^\d+]/g, "");
  const whatsappHref = sanitizedPhone ? `https://wa.me/${sanitizedPhone.replace(/^\+/, "")}` : "";
  const sidebarSocialLinks = socialLinks.filter((social) => {
    const normalized = social.platform.toLowerCase();
    return normalized.includes("linkedin") || normalized.includes("github") || normalized.includes("twitter") || normalized === "x" || normalized.includes("x.com");
  });
  const sidebarQuickLinks = [
    ...sidebarSocialLinks,
    ...(whatsappHref ? [{ id: "sidebar-whatsapp", platform: "whatsapp", label: "WhatsApp", url: whatsappHref }] : []),
    { id: "sidebar-contact", platform: "contact", label: "Contact", url: "/contact" },
  ];
  const hobbiesWithIcons = hobbies.map((hobby) => ({
    label: hobby,
    preview: HOBBY_PREVIEWS[hobby.toLowerCase()] ?? null,
    icon:
      hobby.toLowerCase() === "video games"
        ? Gamepad2
        : hobby.toLowerCase() === "podcast"
          ? Podcast
          : hobby.toLowerCase() === "musci" || hobby.toLowerCase() === "music"
            ? Headphones
            : hobby.toLowerCase() === "movies"
              ? Popcorn
              : hobby.toLowerCase() === "travel"
                ? Plane
                : BriefcaseBusiness,
  }));

  return (
    <PageContent>
      <div className="space-y-8 border border-border/60 bg-background">
        <section className="animate-in fade-in slide-in-from-top-3 duration-500 overflow-hidden bg-background">
          <div className="relative min-h-[27rem]">
            <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="relative grid grid-rows-[auto_1fr]">
                <div className="relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
                  <div className="absolute -left-12 bottom-5 h-px w-24 bg-foreground/25" />
                  <div className="space-y-3">
                    {heroMeta.length > 0 ? (
                      heroMeta.map((item) => {
                        const Icon = item.icon;
                        return (
                        <div key={item.label} className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-foreground">
                          <span className="flex size-4 items-center justify-center rounded-full border border-foreground/70">
                            <Icon className="size-2.5" />
                          </span>
                          <span>{item.label}</span>
                        </div>
                        );
                      })
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-foreground">
                        <span className="flex size-4 items-center justify-center rounded-full border border-foreground/70">
                            <MapPin className="size-2.5" />
                        </span>
                        <span>Profile overview placeholder</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-foreground">
                        <span className="flex size-4 items-center justify-center rounded-full border border-foreground/70">
                            <Phone className="size-2.5" />
                        </span>
                        <span>Visual intro section</span>
                      </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative mx-5 mb-5 mt-2 min-h-[18rem] sm:mx-6 sm:mb-6 lg:min-h-[21rem]">
                  <div className="absolute bottom-0 left-[16%] h-[30%] w-[54%] rounded-t-[48%] bg-[rgba(26,26,26,0.18)] blur-[4px]" />
                </div>
              </div>

              <div className="hidden lg:block" />
            </div>

            <div className="relative z-20 lg:absolute lg:left-[15rem] lg:right-0 lg:top-[1.55rem]">
              <div className="grid grid-rows-[1fr_auto]">
                <div className="relative overflow-hidden bg-[#2b2b2d] px-7 py-7 text-white sm:px-9 sm:py-9 lg:min-h-[19.5rem] lg:pl-[11.5rem] xl:pl-[13rem]">
                <span className="absolute right-4 top-0 h-20 w-px bg-white/85 sm:right-8 sm:h-24" />
                <span className="absolute right-0 top-4 h-px w-14 bg-white/85 sm:top-6 sm:w-16" />

                <div className="flex h-full flex-col justify-start gap-5 pt-2">
                  <div className="space-y-1.5">
                    <p className="font-serif text-[clamp(2rem,1.45vw+1.05rem,2.85rem)] italic leading-[0.9] tracking-[-0.045em] text-white/96">
                      Hi, I&apos;m
                    </p>
                    <motion.div
                      className="space-y-0.5"
                      onHoverStart={() => setNameHovered(true)}
                      onHoverEnd={() => setNameHovered(false)}
                    >
                      <motion.h1
                        className="font-sans text-[clamp(2.7rem,4.85vw,5.15rem)] font-medium uppercase leading-[0.82] tracking-[0.005em] text-white"
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : {
                                letterSpacing: nameHovered ? "0.04em" : "0.005em",
                                x: nameHovered ? 6 : 0,
                                opacity: nameHovered ? 0.92 : 1,
                              }
                        }
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {profileLeadName}
                      </motion.h1>
                      {profileTailName ? (
                        <motion.h2
                          className="font-sans text-[clamp(2.7rem,4.85vw,5.15rem)] font-extrabold uppercase leading-[0.82] tracking-[0.005em] text-white"
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  y: nameHovered ? 3 : 0,
                                  textShadow: nameHovered
                                    ? "0 0 18px rgba(255,255,255,0.16)"
                                    : "0 0 0 rgba(255,255,255,0)",
                                }
                          }
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {profileTailName}
                        </motion.h2>
                      ) : null}
                    </motion.div>
                    <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-white/76">
                      {displayTitle || "Professional profile"}
                    </p>
                  </div>
                </div>
              </div>

                <div className="relative min-h-[6.4rem] bg-background px-6 py-3 sm:min-h-[7rem] sm:px-8 sm:py-3">
                  <div className="relative z-20 max-w-[42rem] pl-[7.25rem] sm:pl-[8.5rem] lg:pl-[11rem]">
                    <span className="absolute left-[1.1rem] top-[-2.6rem] block font-serif text-[8.4rem] font-semibold leading-[0.6] tracking-[-0.1em] text-white drop-shadow-[0_1px_0_rgba(31,31,33,0.2)] sm:left-[1.4rem] sm:top-[-2.9rem] sm:text-[9.2rem] lg:left-[8rem] lg:top-[-2.75rem]">
                      &ldquo;
                    </span>
                    <p className="relative z-20 max-w-[29rem] pt-2 text-[0.68rem] leading-[1.42] tracking-[0.01em] text-foreground sm:max-w-[32rem] sm:text-[0.74rem]">
                      {heroQuote}
                    </p>
                  </div>
                  <div className="relative z-20 mt-3 flex justify-end gap-2 lg:absolute lg:bottom-[-2rem] lg:right-8 lg:mt-0">
                    <Button className="rounded-none" asChild>
                      <a href={displayResumeUrl} target="_blank" rel="noreferrer">
                        <Download className="mr-2 size-4" />
                        Resume
                      </a>
                    </Button>
                    <Button variant="outline" className="rounded-none border-foreground/70 bg-transparent text-foreground hover:bg-foreground hover:text-background" asChild>
                      <a href={displayEmail ? `mailto:${displayEmail}` : "/contact"}>
                        <Mail className="mr-2 size-4" />
                        Contact
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute left-0 top-0 z-40 hidden h-full w-full lg:block">
              <div className="group absolute left-[3rem] top-[9.2rem] h-[21rem] w-[18rem] overflow-hidden border border-[#1f1f21] bg-[#d0d0d0] shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
                <Image
                  src="/images/professional-portrait.jpg"
                  alt={`${displayName} portrait`}
                  fill
                  sizes="18rem"
                  className="object-cover object-[52%_center] grayscale transition duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:contrast-[1.08] motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_22%,rgba(0,0,0,0.1)_100%)]" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(15rem,0.28fr)_18.75rem_minmax(0,0.72fr)] lg:items-start">
          <aside
            ref={skillsRef}
            data-testid="profile-sidebar"
            className="animate-in fade-in slide-in-from-left-3 duration-500 space-y-7 bg-transparent p-5 lg:sticky lg:top-28 lg:self-start"
          >
            {sidebarQuickLinks.length > 0 ? (
              <ProfileSidebarBlock title="Social" compact className="space-y-3 pb-4 lg:gap-4">
                <div className="flex items-center gap-2">
                  {sidebarQuickLinks.map((social) => {
                    const Icon =
                      social.platform === "whatsapp"
                        ? WhatsAppIcon
                        : social.platform === "contact"
                          ? Mail
                          : iconForPlatform(social.platform);
                    return (
                      <Button key={social.id} variant="outline" size="icon" className="size-10 rounded-none" asChild>
                        <a
                          href={social.url}
                          target={social.url.startsWith("/") ? undefined : "_blank"}
                          rel={social.url.startsWith("/") ? undefined : "noopener noreferrer"}
                          aria-label={social.label}
                        >
                          <Icon className="size-4" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </ProfileSidebarBlock>
            ) : null}

            <ProfileSidebarBlock title="Languages">
              <div className="grid gap-4 sm:grid-cols-2">
                {languageEntries.map((language, index) => {
                  const placeholder = language.proficiency <= 0;
                  return (
                    <LanguageRing
                      key={`${language.label}-${index}`}
                      label={language.label}
                      proficiency={language.proficiency}
                      placeholder={placeholder}
                    />
                  );
                })}
              </div>
            </ProfileSidebarBlock>

            <ProfileSidebarBlock title="Professional skills">
              <div className="space-y-3">
                {professionalSkillMeters.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="type-body">{item.label}</span>
                      <span className="type-meta text-muted-foreground">{item.placeholder ? "pending" : `${item.level}%`}</span>
                    </div>
                    <div className="h-2 border border-border/60 bg-transparent">
                      <motion.div
                        className={`h-full origin-left ${item.placeholder ? "scale-x-0" : "bg-foreground"}`}
                        initial={prefersReducedMotion ? false : { scaleX: 0 }}
                        animate={
                          item.placeholder
                            ? { scaleX: 0 }
                            : prefersReducedMotion
                              ? { scaleX: 1 }
                              : { scaleX: skillsInView ? item.level / 100 : 0 }
                        }
                        transition={{
                          duration: 0.9,
                          delay: prefersReducedMotion ? 0 : index * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSidebarBlock>

            <ProfileSidebarBlock title="Technical skills">
              <div className="space-y-3">
                {technicalSkillMeters.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="type-body">{item.label}</span>
                      <span className="type-meta text-muted-foreground">{item.placeholder ? "pending" : `${item.level}%`}</span>
                    </div>
                    <div className="h-2 border border-border/60 bg-transparent">
                      <motion.div
                        className={`h-full origin-left ${item.placeholder ? "scale-x-0" : "bg-foreground"}`}
                        initial={prefersReducedMotion ? false : { scaleX: 0 }}
                        animate={
                          item.placeholder
                            ? { scaleX: 0 }
                            : prefersReducedMotion
                              ? { scaleX: 1 }
                              : { scaleX: skillsInView ? item.level / 100 : 0 }
                        }
                        transition={{
                          duration: 0.9,
                          delay: prefersReducedMotion ? 0 : index * 0.08 + 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSidebarBlock>

            <ProfileSidebarBlock title="Hobbies">
              <div className="flex flex-wrap gap-3">
                {hobbiesWithIcons.length > 0 ? (
                  hobbiesWithIcons.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        title={item.label}
                        aria-label={item.label}
                        onMouseEnter={item.preview ? () => setActiveHobbyPreview(item.preview) : undefined}
                        onMouseLeave={item.preview ? () => setActiveHobbyPreview(null) : undefined}
                        onFocus={item.preview ? () => setActiveHobbyPreview(item.preview) : undefined}
                        onBlur={item.preview ? () => setActiveHobbyPreview(null) : undefined}
                        className="flex size-12 items-center justify-center border border-border/60 bg-background/60 transition-colors hover:border-primary/40 hover:bg-accent"
                      >
                        <Icon className="size-5 text-foreground" />
                      </button>
                    );
                  })
                ) : (
                  <p className="type-body text-muted-foreground">Hobbies can be added from the profile content settings.</p>
                )}
              </div>
            </ProfileSidebarBlock>
          </aside>

          <div className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
            <div
              aria-hidden={!activeHobbyPreview}
              data-testid="hobby-hover-preview"
              className={`overflow-visible transition-[opacity,visibility] duration-150 ${
                activeHobbyPreview ? "visible opacity-100" : "invisible opacity-0"
              }`}
              style={{
                width: activeHobbyPreview?.width ?? 300,
                height: activeHobbyPreview?.height ?? 300,
              }}
            >
              {activeHobbyPreview ? (
                <Image
                  data-testid="hobby-hover-image"
                  src={activeHobbyPreview.src}
                  alt=""
                  width={activeHobbyPreview.width}
                  height={activeHobbyPreview.height}
                  unoptimized
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-10">
            <ProfileTimelineBlock
              title={timelineTitle}
              subtitle={timelineSubtitle}
              achievementsTitle={achievementsTitle}
              skillsTitle={skillsTitle}
              experiences={experiences}
            />

            <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 px-6 md:px-8">
              <div className="pb-5 lg:grid lg:grid-cols-[2.75rem_minmax(0,1fr)] lg:gap-5">
                <div className="flex items-center gap-3 lg:self-stretch lg:flex-col lg:items-center lg:justify-start lg:gap-3">
                  <p className="type-meta text-muted-foreground lg:[writing-mode:vertical-rl] lg:rotate-180 lg:tracking-[0.18em]">
                    Education
                  </p>
                  <span className="h-0.5 flex-1 self-center bg-foreground/70 lg:w-0.5" />
                </div>
                <div className="space-y-4">
                  {education.length > 0 ? (
                    <div className="space-y-5">
                      {education.map((item) => (
                        <div key={item.title} className="space-y-2 pt-4 first:pt-0">
                          <h3 className="type-card-title text-[1.35rem]">{item.title}</h3>
                          {item.subtitle ? <p className="type-body text-muted-foreground">{item.subtitle}</p> : null}
                          {item.meta ? <p className="type-meta text-muted-foreground">{item.meta}</p> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="type-body text-muted-foreground">Education details can be added from the content settings.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageContent>
  );
}

function ExternalIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.545l-5.123-6.73L5.2 22H1.94l7.606-8.693L1.5 2h6.71l4.63 6.116L18.244 2Zm-1.142 18h1.804L7.228 3.895H5.292L17.102 20Z" />
    </svg>
  );
}

function WhatsAppIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.05 4.94A9.94 9.94 0 0 0 12.01 2C6.5 2 2.02 6.48 2.02 12c0 1.76.46 3.48 1.33 5L2 22l5.14-1.3A9.96 9.96 0 0 0 12 22h.01c5.51 0 9.99-4.48 9.99-10 0-2.67-1.04-5.18-2.95-7.06ZM12 20.3a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.05.77.82-2.97-.2-.31A8.24 8.24 0 0 1 3.72 12a8.29 8.29 0 0 1 14.14-5.86A8.23 8.23 0 0 1 20.29 12c0 4.58-3.72 8.3-8.29 8.3Zm4.55-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.8-.8.97-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.26-.75-.67-1.25-1.5-1.4-1.76-.15-.25-.02-.38.11-.5.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.78.6.26 1.07.42 1.44.53.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}
