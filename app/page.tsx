import { WorkTimeline } from "@/components/sections/work-timeline";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import HeroSplit from "@/components/sections/hero/HeroSplit";
import { prisma } from "@/lib/prisma";

// Use Incremental Static Regeneration (ISR) instead of force-dynamic
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  if (!process.env.DATABASE_URL) {
    return (
      <div>
        <HeroSplit />
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

  // Fetch data in parallel with resilient fallbacks per query
  const [experiences, featuredArticles, featuredProjects] = await Promise.all([
    safeQuery("work experiences", () => prisma.workExperience.findMany({ orderBy: { order: "asc" } }), []),
    safeQuery(
      "featured articles",
      () =>
        prisma.article.findMany({
          where: { featured: true, published: true },
          orderBy: { publishedAt: "desc" },
          take: 3,
        }),
      []
    ),
    safeQuery(
      "featured projects",
      () =>
        prisma.project.findMany({
          where: { featured: true },
          orderBy: { order: "asc" },
          take: 3,
        }),
      []
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

  // Transform data for the component
  const formattedExperiences = experiences.map((exp) => ({
    id: exp.id,
    company: exp.company,
    role: exp.role,
    location: exp.location,
    startDate: exp.startDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    endDate: exp.endDate?.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    current: exp.current,
    description: exp.description,
    achievements: parseStringArray(exp.achievements),
    skills: parseStringArray(exp.skills),
  }));

  return (
    <div>
      <HeroSplit />
      <WorkTimeline experiences={formattedExperiences} />
      <FeaturedArticles articles={featuredArticles} />
      <FeaturedProjects projects={featuredProjects} />
    </div>
  );
}
