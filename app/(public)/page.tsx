import { WorkTimeline } from "@/components/sections/work-timeline";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import HeroSplit from "@/components/sections/hero/HeroSplit";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Article, Project, WorkExperienceCard } from "@/lib/db-types";
import { RESUME_EXPERIENCES } from "@/lib/resume-data";

// Use Incremental Static Regeneration (ISR) instead of force-dynamic
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div>
        <HeroSplit />
        <WorkTimeline experiences={[]} />
        <FeaturedArticles articles={[]} />
        <FeaturedProjects projects={[]} />
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();

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
    safeQuery("work experience cards", async () => {
      const { data, error } = await supabase
        .from("WorkExperienceCard")
        .select("*")
        .order("order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as WorkExperienceCard[];
    }, [] as WorkExperienceCard[]),
    safeQuery(
      "featured articles",
      async () => {
        const { data, error } = await supabase
          .from("Article")
          .select("*")
          .eq("featured", true)
          .eq("published", true)
          .order("publishedAt", { ascending: false, nullsFirst: false })
          .limit(3);
        if (error) throw error;
        return (data ?? []) as Article[];
      },
      [] as Article[]
    ),
    safeQuery(
      "featured projects",
      async () => {
        const { data, error } = await supabase
          .from("Project")
          .select("*")
          .eq("featured", true)
          .order("order", { ascending: true })
          .limit(3);
        if (error) throw error;
        return (data ?? []) as Project[];
      },
      [] as Project[]
    ),
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
      <HeroSplit />
      <WorkTimeline experiences={formattedExperiences} />
      <FeaturedArticles articles={featuredArticles} />
      <FeaturedProjects projects={featuredProjects} />
    </div>
  );
}
