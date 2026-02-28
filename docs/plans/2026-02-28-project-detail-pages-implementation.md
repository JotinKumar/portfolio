# Project Detail Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add individual project detail pages with blog-like structure, multiple image support, placeholders, and clickable project cards from the list page.

**Architecture:** Add a server-rendered route for `/projects/[slug]`, extend query helpers for project-by-slug retrieval, and update project cards/list interaction to route users to detail pages while preserving external live/code CTAs.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, existing UI components.

---

### Task 1: Add Project Query Helper by Slug

**Files:**
- Modify: `lib/server/queries.ts`

**Step 1:** Add `getProjectBySlug(slug)` with explicit column selection.

**Step 2:** Return `Project | null` and throw on DB errors.

**Step 3:** Verify typecheck.

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4:** Commit.

```bash
git add lib/server/queries.ts
git commit -m "feat: add server query helper for project detail by slug"
```

### Task 2: Create `/projects/[slug]` Detail Page

**Files:**
- Create: `app/(public)/projects/[slug]/page.tsx`

**Step 1:** Implement server page with slug fetch and not-found fallback card.

**Step 2:** Build blog-like sections:
- back button
- metadata header
- hero image block with placeholder
- screenshots gallery with fallback
- overview
- tech stack
- concepts/tags
- timeline fallback text
- live/code CTA band

**Step 3:** Add safe parsing helpers for `screenshots`, `techStack`, and `tags`.

**Step 4:** Verify typecheck.

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 5:** Commit.

```bash
git add app/(public)/projects/[slug]/page.tsx
git commit -m "feat: add styled project detail page with gallery placeholders"
```

### Task 3: Make Project Cards Click Through

**Files:**
- Modify: `components/sections/project-card.tsx`

**Step 1:** Wrap media/title (or main body) with internal link to `/projects/[slug]`.

**Step 2:** Preserve existing external live/code buttons.

**Step 3:** Keep card image placeholder behavior aligned where needed.

**Step 4:** Verify typecheck.

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 5:** Commit.

```bash
git add components/sections/project-card.tsx
git commit -m "feat: make project cards navigate to project detail pages"
```

### Task 4: Final Verification

**Files:**
- Verify only

**Step 1:** Typecheck.
Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 2:** Test.
Run: `cmd /c npm test`
Expected: PASS.

**Step 3:** Build.
Run: `cmd /c npm run build`
Expected: if sandbox build instability occurs, document limitation and keep typecheck/test evidence.

**Step 4:** Commit any remaining updates.

```bash
git add app components lib
git commit -m "feat: deliver project detail routing and blog-style project pages"
```