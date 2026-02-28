# Content Pages And Admin CRUD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add all missing article/project pages and admin create/edit pages so no linked route returns 404, while preserving current auth and data behavior.

**Architecture:** Build missing App Router pages for public content details and admin CRUD entry points, then centralize shared validation/query helpers to reduce duplication. Use server-rendered pages + route handlers where needed, and enforce admin-only access under the existing `/admin` layout guard.

**Tech Stack:** Next.js App Router, TypeScript, Supabase (`@supabase/ssr`), Zod, existing UI components.

---

### Task 1: Route Gap Audit Baseline

**Files:**
- Modify: `docs/plans/2026-02-28-content-pages-and-admin-crud-plan.md`
- Verify: `app/**`, `components/**`

**Step 1: Capture currently linked paths**

Run: `rg -n "href=|router\\.push\\(|redirect\\(" app components lib -S`
Expected: includes admin and public content links.

**Step 2: Compare against existing pages**

Run: `rg --files app`
Expected: confirms missing dynamic/detail/create/edit pages.

**Step 3: Document required routes in plan**

Add checklist of required pages:
- `/articles/[slug]`
- `/admin/articles/new`
- `/admin/articles/[id]/edit`
- `/admin/projects/new`
- `/admin/projects/[id]/edit`
- Optional fallback-safe route handling for invalid IDs/slugs (no framework 404 page shown for expected paths).

**Step 4: Commit (plan checkpoint)**

```bash
git add docs/plans/2026-02-28-content-pages-and-admin-crud-plan.md
git commit -m "docs: define content/admin route completion plan"
```

### Task 2: Add Shared Content Form Schema + Helpers

**Files:**
- Create: `lib/content-schemas.ts`
- Create: `lib/content-repo.ts`
- Test: `scripts/security-selftest.cjs` (extend lightweight checks) or route-level manual verification list in plan

**Step 1: Write failing type-level usage expectation**

Define intended function signatures in plan first:
- `parseArticleInput`
- `parseProjectInput`
- `getArticleById`, `getArticleBySlug`
- `getProjectById`

**Step 2: Run typecheck to confirm missing symbols fail**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: fail until helper files are created and imported.

**Step 3: Implement minimal helpers**

Add Zod schemas and thin Supabase fetch/insert/update wrappers used by both create and edit pages.

**Step 4: Re-run typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: pass for helper integration.

**Step 5: Commit**

```bash
git add lib/content-schemas.ts lib/content-repo.ts
git commit -m "refactor: add shared article/project schemas and repo helpers"
```

### Task 3: Public Individual Article Page

**Files:**
- Create: `app/articles/[slug]/page.tsx`
- Modify: `lib/db-types.ts` (if extra fields needed)

**Step 1: Write failing behavior check**

Manual check definition:
- Visiting `/articles/<valid-slug>` shows full article.
- Visiting unknown slug shows friendly message page (not default framework 404).

**Step 2: Implement minimal page**

Server page:
- query `Article` by `slug`
- show full content for published items
- if not found/unpublished, render in-app “Article not found” state with link back to `/articles`

**Step 3: Verify locally**

Run: `npm run dev`
Expected: route resolves for valid and invalid slug without framework 404 screen.

**Step 4: Commit**

```bash
git add app/articles/[slug]/page.tsx lib/db-types.ts
git commit -m "feat: add public individual article page with safe fallback state"
```

### Task 4: Admin New Article Page

**Files:**
- Create: `app/admin/articles/new/page.tsx`
- Create: `app/api/admin/articles/route.ts` (POST create)
- Modify: `app/admin/articles/page.tsx` (link confirmation and post-create refresh behavior if needed)

**Step 1: Write failing behavior check**

Manual definition:
- `/admin/articles/new` currently 404 -> must become form page.

**Step 2: Implement page + POST handler**

Add form fields mapped to `Article` columns:
- title, slug, excerpt, content, category, tags, readTime, featured, published

**Step 3: Verify validation + save**

Expected:
- invalid payload shows message
- valid save creates row and returns to `/admin/articles`

**Step 4: Commit**

```bash
git add app/admin/articles/new/page.tsx app/api/admin/articles/route.ts app/admin/articles/page.tsx
git commit -m "feat: add admin new article page and create endpoint"
```

### Task 5: Admin Edit Article Page

**Files:**
- Create: `app/admin/articles/[id]/edit/page.tsx`
- Create: `app/api/admin/articles/[id]/route.ts` (PATCH update)

**Step 1: Write failing behavior check**

Manual definition:
- `/admin/articles/<id>/edit` currently 404 -> must load editor for existing article.

**Step 2: Implement edit page + PATCH handler**

Behavior:
- load article by ID
- prefill form
- save updates
- invalid ID renders friendly state with “Back to articles”

**Step 3: Verify**

Expected:
- valid ID edit succeeds
- invalid ID no framework 404

**Step 4: Commit**

```bash
git add app/admin/articles/[id]/edit/page.tsx app/api/admin/articles/[id]/route.ts
git commit -m "feat: add admin article edit page and update endpoint"
```

### Task 6: Admin New Project Page

**Files:**
- Create: `app/admin/projects/new/page.tsx`
- Create: `app/api/admin/projects/route.ts` (POST create)
- Modify: `app/admin/projects/page.tsx` (add new-project CTA if missing)

**Step 1: Write failing behavior check**

Manual definition:
- `/admin/projects/new` currently 404 -> must render create form.

**Step 2: Implement page + create handler**

Fields:
- title, slug, shortDesc, description, category, status, order, featured, liveUrl, githubUrl, coverImage, screenshots, techStack, tags

**Step 3: Verify**

Expected:
- creates project and returns to projects admin listing.

**Step 4: Commit**

```bash
git add app/admin/projects/new/page.tsx app/api/admin/projects/route.ts app/admin/projects/page.tsx
git commit -m "feat: add admin new project page and create endpoint"
```

### Task 7: Admin Edit Project Page

**Files:**
- Create: `app/admin/projects/[id]/edit/page.tsx`
- Create: `app/api/admin/projects/[id]/route.ts` (PATCH update)

**Step 1: Write failing behavior check**

Manual definition:
- `/admin/projects/<id>/edit` currently 404 -> must render edit form.

**Step 2: Implement edit page + update handler**

Behavior:
- fetch by ID
- prefill fields
- save changes
- invalid ID -> friendly in-app state, no framework 404

**Step 3: Verify**

Expected:
- valid edit works
- invalid ID handled safely

**Step 4: Commit**

```bash
git add app/admin/projects/[id]/edit/page.tsx app/api/admin/projects/[id]/route.ts
git commit -m "feat: add admin project edit page and update endpoint"
```

### Task 8: Eliminate 404 For Known Content/Admin Paths

**Files:**
- Create: `app/admin/articles/[id]/page.tsx` (optional redirect helper page)
- Create: `app/admin/projects/[id]/page.tsx` (optional redirect helper page)
- Create: `app/articles/[slug]/not-found.tsx` (optional custom not-found UI if desired)
- Modify: any pages that currently link to non-existent paths

**Step 1: Add path-safe fallback behavior**

For known paths:
- either render friendly fallback UI
- or redirect to the nearest valid index (`/admin/articles`, `/admin/projects`, `/articles`)

**Step 2: Verify no user-facing framework 404 on known app paths**

Manual route checklist:
- `/articles/<bad-slug>`
- `/admin/articles/new`
- `/admin/articles/<bad-id>/edit`
- `/admin/projects/new`
- `/admin/projects/<bad-id>/edit`

**Step 3: Commit**

```bash
git add app/admin/articles/[id]/page.tsx app/admin/projects/[id]/page.tsx app/articles/[slug]/not-found.tsx
git commit -m "fix: add safe fallbacks to avoid framework 404 on known content routes"
```

### Task 9: Add Navigation Completeness In Admin

**Files:**
- Modify: `app/admin/articles/page.tsx`
- Modify: `app/admin/projects/page.tsx`

**Step 1: Ensure action links are complete**

Articles:
- new
- edit
- optional preview

Projects:
- new
- edit

**Step 2: Verify all admin CTAs resolve**

Run app and click through every button/link in:
- `/admin/articles`
- `/admin/projects`

Expected: no dead links / 404.

**Step 3: Commit**

```bash
git add app/admin/articles/page.tsx app/admin/projects/page.tsx
git commit -m "chore: complete admin navigation for article/project CRUD"
```

### Task 10: Full Verification Before Completion

**Files:**
- Verify only

**Step 1: Typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: no errors.

**Step 2: Build**

Run: `npm run build`
Expected: successful production build.

**Step 3: Smoke test critical paths**

Run dev server and verify:
- public list + individual article
- admin article create/edit
- admin project create/edit
- invalid article slug/id/project id paths show safe UI (not framework 404)

**Step 4: Final commit**

```bash
git add app lib
git commit -m "feat: complete article/project pages and admin CRUD routes without dead links"
```

