import { WorkTimeline } from "@/components/home/work-timeline";
import { FeaturedArticles } from "@/components/home/featured-articles";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { HeroSplitClient } from "@/components/home/HeroSplitClient";
import {
  getFeaturedArticles,
  getFeaturedProjects,
  getHeroContent,
  getProfileMilestones,
  getSiteShellData,
  getWorkExperienceCards,
} from "@/lib/server/queries";
import type { ProfileMilestone, WorkExperienceCard } from "@/lib/db-types";

const FALLBACK_HOME_MILESTONES: ProfileMilestone[] = [
  { id: "milestone-process-associate", title: "Process Associate", month: "Jun", year: 2004, order: 1, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-sr-mis-analyst", title: "Sr. MIS Analyst", month: "Apr", year: 2007, order: 2, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-team-lead-ops-mis", title: "Team Lead (Ops & MIS)", month: "Apr", year: 2008, order: 3, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-assistant-manager", title: "Assistant Manager", month: "Apr", year: 2010, order: 4, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-deputy-manager", title: "Deputy Manager", month: "Oct", year: 2011, order: 5, visible: true, createdAt: "", updatedAt: "" },
  { id: "milestone-operations-manager", title: "Operations Manager", month: "Apr", year: 2013, order: 6, visible: true, createdAt: "", updatedAt: "" },
  {
    id: "milestone-senior-manager-pricing-healthcare",
    title: "Senior Manager, Pricing & Healthcare Solutions",
    month: "Oct",
    year: 2016,
    order: 7,
    visible: true,
    createdAt: "",
    updatedAt: "",
  },
  { id: "milestone-director-pricing-solutions", title: "Director, Pricing & Solutions", month: "Jan", year: 2026, order: 8, visible: true, createdAt: "", updatedAt: "" },
];

export const revalidate = 3600;

export default async function Home() {
  const safeQuery = async <T,>(query: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await query();
    } catch {
      return fallback;
    }
  };

  const [shellData, heroContent, workExperienceCards, featuredArticles, featuredProjects, milestones] = await Promise.all([
    safeQuery(getSiteShellData, {
      siteConfig: null,
      headerNav: [],
      footerQuickLinks: [],
      footerResourceLinks: [],
      footerLegalLinks: [],
      footerSocialLinks: [],
    }),
    safeQuery(getHeroContent, null),
    safeQuery(getWorkExperienceCards, [] as WorkExperienceCard[]),
    safeQuery(() => getFeaturedArticles(4), [] as Awaited<ReturnType<typeof getFeaturedArticles>>),
    safeQuery(() => getFeaturedProjects(3), [] as Awaited<ReturnType<typeof getFeaturedProjects>>),
    safeQuery(getProfileMilestones, [] as ProfileMilestone[]),
  ]);

  if (!heroContent) {
    return (
      <div>
        <WorkTimeline experiences={[]} milestones={FALLBACK_HOME_MILESTONES} title="Work Experience" />
        <FeaturedArticles articles={featuredArticles} title="Featured Blogs" viewAllLabel="View All Blogs" />
        <FeaturedProjects projects={featuredProjects} title="Featured Projects" viewAllLabel="View All Projects" />
      </div>
    );
  }

  const parseStringArray = (value: string): string[] => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const formattedExperiences = workExperienceCards.map((exp) => ({
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

  return (
    <div>
      <HeroSplitClient heroContent={heroContent} siteConfig={shellData.siteConfig} />
      <WorkTimeline experiences={formattedExperiences} milestones={milestones.length > 0 ? milestones : FALLBACK_HOME_MILESTONES} title={heroContent.homeWorkSectionTitle} />
      <FeaturedArticles
        articles={featuredArticles}
        title={heroContent.homeFeaturedArticlesTitle}
        viewAllLabel={heroContent.homeViewAllArticlesLabel}
      />
      <FeaturedProjects
        projects={featuredProjects}
        title={heroContent.homeFeaturedProjectsTitle}
        viewAllLabel={heroContent.homeViewAllProjectsLabel}
      />
    </div>
  );
}
