# Supabase Runtime Data Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move all runtime application data access from Prisma to Supabase while preserving current behavior.

**Architecture:** Replace each Prisma query in `app/**` with server-side Supabase queries using `createServerSupabaseClient()`. Introduce local shared row types in `lib/db-types.ts` to avoid runtime dependency on Prisma client types in UI components.

**Tech Stack:** Next.js App Router, Supabase (`@supabase/ssr`), TypeScript.

---

### Task 1: Add shared DB row types

**Files:**
- Create: `lib/db-types.ts`

**Step 1: Write type definitions**
- Add interfaces for `Article`, `Project`, `WorkExperience`, `Contact`, and `Settings`.

**Step 2: Verify compile references**
- Replace `@prisma/client` type imports where used by UI components/pages.

### Task 2: Migrate public pages to Supabase

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/articles/page.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/profile/page.tsx`

**Step 1: Swap Prisma imports with Supabase server client**
- Use `createServerSupabaseClient()`.

**Step 2: Port each query**
- Recreate filters/order/take logic using Supabase query builders.

**Step 3: Preserve formatting/fallback behavior**
- Keep existing empty states and date/string transforms.

### Task 3: Migrate admin pages and contact API

**Files:**
- Modify: `app/admin/dashboard/page.tsx`
- Modify: `app/admin/articles/page.tsx`
- Modify: `app/admin/experience/page.tsx`
- Modify: `app/admin/projects/page.tsx`
- Modify: `app/admin/settings/page.tsx`
- Modify: `app/admin/messages/page.tsx`
- Modify: `app/api/contact/route.ts`

**Step 1: Replace all Prisma reads/writes**
- Use Supabase `.select()`, `.insert()`, and count queries.

**Step 2: Keep behavior consistent**
- Preserve ordering, limits, and displayed fields.

### Task 4: Remove Prisma runtime dependency from build path

**Files:**
- Modify: `package.json`

**Step 1: Update build script**
- Remove `prisma generate` from `build` script so app build does not require Prisma runtime client generation.

### Task 5: Verify migration

**Files:**
- Modify if needed from failures

**Step 1: Typecheck**
- Run: `npx tsc --noEmit --pretty false --incremental false`

**Step 2: Build**
- Run: `npm run build`

**Step 3: Confirm no Prisma runtime usage in app**
- Run search for `@/lib/prisma` and `prisma.` under `app/`.
