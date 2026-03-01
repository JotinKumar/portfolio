import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DIRECT_URL or DATABASE_URL for Prisma seed.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const settingsData = {
    id: 'default',
    resumeUrl: '/jotin-madugula-resume.pdf',
    linkedinUrl: 'https://linkedin.com/in/jotin',
    githubUrl: 'https://github.com/jotin',
    twitterUrl: '',
    emailAddress: 'contact@jotin.in',
    heroTitle: 'Jotin Kumar Madugula',
    heroSubtitle: 'Business Process Expert & AI Enthusiast',
    techHeroTitle: 'Jotin Kumar Madugula',
    techHeroSubtitle: 'Full Stack Developer & AI Explorer',
    aboutMe: 'Transforming operations through intelligent automation.',
    profileImage: '/profile.jpg',
  };

  await prisma.settings.upsert({
    where: { id: 'default' },
    update: settingsData,
    create: settingsData,
  });

  const siteConfigData = {
    id: 'default',
    siteName: 'Jotin Kumar Madugula',
    siteTagline: 'Business Process Expert & Full Stack Developer',
    logoUrl: '/images/logo.png',
    logoAlt: 'Jotin Portfolio Logo',
    resumeUrl: '/jotin-madugula-resume.pdf',
    primaryEmail: 'contact@jotin.in',
    locationLabel: 'Hyderabad, India',
    defaultTitle: 'Jotin Kumar Madugula - Portfolio',
    defaultDescription: 'Business Process Expert & Full Stack Developer',
  };

  await (prisma as any).siteConfig.upsert({
    where: { id: 'default' },
    update: siteConfigData,
    create: siteConfigData,
  });

  const navigationItems = [
    { label: 'Home', href: '/', position: 'HEADER', order: 1 },
    { label: 'Profile', href: '/profile', position: 'HEADER', order: 2 },
    { label: 'Articles', href: '/articles', position: 'HEADER', order: 3 },
    { label: 'Projects', href: '/projects', position: 'HEADER', order: 4 },
    { label: 'Contact', href: '/contact', position: 'HEADER', order: 5 },
    { label: 'Home', href: '/', position: 'FOOTER_QUICK', order: 1 },
    { label: 'Profile', href: '/profile', position: 'FOOTER_QUICK', order: 2 },
    { label: 'Articles', href: '/articles', position: 'FOOTER_QUICK', order: 3 },
    { label: 'Projects', href: '/projects', position: 'FOOTER_QUICK', order: 4 },
    { label: 'Resume', href: '/jotin-madugula-resume.pdf', position: 'FOOTER_RESOURCE', order: 1 },
    { label: 'Contact', href: '/contact', position: 'FOOTER_RESOURCE', order: 2 },
    { label: 'Privacy Policy', href: '/privacy', position: 'FOOTER_LEGAL', order: 1 },
    { label: 'Terms of Service', href: '/terms', position: 'FOOTER_LEGAL', order: 2 },
  ] as const;

  for (const item of navigationItems) {
    await (prisma as any).navigationItem.upsert({
      where: { id: `${item.position}-${item.order}` },
      update: { ...item },
      create: { id: `${item.position}-${item.order}`, ...item },
    });
  }

  const socialLinks = [
    { id: 'social-github', platform: 'github', label: 'GitHub', url: 'https://github.com/jotin', position: 'FOOTER', order: 1 },
    { id: 'social-linkedin', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/jotin', position: 'FOOTER', order: 2 },
    { id: 'social-twitter', platform: 'twitter', label: 'Twitter', url: 'https://twitter.com/jotin', position: 'FOOTER', order: 3 },
    { id: 'social-email', platform: 'email', label: 'Email', url: 'mailto:contact@jotin.in', position: 'FOOTER', order: 4 },
    { id: 'contact-linkedin', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/jotin', position: 'CONTACT', order: 1 },
    { id: 'contact-github', platform: 'github', label: 'GitHub', url: 'https://github.com/jotin', position: 'CONTACT', order: 2 },
    { id: 'contact-twitter', platform: 'twitter', label: 'Twitter', url: 'https://twitter.com/jotin', position: 'CONTACT', order: 3 },
  ] as const;

  for (const item of socialLinks) {
    await (prisma as any).socialLink.upsert({
      where: { id: item.id },
      update: { ...item },
      create: { ...item },
    });
  }

  const heroContent = {
    id: 'default',
    displayName: 'Jotin Kumar Madugula',
    professionalTitle: 'Pricing and Solutions Director',
    professionalSubtitle:
      'A seasoned professional with 21+ years of experience in the BPO/ITES industry, including 13 years in US Healthcare Operations and 8+ years in Pricing and Financial Strategy.',
    techTitle: 'Self-Taught Tech Enthusiast',
    techSubtitle:
      'A self-taught tech enthusiast driven by curiosity and a constant desire to learn. Actively exploring modern technologies including AI, machine learning, and full-stack development.',
    professionalSkills: [
      'Pricing & RFX',
      'Ops Leadership',
      'Cost Modeling',
      'Process Re-engineering',
      'Financial Analysis',
      'RPA & Automation',
      'Price-to-Win Strategy',
      'US Healthcare',
      'Analytics & MIS',
      'Global Governance',
    ],
    professionalInitialSkills: ['Pricing & RFX', 'Ops Leadership', 'Financial Analysis', 'US Healthcare'],
    techSkills: ['Python', 'Node.js', 'React', 'Next.js', 'TypeScript', 'AI & ML', 'Excel & VBA', 'RPA & Automation', 'Full Stack', 'UI Design'],
    techInitialSkills: ['AI & ML', 'Next.js', 'Python', 'Full Stack'],
    professionalImageUrl: '/images/professional-portrait.jpg',
    techImageUrl: '/images/tech-portrait.jpg',
    exploreProfessionalLabel: 'Explore Professional',
    exploreTechLabel: 'Explore Tech Side',
    resetViewLabel: 'Reset View',
    downloadResumeLabel: 'Download Resume',
    getInTouchLabel: 'Get in Touch',
    viewProjectsLabel: 'View Projects',
    viewArticlesLabel: 'View Articles',
    homeWorkSectionTitle: 'Work Experience',
    homeFeaturedArticlesTitle: 'Featured Articles',
    homeFeaturedProjectsTitle: 'Featured Projects',
    homeViewAllArticlesLabel: 'View All Articles',
    homeViewAllProjectsLabel: 'View All Projects',
  };

  await (prisma as any).heroContent.upsert({
    where: { id: 'default' },
    update: heroContent,
    create: heroContent,
  });

  const pageContentRows = [
    {
      page: 'HOME',
      title: 'Home',
      subtitle: 'Business and technology perspectives, projects, and career highlights.',
      emptyTitle: null,
      emptyMessage: null,
      primaryCta: null,
      secondaryCta: null,
      content: null,
    },
    {
      page: 'PROFILE',
      title: 'Jotin Kumar Madugula',
      subtitle: 'Pricing and Solutions Director',
      emptyTitle: null,
      emptyMessage: null,
      primaryCta: 'Download Resume',
      secondaryCta: 'Contact Me',
      content: {
        summary:
          'A seasoned professional with 21+ years of experience in the BPO/ITES industry, including 13 years in US Healthcare Operations and 8+ years in Pricing and Financial Strategy.',
        profileIntroBadge: 'Hybrid Resume Profile',
        professionalSummaryTitle: 'Professional Summary',
        professionalSummarySubtitle: 'Executive overview tailored for pricing, operations, and transformation leadership.',
        timelineTitle: 'Experience Timeline',
        timelineSubtitle: 'Role progression with delivery impact, capabilities, and measurable contributions.',
        quickFactsTitle: 'Quick Facts',
        quickFactLocationLabel: 'Location',
        quickFactExperienceLabel: 'Experience',
        quickFactFocusLabel: 'Current Focus',
        achievementsTitle: 'Key Achievements',
        skillsTitle: 'Skills',
        commercialDeliveryTitle: 'Commercial & Delivery',
        operationsTechnologyTitle: 'Operations & Technology',
        contactLinksTitle: 'Contact & Links',
        contactLinksSubtitle: 'Available for consulting, leadership opportunities, and strategic partnerships.',
      },
    },
    {
      page: 'ARTICLES',
      title: 'Articles',
      subtitle: 'Thoughts on business processes, technology, and the future of work.',
      emptyTitle: 'No articles found',
      emptyMessage: 'Try adjusting your filters to see more articles.',
      primaryCta: 'All',
      secondaryCta: 'Clear',
      content: {
        tagLabel: 'Tag:',
        defaultEmptyMessage: 'Articles will appear here once they are published.',
      },
    },
    {
      page: 'PROJECTS',
      title: 'Projects',
      subtitle: 'A showcase of my latest work in web development, automation, and digital transformation.',
      emptyTitle: 'No projects yet',
      emptyMessage: 'Projects will appear here once they are added.',
      primaryCta: 'All',
      secondaryCta: null,
      content: null,
    },
    {
      page: 'CONTACT',
      title: 'Get in Touch',
      subtitle: "Have a project in mind or just want to chat? I'd love to hear from you.",
      emptyTitle: null,
      emptyMessage: null,
      primaryCta: 'Send Message',
      secondaryCta: 'Sending...',
      content: {
        formTitle: 'Send a Message',
        formSubtitle: "Fill out the form below and I'll get back to you within 24 hours.",
        nameLabel: 'Name',
        emailLabel: 'Email',
        messageLabel: 'Message',
        namePlaceholder: 'Your full name',
        emailPlaceholder: 'your.email@example.com',
        messagePlaceholder: 'Tell me about your project or just say hello!',
        infoTitle: 'Contact Information',
        infoSubtitle: 'Prefer a different way to reach out? Here are some alternatives.',
        infoEmailLabel: 'Email',
        infoLocationLabel: 'Location',
        infoLocationValue: 'Remote • Available Globally',
        infoResponseTimeLabel: 'Response Time',
        infoResponseTimeValue: 'Within 24 hours',
        socialTitle: "Let's Connect",
        socialSubtitle: 'Follow me on social media for updates and insights.',
        successMessage: "Message sent successfully! I'll get back to you soon.",
        errorMessage: 'Failed to send message',
        unexpectedErrorMessage: 'An error occurred while sending your message',
      },
    },
  ] as const;

  for (const row of pageContentRows) {
    await (prisma as any).pageContent.upsert({
      where: { page: row.page },
      update: row,
      create: row,
    });
  }

  const competencies = [
    { name: 'Strategic Pricing & RFX Ownership', category: 'COMMERCIAL_DELIVERY', order: 1 },
    { name: 'Multi-Geo Cost Modelling', category: 'COMMERCIAL_DELIVERY', order: 2 },
    { name: 'Executive Financial Storytelling', category: 'COMMERCIAL_DELIVERY', order: 3 },
    { name: 'Price-to-Win Strategy', category: 'COMMERCIAL_DELIVERY', order: 4 },
    { name: 'US Healthcare Life Cycle Expertise', category: 'COMMERCIAL_DELIVERY', order: 5 },
    { name: 'Operations Leadership', category: 'OPERATIONS_TECH', order: 1 },
    { name: 'Process Re-engineering', category: 'OPERATIONS_TECH', order: 2 },
    { name: 'RPA and Automation', category: 'OPERATIONS_TECH', order: 3 },
    { name: 'MIS & Performance Analytics', category: 'OPERATIONS_TECH', order: 4 },
    { name: 'Global Stakeholder Governance', category: 'OPERATIONS_TECH', order: 5 },
  ] as const;

  for (const item of competencies) {
    await (prisma as any).competency.upsert({
      where: { id: `${item.category}-${item.order}` },
      update: item,
      create: { id: `${item.category}-${item.order}`, ...item },
    });
  }

  const work1Data = {
    id: 'work1',
    company: 'Tech Solutions Inc.',
    role: 'Senior Business Process Analyst',
    location: 'Remote',
    type: 'full-time',
    description: 'Led digital transformation initiatives for major clients.',
    achievements: JSON.stringify([
      'Reduced processing time by 40%',
      'Implemented AI-driven automation solutions',
      'Managed team of 8+ analysts',
    ]),
    skills: JSON.stringify([
      'Process Optimization',
      'AI Integration',
      'Team Leadership',
      'Strategic Planning',
    ]),
    startDate: new Date('2022-01-01'),
    current: true,
    order: 1,
  };

  await prisma.workExperience.upsert({
    where: { id: 'work1' },
    update: work1Data,
    create: work1Data,
  });

  const work2Data = {
    id: 'work2',
    company: 'Innovation Corp',
    role: 'Process Improvement Manager',
    location: 'New York, NY',
    type: 'full-time',
    description: 'Streamlined operations and implemented automation solutions.',
    achievements: JSON.stringify([
      'Increased efficiency by 35%',
      'Led cross-functional teams',
      'Deployed RPA solutions',
    ]),
    skills: JSON.stringify(['Business Analysis', 'Project Management', 'RPA', 'Six Sigma']),
    startDate: new Date('2020-03-01'),
    endDate: new Date('2021-12-31'),
    current: false,
    order: 2,
  };

  await prisma.workExperience.upsert({
    where: { id: 'work2' },
    update: work2Data,
    create: work2Data,
  });

  const article1Data = {
    title: 'AI Transformation in Business Processes',
    slug: 'ai-transformation-business-processes',
    excerpt:
      'How artificial intelligence is revolutionizing the way we approach business process optimization and what it means for the future of work.',
    content: `# AI Transformation in Business Processes

Artificial Intelligence is not just a buzzword anymore - it is a fundamental shift in how we approach business processes. In this article, we explore practical applications of AI in process optimization and real-world impact on organizations.

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

The future of work is not about replacing humans - it is about augmenting human capabilities with AI.`,
    tags: 'AI,Business Processes,Automation,Digital Transformation',
    category: 'Technology',
    published: true,
    featured: true,
    readTime: 5,
    publishedAt: new Date(),
  };

  await prisma.article.upsert({
    where: { slug: article1Data.slug },
    update: article1Data,
    create: article1Data,
  });

  const article2Data = {
    title: 'Remote Work Productivity Tips for Teams',
    slug: 'remote-work-productivity-tips',
    excerpt:
      'Practical strategies for maintaining high productivity levels while working remotely, based on real-world experience managing distributed teams.',
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
    featured: false,
    readTime: 7,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  };

  await prisma.article.upsert({
    where: { slug: article2Data.slug },
    update: article2Data,
    create: article2Data,
  });

  const project1Data = {
    title: 'Personal Portfolio Website',
    slug: 'portfolio-website',
    description:
      'A modern, responsive portfolio website built with Next.js, featuring a dual-personality design that toggles between professional and technical modes. Includes an admin dashboard for content management.',
    shortDesc: 'Modern portfolio website with dual-personality design and admin dashboard',
    category: 'Web Development',
    status: 'completed',
    order: 1,
    featured: true,
    liveUrl: 'https://jotin.in',
    githubUrl: 'https://github.com/jotin/portfolio',
    coverImage: '/images/projects/portfolio-cover.jpg',
    screenshots: JSON.stringify([
      '/images/projects/portfolio-1.jpg',
      '/images/projects/portfolio-2.jpg',
      '/images/projects/portfolio-3.jpg',
    ]),
    techStack:
      'Next.js, TypeScript, TailwindCSS, Prisma, PostgreSQL, Supabase, shadcn/ui, Framer Motion',
    tags: 'Next.js,TypeScript,TailwindCSS,Portfolio',
  };

  await prisma.project.upsert({
    where: { slug: project1Data.slug },
    update: project1Data,
    create: project1Data,
  });

  const project2Data = {
    title: 'Business Process Automation Dashboard',
    slug: 'automation-dashboard',
    description:
      'A comprehensive dashboard for monitoring and managing automated business processes. Features real-time analytics, workflow visualization, and performance metrics to help organizations optimize their automation initiatives.',
    shortDesc: 'Dashboard for monitoring automated business processes with real-time analytics',
    category: 'Business Intelligence',
    status: 'in-progress',
    order: 2,
    featured: false,
    coverImage: '/images/projects/dashboard-cover.jpg',
    screenshots: JSON.stringify(['/images/projects/dashboard-1.jpg', '/images/projects/dashboard-2.jpg']),
    techStack: 'React, Node.js, PostgreSQL, D3.js, Express, Docker',
    tags: 'React,Dashboard,Analytics,Automation',
  };

  await prisma.project.upsert({
    where: { slug: project2Data.slug },
    update: project2Data,
    create: project2Data,
  });

  console.log('Database has been seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
