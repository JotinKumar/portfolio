# Blogs Editorial Header Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new editorial header to the public blogs page with a title, supporting text, post/topic counts, topic dropdown, and simplified search.

**Architecture:** Keep the existing blogs page route and data fetching in place, but extend the blogs hero component to render a dedicated editorial heading block above the current layout. Reuse the already fetched category and article counts to power the counters and dropdown, and add focused Playwright coverage so the new header structure remains stable.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Playwright

---

### Task 1: Add a failing blogs-header regression test

**Files:**
- Modify: `tests/public-detail-pages.spec.ts`

**Step 1: Write the failing test**

Add a test that opens `/blogs` and expects:

- a visible heading `Thinking Out Loud`
- a blogs utility row with `data-testid="blogs-editorial-utility"`
- a visible topic dropdown with `data-testid="blogs-topic-select"`
- a visible search form with `data-testid="blogs-editorial-search"`

**Step 2: Run test to verify it fails**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "blogs editorial header" --project=chromium --reporter=line`

Expected: FAIL because the current page does not expose the new editorial header structure.

### Task 2: Implement the blogs editorial header

**Files:**
- Modify: `components/sections/blogs/blogs-editorial-hero.tsx`
- Modify: `app/(public)/blogs/page.tsx`

**Step 1: Write minimal implementation**

Update the blogs hero so it renders:

- a large editorial title
- a supporting sentence
- a utility row with counts, a topic dropdown, and a right-aligned search field

Pass the available categories into the hero from the route file.

**Step 2: Run test to verify it passes**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "blogs editorial header" --project=chromium --reporter=line`

Expected: PASS

### Task 3: Verify the existing public page coverage

**Files:**
- Modify: `components/sections/blogs/blogs-editorial-hero.tsx` if needed

**Step 1: Run lint**

Run: `cmd /c npm run lint -- app/(public)/blogs/page.tsx components/sections/blogs/blogs-editorial-hero.tsx tests/public-detail-pages.spec.ts`

Expected: PASS

**Step 2: Run the full public-detail spec**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium --reporter=line`

Expected: PASS
