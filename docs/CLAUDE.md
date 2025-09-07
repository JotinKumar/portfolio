# CLAUDE.md - Implementation Guide for jotin.in Portfolio

## 🎯 Project Overview
You are building a professional portfolio website for Jotin Kumar Madugula at jotin.in. This is a Next.js 15 application with TypeScript, TailwindCSS, shadcn/ui, SQLite database, and an admin dashboard for content management.

## 🛠️ MCP Tools to Use

### Required MCP Servers
```bash
# Ensure these MCP servers are connected:
1. @context7 - For project context and file management
2. @shadcnui - For UI component installation
3. @playwright - For E2E testing after each feature
```

### Tool Usage Guidelines
- **@context7**: Use for maintaining project context, tracking TODOs, and managing file relationships
- **@shadcnui**: Use for installing UI components instead of manual creation
- **@playwright**: Run tests after EVERY major feature implementation

## 📋 Implementation Workflow

### IMPORTANT: Follow These Rules
1. **Test after EVERY feature implementation** using Playwright
2. **Commit to GitHub after EVERY successful test**
3. **Use @shadcnui for ALL UI components** - don't create from scratch
4. **Track progress in GitHub Projects**
5. **Update @context7 after each phase completion**

## 🚀 Phase 1: Project Foundation (Day 1-3)

### Step 1.1: Initial Setup
```bash
# Create project and initialize
npx create-next-app@latest jotin-portfolio --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd jotin-portfolio

# Initialize Git and create GitHub repo
git init
gh repo create jotin-portfolio --public --source=. --remote=origin --push

# Create GitHub Project for tracking
gh project create --title "Portfolio Development" --body "Tracking portfolio website development"
```

### Step 1.2: Install Dependencies
```bash
# Core dependencies
pnpm add @prisma/client prisma lucide-react framer-motion
pnpm add resend react-hook-form zod
pnpm add bcryptjs jsonwebtoken cookies-next
pnpm add -D @types/bcryptjs @types/jsonwebtoken

# Install shadcn/ui CLI
pnpm dlx shadcn-ui@latest init
# Choose: Default style, Slate base color, CSS variables
```

### Step 1.3: Setup shadcn/ui Components
```bash
# Use @shadcnui MCP to install these components:
@shadcnui add button
@shadcnui add card
@shadcnui add form
@shadcnui add input
@shadcnui add label
@shadcnui add navigation-menu
@shadcnui add select
@shadcnui add separator
@shadcnui add sheet
@shadcnui add skeleton
@shadcnui add switch
@shadcnui add tabs
@shadcnui add textarea
@shadcnui add toast
@shadcnui add toggle
@shadcnui add badge
@shadcnui add dialog
@shadcnui add dropdown-menu
@shadcnui add avatar
```

### Step 1.4: Setup Database
```bash
# Initialize Prisma with SQLite
npx prisma init --datasource-provider sqlite

# Create the schema file (copy from PRD)
# Then run:
npx prisma migrate dev --name init
npx prisma generate

# Create seed file at prisma/seed.ts
```

**prisma/seed.ts:**
```typescript
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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Add to package.json:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

### Step 1.5: Create Project Structure
```bash
# Create directory structure
mkdir -p app/{(marketing),articles,projects,admin,api}
mkdir -p app/api/{auth,admin}
mkdir -p components/{ui,layout,sections,admin,common}
mkdir -p lib hooks styles public/{images,uploads}

# Use @context7 to track this structure
@context7 add "Project structure created with all necessary directories"
```

### Step 1.6: Setup Testing
```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install

# Create playwright.config.ts
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### TEST CHECKPOINT 1
```bash
# Run initial test
@playwright test --project=chromium

# If successful, commit:
git add .
git commit -m "✅ Phase 1.1-1.6: Project foundation setup complete"
git push

# Update GitHub Project
gh issue create --title "✅ Foundation Setup Complete" --body "Database, dependencies, and structure ready"
```

## 🎨 Phase 2: Core Components (Day 4-6)

### Step 2.1: Layout Components

**app/layout.tsx:**
```typescript
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jotin Kumar Madugula - Portfolio',
  description: 'Business Process Expert & Full Stack Developer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Step 2.2: Hero Toggle Component

**components/sections/hero-toggle.tsx:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Download, Mail, Code, Briefcase } from 'lucide-react';

export function HeroToggle() {
  const [mode, setMode] = useState<'professional' | 'tech'>('professional');
  
  useEffect(() => {
    const saved = localStorage.getItem('hero-mode');
    if (saved) setMode(saved as typeof mode);
  }, []);

  useEffect(() => {
    localStorage.setItem('hero-mode', mode);
  }, [mode]);

  const content = {
    professional: {
      title: "Business Process Expert",
      subtitle: "Transforming operations through intelligent automation",
      skills: ["Process Optimization", "Team Leadership", "AI Integration", "Strategic Planning"],
      primaryCTA: { label: "Download Resume", href: "/resume.pdf", icon: Download },
      secondaryCTA: { label: "Get in Touch", href: "/contact", icon: Mail }
    },
    tech: {
      title: "Full Stack Developer",
      subtitle: "Building scalable solutions with modern technologies",
      skills: ["Next.js", "React", "TypeScript", "Python", "AI/ML", "Cloud"],
      primaryCTA: { label: "View Projects", href: "/projects", icon: Code },
      secondaryCTA: { label: "Read Articles", href: "/articles", icon: Briefcase }
    }
  };

  const current = content[mode];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 p-1 bg-muted rounded-full">
              <span className={`px-3 py-1 ${mode === 'professional' ? 'font-semibold' : ''}`}>
                Professional
              </span>
              <Switch
                checked={mode === 'tech'}
                onCheckedChange={(checked) => setMode(checked ? 'tech' : 'professional')}
              />
              <span className={`px-3 py-1 ${mode === 'tech' ? 'font-semibold' : ''}`}>
                Tech
              </span>
            </div>
          </div>

          {/* Animated Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                Jotin Kumar Madugula
              </h1>
              <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6">
                {current.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                {current.subtitle}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {current.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <a href={current.primaryCTA.href}>
                    <current.primaryCTA.icon className="w-4 h-4" />
                    {current.primaryCTA.label}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href={current.secondaryCTA.href}>
                    <current.secondaryCTA.icon className="w-4 h-4" />
                    {current.secondaryCTA.label}
                  </a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
```

### TEST CHECKPOINT 2
```bash
# Test hero component
@playwright test tests/hero.spec.ts

# Create test file first:
```

**tests/hero.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test('should toggle between professional and tech modes', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state
    await expect(page.getByText('Business Process Expert')).toBeVisible();
    
    // Toggle to tech mode
    await page.getByRole('switch').click();
    await expect(page.getByText('Full Stack Developer')).toBeVisible();
    
    // Check persistence
    await page.reload();
    await expect(page.getByText('Full Stack Developer')).toBeVisible();
  });
});
```

```bash
# After successful test:
git add .
git commit -m "✅ Phase 2.1-2.2: Layout and Hero components complete"
git push
```

### Step 2.3: Horizontal Timeline Component

**components/sections/work-timeline.tsx:**
```typescript
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export function WorkTimeline({ experiences }: { experiences: Experience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Work Experience
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          {/* Scrollable container */}
          <div
            ref={containerRef}
            className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.role}</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {exp.company}
                      </p>
                    </div>
                    {exp.current && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                  </div>
                  
                  <p className="text-sm mb-4">{exp.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {exp.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### TEST CHECKPOINT 3
```bash
@playwright test tests/timeline.spec.ts

# After success:
git add .
git commit -m "✅ Phase 2.3: Horizontal timeline component complete"
git push
```

## 🔐 Phase 3: Admin Dashboard (Day 7-9)

### Step 3.1: Authentication Setup

**lib/auth.ts:**
```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get('auth-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
```

### Step 3.2: Admin Layout

**app/admin/layout.tsx:**
```typescript
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
```

### Step 3.3: Article CRUD

**app/admin/articles/page.tsx:**
```typescript
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Edit, Trash } from 'lucide-react';

export default async function ArticlesAdmin() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={article.published ? 'default' : 'secondary'}>
                    {article.published ? 'Published' : 'Draft'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/articles/${article.id}/edit`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### TEST CHECKPOINT 4
```bash
# Test admin authentication
@playwright test tests/admin.spec.ts

# After success:
git add .
git commit -m "✅ Phase 3: Admin dashboard with authentication complete"
git push
```

## 📝 Phase 4: Content Pages (Day 10-12)

### Step 4.1: Articles Listing

**app/articles/page.tsx:**
```typescript
import { prisma } from '@/lib/prisma';
import { ArticleCard } from '@/components/sections/article-card';
import { SearchBar } from '@/components/common/search-bar';
import { CategoryFilter } from '@/components/common/category-filter';

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(searchParams.category && { category: searchParams.category }),
      ...(searchParams.search && {
        OR: [
          { title: { contains: searchParams.search } },
          { excerpt: { contains: searchParams.search } },
        ],
      }),
    },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Articles</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <SearchBar />
        <CategoryFilter />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
```

### Step 4.2: Projects Showcase

**app/projects/page.tsx:**
```typescript
import { prisma } from '@/lib/prisma';
import { ProjectCard } from '@/components/sections/project-card';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

### TEST CHECKPOINT 5
```bash
@playwright test tests/content.spec.ts

# After success:
git add .
git commit -m "✅ Phase 4: Content pages complete"
git push
```

## 🚀 Phase 5: Deployment (Day 13-14)

### Step 5.1: Production Setup

**Create .env.production:**
```env
DATABASE_URL="file:./prod.db"
RESEND_API_KEY="re_production_key"
JWT_SECRET="production_secret_key"
NEXT_PUBLIC_APP_URL="https://jotin.in"
```

### Step 5.2: Vercel Deployment
```bash
# Install Vercel CLI
pnpm add -D vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Step 5.3: Final Testing
```bash
# Run full test suite
@playwright test

# Run performance test
npm run build
npm run start
# Test lighthouse scores
```

### FINAL CHECKPOINT
```bash
git add .
git commit -m "🎉 Portfolio website complete and deployed"
git push

# Create release
gh release create v1.0.0 --title "Portfolio v1.0.0" --notes "Initial release of jotin.in portfolio"
```

## 📊 Testing Strategy

### After EVERY Feature Implementation:
1. **Unit Test** with @playwright
2. **Visual Test** in browser (desktop + mobile)
3. **Accessibility Test** with axe DevTools
4. **Performance Test** with Lighthouse

### Test Files Structure:
```
tests/
├── hero.spec.ts
├── timeline.spec.ts
├── admin.spec.ts
├── articles.spec.ts
├── projects.spec.ts
├── contact.spec.ts
└── e2e.spec.ts
```

## 🎯 GitHub Project Structure

Create these issues in GitHub Project:
```markdown
## Milestones
- [ ] Foundation Setup
- [ ] Core Components
- [ ] Admin Dashboard
- [ ] Content Pages
- [ ] Deployment

## Issues Template
Title: [Phase X.Y] Feature Name
Labels: enhancement, in-progress
Assignee: @jotin
Project: Portfolio Development
```

## 🔄 Git Commit Convention

Use these prefixes:
- `✅` - Feature complete with tests
- `🐛` - Bug fix
- `💄` - UI/style updates
- `📝` - Documentation
- `🚀` - Deployment
- `♻️` - Refactor
- `🔧` - Configuration

## 📚 Context Management with @context7

After each phase:
```bash
@context7 update "Phase X complete: [description]"
@context7 add-todo "Next: [next task]"
@context7 track-file [important files]
```

## 🎨 UI Component Usage with @shadcnui

Always use @shadcnui for components:
```bash
# Instead of creating manually:
@shadcnui add [component-name]

# Then customize the imported component
```

## 🧪 Playwright Testing with @playwright

Create comprehensive tests:
```typescript
// Example test structure
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## 🚨 Important Reminders

1. **NEVER skip testing** - Test after every feature
2. **ALWAYS use MCP tools** - Don't reinvent the wheel
3. **Commit frequently** - After every successful test
4. **Track progress** - Update GitHub Project regularly
5. **Document changes** - Keep README and CHANGELOG updated

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Playwright**: https://playwright.dev

---

**START IMPLEMENTATION NOW** 🚀

Begin with Phase 1, Step 1.1 and follow this guide sequentially. Test after each step, commit after each success, and track everything in GitHub Projects.