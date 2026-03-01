import { WorkTimeline } from "@/components/sections/work-timeline";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { HeroSplitClient } from "@/components/sections/hero/HeroSplitClient";
import {
  getFeaturedArticles,
  getFeaturedProjects,
  getHeroContent,
  getSiteShellData,
  getWorkExperienceCards,
} from "@/lib/server/queries";
import type { WorkExperienceCard } from "@/lib/db-types";

export const revalidate = 3600;

export default async function Home() {
  const safeQuery = async <T,>(query: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await query();
    } catch {
      return fallback;
    }
  };

  const [shellData, heroContent, workExperienceCards, featuredArticles, featuredProjects] = await Promise.all([
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
    safeQuery(() => getFeaturedArticles(3), [] as Awaited<ReturnType<typeof getFeaturedArticles>>),
    safeQuery(() => getFeaturedProjects(3), [] as Awaited<ReturnType<typeof getFeaturedProjects>>),
  ]);

  if (!heroContent) {
    return (
      <div>
        <WorkTimeline experiences={[]} title="Work Experience" />
        <FeaturedArticles articles={featuredArticles} title="Featured Articles" viewAllLabel="View All Articles" />
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
      <WorkTimeline experiences={formattedExperiences} title={heroContent.homeWorkSectionTitle} />
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
