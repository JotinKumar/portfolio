# Vercel React Best Practices Remediation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve real-world performance and maintainability of the portfolio by applying high-impact Vercel React/Next.js best practices without changing product behavior.

**Architecture:** Keep data fetching server-first and parallelized, reduce global client-side hydration cost from layout-level effects/animations, and scope expensive UI logic to only pages that need it. Refactor repetitive database access into shared server helpers with cache-aware boundaries and narrower payloads.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Supabase SSR, Framer Motion, Tailwind CSS.

---

## Audit Summary (Prioritized)

### P0 (Critical)

1. `bundle-dynamic-imports`: Heavy hero animation stack (`framer-motion`) is loaded on home route via static import in [app/page.tsx](/E:/Projects/portfolio/app/page.tsx).
2. `bundle-conditional`: Global animated visuals are mounted in root layout for all routes, including admin and auth pages ([app/layout.tsx](/E:/Projects/portfolio/app/layout.tsx)).
3. `server-serialization`: Multiple pages query `select('*')` instead of selecting only rendered fields, increasing payload and serialization costs.

### P1 (High)

1. `server-cache-react`: Repeated per-request access patterns can be deduplicated through shared cached query helpers.
2. `async-api-routes`: Contact API can start independent work earlier and await later for lower tail latency.
3. `rendering-hydration-no-flicker`: Several components gate render on `mounted` and return `null`/fallbacks, causing avoidable hydration mismatch/flicker patterns.

### P2 (Medium)

1. `rerender-derived-state-no-effect`: Minor derivations and parsing are done repeatedly in render paths.
2. `client-passive-event-listeners`: Scroll/resize/visibility listeners should be audited for passive mode where relevant.
3. `rendering-content-visibility`: Long horizontal/vertical card sections can use content visibility for reduced offscreen work.

## Task 1 Baseline Notes (2026-02-28)

- `npm run build` compiles sources successfully but fails in this environment at process spawn with `Error: spawn EPERM` during build-time TypeScript stage.
- `npx tsc --noEmit --pretty false --incremental false` passes after clearing stale `.next` artifacts.
- Hotspot scan confirms global layout currently pulled public animation shell (`Background`, `FloatingBlobsBar`, `Header`) from root layout pre-refactor.

---

### Task 1: Build Baseline Performance Snapshot

**Files:**
- Verify: `package.json`
- Verify: `app/layout.tsx`, `app/page.tsx`

**Step 1: Build production output**

Run: `npm run build`
Expected: successful build and route classification output.

**Step 2: Capture bundle/hydration hotspots**

Run: `rg -n "use client|framer-motion|FloatingBlobsBar|Background|Header" app components`
Expected: confirms globally-mounted client components and animation-heavy areas.

**Step 3: Record baseline notes in this plan**

Document current bottlenecks before refactor so changes are measurable.

**Step 4: Commit**

```bash
git add docs/plans/2026-02-28-vercel-react-best-practices-remediation-plan.md
git commit -m "docs: add vercel react best-practices remediation plan"
```

### Task 2: Split Route Groups to Reduce Global Hydration

**Files:**
- Create: `app/(public)/layout.tsx`
- Create: `app/(admin)/layout.tsx`
- Move/Modify: `app/page.tsx`, `app/profile/page.tsx`, `app/articles/**`, `app/projects/**`, `app/contact/page.tsx`, `app/login/page.tsx`, `app/admin/**`
- Modify: `app/layout.tsx`

**Step 1: Move marketing visual shell out of root layout**

Keep `ThemeProvider` and global CSS in root layout only.

**Step 2: Apply animated background/header only to public group**

Place `Background`, `FloatingBlobsBar`, and public `Header/Footer` in `(public)` layout.

**Step 3: Keep admin/auth layout lean**

Use minimal layout in `(admin)` and login flows to avoid unnecessary client bundles.

**Step 4: Verify routes**

Run: `npm run build`
Expected: all routes compile with unchanged URLs and reduced global client surface.

**Step 5: Commit**

```bash
git add app
git commit -m "refactor: scope animated client layout to public routes"
```

### Task 3: Dynamically Load Hero Animation Stack

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sections/hero/HeroSplit.tsx`
- Optional Create: `components/sections/hero/HeroSplitSkeleton.tsx`

**Step 1: Convert home hero to dynamic import**

Use `next/dynamic` in `app/page.tsx` with SSR disabled only for animation-heavy interactive hero.

**Step 2: Add lightweight fallback**

Render a static hero placeholder/skeleton while client chunk loads.

**Step 3: Keep data sections server-rendered**

`WorkTimeline`, `FeaturedArticles`, `FeaturedProjects` remain server-fed from `app/page.tsx`.

**Step 4: Verify**

Run: `npm run build`
Expected: successful build, no behavior regression on home route.

**Step 5: Commit**

```bash
git add app/page.tsx components/sections/hero
git commit -m "perf: dynamically load interactive home hero"
```

### Task 4: Narrow Supabase Selects and Shared Query Helpers

**Files:**
- Create: `lib/server/queries.ts`
- Modify: `app/page.tsx`
- Modify: `app/profile/page.tsx`
- Modify: `app/articles/page.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/admin/dashboard/page.tsx`
- Modify: `app/articles/[slug]/page.tsx`

**Step 1: Replace `select('*')` with explicit columns**

Include only fields rendered by each page/card.

**Step 2: Extract shared fetchers**

Centralize repeated queries (featured articles/projects, category lists, dashboard counts).

**Step 3: Add per-request dedupe with `cache()` where reused**

Wrap read-only fetchers used multiple times in one render tree.

**Step 4: Verify**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: no type errors after query helper extraction.

**Step 5: Commit**

```bash
git add lib/server/queries.ts app
git commit -m "perf: narrow db selects and add shared cached query helpers"
```

### Task 5: Improve Contact API Route Async Structure

**Files:**
- Modify: `app/api/contact/route.ts`

**Step 1: Start independent tasks earlier**

Instantiate reusable clients and sanitize inputs once after validation.

**Step 2: Await DB write first, defer non-critical work**

Keep persistence synchronous for correctness; move notification send to non-blocking path (`after()` or explicit non-blocking pattern) where acceptable.

**Step 3: Keep security controls unchanged**

Preserve trusted-origin check and rate limiting behavior.

**Step 4: Verify**

Run: `npm run test`
Expected: existing security self-test passes.

**Step 5: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "perf: optimize contact api async flow while preserving security"
```

### Task 6: Remove Mount-Gating Flicker Patterns

**Files:**
- Modify: `components/layout/header.tsx`
- Modify: `components/ui/background.tsx`
- Modify: `components/ui/glassmorphism.tsx`

**Step 1: Replace `mounted` null-return patterns**

Prefer SSR-safe defaults and `suppressHydrationWarning` only where mismatch is intentional.

**Step 2: Limit client-only theme-dependent style churn**

Use CSS variables/classes to avoid render-then-swap logic where possible.

**Step 3: Verify visually**

Run: `npm run dev`
Expected: header/background render consistently without first-paint disappearance.

**Step 4: Commit**

```bash
git add components/layout/header.tsx components/ui/background.tsx components/ui/glassmorphism.tsx
git commit -m "perf: remove mount-gating hydration flicker in shared ui"
```

### Task 7: Optimize Animation/Event Work in Floating Blobs

**Files:**
- Modify: `components/ui/floating-blobs-bar.tsx`

**Step 1: Use passive listener options where safe**

Apply passive mode for listeners that never call `preventDefault`.

**Step 2: Add reduced-motion guard**

Skip animation loop for users with `prefers-reduced-motion: reduce`.

**Step 3: Ensure strict cleanup paths**

Keep animation frame and listeners reliably cleaned up.

**Step 4: Verify**

Run: `npm run build`
Expected: no runtime or type regressions.

**Step 5: Commit**

```bash
git add components/ui/floating-blobs-bar.tsx
git commit -m "perf: optimize floating blobs listeners and motion behavior"
```

### Task 8: Rendering and Re-render Micro-Optimizations

**Files:**
- Modify: `components/sections/work-timeline.tsx`
- Modify: `components/sections/project-card.tsx`
- Modify: `components/sections/article-card.tsx`

**Step 1: Move repeated parsing out of render JSX blocks**

Avoid inline IIFEs and repeated `JSON.parse` in mapped trees.

**Step 2: Stabilize cheap derived values**

Precompute derived arrays and guard invalid values.

**Step 3: Add `content-visibility` where list sections are long**

Apply to card containers to reduce offscreen rendering cost.

**Step 4: Verify**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: no type errors.

**Step 5: Commit**

```bash
git add components/sections
git commit -m "perf: reduce render-path parsing and offscreen work"
```

### Task 9: Final Verification Before Merge

**Files:**
- Verify only

**Step 1: Typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: pass.

**Step 2: Production build**

Run: `npm run build`
Expected: pass.

**Step 3: Functional smoke checks**

Run: `npm run dev`
Expected: public pages, admin pages, login, and contact form function correctly.

**Step 4: Optional code review checkpoint**

Request review for regressions in routing/layout boundaries and perceived home-page load speed.

**Step 5: Final commit**

```bash
git add app components lib docs/plans
git commit -m "perf: apply vercel react best-practices across app"
```
