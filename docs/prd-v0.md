# Product Requirements & Project Plan (PRD/PRP)
## jotin.in - Professional Portfolio & Tech Blog

**Project Owner:** Jotin Kumar Madugula  
**Document Version:** 1.0  
**Last Updated:** 2025-09-05  
**Implementation Timeline:** 2-3 weeks  

---

## 📋 Executive Summary

A modern, responsive portfolio website showcasing professional experience, technical projects, and thought leadership through articles. The site features a unique dual-personality design toggling between Professional and Tech Enthusiast modes, creating an engaging experience for different visitor types.

---

## 🎯 Project Objectives

### Primary Goals
1. **Professional Presence:** Establish credible online presence for career opportunities
2. **Thought Leadership:** Share insights on AI, BPO transformation, and technology
3. **Project Showcase:** Demonstrate technical capabilities through live projects
4. **Network Building:** Connect with recruiters, peers, and tech community

### Success Metrics
- 500+ monthly visitors within 3 months
- 50+ article reads per week
- 5+ recruiter inquiries per month
- 90+ Lighthouse performance score

---

## 👥 User Personas

### 1. Recruiter Rachel
- **Goal:** Quickly assess technical skills and experience
- **Needs:** Resume download, clear work history, contact form
- **Pain Points:** Cluttered portfolios, missing contact info

### 2. Tech Enthusiast Tom
- **Goal:** Discover technical insights and projects
- **Needs:** Technical articles, GitHub links, project demos
- **Pain Points:** Shallow content, outdated projects

### 3. General Visitor Grace
- **Goal:** Learn about Jotin's professional journey
- **Needs:** Easy navigation, engaging content, social proof
- **Pain Points:** Confusing layouts, slow loading

---

## 🏗️ Technical Architecture

### Tech Stack
```yaml
Frontend:
  Framework: Next.js 14+ (App Router)
  Styling: TailwindCSS 3.4+
  Components: shadcn/ui
  Animations: Framer Motion
  Icons: Lucide React

Backend:
  ORM: Prisma 5+
  Database: SQLite (dev) → PostgreSQL (prod)
  Email: Resend API
  Analytics: Vercel Analytics

Infrastructure:
  Hosting: Vercel
  CDN: Vercel Edge Network
  Domain: jotin.in
  Version Control: GitHub

Development:
  TypeScript: 5.0+
  Package Manager: pnpm
  Linting: ESLint + Prettier
  Testing: Vitest + Playwright
```

---

## 📊 Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // Use "sqlite" for development
  url      = env("DATABASE_URL")
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   @db.Text
  coverImage  String?
  tags        String[]
  category    String
  published   Boolean  @default(false)
  featured    Boolean  @default(false)
  viewCount   Int      @default(0)
  readTime    Int      // in minutes
  series      String?  // for article series
  seriesOrder Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?

  @@index([slug])
  @@index([published, featured])
  @@index([category])
}

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  shortDesc   String
  category    String
  status      String   // "active", "completed", "in-progress"
  featured    Boolean  @default(false)
  order       Int      @default(0)
  
  // Links
  liveUrl     String?
  githubUrl   String?
  videoUrl    String?
  
  // Media
  coverImage  String
  screenshots String[]
  
  // Technical Details
  techStack   String[]
  tags        String[]
  challenges  String?  @db.Text
  learnings   String?  @db.Text
  
  // Metrics
  stars       Int?
  forks       Int?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([featured, order])
}

model WorkExperience {
  id           String   @id @default(cuid())
  company      String
  companyLogo  String?
  role         String
  location     String
  type         String   // "full-time", "contract", "internship"
  description  String   @db.Text
  achievements String[] // bullet points
  skills       String[]
  startDate    DateTime
  endDate      DateTime?
  current      Boolean  @default(false)
  order        Int      @default(0)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([current, order])
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  replied   Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([replied, createdAt])
}

model Settings {
  id              String   @id @default(cuid())
  resumeUrl       String
  linkedinUrl     String
  githubUrl       String
  twitterUrl      String?
  emailAddress    String
  heroTitle       String
  heroSubtitle    String
  techHeroTitle   String
  techHeroSubtitle String
  aboutMe         String   @db.Text
  profileImage    String
  updatedAt       DateTime @updatedAt
}
```

---

## 🎨 Design System

### Color Palette
```css
/* Light Mode */
--primary: #0066CC (Blue)
--secondary: #00A86B (Green)
--accent: #FF6B35 (Orange)
--background: #FFFFFF
--foreground: #0A0A0A
--muted: #F5F5F5
--border: #E5E5E5

/* Dark Mode */
--primary: #4D9FFF
--secondary: #00D68F
--accent: #FF8A65
--background: #0A0A0A
--foreground: #FFFFFF
--muted: #1A1A1A
--border: #2A2A2A
```

### Typography
```css
--font-sans: 'Inter', system-ui, sans-serif
--font-mono: 'Fira Code', monospace
--font-heading: 'Cal Sans', 'Inter', sans-serif

/* Scale */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem
--text-4xl: 2.25rem
--text-5xl: 3rem
```

### Component Specifications

#### Hero Toggle Component
```typescript
interface HeroToggleProps {
  defaultMode?: 'professional' | 'tech'
  onModeChange?: (mode: string) => void
}

// Features:
- Smooth transition (300ms)
- LocalStorage persistence
- Keyboard accessible (Space/Enter to toggle)
- ARIA labels and roles
```

#### Timeline Component
```typescript
interface TimelineProps {
  experiences: WorkExperience[]
  orientation: 'horizontal' | 'vertical'
  interactive?: boolean
}

// Features:
- Horizontal scroll with wheel support
- Touch/swipe on mobile
- Keyboard navigation (Arrow keys)
- Hover cards with animation
- Company logos
- Duration calculation
```
## 🎨 Design Best Practices

To ensure the portfolio remains user-centered, consistent, and accessible, the following principles should guide all design and UI decisions:

### Core Principles
- **Users First:** Prioritize clarity, ease of navigation, and minimal friction in every interaction.
- **Simplicity & Clarity:** Keep layouts uncluttered with clear labels, instructions, and hierarchy.
- **Consistency:** Apply a uniform design language across typography, spacing, colors, and components.
- **Accessibility (WCAG AA):** Ensure color contrast, keyboard navigability, and screen reader compatibility.

### Interaction & Micro-Design
- **Purposeful Animations:** Use quick (150–300ms) transitions and feedback to enhance usability without distraction.
- **Responsive Design:** Ensure layouts adapt seamlessly across mobile, tablet, and desktop.
- **Feedback & States:** Every interactive element (buttons, forms, toggles) must have clear hover, focus, active, and error states.

### System & Documentation
- **Scalable Design Tokens:** Base spacing, radii, and typography on consistent scales (e.g., 8px grid).
- **Iterative Testing:** Continuously test UI with real users and refine based on feedback.
- **Documentation:** Maintain clear component and design system documentation for long-term maintainability.

---

## 📄 Page Specifications

### 1. Home Page (`/`)

#### Structure
```
├── Hero Section (100vh)
│   ├── Toggle Switch (Professional ↔ Tech)
│   ├── Dynamic Content Area
│   ├── Profile Image
│   ├── Skills Badges
│   └── CTA Buttons
├── Work Timeline Section
│   └── Horizontal Scrollable Timeline
├── Featured Articles Section
│   └── Article Cards (3x3 grid → 1 column mobile)
├── Featured Projects Section
│   └── Project Cards (2x3 grid → 1 column mobile)
└── Footer with Contact CTA
```

#### Key Interactions
- Hero toggle animates between states (fade + slide)
- Timeline scrolls horizontally with momentum
- Cards have hover elevation effect
- Smooth scroll anchors between sections

### 2. Profile Page (`/profile`)

#### Content Sections
```
├── Header with Download Resume Button
├── Professional Summary
├── Core Competencies (Grid)
├── Work Experience (Detailed)
├── Education
├── Certifications
├── Languages
└── References (Optional)
```

### 3. Articles Page (`/articles`)

#### Features
- Search bar with debounced input
- Category filter tabs
- Tag cloud for filtering
- Sort options (Date, Popular, Read Time)
- Pagination or Infinite scroll
- RSS feed link

### 4. Article Detail (`/articles/[slug]`)

#### Layout
```
├── Hero Image
├── Title + Meta (Date, Read Time, Views)
├── Table of Contents (Sticky sidebar desktop)
├── Article Content (MDX support)
│   ├── Code blocks with syntax highlighting
│   ├── Images with lazy loading
│   └── Embedded components
├── Author Bio
├── Related Articles
└── Newsletter Signup
```

### 5. Projects Page (`/projects`)

#### Features
- Filter by category/status
- Search functionality
- Grid/List view toggle
- Sort by date/popularity

### 6. Project Detail (`/projects/[slug]`)

#### Sections
```
├── Hero with Screenshot Carousel
├── Project Overview
├── Tech Stack Badges
├── Key Features (Bullet points)
├── Challenges & Solutions
├── What I Learned
├── Links (Live Demo, GitHub)
└── Related Projects
```

### 7. Contact Page (`/contact`)

#### Components
- Contact form with validation
- Social links grid
- Location map (optional)
- Response time expectation

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup Next.js project with TypeScript
- [ ] Configure TailwindCSS and shadcn/ui
- [ ] Setup Prisma with initial schema
- [ ] Create base layout components
- [ ] Implement responsive navigation
- [ ] Setup dark mode toggle
- [ ] Deploy initial version to Vercel

### Phase 2: Core Features (Week 2)
- [ ] Build Hero section with toggle
- [ ] Implement Work Timeline
- [ ] Create Article listing and detail pages
- [ ] Build Project showcase
- [ ] Implement contact form with Resend
- [ ] Add SEO meta tags
- [ ] Setup analytics

### Phase 3: Enhancement (Week 3)
- [ ] Add animations with Framer Motion
- [ ] Implement search and filters
- [ ] Add view tracking
- [ ] Create admin dashboard (optional)
- [ ] Performance optimization
- [ ] Testing and bug fixes
- [ ] Content population

---

## 🔧 Development Guidelines

### File Structure
```
jotin.in/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                 # Home
│   │   ├── profile/page.tsx
│   │   └── contact/page.tsx
│   ├── articles/
│   │   ├── page.tsx                 # Articles list
│   │   └── [slug]/page.tsx          # Article detail
│   ├── projects/
│   │   ├── page.tsx                 # Projects list
│   │   └── [slug]/page.tsx          # Project detail
│   ├── api/
│   │   ├── articles/route.ts
│   │   ├── projects/route.ts
│   │   └── contact/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   ├── sections/
│   │   ├── hero-toggle.tsx
│   │   ├── work-timeline.tsx
│   │   ├── article-card.tsx
│   │   └── project-card.tsx
│   └── common/
│       ├── seo.tsx
│       ├── theme-toggle.tsx
│       └── loading.tsx
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── use-theme.ts
│   ├── use-scroll.ts
│   └── use-media-query.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── images/
│   ├── resume.pdf
│   └── favicon.ico
└── styles/
    └── prose.css                     # Article typography
```

### Component Examples

#### Hero Toggle Implementation
```typescript
// components/sections/hero-toggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
  ctaButtons: Array<{
    label: string;
    href: string;
    variant: 'default' | 'outline';
  }>;
}

export function HeroToggle() {
  const [mode, setMode] = useState<'professional' | 'tech'>('professional');
  
  // Content configuration
  const content: Record<string, HeroContent> = {
    professional: {
      title: "Jotin Kumar Madugula",
      subtitle: "Business Process Expert & AI Enthusiast",
      description: "Transforming operations through intelligent automation...",
      skills: ["Process Optimization", "Team Leadership", "AI Integration"],
      ctaButtons: [
        { label: "Download Resume", href: "/resume.pdf", variant: "default" },
        { label: "View Profile", href: "/profile", variant: "outline" }
      ]
    },
    tech: {
      title: "Jotin Kumar Madugula",
      subtitle: "Full Stack Developer & AI Explorer",
      description: "Building the future with code and creativity...",
      skills: ["Next.js", "React", "Python", "GenAI", "Cloud"],
      ctaButtons: [
        { label: "View Projects", href: "#projects", variant: "default" },
        { label: "Read Articles", href: "/articles", variant: "outline" }
      ]
    }
  };

  // Persist mode preference
  useEffect(() => {
    const saved = localStorage.getItem('hero-mode');
    if (saved) setMode(saved as typeof mode);
  }, []);

  useEffect(() => {
    localStorage.setItem('hero-mode', mode);
  }, [mode]);

  return (
    <section className="hero-section">
      {/* Implementation details */}
    </section>
  );
}
```

### API Routes Example
```typescript
// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const where = {
    published: true,
    ...(category && { category }),
    ...(tag && { tags: { has: tag } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.article.count({ where })
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}
```
## 🤖 AI Best Practices

To maximize the use of AI tools (e.g., Claude, Copilot) during development and content creation, the following practices should be followed:

### Content & Documentation
- Maintain **living documents** (e.g., articles, project docs) as AI Artifacts or templates.  
- Ensure updates in one version (blog, project detail) propagate across related formats (social posts, newsletters, summaries).  
- Use clear **naming conventions** and set regular review cycles for AI-generated outputs.

### Workflow & Efficiency
- Begin with **pilot tasks** (e.g., drafting a project description) before scaling AI usage across all content.  
- Explicitly request **step-by-step reasoning** from AI for complex tasks (debugging, analytics, strategy).  
- Track efficiency metrics (time saved, reduced errors) alongside business KPIs.

### Governance & Quality
- Define **output guidelines**: preferred format, tone, and terminology.  
- Always review AI outputs before publishing to maintain quality and brand voice.  
- Use versioning to manage AI-generated drafts and retain human oversight.  

### Scaling & ROI
- Roll out AI features in **phases** (pilot → core workflows → advanced features).  
- Measure both **quantitative** (time saved, error reduction) and **qualitative** (team satisfaction, consistency) ROI.  
- Document learnings and continuously refine prompts and workflows.

---

## 📈 Performance Requirements

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTFB (Time to First Byte):** < 600ms

### Optimization Strategies
1. **Image Optimization**
   - Use Next.js Image component
   - Implement responsive images
   - Lazy load below-fold images
   - Use WebP format with fallbacks

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based code splitting
   - Lazy load third-party scripts

3. **Caching Strategy**
   - ISR for articles and projects
   - Static generation for marketing pages
   - Edge caching for API responses
   - Browser caching for assets

4. **Bundle Size**
   - Tree shaking unused code
   - Minimize dependencies
   - Use dynamic imports
   - Regular bundle analysis

---

## 🔒 Security Considerations

### Implementation Requirements
- [ ] HTTPS only (Vercel default)
- [ ] Environment variables for secrets
- [ ] Input sanitization for forms
- [ ] Rate limiting on API routes
- [ ] CSRF protection for forms
- [ ] Content Security Policy headers
- [ ] Regular dependency updates

### Contact Form Security
```typescript
// Honeypot field implementation
<input 
  type="text" 
  name="website" 
  className="hidden" 
  tabIndex={-1}
  autoComplete="off"
/>

// Rate limiting with Upstash
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
});
```

---

## 🎯 SEO & Analytics

### SEO Checklist
- [ ] Unique meta titles and descriptions
- [ ] Open Graph tags for all pages
- [ ] Twitter Card meta tags
- [ ] Canonical URLs
- [ ] XML Sitemap generation
- [ ] Robots.txt configuration
- [ ] Schema.org markup for articles
- [ ] Alt text for all images

### Analytics Implementation
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## ♿ Accessibility Requirements

### WCAG 2.1 Level AA Compliance
- [ ] Color contrast ratio 4.5:1 for normal text
- [ ] Color contrast ratio 3:1 for large text
- [ ] Keyboard navigation for all interactive elements
- [ ] Focus indicators visible
- [ ] Screen reader compatibility
- [ ] Proper heading hierarchy
- [ ] ARIA labels where needed
- [ ] Skip to main content link
- [ ] Reduced motion support

### Testing Tools
- axe DevTools
- WAVE
- Lighthouse
- NVDA/JAWS testing

---

## 📝 Content Guidelines

### Article Writing
- **Length:** 800-2000 words
- **Structure:** Introduction, body with headers, conclusion
- **Media:** At least one image per article
- **Code:** Syntax highlighted examples where relevant
- **SEO:** Focus keyword in title, headers, and first paragraph

### Project Documentation
- **Overview:** 100-200 words
- **Technical Details:** Bullet points
- **Challenges:** 2-3 paragraphs
- **Learnings:** 3-5 bullet points
- **Screenshots:** 3-5 high-quality images

---

## 🚢 Deployment Strategy

### Environment Setup
```bash
# Development
DATABASE_URL="file:./dev.db"
RESEND_API_KEY="re_development_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Production
DATABASE_URL="postgresql://..."
RESEND_API_KEY="re_production_key"
NEXT_PUBLIC_APP_URL="https://jotin.in"
```

### Vercel Configuration
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "outputDirectory": ".next",
  "devCommand": "next dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### CI/CD Pipeline
1. **Pre-deployment**
   - Run tests
   - Type checking
   - Linting
   - Build verification

2. **Deployment**
   - Push to main branch
   - Automatic Vercel deployment
   - Database migrations
   - Cache invalidation

3. **Post-deployment**
   - Smoke tests
   - Performance monitoring
   - Error tracking setup

---

## 📊 Success Metrics & KPIs

### Technical Metrics
- Page load time < 3 seconds
- Lighthouse score > 90
- Zero accessibility errors
- 99.9% uptime

### Business Metrics
- Monthly visitors: 500+
- Average session duration: > 2 minutes
- Article engagement rate: > 30%
- Contact form submissions: 5+/month
- Project demo clicks: 50+/month

### Content Metrics
- Articles published: 2/month
- Projects showcased: 6+
- Social shares: 20+/month

---

## 🔄 Maintenance Plan

### Regular Tasks
- **Daily:** Monitor errors and performance
- **Weekly:** Content updates, respond to contacts
- **Monthly:** Dependency updates, analytics review
- **Quarterly:** Major feature additions, design updates

### Backup Strategy
- Database: Daily automated backups
- Code: Git version control
- Assets: CDN with fallback

---

## 📚 Resources & References

### Design Inspiration
- [Vercel Templates](https://vercel.com/templates)
- [shadcn/ui Examples](https://ui.shadcn.com/examples)
- [Awwwards Portfolio Sites](https://www.awwwards.com/websites/portfolio/)

### Technical Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Learning Resources
- [Next.js Learn Course](https://nextjs.org/learn)
- [Prisma Tutorials](https://www.prisma.io/docs/getting-started)
- [Web.dev Performance](https://web.dev/performance/)

---

## 🎬 Getting Started for Claude Code

To implement this project with Claude Code:

1. **Initial Setup**
```bash
# Create Next.js project
npx create-next-app@latest jotin-portfolio --typescript --tailwind --app

# Install dependencies
pnpm add @prisma/client prisma lucide-react framer-motion
pnpm add @radix-ui/react-* # Add needed Radix primitives
pnpm add resend react-hook-form zod

# Setup Prisma
npx prisma init --datasource-provider sqlite
# Copy schema from this document
npx prisma migrate dev --name init
npx prisma generate
```

2. **Start with Phase 1 tasks in order**
3. **Use the component examples as templates**
4. **Follow the file structure exactly**
5. **Test each feature before moving to the next**

---



**End of PRD/PRP Document**

*This document should be used as the single source of truth for implementing the jotin.in portfolio website. All features, designs, and technical decisions should align with these specifications.*