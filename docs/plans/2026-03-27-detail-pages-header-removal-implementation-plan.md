# Detail Page Header Removal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the dominant top header blocks from the blog and project detail pages and replace them with lighter editorial openings that match the approved refinement.

**Architecture:** Keep the existing route files and data flow intact, but refactor the two detail shell components so blogs open directly with the title composition and projects open directly with the gallery. Extend the existing Playwright detail-page coverage so the new entry hierarchy is locked in and the old bulky header patterns do not reappear.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Playwright

---

### Task 1: Add Regression Coverage For Header Removal

**Files:**
- Modify: `tests/public-detail-pages.spec.ts`
- Reference: `components/sections/blogs/blog-detail-shell.tsx`
- Reference: `components/sections/projects/project-detail-shell.tsx`

**Step 1: Write the failing test**

Extend the existing spec so it asserts the new hierarchy instead of the current header-heavy one.

```ts
test("blog detail opens with title composition instead of a large header block", async ({ page }) => {
  await page.goto("/blogs/preview-editorial-detail");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("blog-meta-rail")).toBeVisible();
  await expect(page.getByTestId("blog-legacy-header")).toHaveCount(0);
});

test("project detail opens with gallery instead of a dominant intro block", async ({ page }) => {
  await page.goto("/projects/preview-case-study-detail");

  await expect(page.getByTestId("project-gallery")).toBeVisible();
  await expect(page.getByTestId("project-legacy-header")).toHaveCount(0);
});
```

**Step 2: Run test to verify it fails**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium --reporter=line`

Expected: FAIL because the current shells still render the heavy top blocks and do not yet expose the new structure hooks.

**Step 3: Keep the test minimal and specific**

Ensure the test checks only hierarchy and presence/absence of the opening blocks, not unrelated copy.

```ts
await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
await expect(page.getByTestId("project-gallery")).toBeVisible();
```

**Step 4: Run test to verify the failure is meaningful**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium --reporter=line`

Expected: FAIL on the missing/incorrect opening structure, not on syntax or setup.

**Step 5: Commit**

```bash
git add tests/public-detail-pages.spec.ts
git commit -m "test: cover detail page header removal behavior"
```

### Task 2: Refine Blog Detail Opening

**Files:**
- Modify: `components/sections/blogs/blog-detail-shell.tsx`
- Test: `tests/public-detail-pages.spec.ts`

**Step 1: Write the failing test case for the lighter blog opening**

Add one specific assertion that proves the old top block is gone and the title now leads from the reading column.

```ts
test("blog title leads directly from the reading column", async ({ page }) => {
  await page.goto("/blogs/preview-editorial-detail");

  await expect(page.getByTestId("blog-title-block")).toBeVisible();
  await expect(page.getByTestId("blog-supporting-media")).toBeVisible();
});
```

**Step 2: Run the blog-specific test to verify it fails**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "blog" --project=chromium --reporter=line`

Expected: FAIL because the shell still opens with the larger header section.

**Step 3: Write minimal implementation**

Refactor `components/sections/blogs/blog-detail-shell.tsx` so:

- the back link remains in the rail
- the main column begins with the title block directly
- the bordered top header wrapper is removed
- the title/excerpt sit in a lighter composition
- the supporting image remains below the opening copy

Representative target structure:

```tsx
<article className="space-y-10" data-testid="blog-article-body">
  <div className="space-y-4" data-testid="blog-title-block">
    <p className="kicker text-muted-foreground">Journal Entry</p>
    <h1 className="type-section-title ...">{title}</h1>
    {excerpt ? <p className="type-body-lg ...">{excerpt}</p> : null}
  </div>

  {coverImage ? <figure data-testid="blog-supporting-media">...</figure> : null}

  <div className="grid gap-8 ...">...</div>
</article>
```

**Step 4: Run the blog-specific test to verify it passes**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "blog" --project=chromium --reporter=line`

Expected: PASS for all blog-detail assertions.

**Step 5: Commit**

```bash
git add components/sections/blogs/blog-detail-shell.tsx tests/public-detail-pages.spec.ts
git commit -m "feat: lighten blog detail opening"
```

### Task 3: Refine Project Detail Opening

**Files:**
- Modify: `components/sections/projects/project-detail-shell.tsx`
- Test: `tests/public-detail-pages.spec.ts`

**Step 1: Write the failing test case for gallery-first opening**

Add a project-specific assertion that the gallery is now the first dominant content section.

```ts
test("project gallery becomes the first dominant section", async ({ page }) => {
  await page.goto("/projects/preview-case-study-detail");

  await expect(page.getByTestId("project-gallery")).toBeVisible();
  await expect(page.getByTestId("project-rail")).toBeVisible();
});
```

**Step 2: Run the project-specific test to verify it fails**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "project" --project=chromium --reporter=line`

Expected: FAIL because the current shell still leads with the large intro block.

**Step 3: Write minimal implementation**

Refactor `components/sections/projects/project-detail-shell.tsx` so:

- the gallery moves to the top of the page
- the old dominant header block is removed
- the metadata/actions move into a compact side rail
- the title and summary move below the gallery or into the editorial flow rather than acting as a hero

Representative target structure:

```tsx
<PageContent className="space-y-10">
  {galleryItems.length > 0 ? <section data-testid="project-gallery">...</section> : null}

  <section className="grid gap-8 ...">
    <div className="space-y-8">
      <div className="space-y-4" data-testid="project-title-block">
        <h1 className="type-section-title ...">{title}</h1>
        <p className="type-body-lg ...">{summary}</p>
      </div>
      <section>overview...</section>
    </div>

    <aside data-testid="project-rail" className="space-y-6 ...">...</aside>
  </section>
</PageContent>
```

**Step 4: Run the project-specific test to verify it passes**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "project" --project=chromium --reporter=line`

Expected: PASS for all project-detail assertions.

**Step 5: Commit**

```bash
git add components/sections/projects/project-detail-shell.tsx tests/public-detail-pages.spec.ts
git commit -m "feat: make project detail gallery-led"
```

### Task 4: Final Verification And Polish

**Files:**
- Modify: `components/sections/blogs/blog-detail-shell.tsx`
- Modify: `components/sections/projects/project-detail-shell.tsx`
- Modify: `tests/public-detail-pages.spec.ts`

**Step 1: Add any last verification for sparse-content behavior**

Keep the assertions focused on the refined opening and absence of the old bulky top sections.

```ts
await expect(page.getByTestId("blog-legacy-header")).toHaveCount(0);
await expect(page.getByTestId("project-legacy-header")).toHaveCount(0);
```

**Step 2: Run the full detail-page spec**

Run: `set PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 && set PLAYWRIGHT_SKIP_WEBSERVER=1 && cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium --reporter=line`

Expected: PASS across blog and project detail refinements.

**Step 3: Run static verification**

Run: `cmd /c npx eslint "components/sections/blogs/blog-detail-shell.tsx" "components/sections/projects/project-detail-shell.tsx" "tests/public-detail-pages.spec.ts"`

Expected: PASS with no lint errors in the touched files.

**Step 4: Run project test suite**

Run: `cmd /c npm test`

Expected: PASS with `security self-test passed`.

**Step 5: Commit**

```bash
git add components/sections/blogs/blog-detail-shell.tsx components/sections/projects/project-detail-shell.tsx tests/public-detail-pages.spec.ts
git commit -m "fix: remove heavy detail page header blocks"
```
