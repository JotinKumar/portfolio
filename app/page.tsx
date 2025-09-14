import { WorkTimeline } from "@/components/sections/work-timeline";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import HeroSplit from "@/components/sections/hero/HeroSplit";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = "force-dynamic";

export default async function Home() {
  let experiences: any[] = [];
  let featuredArticles: any[] = [];
  let featuredProjects: any[] = [];

  try {
    // Fetch work experience data
    experiences = await prisma.workExperience.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.log(
      "Database not available for work experiences, using empty state"
    );
  }

  try {
    // Fetch featured articles
    featuredArticles = await prisma.article.findMany({
      where: { featured: true, published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.log("Database not available for articles, using empty state");
  }

  try {
    // Fetch featured projects
    featuredProjects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 3,
    });
  } catch (error) {
    console.log("Database not available for projects, using empty state");
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
