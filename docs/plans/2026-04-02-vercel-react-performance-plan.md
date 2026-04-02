# Vercel React Performance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce initial page load cost and improve caching by server-rendering more of the homepage and profile page, shrinking client bundles, and removing avoidable request waterfalls.

**Architecture:** Keep public content pages mostly server-rendered. Move only the truly interactive parts into small client islands. Prefer static rendering with revalidation for public pages, reduce heavy client-only boundaries, and remove extra Supabase round trips on the critical path.

**Tech Stack:** Next.js App Router, React 19, Supabase, Prisma, TypeScript, Framer Motion, next/dynamic

---

### Task 1: Baseline Measurement

**Files:**
- Modify: `package.json`
- Create: `docs/plans/2026-04-02-vercel-react-performance-plan.md`

**Step 1: Add a bundle analysis script**

Add a script that can run a production build with bundle analysis enabled.

**Step 2: Run the baseline build**

Run: `npm run build`
Expected: production build succeeds and route output is printed.

**Step 3: Run bundle analysis**

Run: `ANALYZE=true npm run build`
Expected: build succeeds and shows which client bundles are largest.

**Step 4: Record the baseline**

Write down:
- homepage route type
- profile route type
- largest client bundles
- whether `framer-motion` and `lucide-react` dominate public-page bundles

**Step 5: Commit**

```bash
git add package.json
git commit -m "chore: add performance measurement baseline"
```

### Task 2: Stop Forcing Dynamic Rendering on Profile

**Files:**
- Modify: `app/(public)/profile/page.tsx`

**Step 1: Remove forced dynamic rendering**

Delete:

```ts
export const dynamic = "force-dynamic";
```

Replace it with either:

```ts
export const revalidate = 3600;
```

or no route override at all if the page can stay static by default.

**Step 2: Keep data fetching parallel**

Retain the current `Promise.all` structure in `ProfilePage`.

**Step 3: Run the build**

Run: `npm run build`
Expected: `/profile` is no longer shown as dynamic unless another dependency still forces it.

**Step 4: Verify page behavior**

Check:
- profile page still renders with current public content
- `notFound()` behavior still works when content is disabled

**Step 5: Commit**

```bash
git add "app/(public)/profile/page.tsx"
git commit -m "perf: statically cache public profile page"
```

### Task 3: Make the Homepage Hero SSR-Friendly

**Files:**
- Modify: `components/home/HeroSplitClient.tsx`
- Modify: `components/home/HeroSplit.tsx`
- Modify: `app/(public)/page.tsx`
- Create: `components/home/HeroSplitShell.tsx`
- Create: `components/home/HeroSplitControls.tsx`

**Step 1: Split the hero into server and client responsibilities**

Server-render:
- the layout shell
- headings
- static text
- initial images

Client-render only:
- split-position state
- button interactions
- animated divider
- scroll cue behavior if needed

**Step 2: Remove `ssr: false`**

Replace the current client-only dynamic import in `HeroSplitClient` with either:
- a normal import, or
- a small dynamic client-only subcomponent inside a server-rendered wrapper

**Step 3: Keep the initial hero visually stable**

The default state should render complete markup on the server so users do not wait for a skeleton before seeing the hero.

**Step 4: Run the build**

Run: `npm run build`
Expected: homepage still builds and the hero no longer depends on a full client-only boundary for first paint.

**Step 5: Verify interaction**

Check:
- default hero view renders immediately
- professional/tech toggles still work
- no hydration mismatch warnings

**Step 6: Commit**

```bash
git add app/(public)/page.tsx components/home/HeroSplitClient.tsx components/home/HeroSplit.tsx components/home/HeroSplitShell.tsx components/home/HeroSplitControls.tsx
git commit -m "perf: server render homepage hero shell"
```

### Task 4: Shrink Icon Import Cost

**Files:**
- Modify: `next.config.ts`
- Modify: `components/layout/header.tsx`
- Modify: `components/profile/profile-editorial-shell.tsx`
- Modify: `components/home/HeroSplit.tsx`
- Modify: `components/home/work-timeline.tsx`
- Modify: `components/ui/article-card.tsx`
- Modify: `components/ui/project-card.tsx`

**Step 1: Enable package import optimization**

Add:

```ts
experimental: {
  optimizePackageImports: ["lucide-react"],
},
```

to `next.config.ts`.

**Step 2: Rebuild**

Run: `npm run build`
Expected: build succeeds with the new optimization setting.

**Step 3: Confirm no icon regressions**

Check the main public pages and admin pages for missing icons.

**Step 4: Commit**

```bash
git add next.config.ts components/layout/header.tsx components/profile/profile-editorial-shell.tsx components/home/HeroSplit.tsx components/home/work-timeline.tsx components/ui/article-card.tsx components/ui/project-card.tsx
git commit -m "perf: optimize lucide icon imports"
```

### Task 5: Break Up the Profile Client Bundle

**Files:**
- Modify: `app/(public)/profile/page.tsx`
- Modify: `components/profile/profile-editorial-shell.tsx`
- Modify: `components/profile/profile-magnetic-years.tsx`
- Modify: `components/profile/profile-timeline-block.tsx`
- Modify: `components/profile/language-ring.tsx`
- Create: `components/profile/profile-editorial-shell.server.tsx`
- Create: `components/profile/profile-skill-meters.client.tsx`
- Create: `components/profile/profile-hobby-preview.client.tsx`

**Step 1: Move static layout to a server component**

The server component should render:
- main layout
- static copy
- education content
- non-interactive structure

**Step 2: Extract the interactive islands**

Small client components should own:
- magnetic years animation
- hover hobby preview
- animated skill meters

**Step 3: Minimize prop payloads**

Pass only the fields each client island needs. Do not pass the whole page payload through one top-level client component.

**Step 4: Keep Framer Motion isolated**

Avoid importing `framer-motion` in components that can be server-rendered.

**Step 5: Run the build**

Run: `npm run build`
Expected: profile still renders correctly and the client bundle is smaller.

**Step 6: Commit**

```bash
git add "app/(public)/profile/page.tsx" components/profile/profile-editorial-shell.tsx components/profile/profile-magnetic-years.tsx components/profile/profile-timeline-block.tsx components/profile/language-ring.tsx components/profile/profile-editorial-shell.server.tsx components/profile/profile-skill-meters.client.tsx components/profile/profile-hobby-preview.client.tsx
git commit -m "perf: split profile page into server shell and client islands"
```

### Task 6: Remove the Featured Articles Waterfall

**Files:**
- Modify: `lib/server/queries.ts`
- Modify: `app/(public)/page.tsx`

**Step 1: Refactor `getFeaturedArticles`**

Replace the two-step query flow with one of these:
- fetch the top published rows once and pick featured items in memory
- or fetch both independent result sets in parallel if two queries are still needed

**Step 2: Preserve ordering behavior**

The returned array should still:
- prefer featured content first
- fill remaining slots with recent published articles
- avoid duplicates

**Step 3: Run the build**

Run: `npm run build`
Expected: no type errors and homepage content still renders.

**Step 4: Spot-check output**

Check that the homepage still shows the correct number of articles and no duplicate featured card appears.

**Step 5: Commit**

```bash
git add lib/server/queries.ts "app/(public)/page.tsx"
git commit -m "perf: remove featured article query waterfall"
```

### Task 7: Final Verification

**Files:**
- Modify: none

**Step 1: Run production build**

Run: `npm run build`
Expected: success.

**Step 2: Re-run bundle analysis**

Run: `ANALYZE=true npm run build`
Expected: smaller public-page client bundles than baseline.

**Step 3: Verify route strategy**

Confirm:
- `/` remains static
- `/profile` is static or ISR, not forced dynamic

**Step 4: Manual smoke test**

Check:
- homepage hero initial render
- homepage hero interaction
- profile page render
- profile page animations
- header theme toggle
- mobile nav

**Step 5: Final commit**

```bash
git commit --allow-empty -m "chore: verify public page performance improvements"
```
