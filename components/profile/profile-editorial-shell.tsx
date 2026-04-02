import Image from "next/image";
import { PageContent } from "@/components/layout/page-primitives";
import { ProfileSidebarBlock } from "@/components/profile/profile-sidebar-block";
import { ProfileTimelineBlock } from "@/components/profile/profile-timeline-block";
import { LanguageRing } from "@/components/profile/language-ring";
import { ProfileMagneticYears } from "@/components/profile/profile-magnetic-years";
import { ProfileSkillMeters } from "@/components/profile/profile-skill-meters.client";
import { ProfileHobbyPreview } from "@/components/profile/profile-hobby-preview.client";
import type { SocialLink } from "@/lib/db-types";
import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Headphones, Linkedin, Mail, MapPin, Phone, Plane, Podcast, Popcorn } from "lucide-react";
import { Button } from "@/components/ui/button";

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

type HeroMetaItem = {
  label: string;
  icon: LucideIcon;
};

type NameSegment = {
  text: string;
  outlined?: boolean;
};

const buildDisplayNameLines = (displayName: string): { firstLine: NameSegment[]; secondLine?: string } => {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return {
      firstLine: [{ text: "Your", outlined: false }],
      secondLine: "Name",
    };
  }

  const segments = parts.map((part) => ({
    text: part,
    outlined: part.toLowerCase() === "kumar",
  }));

  if (segments.length === 1) {
    return { firstLine: segments };
  }

  return {
    firstLine: segments.slice(0, -1),
    secondLine: segments.at(-1)?.text,
  };
};

const summarizeLine = (value: string, fallback: string) => {
  const normalized = value.trim();
  if (!normalized) return fallback;
  return normalized.length > 44 ? `${normalized.slice(0, 41).trimEnd()}...` : normalized;
};

const normalizeHobbyLabel = (label: string) => (label.trim().toLowerCase() === "musci" ? "Music" : label.trim());

const iconForPlatform = (platform: string) => {
  const normalized = platform.toLowerCase();
  if (normalized.includes("linkedin")) return Linkedin;
  if (normalized.includes("mail") || normalized.includes("email")) return Mail;
  if (normalized.includes("phone")) return Phone;
  if (normalized.includes("location")) return MapPin;
  return ExternalIcon;
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
  socialLinks: SocialLink[];
  timelineTitle: string;
  timelineSubtitle: string;
  achievementsTitle: string;
  skillsTitle: string;
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  hobbies: string[];
}) {
  const { firstLine: firstLineNameSegments, secondLine: secondLineName } = buildDisplayNameLines(displayName);
  const heroMeta = [
    displayLocation ? { label: `Based in ${displayLocation}`, icon: MapPin } : null,
    displayEmail ? { label: summarizeLine(displayEmail, "hello@example.com"), icon: Mail } : null,
    displayPhone ? { label: displayPhone, icon: Phone } : null,
  ].filter((item): item is HeroMetaItem => item !== null);
  const heroSummary =
    displaySummary.trim() ||
    "A seasoned professional focused on pricing strategy, operational delivery, and systems that turn complex work into measurable outcomes.";

  const sanitizedPhone = displayPhone.replace(/[^\d+]/g, "");
  const whatsappHref = sanitizedPhone ? `https://wa.me/${sanitizedPhone.replace(/^\+/, "")}` : "";
  const sidebarSocialLinks = socialLinks.filter((social) => {
    const normalized = social.platform.toLowerCase();
    return (
      normalized.includes("linkedin") ||
      normalized.includes("github") ||
      normalized.includes("twitter") ||
      normalized === "x" ||
      normalized.includes("x.com") ||
      normalized.includes("whatsapp") ||
      normalized.includes("email")
    );
  });

  const sidebarQuickLinks = sidebarSocialLinks.length > 0
    ? sidebarSocialLinks
    : [
        ...(whatsappHref ? [{ id: "sidebar-whatsapp", platform: "whatsapp", label: "WhatsApp", url: whatsappHref }] : []),
        { id: "sidebar-contact", platform: "contact", label: "Contact", url: "/contact" },
      ];

  const mobileContactLinks = [
    displayLocation
      ? {
          id: "mobile-location",
          platform: "location",
          label: `Based in ${displayLocation}`,
          url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayLocation)}`,
        }
      : null,
    displayEmail
      ? {
          id: "mobile-email",
          platform: "email",
          label: displayEmail,
          url: `mailto:${displayEmail}`,
        }
      : null,
    displayPhone
      ? {
          id: "mobile-phone",
          platform: "phone",
          label: displayPhone,
          url: `tel:${sanitizedPhone}`,
        }
      : null,
  ].filter((item): item is { id: string; platform: string; label: string; url: string } => item !== null);

  const compactContactLinks = [...mobileContactLinks, ...sidebarQuickLinks];
  const normalizedHobbies = hobbies.map(normalizeHobbyLabel);

  const renderContactLinks = (compact: boolean) => (
    <div data-testid="profile-quick-links" className={compact ? "grid gap-2" : "grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap"}>
      {compactContactLinks.map((social) => {
        const Icon = social.platform === "whatsapp" ? WhatsAppIcon : iconForPlatform(social.platform);
        const label =
          social.platform.toLowerCase().includes("twitter") ||
          social.platform.toLowerCase() === "x" ||
          social.platform.toLowerCase().includes("x.com")
            ? "X"
            : social.label;
        const href = social.url;

        if (!href) {
          return null;
        }

        const displayUrl = href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

        return (
          <Button
            key={social.id}
            variant="outline"
            className={
              compact
                ? "group relative h-11 min-w-0 justify-start gap-3 rounded-none px-3"
                : `group relative h-11 min-w-0 justify-start gap-3 rounded-none px-3 ${
                    social.id.startsWith("mobile-") ? "lg:hidden" : "lg:h-11 lg:w-11 lg:justify-center lg:px-0"
                  }`
            }
            asChild
          >
            <a
              href={href}
              target={href.startsWith("/") || href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
              rel={href.startsWith("/") || href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "noopener noreferrer"}
              aria-label={label}
              className={compact ? "flex min-w-0 items-center justify-start gap-3" : "flex min-w-0 items-center justify-start gap-3 lg:h-11 lg:w-11 lg:justify-center"}
            >
              <Icon className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span className={compact ? "min-w-0 truncate text-[0.7rem] uppercase tracking-[0.14em]" : "min-w-0 truncate text-[0.7rem] uppercase tracking-[0.14em] lg:hidden"}>
                {label}
              </span>

              {!compact ? (
                <div className="absolute bottom-[calc(100%+0.5rem)] left-1/2 hidden -translate-x-1/2 translate-y-2 flex-col items-center whitespace-nowrap border border-zinc-800 bg-zinc-900 px-3 py-2 text-center opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
                  <span className="text-[0.65rem] font-bold text-zinc-100 normal-case">{label}</span>
                  <span className="mt-0.5 text-[0.65rem] lowercase tracking-normal text-zinc-400">{displayUrl}</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900" />
                </div>
              ) : null}
            </a>
          </Button>
        );
      })}
    </div>
  );

  return (
    <PageContent>
      <div className="space-y-8 border border-border/60 bg-background">
        <section className="animate-in fade-in slide-in-from-top-3 duration-500 overflow-hidden bg-background">
          <div className="relative grid border-b border-border/60 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div className="border-b border-border/60 px-5 py-5 sm:px-6 sm:py-6 lg:border-b-0 lg:border-r">
              <div className="hidden space-y-2.5 lg:block">
                {heroMeta.length > 0 ? (
                  heroMeta.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-foreground">
                        <span className="flex size-4 items-center justify-center rounded-full border border-foreground/60">
                          <Icon className="size-2.5" />
                        </span>
                        <span>{item.label}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-2.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-foreground">
                    <span className="flex size-4 items-center justify-center rounded-full border border-foreground/60">
                      <MapPin className="size-2.5" />
                    </span>
                    <span>Profile overview</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden bg-[#2b2b2d] px-5 py-6 text-white sm:px-8 sm:py-8 lg:min-h-[20rem] lg:pl-[10.5rem] xl:pl-[12rem]">
                <span className="absolute right-4 top-0 h-20 w-px bg-white/80 sm:right-8 sm:h-24" />
                <span className="absolute right-0 top-4 h-px w-14 bg-white/80 sm:top-6 sm:w-16" />
                <div data-testid="profile-year-field" className="absolute inset-y-0 left-[45%] right-0 overflow-hidden">
                  <ProfileMagneticYears initialExperience={yearsExperience} />
                </div>
                <div
                  data-testid="profile-portrait-mobile"
                  data-portrait-revealed="true"
                  className="absolute right-3 top-4 z-30 h-16 w-16 overflow-hidden rounded-full border border-white/22 bg-[#d0d0d0] shadow-[0_10px_22px_rgba(0,0,0,0.24)] sm:right-7 sm:top-7 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:hidden"
                >
                  <Image
                    src="/images/professional-portrait.jpg"
                    alt={`${displayName} portrait`}
                    fill
                    sizes="(max-width: 640px) 5rem, (max-width: 1024px) 7rem, 0px"
                    priority
                    className="object-cover object-[52%_center]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.02)_30%,rgba(0,0,0,0.16)_100%)]" />
                </div>

                <div className="relative z-20 max-w-[46rem] space-y-4 pr-20 sm:pr-32 md:pr-36 lg:pr-40">
                  <p className="font-serif text-[clamp(1.4rem,1.35vw+1rem,2.25rem)] italic leading-[0.92] tracking-[-0.04em] text-white/92">
                    Hi, I&apos;m
                  </p>
                  <div className="group space-y-1">
                    <h1 className="flex max-w-full flex-nowrap items-baseline gap-x-[0.14em] whitespace-nowrap font-sans text-[clamp(1.7rem,3.6vw,4rem)] font-medium uppercase leading-[0.88] tracking-[0.008em] text-white transition-[letter-spacing,opacity] duration-300 group-hover:tracking-[0.016em] group-hover:opacity-95">
                      {firstLineNameSegments.map((segment) => (
                        <span
                          key={segment.text}
                          className={
                            segment.outlined
                              ? "font-normal text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.92)]"
                              : "font-medium text-white"
                          }
                        >
                          {segment.text}
                        </span>
                      ))}
                    </h1>
                    {secondLineName ? (
                      <h2 className="font-sans text-[clamp(2.55rem,5.4vw,6rem)] font-extrabold uppercase leading-[0.86] tracking-[0.008em] text-white transition-transform duration-300 group-hover:translate-y-[2px] group-hover:opacity-95">
                        {secondLineName}
                      </h2>
                    ) : null}
                  </div>
                  <p className="max-w-[28rem] font-sans text-[0.72rem] uppercase tracking-[0.24em] text-white/72 sm:text-[0.78rem]">
                    {displayTitle || "Professional profile"}
                  </p>
                </div>
              </div>

              <div className="relative bg-background px-5 py-5 sm:px-8 sm:py-6 lg:px-[10.5rem] xl:px-[12rem]">
                <div className="relative max-w-[40rem]">
                  <span className="pointer-events-none absolute -left-1 top-[-2.2rem] block font-serif text-[5.5rem] font-semibold leading-[0.6] tracking-[-0.1em] text-foreground/14 sm:text-[7rem] lg:text-[8rem]">
                    &ldquo;
                  </span>
                  <p className="relative z-10 max-w-[40rem] text-[0.98rem] leading-[1.82] text-foreground sm:text-[1.05rem] lg:text-[1.08rem]">
                    {heroSummary}
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[16rem] lg:block">
              <div
                data-testid="profile-portrait"
                data-portrait-revealed="true"
                className="absolute left-[2.75rem] top-[7.75rem] h-[20.5rem] w-[17rem] overflow-hidden border border-[#1f1f21] bg-[#d0d0d0] shadow-[0_16px_26px_rgba(0,0,0,0.12)]"
              >
                <Image
                  src="/images/professional-portrait.jpg"
                  alt={`${displayName} portrait`}
                  fill
                  sizes="17rem"
                  priority
                  className="object-cover object-[52%_center]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_22%,rgba(0,0,0,0.12)_100%)]" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(16rem,0.3fr)_minmax(0,0.7fr)] lg:items-start">
          <aside data-testid="profile-sidebar" className="hidden space-y-7 bg-transparent p-5 lg:sticky lg:top-28 lg:block lg:self-start">
            {sidebarQuickLinks.length > 0 ? (
              <ProfileSidebarBlock title="Social" compact className="space-y-3 pt-0 before:hidden lg:gap-4">
                {renderContactLinks(false)}
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

            <ProfileSkillMeters title="Professional skills" items={professionalSkillMeters} animateOnView />
            <ProfileSkillMeters title="Technical skills" items={technicalSkillMeters} animateOnView />
            <ProfileHobbyPreview hobbies={normalizedHobbies} />
          </aside>

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

            <section className="px-6 md:px-8 lg:hidden">
              <div className="grid gap-6 md:grid-cols-2">
                <ProfileSkillMeters title="Professional skills" items={professionalSkillMeters} className="pt-0 before:hidden" />
                <ProfileSkillMeters title="Technical skills" items={technicalSkillMeters} className="pt-0 before:hidden" />
                <ProfileHobbyPreview hobbies={normalizedHobbies} compact className="pt-0 before:hidden" />

                <ProfileSidebarBlock title="Contact" className="pt-0 before:hidden">
                  {renderContactLinks(true)}
                </ProfileSidebarBlock>
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

function WhatsAppIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.05 4.94A9.94 9.94 0 0 0 12.01 2C6.5 2 2.02 6.48 2.02 12c0 1.76.46 3.48 1.33 5L2 22l5.14-1.3A9.96 9.96 0 0 0 12 22h.01c5.51 0 9.99-4.48 9.99-10 0-2.67-1.04-5.18-2.95-7.06ZM12 20.3a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.05.77.82-2.97-.2-.31A8.24 8.24 0 0 1 3.72 12a8.29 8.29 0 0 1 14.14-5.86A8.23 8.23 0 0 1 20.29 12c0 4.58-3.72 8.3-8.29 8.3Zm4.55-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.8-.8.97-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.26-.75-.67-1.25-1.5-1.4-1.76-.15-.25-.02-.38.11-.5.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.78.6.26 1.07.42 1.44.53.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}
