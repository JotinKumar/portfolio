import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Settings, WorkExperienceCard } from "@/lib/db-types";
import { getCompetencies, getPageContent, getProfileData, getSiteShellData } from "@/lib/server/queries";
import { Calendar, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";

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

export default async function ProfilePage() {
  let settings: Settings | null = null;
  let experienceCards: WorkExperienceCard[] = [];
  let profilePageContent: Awaited<ReturnType<typeof getPageContent>> = null;
  let competencies: Awaited<ReturnType<typeof getCompetencies>> = [];
  let siteConfig: Awaited<ReturnType<typeof getSiteShellData>>["siteConfig"] = null;

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
  } catch {
    // Render empty state when database is unavailable.
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
  const summaryLead = displaySummary.split(".")[0]?.trim() || displaySummary;
  const yearsExperience = deriveYearsExperience(experiences);
  const currentRole = experiences.find((exp) => exp.current)?.role || displayTitle;
  const commercialCompetencies = competencies.filter((item) => item.category === "COMMERCIAL_DELIVERY").map((item) => item.name);
  const operationsCompetencies = competencies.filter((item) => item.category === "OPERATIONS_TECH").map((item) => item.name);

  return (
    <section className="py-12 md:py-16">
      <div className="w-full max-w-6xl mx-auto space-y-10">
        <div className="relative overflow-hidden rounded-3xl border bg-card/70 p-6 shadow-sm animate-in fade-in duration-500 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-primary),transparent_78%)_0%,transparent_48%)]" />
          <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:gap-10">
            <div className="space-y-5">
              <Badge className="rounded-full px-3 py-1 text-xs tracking-wide">{asText(pageContent, "profileIntroBadge", "Profile")}</Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight md:text-5xl">{displayName}</h1>
                <p className="text-lg font-semibold text-primary md:text-2xl">{displayTitle}</p>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{summaryLead}.</p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <a href={displayResumeUrl} target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    {profilePageContent?.primaryCta ?? "Download Resume"}
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`mailto:${displayEmail}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    {profilePageContent?.secondaryCta ?? "Contact Me"}
                  </a>
                </Button>
              </div>
            </div>

            <Card className="border-primary/20 bg-background/70 backdrop-blur-sm animate-in slide-in-from-right-4 duration-500">
              <CardHeader>
                <CardTitle className="text-lg">{asText(pageContent, "quickFactsTitle", "Quick Facts")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{asText(pageContent, "quickFactLocationLabel", "Location")}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {displayLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{asText(pageContent, "quickFactExperienceLabel", "Experience")}</span>
                  <span className="font-medium">{yearsExperience}+ years</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{asText(pageContent, "quickFactFocusLabel", "Current Focus")}</span>
                  <span className="font-medium text-right">{currentRole}</span>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {commercialCompetencies.slice(0, 4).map((item) => (
                    <Badge key={item} variant="secondary" className="text-[11px]">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <CardHeader>
            <CardTitle>{asText(pageContent, "professionalSummaryTitle", "Professional Summary")}</CardTitle>
            <CardDescription>{asText(pageContent, "professionalSummarySubtitle", "")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">{displaySummary}</p>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{asText(pageContent, "timelineTitle", "Experience Timeline")}</h2>
            <p className="text-sm text-muted-foreground md:text-base">{asText(pageContent, "timelineSubtitle", "")}</p>
          </div>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <Card
                key={exp.id}
                className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ${exp.current ? "border-primary/40 shadow-md" : ""}`}
              >
                <CardHeader className="space-y-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-xl">{exp.role}</CardTitle>
                        {exp.current ? <Badge>Current</Badge> : null}
                      </div>
                      <p className="text-sm font-medium text-muted-foreground md:text-base">{exp.company}</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground md:text-right">
                      <div className="flex items-center gap-1 md:justify-end">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {exp.startDate} - {exp.endDate || "Present"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 md:justify-end">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">{exp.description}</p>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {asText(pageContent, "achievementsTitle", "Key Achievements")}
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={`${exp.id}-ach-${idx}`} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {asText(pageContent, "skillsTitle", "Skills")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <Badge key={`${exp.id}-skill-${skill}`} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-in fade-in slide-in-from-left-2 duration-500">
            <CardHeader>
              <CardTitle>{asText(pageContent, "commercialDeliveryTitle", "Commercial & Delivery")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {commercialCompetencies.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-right-2 duration-500">
            <CardHeader>
              <CardTitle>{asText(pageContent, "operationsTechnologyTitle", "Operations & Technology")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {operationsCompetencies.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-card/80 animate-in fade-in duration-500">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{asText(pageContent, "contactLinksTitle", "Contact & Links")}</h3>
              <p className="text-sm text-muted-foreground">{asText(pageContent, "contactLinksSubtitle", "")}</p>
              <p className="text-sm font-medium">{displayEmail}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${displayEmail}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </a>
              </Button>
              {settings?.linkedinUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              ) : null}
              {settings?.githubUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              ) : null}
              <Button size="sm" asChild>
                <a href={displayResumeUrl} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  {profilePageContent?.primaryCta ?? "Resume"}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
