import { expect, test, type Locator, type Page } from "@playwright/test";

import fixture from "../fixtures/responsive-hero-data.json";

const { heroContent } = fixture;
const transparentPixel = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+XwK7WQAAAABJRU5ErkJggg==",
  "base64"
);

const viewportCases = [
  { width: 767, expected: "mobile" },
  { width: 768, expected: "tablet" },
  { width: 1023, expected: "tablet" },
  { width: 1024, expected: "desktop" },
] as const;

const interactionCases = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 820, height: 1180 },
] as const;

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth/header-account", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ user: null, isAdmin: false }),
    });
  });
  await page.route("**/_next/image?*", async (route) => {
    await route.fulfill({ contentType: "image/png", body: transparentPixel });
  });
});

test("SSR exposes only the hydration placeholder", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  await page.goto("/");

  await expect(page.getByTestId("responsive-hero-placeholder")).toHaveCount(1);
  await expect(page.locator("[data-responsive-hero-variant]")).toHaveCount(0);
  await context.close();
});

test("mounts exactly one hero at every breakpoint boundary", async ({ page }) => {
  await page.setViewportSize({ width: 767, height: 900 });
  await page.goto("/");

  for (const viewport of viewportCases) {
    await page.setViewportSize({ width: viewport.width, height: 900 });
    await expectOneMountedVariant(page, viewport.expected);
    await expectNoHorizontalOverflow(page);
  }
});

for (const viewport of interactionCases) {
  test(`${viewport.name} supports both detail flows and long CMS content`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expectOneMountedVariant(page, viewport.name);
    await expectChoiceContentResilience(page, viewport.name);
    await exerciseDetailFlows(page, viewport.name, true);
  });

  test(`${viewport.name} detail flows remain usable with reduced motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
      )
      .toBe(true);
    await expectOneMountedVariant(page, viewport.name);
    await exerciseDetailFlows(page, viewport.name, false);
  });
}

async function exerciseDetailFlows(
  page: Page,
  expectedVariant: string,
  checkLongContent: boolean
) {
  const initialUrl = page.url();
  const professionalChoice = choiceButton(
    page,
    heroContent.exploreProfessionalLabel
  );
  await professionalChoice.click();

  const professionalBack = page.getByRole("button", {
    name: heroContent.resetViewLabel,
    exact: true,
  });
  await expectVisibleFocusRing(professionalBack);
  await expect(page).toHaveURL(initialUrl);
  await expect(page.getByRole("link", { name: heroContent.downloadResumeLabel })).toHaveAttribute(
    "href",
    "/resume.pdf"
  );
  const contactAction = page.getByRole("link", {
    name: heroContent.getInTouchLabel,
    exact: true,
  });
  await expect(contactAction).toHaveAttribute("href", "/contact");
  await expect(contactAction).toBeVisible();
  if (checkLongContent) {
    await expectClamped(
      page.getByRole("heading", {
        name: heroContent.professionalTitle,
        exact: true,
      }),
      3
    );
    await expectClamped(
      page.getByText(heroContent.professionalSubtitle, { exact: true }),
      4
    );
    await expectBreakable(
      page.getByText(heroContent.professionalSkills[0], { exact: true })
    );
    await expectActionInsideHero(contactAction);
  }
  await expectOneMountedVariant(page, expectedVariant);
  await expectNoHorizontalOverflow(page);

  await professionalBack.click();
  await expectVisibleFocusRing(professionalChoice);
  await expect(page).toHaveURL(initialUrl);

  const techChoice = choiceButton(page, heroContent.exploreTechLabel);
  await techChoice.click();

  const techBack = page.getByRole("button", {
    name: heroContent.resetViewLabel,
    exact: true,
  });
  await expectVisibleFocusRing(techBack);
  await expect(page).toHaveURL(initialUrl);
  await expect(page.getByRole("link", { name: heroContent.viewProjectsLabel })).toHaveAttribute(
    "href",
    "/projects"
  );
  await expect(page.getByRole("link", { name: heroContent.viewArticlesLabel })).toHaveAttribute(
    "href",
    "/blogs"
  );
  if (checkLongContent) {
    await expectClamped(
      page.getByRole("heading", { name: heroContent.techTitle, exact: true }),
      3
    );
    await expectClamped(
      page.getByText(heroContent.techSubtitle, { exact: true }),
      4
    );
    await expectBreakable(page.getByText(heroContent.techSkills[0], { exact: true }));
  }
  await expectOneMountedVariant(page, expectedVariant);
  await expectNoHorizontalOverflow(page);

  await techBack.click();
  await expectVisibleFocusRing(techChoice);
  await expect(page).toHaveURL(initialUrl);
  await expectNoHorizontalOverflow(page);
}

async function expectChoiceContentResilience(page: Page, variant: string) {
  const professionalChoice = choiceButton(
    page,
    heroContent.exploreProfessionalLabel
  );
  const techChoice = choiceButton(page, heroContent.exploreTechLabel);

  await expectClamped(
    professionalChoice.getByText(heroContent.exploreProfessionalLabel, {
      exact: true,
    }),
    2
  );
  await expectClamped(
    techChoice.getByText(heroContent.exploreTechLabel, { exact: true }),
    2
  );

  if (variant === "mobile") {
    await expectClamped(
      page.getByText(heroContent.professionalTitle, { exact: true }),
      2
    );
    await expectClamped(page.getByText(heroContent.techTitle, { exact: true }), 2);

    const shortcuts = page.getByRole("navigation", {
      name: "Portfolio shortcuts",
    });
    await expect(
      shortcuts.getByRole("link", { name: heroContent.getInTouchLabel })
    ).toHaveAttribute("href", "/contact");
    await expect(
      shortcuts.getByRole("link", { name: heroContent.viewProjectsLabel })
    ).toHaveAttribute("href", "/projects");
    await expect(
      shortcuts.getByRole("link", { name: heroContent.viewArticlesLabel })
    ).toHaveAttribute("href", "/blogs");
  }

  await expectNoHorizontalOverflow(page);
}

function choiceButton(page: Page, label: string) {
  return page.getByRole("button", { name: new RegExp(escapeRegex(label)) });
}

async function expectOneMountedVariant(page: Page, expectedVariant: string) {
  const variants = page.locator("[data-responsive-hero-variant]");
  await expect(variants).toHaveCount(1);
  await expect(variants).toHaveAttribute(
    "data-responsive-hero-variant",
    expectedVariant
  );
  await expect(page.getByTestId("responsive-hero-placeholder")).toHaveCount(0);
}

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const pageWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        );
        return pageWidth - window.innerWidth;
      })
    )
    .toBeLessThanOrEqual(0);
}

async function expectClamped(locator: Locator, expectedLines: number) {
  await expect(locator).toBeVisible();
  const metrics = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const lineHeight = Number.parseFloat(style.lineHeight);
    return {
      renderedHeight: element.clientHeight,
      maximumHeight: lineHeight * Number(style.webkitLineClamp),
      lineClamp: style.webkitLineClamp,
      overflowWrap: style.overflowWrap,
      horizontalOverflow: element.scrollWidth - element.clientWidth,
    };
  });

  expect(metrics.lineClamp).toBe(String(expectedLines));
  expect(metrics.renderedHeight).toBeLessThanOrEqual(metrics.maximumHeight + 1);
  expect(metrics.overflowWrap).toBe("anywhere");
  expect(metrics.horizontalOverflow).toBeLessThanOrEqual(0);
}

async function expectBreakable(locator: Locator) {
  await expect(locator).toBeVisible();
  const metrics = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      overflowWrap: style.overflowWrap,
      horizontalOverflow: element.scrollWidth - element.clientWidth,
    };
  });

  expect(metrics.overflowWrap).toBe("anywhere");
  expect(metrics.horizontalOverflow).toBeLessThanOrEqual(0);
}

async function expectActionInsideHero(action: Locator) {
  const isInsideHero = await action.evaluate((element) => {
    const hero = element.closest("[data-responsive-hero-variant]");
    if (!hero) return false;

    const actionBounds = element.getBoundingClientRect();
    const heroBounds = hero.getBoundingClientRect();
    return (
      actionBounds.left >= heroBounds.left &&
      actionBounds.right <= heroBounds.right &&
      actionBounds.top >= heroBounds.top &&
      actionBounds.bottom <= heroBounds.bottom
    );
  });

  expect(isInsideHero).toBe(true);
}

async function expectVisibleFocusRing(locator: Locator) {
  await expect(locator).toBeFocused();
  await expect
    .poll(() => locator.evaluate((element) => getComputedStyle(element).boxShadow))
    .toMatch(/0px 0px 0px 4px/);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
