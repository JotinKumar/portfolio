import fs from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from '@prisma/client';

const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DIRECT_URL or DATABASE_URL for Prisma seed.');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
});

async function main() {
  console.log('Seeding database...');

  const siteConfigData = {
    id: 'default',
    siteName: 'Jotin Kumar Madugula',
    siteTagline: 'Business Process Expert & Full Stack Developer',
    logoUrl: '/images/logo.png',
    logoAlt: 'Jotin Portfolio Logo',
    resumeUrl: '/jotin-madugula-resume.pdf',
    primaryEmail: 'contact@jotin.in',
    phone: '+91 90596 71178',
    locationLabel: 'Hyderabad, India',
    defaultTitle: 'Jotin Kumar Madugula - Portfolio',
    defaultDescription: 'Business Process Expert & Full Stack Developer',
  };

  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: siteConfigData,
    create: siteConfigData,
  });

  const navigationItems = [
    { label: 'Home', href: '/', position: 'HEADER', order: 1 },
    { label: 'Profile', href: '/profile', position: 'HEADER', order: 2 },
    { label: 'Blogs', href: '/blogs', position: 'HEADER', order: 3 },
    { label: 'Projects', href: '/projects', position: 'HEADER', order: 4 },
    { label: 'Contact', href: '/contact', position: 'HEADER', order: 5 },
    { label: 'Home', href: '/', position: 'FOOTER_QUICK', order: 1 },
    { label: 'Profile', href: '/profile', position: 'FOOTER_QUICK', order: 2 },
    { label: 'Blogs', href: '/blogs', position: 'FOOTER_QUICK', order: 3 },
    { label: 'Projects', href: '/projects', position: 'FOOTER_QUICK', order: 4 },
    { label: 'Resume', href: '/jotin-madugula-resume.pdf', position: 'FOOTER_RESOURCE', order: 1 },
    { label: 'Contact', href: '/contact', position: 'FOOTER_RESOURCE', order: 2 },
    { label: 'Privacy Policy', href: '/privacy', position: 'FOOTER_LEGAL', order: 1 },
    { label: 'Terms of Service', href: '/terms', position: 'FOOTER_LEGAL', order: 2 },
  ] as const;

  for (const item of navigationItems) {
    await prisma.navigationItem.upsert({
      where: { id: `${item.position}-${item.order}` },
      update: { ...item },
      create: { id: `${item.position}-${item.order}`, ...item },
    });
  }

  const socialLinks = [
    {
      id: 'social-github',
      kind: 'SOCIAL',
      platform: 'github',
      label: 'GitHub',
      value: 'GitHub',
      url: 'https://github.com/jotin',
      position: 'FOOTER',
      order: 1,
    },
    {
      id: 'social-linkedin',
      kind: 'SOCIAL',
      platform: 'linkedin',
      label: 'LinkedIn',
      value: 'LinkedIn',
      url: 'https://linkedin.com/in/jotin',
      position: 'FOOTER',
      order: 2,
    },
    {
      id: 'social-x',
      kind: 'SOCIAL',
      platform: 'x',
      label: 'X',
      value: 'X.com',
      url: 'https://x.com/jotin',
      position: 'FOOTER',
      order: 3,
    },
    {
      id: 'profile-github',
      kind: 'SOCIAL',
      platform: 'github',
      label: 'GitHub',
      value: 'GitHub',
      url: 'https://github.com/jotin',
      position: 'PROFILE',
      order: 1,
    },
    {
      id: 'profile-linkedin',
      kind: 'SOCIAL',
      platform: 'linkedin',
      label: 'LinkedIn',
      value: 'LinkedIn',
      url: 'https://linkedin.com/in/jotin',
      position: 'PROFILE',
      order: 2,
    },
    {
      id: 'profile-x',
      kind: 'SOCIAL',
      platform: 'x',
      label: 'X',
      value: 'X.com',
      url: 'https://x.com/jotin',
      position: 'PROFILE',
      order: 3,
    },
    {
      id: 'contact-phone',
      kind: 'CONTACT',
      platform: 'phone',
      label: 'Phone Number',
      value: '+91 90596 71178',
      url: 'tel:+919059671178',
      position: 'CONTACT',
      order: 1,
    },
    {
      id: 'contact-whatsapp',
      kind: 'CONTACT',
      platform: 'whatsapp',
      label: 'Whatsapp number',
      value: '+91 90596 71178',
      url: 'https://wa.me/919059671178',
      position: 'CONTACT',
      order: 2,
    },
    {
      id: 'contact-personal-email',
      kind: 'CONTACT',
      platform: 'email',
      label: 'Personal email',
      value: 'contact@jotin.in',
      url: 'mailto:contact@jotin.in',
      position: 'CONTACT',
      order: 3,
    },
    {
      id: 'contact-support-email',
      kind: 'CONTACT',
      platform: 'email',
      label: 'Support email',
      value: 'support@jotin.in',
      url: 'mailto:support@jotin.in',
      position: 'CONTACT',
      order: 4,
    },
    {
      id: 'contact-location',
      kind: 'CONTACT',
      platform: 'location',
      label: 'Location',
      value: 'Hyderabad, India',
      url: 'https://www.google.com/maps?q=Hyderabad%2C%20India',
      position: 'CONTACT',
      order: 5,
    },
    {
      id: 'profile-phone',
      kind: 'CONTACT',
      platform: 'phone',
      label: 'Phone Number',
      value: '+91 90596 71178',
      url: 'tel:+919059671178',
      position: 'PROFILE',
      order: 4,
    },
    {
      id: 'profile-whatsapp',
      kind: 'CONTACT',
      platform: 'whatsapp',
      label: 'Whatsapp number',
      value: '+91 90596 71178',
      url: 'https://wa.me/919059671178',
      position: 'PROFILE',
      order: 5,
    },
    {
      id: 'profile-personal-email',
      kind: 'CONTACT',
      platform: 'email',
      label: 'Personal email',
      value: 'contact@jotin.in',
      url: 'mailto:contact@jotin.in',
      position: 'PROFILE',
      order: 6,
    },
    {
      id: 'profile-support-email',
      kind: 'CONTACT',
      platform: 'email',
      label: 'Support email',
      value: 'support@jotin.in',
      url: 'mailto:support@jotin.in',
      position: 'PROFILE',
      order: 7,
    },
    {
      id: 'profile-location',
      kind: 'CONTACT',
      platform: 'location',
      label: 'Location',
      value: 'Hyderabad, India',
      url: 'https://www.google.com/maps?q=Hyderabad%2C%20India',
      position: 'PROFILE',
      order: 8,
    },
  ] as const;

  for (const item of socialLinks) {
    await prisma.socialLink.upsert({
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
    viewArticlesLabel: 'View Blogs',
    homeWorkSectionTitle: 'Work Experience',
    homeFeaturedArticlesTitle: 'Featured Blogs',
    homeFeaturedProjectsTitle: 'Featured Projects',
    homeViewAllArticlesLabel: 'View All Blogs',
    homeViewAllProjectsLabel: 'View All Projects',
  };

  await prisma.heroContent.upsert({
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
        languages: [
          { label: 'English', proficiency: 91 },
          { label: 'Odia', proficiency: 98 },
          { label: 'Hindi', proficiency: 83 },
          { label: 'Telugu', proficiency: 64 },
        ],
        education: [
          {
            title: 'Bachelor of Computer Applications (BCA)',
            subtitle: 'Dr. CV Raman University',
            meta: '2010 • Chhattisgarh',
          },
          {
            title: 'Higher Secondary Education (Commerce)',
            subtitle: 'Kabi Samrat Upendra Bhanja College',
            meta: '1998 • Bhanjanagar, Odisha',
          },
          {
            title: 'Board of Secondary Education (10th)',
            subtitle: 'Sribatsa High School',
            meta: '1993 • Bhanjanagar, Odisha',
          },
        ],
        hobbies: ['Video Games', 'Podcast', 'Musci', 'Movies', 'Travel'],
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
      title: 'Blogs',
      subtitle: 'Thoughts on business processes, technology, and the future of work.',
      emptyTitle: 'No blogs found',
      emptyMessage: 'Try adjusting your filters to see more blogs.',
      primaryCta: 'All',
      secondaryCta: 'Clear',
      content: {
        tagLabel: 'Tag:',
        defaultEmptyMessage: 'Blogs will appear here once they are published.',
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
    const contentValue = row.content === null ? Prisma.JsonNull : row.content;
    await prisma.pageContent.upsert({
      where: { page: row.page },
      update: { ...row, content: contentValue },
      create: { ...row, content: contentValue },
    });
  }

  const workExperienceCards = [
    {
      id: 'work-card-1',
      company: 'Tech Solutions Inc.',
      role: 'Senior Business Process Analyst',
      location: 'Remote',
      description: 'Led digital transformation initiatives for major clients across operations, reporting, and workflow automation.',
      achievements: JSON.stringify([
        'Reduced processing time by 40%',
        'Implemented AI-driven automation solutions',
        'Managed a team of 8+ analysts',
      ]),
      skills: JSON.stringify([
        'Process Optimization',
        'AI Integration',
        'Team Leadership',
        'Strategic Planning',
      ]),
      startDate: 'Jan 2022',
      endDate: null,
      current: true,
      order: 1,
    },
    {
      id: 'work-card-2',
      company: 'Innovation Corp',
      role: 'Process Improvement Manager',
      location: 'New York, NY',
      description: 'Streamlined operations and introduced automation programs for distributed service teams.',
      achievements: JSON.stringify([
        'Increased efficiency by 35%',
        'Led cross-functional delivery teams',
        'Deployed RPA solutions across core workflows',
      ]),
      skills: JSON.stringify(['Business Analysis', 'Project Management', 'RPA', 'Six Sigma']),
      startDate: 'Mar 2020',
      endDate: 'Dec 2021',
      current: false,
      order: 2,
    },
  ] as const;

  for (const card of workExperienceCards) {
    await prisma.workExperienceCard.upsert({
      where: { id: card.id },
      update: card,
      create: card,
    });
  }

  const profileMilestones = [
    { id: "milestone-process-associate", title: "Process Associate", month: "Jun", year: 2004, order: 1, visible: true },
    { id: "milestone-sr-mis-analyst", title: "Sr. MIS Analyst", month: "Apr", year: 2007, order: 2, visible: true },
    { id: "milestone-team-lead-ops-mis", title: "Team Lead (Ops & MIS)", month: "Apr", year: 2008, order: 3, visible: true },
    { id: "milestone-assistant-manager", title: "Assistant Manager", month: "Apr", year: 2010, order: 4, visible: true },
    { id: "milestone-deputy-manager", title: "Deputy Manager", month: "Oct", year: 2011, order: 5, visible: true },
    { id: "milestone-operations-manager", title: "Operations Manager", month: "Apr", year: 2013, order: 6, visible: true },
    {
      id: "milestone-senior-manager-pricing-healthcare",
      title: "Senior Manager, Pricing & Healthcare Solutions",
      month: "Oct",
      year: 2016,
      order: 7,
      visible: true,
    },
    { id: "milestone-director-pricing-solutions", title: "Director, Pricing & Solutions", month: "Jan", year: 2026, order: 8, visible: true },
  ] as const;

  for (const milestone of profileMilestones) {
    await prisma.profileMilestone.upsert({
      where: { id: milestone.id },
      update: milestone,
      create: milestone,
    });
  }

  const blogSeedRows = [
    {
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
    },
    {
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
    },
    {
      title: 'Designing Pricing Narratives That Survive Executive Review',
      slug: 'pricing-narratives-executive-review',
      excerpt:
        'A practical way to turn pricing assumptions, cost drivers, and margin logic into a narrative leaders can approve quickly.',
      content: `# Designing Pricing Narratives That Survive Executive Review

Strong pricing models rarely fail because the numbers are wrong. They fail because the story around the numbers is weak.

## Start With The Decision

Before building slides or spreadsheets, define the decision your audience needs to make. Approval becomes easier when assumptions, trade-offs, and risks are visible early.

## Build The Story Around Three Anchors

1. Commercial context
2. Delivery confidence
3. Margin protection

## Keep The Narrative Tight

Executives do not need every calculation. They need confidence that the model is grounded, resilient, and explainable.`,
      tags: 'Pricing,Strategy,Executive Communication,Commercial',
      category: 'Business',
      published: true,
      featured: false,
      readTime: 6,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'What Good Operations Dashboards Actually Need',
      slug: 'good-operations-dashboards',
      excerpt:
        'The best dashboards do not show everything. They surface the few signals that help managers intervene early and clearly.',
      content: `# What Good Operations Dashboards Actually Need

Many dashboards become unusable because they chase completeness instead of clarity.

## Start With Intervention

Every metric should support a decision or trigger action. If a number is interesting but not actionable, it probably does not belong on the first screen.

## Prioritize Signal Over Density

- Trends before snapshots
- Exceptions before averages
- Ownership before decoration

## Design For Weekly Use

A dashboard should still make sense when someone returns to it after a week away from the work.`,
      tags: 'Operations,Dashboards,Analytics,Management',
      category: 'Operations',
      published: true,
      featured: false,
      readTime: 4,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Automation Is Most Useful Before a Team Scales',
      slug: 'automation-before-scaling',
      excerpt:
        'Automation has the biggest leverage when it is used to prevent messy scale, not just to clean up after it.',
      content: `# Automation Is Most Useful Before a Team Scales

Teams often wait too long to automate because the current process still feels manageable.

## Small Friction Compounds Fast

An extra five minutes in a workflow can feel harmless for a five-person team. It becomes expensive when volume doubles and the process is copied across regions.

## Where To Start

Look for handoffs, manual validations, and repeated data movement. Those are usually the first places where automation creates meaningful leverage.

## Automate With Ownership

Every automated step still needs an owner, a fallback path, and a clear definition of success.`,
      tags: 'Automation,Scale,Operations,Process Design',
      category: 'Technology',
      published: true,
      featured: false,
      readTime: 5,
      publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    },
  ] as const;

  for (const article of blogSeedRows) {
    await prisma.blog.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

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
