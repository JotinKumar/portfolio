import { WorkTimeline } from "@/components/sections/work-timeline";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import HeroSplit from "@/components/sections/hero/HeroSplit";
import { prisma } from "@/lib/prisma";

// Use Incremental Static Regeneration (ISR) instead of force-dynamic
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch data in parallel for better performance
  const [experiencesResult, articlesResult, projectsResult] = await Promise.allSettled([
    prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
    prisma.article.findMany({
      where: { featured: true, published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
  ]);

  const experiences = experiencesResult.status === 'fulfilled' ? experiencesResult.value : [];
  const featuredArticles = articlesResult.status === 'fulfilled' ? articlesResult.value : [];
  const featuredProjects = projectsResult.status === 'fulfilled' ? projectsResult.value : [];

  if (experiencesResult.status === 'rejected') {
    console.error("Failed to fetch work experiences:", experiencesResult.reason);
  }
  if (articlesResult.status === 'rejected') {
    console.error("Failed to fetch articles:", articlesResult.reason);
  }
  if (projectsResult.status === 'rejected') {
    console.error("Failed to fetch projects:", projectsResult.reason);
  }

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
    achievements: exp.achievements,
    skills: exp.skills,
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
