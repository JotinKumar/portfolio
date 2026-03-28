# Project And Blog Detail Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the public blog and project detail pages so blogs are text-first editorial pages and projects are screenshot-led case studies that align with the rest of the portfolio.

**Architecture:** Keep the existing query layer and route structure, but move most of the presentation logic out of the route files into page-specific section components under `components/sections/blogs` and `components/sections/projects`. Add one focused Playwright regression spec that checks the intended content hierarchy and the absence of placeholder-heavy behavior on both detail pages.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Playwright

---

### Task 1: Add Detail-Page Regression Coverage

**Files:**
- Create: `tests/public-detail-pages.spec.ts`
- Modify: `playwright.config.ts`
- Reference: `app/(public)/blogs/[slug]/page.tsx`
- Reference: `app/(public)/projects/[slug]/page.tsx`

**Step 1: Write the failing test**

```ts
import { test, expect } from "@playwright/test";

test("blog detail stays text-first when a cover image exists", async ({ page }) => {
  await page.goto("/blogs/sample-slug");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("min read")).toBeVisible();
  await expect(page.locator("main img").first()).toBeVisible();

  const heroLikeImage = page.locator('[data-testid="blog-hero-media"]');
  await expect(heroLikeImage).toHaveCount(0);
});

test("project detail surfaces case-study evidence before long-form metadata", async ({ page }) => {
  await page.goto("/projects/sample-slug");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("project-gallery")).toBeVisible();
  await expect(page.getByText("Technology Stack")).toBeVisible();
  await expect(page.getByText("Future Improvements")).toHaveCount(0);
});
```

**Step 2: Run test to verify it fails**

Run: `cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium`

Expected: FAIL because the detail pages do not yet expose the intended structure or `data-testid` hooks.

**Step 3: Add the minimum test harness updates**

Update `playwright.config.ts` only if needed so the new spec is discovered under `tests/`.

```ts
export default defineConfig({
  testDir: "./tests",
});
```

**Step 4: Run test to verify the failure is meaningful**

Run: `cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium`

Expected: FAIL on missing selectors or incorrect content ordering, not on syntax or configuration errors.

**Step 5: Commit**

```bash
git add playwright.config.ts tests/public-detail-pages.spec.ts
git commit -m "test: add detail page layout regression coverage"
```

### Task 2: Rebuild Blog Detail As An Editorial Reading Page

**Files:**
- Create: `components/sections/blogs/blog-detail-shell.tsx`
- Modify: `app/(public)/blogs/[slug]/page.tsx`
- Reference: `components/layout/page-primitives.tsx`
- Reference: `app/(public)/blogs/page.tsx`

**Step 1: Write the failing test case for the new blog structure**

Extend `tests/public-detail-pages.spec.ts` with explicit assertions for the editorial shell.

```ts
test("blog detail renders metadata rail and keeps the article body central", async ({ page }) => {
  await page.goto("/blogs/sample-slug");

  await expect(page.getByTestId("blog-meta-rail")).toBeVisible();
  await expect(page.getByTestId("blog-article-body")).toBeVisible();
  await expect(page.getByTestId("blog-supporting-media")).toHaveCount(0);
});
```

**Step 2: Run the blog-specific test to verify it fails**

Run: `cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "blog detail" --project=chromium`

Expected: FAIL because the page still uses the old hero-image and card layout.

**Step 3: Implement the minimal blog shell**

Create `components/sections/blogs/blog-detail-shell.tsx`.

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/components/layout/page-primitives";

export function BlogDetailShell({
  title,
  category,
  publishedDate,
  readTime,
  tags,
  coverImage,
  content,
}: {
  title: string;
  category: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  coverImage?: string | null;
  content: string;
}) {
  return (
    <PageContent className="grid gap-8 xl:grid-cols-[14rem_minmax(0,44rem)_minmax(0,1fr)]">
      <aside data-testid="blog-meta-rail" className="space-y-4 xl:sticky xl:top-28">
        <Button variant="outline" size="sm" asChild>
          <Link href="/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{publishedDate}</p>
          <p className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{readTime}</p>
        </div>
      </aside>

      <article className="space-y-8">
        <header className="space-y-4">
          <Badge variant="secondary">{category}</Badge>
          <h1 className="type-section-title text-[2.8rem] leading-[0.94]">{title}</h1>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {coverImage ? (
          <div data-testid="blog-supporting-media" className="relative aspect-[16/9] overflow-hidden border border-border/70">
            <Image src={coverImage} alt={title} fill className="object-cover" />
          </div>
        ) : null}

        <div data-testid="blog-article-body" className="type-body whitespace-pre-wrap text-muted-foreground">
          {content}
        </div>
      </article>
    </PageContent>
  );
}
```

Then replace most of the presentation in `app/(public)/blogs/[slug]/page.tsx` with the new shell and remove the oversized hero image placeholder behavior.

```tsx
return (
  <section className={PAGE_SECTION_Y_CLASS}>
    <BlogDetailShell
      title={article.title}
      category={article.category}
      publishedDate={publishedDate}
      readTime={`${article.readTime} min read`}
      tags={tags}
      coverImage={article.coverImage}
      content={article.content}
    />
  </section>
);
```

**Step 4: Run the blog-specific test to verify it passes**

Run: `cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "blog detail" --project=chromium`

Expected: PASS for blog-detail assertions.

**Step 5: Commit**

```bash
git add app/(public)/blogs/[slug]/page.tsx components/sections/blogs/blog-detail-shell.tsx tests/public-detail-pages.spec.ts
git commit -m "feat: redesign blog detail page as editorial reading layout"
```

### Task 3: Rebuild Project Detail As A Case-Study Page

**Files:**
- Create: `components/sections/projects/project-detail-shell.tsx`
- Modify: `app/(public)/projects/[slug]/page.tsx`
- Reference: `app/(public)/projects/page.tsx`
- Reference: `components/sections/projects/projects-case-study-lead.tsx`

**Step 1: Write the failing test case for project case-study structure**

Extend `tests/public-detail-pages.spec.ts`.

```ts
test("project detail shows gallery before stack and roadmap sections", async ({ page }) => {
  await page.goto("/projects/sample-slug");

  const gallery = page.getByTestId("project-gallery");
  const stack = page.getByTestId("project-stack");

  await expect(gallery).toBeVisible();
  await expect(stack).toBeVisible();
  await expect(page.getByTestId("project-placeholder-gallery")).toHaveCount(0);
});
```

**Step 2: Run the project-specific test to verify it fails**

Run: `cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "project detail" --project=chromium`

Expected: FAIL because the page still renders generic placeholder blocks and old section ordering.

**Step 3: Implement the minimal project shell**

Create `components/sections/projects/project-detail-shell.tsx`.

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/components/layout/page-primitives";

export function ProjectDetailShell({
  title,
  summary,
  category,
  status,
  screenshots,
  description,
  techStack,
  concepts,
  liveUrl,
  githubUrl,
}: {
  title: string;
  summary: string;
  category: string;
  status: string;
  screenshots: string[];
  description: string;
  techStack: string[];
  concepts: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
}) {
  return (
    <PageContent className="space-y-10">
      <header className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-end">
        <div className="space-y-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">{status}</Badge>
          </div>
          <h1 className="type-section-title text-[2.8rem] leading-[0.94]">{title}</h1>
          <p className="type-body-lg max-w-[60ch] text-muted-foreground">{summary}</p>
        </div>
        <div className="flex flex-wrap gap-3 xl:justify-end">
          {liveUrl ? <Button asChild><Link href={liveUrl}>Live Demo</Link></Button> : null}
          {githubUrl ? <Button variant="outline" asChild><Link href={githubUrl}>Source Code</Link></Button> : null}
        </div>
      </header>

      {screenshots.length > 0 ? (
        <section data-testid="project-gallery" className="grid gap-4 md:grid-cols-2">
          {screenshots.map((src, index) => (
            <div key={src + index} className="relative aspect-[16/10] overflow-hidden border border-border/70">
              <Image src={src} alt={`${title} screenshot ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-8">
          <section className="space-y-3">
            <p className="kicker text-muted-foreground">Overview</p>
            <p className="type-body whitespace-pre-wrap text-muted-foreground">{description}</p>
          </section>
        </div>

        <aside className="space-y-6">
          <section data-testid="project-stack" className="space-y-3">
            <p className="kicker text-muted-foreground">Technology Stack</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}
            </div>
          </section>
          {concepts.length > 0 ? (
            <section className="space-y-3">
              <p className="kicker text-muted-foreground">Concepts</p>
              <div className="flex flex-wrap gap-2">
                {concepts.map((concept) => <Badge key={concept} variant="outline">{concept}</Badge>)}
              </div>
            </section>
          ) : null}
        </aside>
      </section>
    </PageContent>
  );
}
```

Then replace the current route-level stacked cards in `app/(public)/projects/[slug]/page.tsx` with the new case-study shell and remove fake screenshot placeholders and empty timeline sections.

```tsx
return (
  <section className={PAGE_SECTION_Y_CLASS}>
    <ProjectDetailShell
      title={project.title}
      summary={project.shortDesc}
      category={project.category}
      status={project.status}
      screenshots={screenshots}
      description={project.description}
      techStack={techStack}
      concepts={concepts}
      liveUrl={project.liveUrl}
      githubUrl={project.githubUrl}
    />
  </section>
);
```

**Step 4: Run the project-specific test to verify it passes**

Run: `cmd /c npx playwright test tests/public-detail-pages.spec.ts --grep "project detail" --project=chromium`

Expected: PASS for the project-detail assertions.

**Step 5: Commit**

```bash
git add app/(public)/projects/[slug]/page.tsx components/sections/projects/project-detail-shell.tsx tests/public-detail-pages.spec.ts
git commit -m "feat: redesign project detail page as case study layout"
```

### Task 4: Polish, Responsive Verification, And Final Regression Pass

**Files:**
- Modify: `components/sections/blogs/blog-detail-shell.tsx`
- Modify: `components/sections/projects/project-detail-shell.tsx`
- Modify: `tests/public-detail-pages.spec.ts`

**Step 1: Add final regression checks for sparse-content behavior**

Extend the spec to confirm sections disappear cleanly when optional data is missing.

```ts
test("optional detail sections collapse cleanly when data is missing", async ({ page }) => {
  await page.goto("/projects/minimal-sample-slug");

  await expect(page.getByTestId("project-gallery")).toHaveCount(0);
  await expect(page.getByText("Timeline not specified")).toHaveCount(0);
  await expect(page.getByText("No screenshot")).toHaveCount(0);
});
```

**Step 2: Run the full detail-page spec**

Run: `cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium`

Expected: PASS across blog and project detail scenarios.

**Step 3: Run the focused static verification**

Run: `cmd /c npm run lint -- app/(public)/blogs/[slug]/page.tsx app/(public)/projects/[slug]/page.tsx components/sections/blogs/blog-detail-shell.tsx components/sections/projects/project-detail-shell.tsx`

Expected: PASS with no lint errors in the touched files.

**Step 4: Review responsive behavior manually**

Run:

```bash
cmd /c npx playwright test tests/public-detail-pages.spec.ts --project=chromium --headed
```

Expected:

- blog detail remains reading-first on desktop and mobile
- project gallery appears early and remains inspectable on smaller screens
- no empty placeholder blocks appear when optional content is absent

**Step 5: Commit**

```bash
git add app/(public)/blogs/[slug]/page.tsx app/(public)/projects/[slug]/page.tsx components/sections/blogs/blog-detail-shell.tsx components/sections/projects/project-detail-shell.tsx tests/public-detail-pages.spec.ts
git commit -m "fix: polish public project and blog detail layouts"
```
