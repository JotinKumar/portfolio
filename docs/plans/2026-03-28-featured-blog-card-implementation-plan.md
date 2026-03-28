# Featured Blog Card Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the main featured article on the public blogs page as an adapted editorial card based on the provided reference component.

**Architecture:** Keep the blogs page data flow unchanged and refactor only the lead featured-card presentation in `components/sections/blogs/blogs-editorial-hero.tsx`. Add a focused Playwright assertion for the featured card structure so the new layout is locked in, then implement the card using the existing article data and placeholder-image fallback.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Playwright

---

### Task 1: Add a failing featured-card regression test

**Files:**
- Modify: `tests/public-detail-pages.spec.ts`

**Step 1: Write the failing test**

Add a test that opens `/blogs` and expects:

- a featured article wrapper with `data-testid="featured-blog-card"`
- a lifted visual panel with `data-testid="featured-blog-media"`
- a bottom utility strip with `data-testid="featured-blog-utility-strip"`
- a floating action button with `data-testid="featured-blog-fab"`

**Step 2: Run test to verify it fails**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "featured blog card" --project=chromium --reporter=line`

Expected: FAIL because the current lead feature does not expose the new structure.

**Step 3: Commit**

```bash
git add tests/public-detail-pages.spec.ts
git commit -m "test: cover featured blogs lead card structure"
```

### Task 2: Implement the adapted featured editorial card

**Files:**
- Modify: `components/sections/blogs/blogs-editorial-hero.tsx`
- Reference: `components/sections/article-card.tsx`

**Step 1: Write minimal implementation**

Refactor `LeadEditorialFeature` so it:

- uses the provided reference layout pattern in an adapted form
- renders a lifted media block on the left
- renders title, author/byline treatment, and excerpt on the right
- renders a bottom strip with the large day/month plus multiple icons
- renders a floating action button
- uses the placeholder image path when `article.coverImage` is missing
- exposes stable `data-testid` hooks for the new Playwright assertions

**Step 2: Run test to verify it passes**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "featured blog card" --project=chromium --reporter=line`

Expected: PASS

**Step 3: Commit**

```bash
git add components/sections/blogs/blogs-editorial-hero.tsx tests/public-detail-pages.spec.ts
git commit -m "feat: redesign featured blog lead card"
```

### Task 3: Verify quality

**Files:**
- Modify: `components/sections/blogs/blogs-editorial-hero.tsx` if visual fixes are needed

**Step 1: Run lint**

Run: `cmd /c npm run lint -- components/sections/blogs/blogs-editorial-hero.tsx tests/public-detail-pages.spec.ts`

Expected: PASS

**Step 2: Run the focused blogs page tests**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium --reporter=line`

Expected: PASS for the featured-card and existing public-detail assertions.

**Step 3: Commit**

```bash
git add components/sections/blogs/blogs-editorial-hero.tsx tests/public-detail-pages.spec.ts
git commit -m "test: verify featured blog lead card refinement"
```
