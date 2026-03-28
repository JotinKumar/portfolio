import { expect, test } from "@playwright/test";

test.describe("public detail pages", () => {
  test("blogs editorial header surfaces title, utility row, topic select, and search", async ({ page }) => {
    await page.goto("/blogs");

    await expect(page.getByRole("heading", { level: 1, name: "Thinking Out Loud" })).toBeVisible();
    await expect(page.getByTestId("blogs-editorial-utility")).toBeVisible();
    await expect(page.getByTestId("blogs-topic-select")).toBeVisible();
    await expect(page.getByTestId("blogs-editorial-search")).toBeVisible();
  });

  test("featured blog card uses the adapted editorial card layout", async ({ page }) => {
    await page.goto("/blogs");

    await expect(page.getByTestId("featured-blog-card")).toBeVisible();
    await expect(page.getByTestId("featured-blog-media")).toBeVisible();
    await expect(page.getByTestId("featured-blog-utility-strip")).toBeVisible();
    await expect(page.getByTestId("featured-blog-fab")).toBeVisible();
  });

  test("blogs archive uses a placeholder image when an article has no cover image", async ({ page }) => {
    await page.goto("/blogs");

    const articleCard = page.locator('a[href="/blogs/remote-work-productivity-tips"]').first();
    const placeholderImage = articleCard.locator('img[src*="blog-card-placeholder"]');

    await expect(articleCard).toBeVisible();
    await expect(placeholderImage).toBeVisible();
  });

  test("blogs archive card reveals excerpt on hover against a black surface without changing card size", async ({ page }) => {
    await page.goto("/blogs");

    const articleCard = page.locator('a[href="/blogs/dummy-article-04"]').first();
    const shell = articleCard.getByTestId("article-card-shell");
    const excerpt = articleCard.getByTestId("article-card-excerpt");
    const surface = articleCard.getByTestId("article-card-surface");
    const beforeShellLayout = await shell.boundingBox();

    await expect(excerpt).not.toBeVisible();
    await articleCard.hover();
    await expect(excerpt).toBeVisible();
    await expect(surface).toHaveCSS("background-color", "rgb(0, 0, 0)");

    const afterShellLayout = await shell.boundingBox();

    expect(beforeShellLayout).not.toBeNull();
    expect(afterShellLayout).not.toBeNull();
    expect(Math.abs(afterShellLayout.width - beforeShellLayout.width)).toBeLessThan(1);
    expect(Math.abs(afterShellLayout.height - beforeShellLayout.height)).toBeLessThan(1);
  });

  test("blog detail stays text-first with supporting media", async ({ page }) => {
    await page.goto("/blogs/preview-editorial-detail");

    await expect(page.getByTestId("blog-meta-rail")).toBeVisible();
    await expect(page.getByTestId("blog-article-body")).toBeVisible();
    await expect(page.locator('[data-testid="blog-article-body"] > header')).toHaveCount(0);
    await expect(page.getByTestId("blog-supporting-media")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Why portfolio writing should read like thinking, not like marketing"
    );
  });

  test("project detail surfaces gallery before technical rail", async ({ page }) => {
    await page.goto("/projects/preview-case-study-detail");

    const gallery = page.getByTestId("project-gallery");
    const stack = page.getByTestId("project-stack");

    await expect(gallery).toBeVisible();
    await expect(stack).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "What the product actually looks like." })).toBeVisible();
    await expect(page.getByText("Timeline not specified")).toHaveCount(0);
    await expect(page.getByText("No screenshot")).toHaveCount(0);
  });
});
