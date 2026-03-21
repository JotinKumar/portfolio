import Link from "next/link";
import { Download, Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContent } from "@/components/layout/page-primitives";
import { ProfileSidebarBlock } from "@/components/sections/profile/profile-sidebar-block";
import { ProfileTimelineBlock } from "@/components/sections/profile/profile-timeline-block";
import { LanguageRing } from "@/components/sections/profile/language-ring";
import type { SocialLink } from "@/lib/db-types";

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

const proficiencyDetail = (value: number, placeholder: boolean) => {
  if (placeholder) return "Set in settings";
  if (value >= 90) return "Fluent";
  if (value >= 75) return "Advanced";
  if (value >= 60) return "Working";
  return "Foundational";
};

export function ProfileEditorialShell({
  introBadge,
  displayName,
  displayTitle,
  displaySummary,
  displayLocation,
  displayEmail,
  yearsExperience,
  languageEntries,
  professionalSkillMeters,
  technicalSkillMeters,
  displayResumeUrl,
  socialLinks,
  primaryCta,
  secondaryCta,
  timelineTitle,
  timelineSubtitle,
  achievementsTitle,
  skillsTitle,
  experiences,
  education,
  hobbies,
}: {
  introBadge: string;
  displayName: string;
  displayTitle: string;
  displaySummary: string;
  displayLocation: string;
  displayEmail: string;
  yearsExperience: number;
  languageEntries: LanguageEntry[];
  professionalSkillMeters: SkillMeterEntry[];
  technicalSkillMeters: SkillMeterEntry[];
  displayResumeUrl: string;
  socialLinks: SocialLink[];
  primaryCta: string;
  secondaryCta: string;
  timelineTitle: string;
  timelineSubtitle: string;
  achievementsTitle: string;
  skillsTitle: string;
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  hobbies: string[];
}) {
  const hasQuickFacts = Boolean(displayLocation || displayEmail || yearsExperience > 0);
  const iconForPlatform = (platform: string) => {
    const normalized = platform.toLowerCase();
    if (normalized.includes("linkedin")) return Linkedin;
    if (normalized.includes("github")) return Github;
    if (normalized.includes("twitter")) return Twitter;
    if (normalized.includes("mail") || normalized.includes("email")) return Mail;
    return ExternalIcon;
  };

  return (
    <PageContent>
      <div className="grid gap-8 lg:grid-cols-[minmax(15rem,0.28fr)_minmax(0,0.72fr)] lg:items-start">
        <aside className="animate-in fade-in slide-in-from-left-3 duration-500 space-y-7 border border-border/70 bg-card/74 p-5 lg:sticky lg:top-28 lg:self-start">
          <ProfileSidebarBlock title={introBadge}>
            <div className="space-y-3">
              <h1 className="type-section-title text-[2.4rem] leading-[0.92]">{displayName}</h1>
              <p className="type-nav text-foreground">{displayTitle}</p>
              <p className="type-body text-muted-foreground">{displaySummary}</p>
            </div>
          </ProfileSidebarBlock>

          <ProfileSidebarBlock title="Contact">
            <div className="space-y-3">
              {displayLocation ? (
                <div className="space-y-1">
                  <p className="type-meta text-muted-foreground">Location</p>
                  <p className="type-body inline-flex items-center gap-2">
                    <MapPin className="size-4" />
                    {displayLocation}
                  </p>
                </div>
              ) : null}
              {displayEmail ? (
                <div className="space-y-1">
                  <p className="type-meta text-muted-foreground">Email</p>
                  <p className="type-body break-all">{displayEmail}</p>
                </div>
              ) : null}
              {yearsExperience > 0 ? (
                <div className="space-y-1">
                  <p className="type-meta text-muted-foreground">Experience</p>
                  <p className="type-body">{yearsExperience}+ years</p>
                </div>
              ) : null}
              {!hasQuickFacts ? (
                <p className="type-body text-muted-foreground">Add contact details in settings to complete this rail.</p>
              ) : null}
            </div>
          </ProfileSidebarBlock>

          <ProfileSidebarBlock title="Languages">
            <div className="grid gap-4">
              {languageEntries.map((language, index) => {
                const placeholder = language.proficiency <= 0;
                return (
                  <LanguageRing
                    key={`${language.label}-${index}`}
                    label={language.label}
                    proficiency={language.proficiency}
                    placeholder={placeholder}
                    detail={proficiencyDetail(language.proficiency, placeholder)}
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
                    <div
                      className={`h-full ${item.placeholder ? "w-0" : "bg-foreground"}`}
                      style={item.placeholder ? undefined : { width: `${item.level}%` }}
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
                    <div
                      className={`h-full ${item.placeholder ? "w-0" : "bg-foreground"}`}
                      style={item.placeholder ? undefined : { width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ProfileSidebarBlock>

          <ProfileSidebarBlock title="Links" bordered={false} className="space-y-3">
            <Button className="w-full" asChild>
              <a href={displayResumeUrl} target="_blank" rel="noreferrer">
                <Download className="mr-2 size-4" />
                {primaryCta}
              </a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href={displayEmail ? `mailto:${displayEmail}` : "/contact"}>
                <Mail className="mr-2 size-4" />
                {secondaryCta}
              </a>
            </Button>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = iconForPlatform(social.platform);
                  return (
                    <Button key={social.id} variant="outline" size="sm" className="flex-1" asChild>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="mr-2 size-4" />
                        {social.label}
                      </a>
                    </Button>
                  );
                })}
              </div>
            ) : null}
          </ProfileSidebarBlock>
        </aside>

        <div className="space-y-10">
          <ProfileTimelineBlock
            title={timelineTitle}
            subtitle={timelineSubtitle}
            achievementsTitle={achievementsTitle}
            skillsTitle={skillsTitle}
            experiences={experiences}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-4 border border-border/70 bg-card/62 p-6">
              <p className="type-meta text-muted-foreground">Education</p>
              {education.length > 0 ? (
                <div className="space-y-5">
                  {education.map((item) => (
                    <div key={item.title} className="space-y-2 border-t border-border/60 pt-4 first:border-t-0 first:pt-0">
                      <h3 className="type-card-title text-[1.35rem]">{item.title}</h3>
                      {item.subtitle ? <p className="type-body text-muted-foreground">{item.subtitle}</p> : null}
                      {item.meta ? <p className="type-meta text-muted-foreground">{item.meta}</p> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="type-body text-muted-foreground">Education details can be added from the content settings.</p>
              )}
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-4 border border-border/70 bg-card/62 p-6">
              <p className="type-meta text-muted-foreground">Hobbies</p>
              {hobbies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby) => (
                    <Badge key={hobby} variant="outline" className="text-muted-foreground">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="type-body text-muted-foreground">Hobbies can be added from the profile content settings.</p>
              )}
            </section>
          </div>

          <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 border border-border/70 bg-card/62 p-6">
            <p className="type-meta text-muted-foreground">Summary</p>
            <p className="type-body mt-4 max-w-[62ch] text-muted-foreground">{displaySummary}</p>
            <div className="mt-6">
              <Link href="/contact" className="type-nav inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary">
                Open contact page
              </Link>
            </div>
          </section>
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
