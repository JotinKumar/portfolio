# Data-Driven Public Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Render all public page copy, labels, links, and section content from database tables while preserving existing client-side interactivity.

**Architecture:** Introduce structured content tables (`SiteConfig`, `NavigationItem`, `SocialLink`, `HeroContent`, `PageContent`, `Competency`) and fetch them server-side through `lib/server/queries.ts`. Pass fetched data into client components as props for animations and interactive controls.

**Tech Stack:** Next.js App Router, TypeScript, Supabase JS (server client), Prisma schema/migrations, PostgreSQL

---

### Task 1: Add database schema and migration
- Files:
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260301123000_data_driven_public_content/migration.sql`
- Modify: `prisma/seed.ts`

### Task 2: Extend typed DB contracts and query layer
- Files:
- Modify: `lib/db-types.ts`
- Modify: `lib/server/queries.ts`

### Task 3: Wire public shell and hero rendering
- Files:
- Modify: `app/(public)/layout.tsx`
- Modify: `components/layout/header.tsx`
- Modify: `components/layout/footer.tsx`
- Modify: `components/sections/hero/HeroSplitClient.tsx`
- Modify: `components/sections/hero/HeroSplit.tsx`
- Modify: `components/sections/hero/ProfessionalHero.tsx`
- Modify: `components/sections/hero/TechHero.tsx`
- Modify: `app/(public)/page.tsx`

### Task 4: Wire profile/articles/projects/contact page copy
- Files:
- Modify: `app/(public)/profile/page.tsx`
- Modify: `app/(public)/articles/page.tsx`
- Modify: `app/(public)/projects/page.tsx`
- Modify: `app/(public)/contact/page.tsx`
- Create: `components/sections/contact-form-card.tsx`
- Modify: `components/sections/work-timeline.tsx`
- Modify: `components/sections/featured-articles.tsx`
- Modify: `components/sections/featured-projects.tsx`

### Task 5: Update admin settings visibility for new content entities
- Files:
- Modify: `app/(admin)/admin/(protected)/settings/page.tsx`

### Task 6: Verify and apply to Supabase
- Run typecheck/build verification.
- Apply migration to Supabase.
- Seed baseline content.
