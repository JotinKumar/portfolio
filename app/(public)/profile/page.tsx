import { notFound } from "next/navigation";
import { PAGE_SECTION_Y_CLASS } from "@/lib/layout";
import type { Settings, WorkExperienceCard } from "@/lib/db-types";
import { getCompetencies, getPageContent, getProfileData, getSiteShellData } from "@/lib/server/queries";
import { isManagedPublicPageEnabled } from "@/lib/public-page-visibility";
import { ProfileEditorialShell } from "@/components/sections/profile/profile-editorial-shell";

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

const PLACEHOLDER_LANGUAGES: LanguageEntry[] = [
  { label: "Language", proficiency: 0 },
  { label: "Language", proficiency: 0 },
  { label: "Language", proficiency: 0 },
];

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

const deriveYearsExperience = (experiences: { startDate: string }[]): number => {
  const years = experiences
    .map((item) => {
      const match = item.startDate.match(/(19|20)\d{2}/);
      return match ? Number(match[0]) : Number.NaN;
    })
    .filter((year) => Number.isFinite(year));

  if (years.length === 0) return 0;

  const firstYear = Math.min(...years);
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
      return { label, proficiency: Math.max(0, Math.min(100, proficiency)) };
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
  let settings: Settings | null = null;
  let experienceCards: WorkExperienceCard[] = [];
  let profilePageContent: Awaited<ReturnType<typeof getPageContent>> = null;
  let competencies: Awaited<ReturnType<typeof getCompetencies>> = [];
  let siteConfig: Awaited<ReturnType<typeof getSiteShellData>>["siteConfig"] = null;
  let socialLinks: Awaited<ReturnType<typeof getSiteShellData>>["footerSocialLinks"] = [];

  try {
    const [profileData, pageContent, competencyRows, shellData] = await Promise.all([
      getProfileData(),
      getPageContent("PROFILE"),
      getCompetencies(),
      getSiteShellData(),
    ]);

    settings = profileData.settings;
    experienceCards = profileData.experienceCards;
    profilePageContent = pageContent;
    competencies = competencyRows;
    siteConfig = shellData.siteConfig;
    socialLinks = shellData.footerSocialLinks;
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
  const displayName = profilePageContent?.title ?? settings?.heroTitle ?? siteConfig?.siteName ?? "Profile";
  const displayTitle = profilePageContent?.subtitle ?? settings?.heroSubtitle ?? siteConfig?.siteTagline ?? "";
  const displaySummary = asText(pageContent, "summary", settings?.aboutMe ?? "");
  const displayEmail = siteConfig?.primaryEmail ?? settings?.emailAddress ?? "";
  const displayResumeUrl = siteConfig?.resumeUrl ?? settings?.resumeUrl ?? "#";
  const displayLocation = siteConfig?.locationLabel ?? "";
  const yearsExperience = deriveYearsExperience(experiences);
  const professionalCompetencies = competencies
    .filter((item) => item.category === "COMMERCIAL_DELIVERY")
    .map((item) => item.name);
  const technicalCompetencies = competencies
    .filter((item) => item.category === "OPERATIONS_TECH")
    .map((item) => item.name);

  const languages = asLanguages(pageContent);
  const education = asEducation(pageContent);
  const hobbies = asStringArray(pageContent, "hobbies", []);
  const languageEntries = languages.length > 0 ? languages : PLACEHOLDER_LANGUAGES;
  const professionalSkillMeters = asSkillMeters(pageContent, "professionalSkills", professionalCompetencies);
  const technicalSkillMeters = asSkillMeters(pageContent, "technicalSkills", technicalCompetencies);

  return (
    <section className={PAGE_SECTION_Y_CLASS}>
      <ProfileEditorialShell
        introBadge={asText(pageContent, "profileIntroBadge", "Profile")}
        displayName={displayName}
        displayTitle={displayTitle}
        displaySummary={displaySummary}
        displayLocation={displayLocation}
        displayEmail={displayEmail}
        yearsExperience={yearsExperience}
        languageEntries={languageEntries}
        professionalSkillMeters={professionalSkillMeters}
        technicalSkillMeters={technicalSkillMeters}
        displayResumeUrl={displayResumeUrl}
        socialLinks={socialLinks}
        primaryCta={profilePageContent?.primaryCta ?? "Download Resume"}
        secondaryCta={profilePageContent?.secondaryCta ?? "Contact Me"}
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
