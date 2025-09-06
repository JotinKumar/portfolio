import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@jotin.in' },
    update: {},
    create: {
      email: 'admin@jotin.in',
      password: hashedPassword,
    },
  });

  // Create initial settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      resumeUrl: '/resume.pdf',
      linkedinUrl: 'https://linkedin.com/in/jotin',
      githubUrl: 'https://github.com/jotin',
      twitterUrl: '',
      emailAddress: 'contact@jotin.in',
      heroTitle: 'Jotin Kumar Madugula',
      heroSubtitle: 'Business Process Expert & AI Enthusiast',
      techHeroTitle: 'Jotin Kumar Madugula',
      techHeroSubtitle: 'Full Stack Developer & AI Explorer',
      aboutMe: 'Transforming operations through intelligent automation...',
      profileImage: '/profile.jpg',
    },
  });

  // Create work experience
  await prisma.workExperience.upsert({
    where: { id: 'work1' },
    update: {},
    create: {
      id: 'work1',
      company: 'Tech Solutions Inc.',
      role: 'Senior Business Process Analyst',
      location: 'Remote',
      type: 'full-time',
      description: 'Led digital transformation initiatives for major clients.',
      achievements: JSON.stringify([
        'Reduced processing time by 40%',
        'Implemented AI-driven automation solutions',
        'Managed team of 8+ analysts'
      ]),
      skills: JSON.stringify([
        'Process Optimization',
        'AI Integration',
        'Team Leadership',
        'Strategic Planning'
      ]),
      startDate: new Date('2022-01-01'),
      current: true,
      order: 1,
    },
  });

  await prisma.workExperience.upsert({
    where: { id: 'work2' },
    update: {},
    create: {
      id: 'work2',
      company: 'Innovation Corp',
      role: 'Process Improvement Manager',
      location: 'New York, NY',
      type: 'full-time',
      description: 'Streamlined operations and implemented automation solutions.',
      achievements: JSON.stringify([
        'Increased efficiency by 35%',
        'Led cross-functional teams',
        'Deployed RPA solutions'
      ]),
      skills: JSON.stringify([
        'Business Analysis',
        'Project Management',
        'RPA',
        'Six Sigma'
      ]),
      startDate: new Date('2020-03-01'),
      endDate: new Date('2021-12-31'),
      current: false,
      order: 2,
    },
  });

  // Create sample articles
  await prisma.article.upsert({
    where: { slug: 'ai-transformation-business-processes' },
    update: {},
    create: {
      title: 'AI Transformation in Business Processes',
      slug: 'ai-transformation-business-processes',
      excerpt: 'How artificial intelligence is revolutionizing the way we approach business process optimization and what it means for the future of work.',
      content: `# AI Transformation in Business Processes

Artificial Intelligence is not just a buzzword anymore—it's a fundamental shift in how we approach business processes. In this article, we'll explore the practical applications of AI in process optimization and the real-world impact it's having on organizations.

## The Current Landscape

Traditional business processes often involve repetitive tasks that consume valuable human resources. With AI, we can automate these processes while improving accuracy and speed.

## Key Benefits

- **Efficiency**: Automated processes run 24/7 without breaks
- **Accuracy**: Reduced human error in data processing
- **Scalability**: Easy to scale operations up or down
- **Cost Reduction**: Lower operational costs over time

## Implementation Strategies

1. Start with simple, repetitive tasks
2. Gradually move to more complex processes
3. Ensure proper change management
4. Invest in employee training

The future of work isn't about replacing humans—it's about augmenting human capabilities with AI.`,
      tags: 'AI,Business Processes,Automation,Digital Transformation',
      category: 'Technology',
      published: true,
      readTime: 5,
      publishedAt: new Date(),
    },
  });

  await prisma.article.upsert({
    where: { slug: 'remote-work-productivity-tips' },
    update: {},
    create: {
      title: 'Remote Work Productivity Tips for Teams',
      slug: 'remote-work-productivity-tips',
      excerpt: 'Practical strategies for maintaining high productivity levels while working remotely, based on real-world experience managing distributed teams.',
      content: `# Remote Work Productivity Tips for Teams

Remote work has become the new normal, but maintaining productivity in a distributed environment requires intentional strategies and tools.

## Communication is Key

Effective communication becomes even more critical when team members are distributed across different locations and time zones.

### Best Practices

- Use asynchronous communication tools
- Set clear expectations for response times
- Have regular one-on-one check-ins
- Document important decisions

## Tools That Make a Difference

The right tools can make or break a remote team's productivity:

1. **Project Management**: Asana, Trello, or Monday.com
2. **Communication**: Slack, Discord, or Microsoft Teams
3. **Video Calls**: Zoom, Google Meet, or Loom
4. **Documentation**: Notion, Confluence, or GitBook

## Creating Boundaries

One of the biggest challenges in remote work is maintaining work-life balance.`,
      tags: 'Remote Work,Productivity,Team Management,Leadership',
      category: 'Leadership',
      published: true,
      readTime: 7,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  // Create sample projects
  await prisma.project.upsert({
    where: { slug: 'portfolio-website' },
    update: {},
    create: {
      title: 'Personal Portfolio Website',
      slug: 'portfolio-website',
      description: 'A modern, responsive portfolio website built with Next.js, featuring a dual-personality design that toggles between professional and technical modes. Includes an admin dashboard for content management.',
      shortDesc: 'Modern portfolio website with dual-personality design and admin dashboard',
      category: 'Web Development',
      status: 'completed',
      order: 1,
      liveUrl: 'https://jotin.in',
      githubUrl: 'https://github.com/jotin/portfolio',
      coverImage: '/images/projects/portfolio-cover.jpg',
      screenshots: JSON.stringify([
        '/images/projects/portfolio-1.jpg',
        '/images/projects/portfolio-2.jpg',
        '/images/projects/portfolio-3.jpg'
      ]),
      techStack: 'Next.js, TypeScript, TailwindCSS, Prisma, SQLite, shadcn/ui, Framer Motion',
      tags: 'Next.js,TypeScript,TailwindCSS,Portfolio',
    },
  });

  await prisma.project.upsert({
    where: { slug: 'automation-dashboard' },
    update: {},
    create: {
      title: 'Business Process Automation Dashboard',
      slug: 'automation-dashboard',
      description: 'A comprehensive dashboard for monitoring and managing automated business processes. Features real-time analytics, workflow visualization, and performance metrics to help organizations optimize their automation initiatives.',
      shortDesc: 'Dashboard for monitoring automated business processes with real-time analytics',
      category: 'Business Intelligence',
      status: 'in-progress',
      order: 2,
      coverImage: '/images/projects/dashboard-cover.jpg',
      screenshots: JSON.stringify([
        '/images/projects/dashboard-1.jpg',
        '/images/projects/dashboard-2.jpg'
      ]),
      techStack: 'React, Node.js, PostgreSQL, D3.js, Express, Docker',
      tags: 'React,Dashboard,Analytics,Automation',
    },
  });

  console.log('Database has been seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());