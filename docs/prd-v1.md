# Product Requirements & Project Plan (PRD/PRP)
## jotin.in - Professional Portfolio & Tech Blog

**Project Owner:** Jotin Kumar Madugula  
**Document Version:** 2.0  
**Last Updated:** 2025-01-06  
**Implementation Timeline:** 2-3 weeks  

---

## 📋 Executive Summary

A modern, responsive portfolio website showcasing professional experience, technical projects, and thought leadership through articles. The site features a unique dual-personality design toggling between Professional and Tech Enthusiast modes, creating an engaging experience for different visitor types. Includes an admin dashboard for content management.

---

## 🎯 Project Objectives

### Primary Goals
1. **Professional Presence:** Establish credible online presence for career opportunities
2. **Thought Leadership:** Share insights on AI, BPO transformation, and technology
3. **Project Showcase:** Demonstrate technical capabilities through live projects
4. **Network Building:** Connect with recruiters, peers, and tech community
5. **Content Management:** Easy article and project updates via admin dashboard

### Success Metrics
- Site loads in < 3 seconds
- All projects and articles display correctly
- Contact form functional with email notifications
- Mobile responsive across all devices
- Admin dashboard allows CRUD operations

---

## 👥 User Personas

### 1. Recruiter Rachel
- **Goal:** Quickly assess technical skills and experience
- **Needs:** Resume download, clear work history, contact form
- **Behavior:** Spends 2-3 minutes scanning, downloads resume

### 2. Tech Enthusiast Tom
- **Goal:** Discover technical insights and projects
- **Needs:** Technical articles, GitHub links, project demos
- **Behavior:** Explores projects first, then reads articles

### 3. Admin Jotin
- **Goal:** Easily manage content without code changes
- **Needs:** Dashboard to create/edit/delete articles and projects
- **Behavior:** Updates content weekly/monthly

---

## 🗏 Technical Architecture

### Tech Stack
```yaml
Frontend:
  Framework: Next.js 15.5.2 (App Router)
  Styling: TailwindCSS 4.1.13
  Components: shadcn/ui 0.9.5
  Animations: Motion 12.23.12
  Icons: Lucide React 0.542.0

Backend:
  ORM: Prisma 6.15.0
  Database: SQLite (development & production)
  Email: Resend API
  Analytics: Vercel Analytics

Infrastructure:
  Hosting: Vercel
  CDN: Vercel Edge Network
  Domain: jotin.in
  Version Control: GitHub

Development:
  TypeScript: 5.9.2
  Package Manager: pnpm 10.15.1
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
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String
  coverImage  String?
  tags        String
  category    String
  published   Boolean  @default(false)
  readTime    Int      // in minutes
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?

  @@index([slug])
  @@index([published])
  @@index([category])
}

model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  shortDesc   String
  category    String
  status      String   // "active", "completed", "in-progress"
  order       Int      @default(0)
  
  // Links
  liveUrl     String?
  githubUrl   String?
  
  // Media
  coverImage  String
  screenshots String
  
  // Technical Details
  techStack   String
  tags        String
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([order])
}

model WorkExperience {
  id           String   @id @default(cuid())
  company      String
  companyLogo  String?
  role         String
  location     String
  type         String   // "full-time", "contract", "internship"
  description  String
  achievements String   // stored as JSON string
  skills       String   // stored as JSON string
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
  message   String
  createdAt DateTime @default(now())

  @@index([createdAt])
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
  aboutMe         String
  profileImage    String
  updatedAt       DateTime @updatedAt
}

model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
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
- Dynamic content based on mode
```

#### Horizontal Timeline Component
```typescript
interface TimelineProps {
  experiences: WorkExperience[]
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
│   └── Article Cards (3 column grid → 1 column mobile)
├── Featured Projects Section
│   └── Project Cards (2 column grid → 1 column mobile)
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
└── Languages
```

### 3. Articles Page (`/articles`)

#### Features
- Search bar with debounced input
- Category filter tabs
- Tag cloud for filtering
- Sort options (Date, Read Time)
- Pagination (10 per page)

### 4. Article Detail (`/articles/[slug]`)

#### Layout
```
├── Hero Image
├── Title + Meta (Date, Read Time)
├── Article Content (MDX support)
│   ├── Code blocks with syntax highlighting
│   ├── Images with lazy loading
│   └── Embedded components
├── Author Bio
└── Related Articles
```

### 5. Projects Page (`/projects`)

#### Features
- Filter by category/status
- Search functionality
- Sort by date

### 6. Project Detail (`/projects/[slug]`)

#### Sections
```
├── Hero with Screenshot Carousel
├── Project Overview
├── Tech Stack Badges
├── Key Features
├── Links (Live Demo, GitHub)
└── Related Projects
```

### 7. Contact Page (`/contact`)

#### Components
- Contact form with validation
- Social links grid
- Response time expectation

### 8. Admin Dashboard (`/admin`)

#### Protected Routes (Auth Required)
```
/admin
├── /dashboard - Overview stats
├── /articles
│   ├── List view with actions
│   ├── /new - Create article
│   └── /[id]/edit - Edit article
├── /projects
│   ├── List view with actions
│   ├── /new - Create project
│   └── /[id]/edit - Edit project
├── /settings - Site settings
└── /logout
```

#### Features
- JWT-based authentication
- Rich text editor for articles
- Image upload functionality
- Preview before publish
- Bulk actions (publish/unpublish)

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup Next.js project with TypeScript
- [ ] Configure TailwindCSS and shadcn/ui
- [ ] Setup Prisma with SQLite
- [ ] Create base layout components
- [ ] Implement responsive navigation
- [ ] Setup dark mode toggle
- [ ] Build Hero section with toggle
- [ ] Deploy initial version to Vercel

### Phase 2: Core Features (Week 2)
- [ ] Implement horizontal Work Timeline
- [ ] Create Article listing and detail pages
- [ ] Build Project showcase
- [ ] Implement contact form with Resend
- [ ] Add SEO meta tags
- [ ] Setup Vercel Analytics
- [ ] Create Profile/Resume page

### Phase 3: Admin & Polish (Week 3)
- [ ] Build admin authentication system
- [ ] Create admin dashboard UI
- [ ] Implement CRUD for articles
- [ ] Implement CRUD for projects
- [ ] Add animations with Framer Motion
- [ ] Implement search and filters
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
│   ├── admin/
│   │   ├── layout.tsx               # Auth wrapper
│   │   ├── dashboard/page.tsx
│   │   ├── articles/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── admin/
│   │   │   ├── articles/route.ts
│   │   │   └── projects/route.ts
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
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── article-form.tsx
│   │   ├── project-form.tsx
│   │   └── rich-editor.tsx
│   └── common/
│       ├── seo.tsx
│       ├── theme-toggle.tsx
│       └── loading.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── use-theme.ts
│   ├── use-scroll.ts
│   └── use-media-query.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── dev.db
│   └── migrations/
├── public/
│   ├── images/
│   ├── uploads/                     # Article/project images
│   ├── resume.pdf
│   └── favicon.ico
└── styles/
    └── prose.css                     # Article typography
```

### Admin Dashboard Implementation
```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
}

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');
    
    if (!token || !verifyToken(token.value)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

export const config = {
  matcher: '/admin/:path*',
};
```

---

## 🔑 Security Considerations

### Implementation Requirements
- [ ] HTTPS only (Vercel default)
- [ ] Environment variables for secrets
- [ ] Input sanitization for forms
- [ ] Rate limiting on API routes
- [ ] CSRF protection for forms
- [ ] JWT-based admin authentication
- [ ] Secure password hashing (bcrypt)
- [ ] Admin session management
- [ ] File upload validation

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

---

## 📈 Performance Requirements

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTFB (Time to First Byte):** < 600ms

### Optimization Strategies
1. **Image Optimization**
   - Next.js Image component
   - WebP format with fallbacks
   - Lazy loading

2. **Code Splitting**
   - Dynamic imports for admin routes
   - Route-based splitting

3. **Database Optimization**
   - SQLite with proper indexes
   - Efficient queries with Prisma

---

## 🚢 Deployment Strategy

### Environment Setup
```bash
# .env.local
DATABASE_URL="file:./dev.db"
RESEND_API_KEY="re_your_key"
JWT_SECRET="your_secret_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# .env.production
DATABASE_URL="file:./prod.db"
RESEND_API_KEY="re_production_key"
JWT_SECRET="production_secret_key"
NEXT_PUBLIC_APP_URL="https://jotin.in"
```

### Vercel Configuration
```json
{
  "buildCommand": "prisma generate && prisma db push && next build",
  "outputDirectory": ".next",
  "devCommand": "next dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

---

## 🎬 Getting Started

### Initial Setup
```bash
# Create Next.js project
npx create-next-app@latest jotin-portfolio --typescript --tailwind --app

# Install dependencies
pnpm add @prisma/client prisma lucide-react framer-motion
pnpm add @radix-ui/react-* # Add needed Radix primitives
pnpm add resend react-hook-form zod
pnpm add bcryptjs jsonwebtoken
pnpm add -D @types/bcryptjs @types/jsonwebtoken

# Setup Prisma with SQLite
npx prisma init --datasource-provider sqlite
# Copy schema from this document
npx prisma migrate dev --name init
npx prisma generate

# Create initial admin user (via seed script)
npx prisma db seed
```

### Development Workflow
1. Start with Phase 1 foundation tasks
2. Test each feature before moving forward
3. Use the admin dashboard for content management
4. Deploy to Vercel for production

---

**End of PRD/PRP Document v2.0**

*This document serves as the single source of truth for implementing the jotin.in portfolio website with admin capabilities.*