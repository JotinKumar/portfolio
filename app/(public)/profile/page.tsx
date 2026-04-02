import { notFound } from "next/navigation";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import type { ProfileMilestone, WorkExperienceCard } from "@/lib/db-types";
import { getWorkExperienceCards, getProfileMilestones, getPageContent, getSiteShellData } from "@/lib/server/queries";
import { isManagedPublicPageEnabled } from "@/lib/public-page-visibility";
import { ProfileEditorialShell } from "@/components/profile/profile-editorial-shell";
import { findSocialLinkByPlatform, resolveSocialLinkDisplayValue } from "@/lib/social-links";

export const dynamic = "force-dynamic";

type NormalizedExperience = {
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
};

type LanguageEntry = {
  label: string;
  proficiency: number;
  rating: number;
};

type EducationEntry = {
  title: string;
  subtitle?: string;
  meta?: string;
};

type SkillMeterEntry = {
  label: string;
  level: number;
  placeholder?: boolean;
};

const DEFAULT_PROFILE_MILESTONES: ProfileMilestone[] = [
  { id: "milestone-process-associate", title: "Process Associate", month: "Jun", year: 2004, order: 1, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-sr-mis-analyst", title: "Sr. MIS Analyst", month: "Apr", year: 2007, order: 2, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-team-lead-ops-mis", title: "Team Lead (Ops & MIS)", month: "Apr", year: 2008, order: 3, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-assistant-manager", title: "Assistant Manager", month: "Apr", year: 2010, order: 4, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-deputy-manager", title: "Deputy Manager", month: "Oct", year: 2011, order: 5, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-operations-manager", title: "Operations Manager", month: "Apr", year: 2013, order: 6, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-senior-manager-pricing-healthcare", title: "Senior Manager, Pricing & Healthcare Solutions", month: "Oct", year: 2016, order: 7, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-director-pricing-solutions", title: "Director, Pricing & Solutions", month: "Jan", year: 2026, order: 8, visible: true, createdAt: "", updatedAt: "" },
];

const PLACEHOLDER_LANGUAGES: LanguageEntry[] = [
  { label: "Language", proficiency: 0, rating: 0 },
  { label: "Language", proficiency: 0, rating: 0 },
  { label: "Language", proficiency: 0, rating: 0 },
];

const LANGUAGE_PRESETS: Record<string, { proficiency: number; rating: number }> = {
  english: { proficiency: 91, rating: 4.5 },
  odia: { proficiency: 98, rating: 5 },
  hindi: { proficiency: 83, rating: 4 },
  telugu: { proficiency: 64, rating: 3 },
};

const ratingFromProficiency = (value: number) => {
  if (value >= 96) return 5;
  if (value >= 88) return 4.5;
  if (value >= 78) return 4;
  if (value >= 68) return 3.5;
  if (value >= 58) return 3;
  if (value >= 48) return 2.5;
  if (value >= 38) return 2;
  if (value >= 28) return 1.5;
  if (value >= 18) return 1;
  if (value > 0) return 0.5;
  return 0;
};

const PLACEHOLDER_SKILLS: SkillMeterEntry[] = [
  { label: "Add skill", level: 0, placeholder: true },
  { label: "Add skill", level: 0, placeholder: true },
  { label: "Add skill", level: 0, placeholder: true },
];

const parseStringArray = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const deriveYearsExperience = (milestones: ProfileMilestone[]): number => {
  const firstYear = milestones[0]?.year;
  if (!firstYear) return 0;
  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - firstYear);
};

const asText = (content: Record<string, unknown> | null | undefined, key: string, fallback: string): string => {
  const value = content?.[key];
  return typeof value === "string" ? value : fallback;
};

const asStringArray = (
  content: Record<string, unknown> | null | undefined,
  key: string,
  fallback: string[]
): string[] => {
  const value = content?.[key];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }
  return fallback;
};

const asLanguages = (content: Record<string, unknown> | null | undefined): LanguageEntry[] => {
  const value = content?.languages;
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;
      const label = typeof item.label === "string" ? item.label : null;
      const proficiency = typeof item.proficiency === "number" ? item.proficiency : null;
      if (!label || proficiency === null) return null;
      const preset = LANGUAGE_PRESETS[label.toLowerCase()];
      const normalizedProficiency = preset?.proficiency ?? Math.max(0, Math.min(100, proficiency));
      return {
        label,
        proficiency: normalizedProficiency,
        rating: preset?.rating ?? ratingFromProficiency(normalizedProficiency),
      };
    })
    .filter((item): item is LanguageEntry => item !== null);
};

const asEducation = (content: Record<string, unknown> | null | undefined): EducationEntry[] => {
  const value = content?.education;
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: EducationEntry[] = [];

  value.forEach((item) => {
    if (typeof item !== "object" || item === null) return;
    const title = typeof item.title === "string" ? item.title : null;
    if (!title) return;

    entries.push({
      title,
      subtitle: typeof item.subtitle === "string" ? item.subtitle : undefined,
      meta: typeof item.meta === "string" ? item.meta : undefined,
    });
  });

  return entries;
};

const defaultSkillLevel = (index: number) => Math.max(46, 92 - index * 8);

const asSkillMeters = (
  content: Record<string, unknown> | null | undefined,
  key: string,
  fallback: string[]
): SkillMeterEntry[] => {
  const value = content?.[key];

  if (Array.isArray(value)) {
    const parsed = value
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            label: item,
            level: defaultSkillLevel(index),
          };
        }

        if (typeof item !== "object" || item === null) return null;
        const label = typeof item.label === "string" ? item.label : null;
        if (!label) return null;
        const level = typeof item.level === "number" ? Math.max(0, Math.min(100, item.level)) : defaultSkillLevel(index);

        return { label, level };
      })
      .filter((item): item is SkillMeterEntry => item !== null);

    if (parsed.length > 0) return parsed;
  }

  if (fallback.length > 0) {
    return fallback.map((label, index) => ({
      label,
      level: defaultSkillLevel(index),
    }));
  }

  return PLACEHOLDER_SKILLS;
};

export default async function ProfilePage() {
  let experienceCards: WorkExperienceCard[] = [];
  let profilePageContent: Awaited<ReturnType<typeof getPageContent>> = null;
  let siteConfig: Awaited<ReturnType<typeof getSiteShellData>>["siteConfig"] = null;
  let socialLinks: Awaited<ReturnType<typeof getSiteShellData>>["footerSocialLinks"] = [];
  let milestones: ProfileMilestone[] = [];

  try {
    const [experienceData, milestoneData, pageContent, shellData] = await Promise.all([
      getWorkExperienceCards(),
      getProfileMilestones(),
      getPageContent("PROFILE"),
      getSiteShellData(),
    ]);

    experienceCards = experienceData;
    milestones = milestoneData;
    profilePageContent = pageContent;
    siteConfig = shellData.siteConfig;
    socialLinks = [
      ...(shellData.profileSocialLinks ?? []),
      ...(shellData.contactSocialLinks ?? []),
      ...shellData.footerSocialLinks,
    ];
  } catch {
    // Render empty state when database is unavailable.
  }

  if (!isManagedPublicPageEnabled(profilePageContent)) {
    notFound();
  }

  const experiences: NormalizedExperience[] = experienceCards.map((exp) => ({
    id: exp.id,
    company: exp.company,
    role: exp.role,
    location: exp.location,
    startDate: exp.startDate,
    endDate: exp.endDate ?? undefined,
    current: exp.current,
    description: exp.description,
    achievements: parseStringArray(exp.achievements),
    skills: parseStringArray(exp.skills),
  }));

  const pageContent = profilePageContent?.content as Record<string, unknown> | null;
  const displayName = profilePageContent?.title ?? siteConfig?.siteName ?? "Profile";
  const displayTitle = profilePageContent?.subtitle ?? siteConfig?.siteTagline ?? "";
  const displaySummary = asText(pageContent, "summary", "");
  const resolvedMilestones = milestones.length > 0 ? milestones : DEFAULT_PROFILE_MILESTONES;
  const locationLink = findSocialLinkByPlatform(socialLinks, "location");
  const displayEmail =
    findSocialLinkByPlatform(socialLinks, "personal_email")?.value ||
    findSocialLinkByPlatform(socialLinks, "email")?.value ||
    siteConfig?.primaryEmail ||
    "";
  const displayPhone =
    findSocialLinkByPlatform(socialLinks, "phone")?.value ||
    findSocialLinkByPlatform(socialLinks, "whatsapp")?.value ||
    siteConfig?.phone ||
    asText(pageContent, "phone", "");
  const displayLocation = locationLink ? resolveSocialLinkDisplayValue(locationLink) : siteConfig?.locationLabel ?? "";
  const yearsExperience = deriveYearsExperience(resolvedMilestones);

  const languages = asLanguages(pageContent);
  const education = asEducation(pageContent);
  const hobbies = asStringArray(pageContent, "hobbies", []);
  const languageEntries = languages.length > 0 ? languages : PLACEHOLDER_LANGUAGES;
  const professionalSkillMeters = asSkillMeters(pageContent, "professionalSkills", []);
  const technicalSkillMeters = asSkillMeters(pageContent, "technicalSkills", []);

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <ProfileEditorialShell
        displayName={displayName}
        displayTitle={displayTitle}
        displaySummary={displaySummary}
        displayLocation={displayLocation}
        displayEmail={displayEmail}
        displayPhone={displayPhone}
        yearsExperience={yearsExperience}
        languageEntries={languageEntries}
        professionalSkillMeters={professionalSkillMeters}
        technicalSkillMeters={technicalSkillMeters}
        socialLinks={(socialLinks.filter((item) => item.position === "PROFILE").length > 0
          ? socialLinks.filter((item) => item.position === "PROFILE")
          : socialLinks.filter((item) => item.position === "FOOTER"))}
        timelineTitle={asText(pageContent, "timelineTitle", "Experience")}
        timelineSubtitle={asText(
          pageContent,
          "timelineSubtitle",
          "Role progression, delivery scope, and operational impact."
        )}
        achievementsTitle={asText(pageContent, "achievementsTitle", "Key Achievements")}
        skillsTitle={asText(pageContent, "skillsTitle", "Skills")}
        experiences={experiences}
        education={education}
        hobbies={hobbies}
      />
    </section>
  );
}
