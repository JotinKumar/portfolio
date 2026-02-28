import { WorkTimeline } from "@/components/sections/work-timeline";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { HeroSplitClient } from "@/components/sections/hero/HeroSplitClient";
import { getFeaturedArticles, getFeaturedProjects, getWorkExperienceCards } from "@/lib/server/queries";
import type { WorkExperienceCard } from "@/lib/db-types";
import { RESUME_EXPERIENCES } from "@/lib/resume-data";

// Use Incremental Static Regeneration (ISR) instead of force-dynamic
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div>
        <HeroSplitClient />
        <WorkTimeline experiences={[]} />
        <FeaturedArticles articles={[]} />
        <FeaturedProjects projects={[]} />
      </div>
    );
  }

  const safeQuery = async <T,>(label: string, query: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await query();
    } catch (error) {
      console.error(`Failed to fetch ${label}:`, error);
      return fallback;
    }
  };

  // Fetch content in parallel with resilient fallbacks per query
  const [workExperienceCards, featuredArticles, featuredProjects] = await Promise.all([
    safeQuery("work experience cards", getWorkExperienceCards, [] as WorkExperienceCard[]),
    safeQuery("featured articles", () => getFeaturedArticles(3), [] as Awaited<ReturnType<typeof getFeaturedArticles>>),
    safeQuery("featured projects", () => getFeaturedProjects(3), [] as Awaited<ReturnType<typeof getFeaturedProjects>>),
  ]);

  const parseStringArray = (value: string): string[] => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const formattedExperiences =
    workExperienceCards.length > 0
      ? workExperienceCards.map((exp) => ({
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
        }))
      : RESUME_EXPERIENCES;

  return (
    <div>
      <HeroSplitClient />
      <WorkTimeline experiences={formattedExperiences} />
      <FeaturedArticles articles={featuredArticles} />
      <FeaturedProjects projects={featuredProjects} />
    </div>
  );
}
