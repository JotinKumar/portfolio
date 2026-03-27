import { expect, test } from "@playwright/test";

test.describe("public detail pages", () => {
  test("blog detail stays text-first with supporting media", async ({ page }) => {
    await page.goto("/blogs/preview-editorial-detail");

    await expect(page.getByTestId("blog-meta-rail")).toBeVisible();
    await expect(page.getByTestId("blog-article-body")).toBeVisible();
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
