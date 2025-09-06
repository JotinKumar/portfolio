import { HeroToggle } from '@/components/sections/hero-toggle';
import { WorkTimeline } from '@/components/sections/work-timeline';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  // Fetch work experience data
  const experiences = await prisma.workExperience.findMany({
    orderBy: { order: 'asc' },
  });

  // Transform data for the component
  const formattedExperiences = experiences.map(exp => ({
    id: exp.id,
    company: exp.company,
    role: exp.role,
    location: exp.location,
    startDate: exp.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    endDate: exp.endDate?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    current: exp.current,
    description: exp.description,
    achievements: JSON.parse(exp.achievements),
    skills: JSON.parse(exp.skills),
  }));

  return (
    <div>
      <HeroToggle />
      <WorkTimeline experiences={formattedExperiences} />
    </div>
  );
}
