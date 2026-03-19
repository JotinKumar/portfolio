const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

require("ts-node/register");

const { APP_SHELL_CLASS, PAGE_CONTENT_CLASS } = require("../lib/layout");

const read = (relativePath) =>
  fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");

test("shared shell keeps the navbar width and page content inherits it", () => {
  assert.match(APP_SHELL_CLASS, /max-w-\[1280px\]/);
  assert.equal(PAGE_CONTENT_CLASS, "w-full");
});

test("shared button defaults are sharp-cornered", () => {
  const source = read("components/ui/button.tsx");

  assert.match(source, /rounded-none/);
  assert.doesNotMatch(source, /rounded-full/);
  assert.doesNotMatch(source, /rounded-md/);
});

test("navigation controls use the same sharp-corner styling", () => {
  const headerSource = read("components/layout/header.tsx");
  const navMenuSource = read("components/ui/navigation-menu.tsx");
  const blogDetailSource = read("app/(public)/blogs/[slug]/page.tsx");

  assert.match(headerSource, /rounded-none/);
  assert.match(navMenuSource, /rounded-none/);
  assert.doesNotMatch(blogDetailSource, /max-w-4xl/);
});

test("navbar keeps only the theme toggle utility and removes the bell control", () => {
  const headerSource = read("components/layout/header.tsx");

  assert.doesNotMatch(headerSource, /Download Resume/);
  assert.doesNotMatch(headerSource, />\s*Resume\s*</);
  assert.doesNotMatch(headerSource, /Bell/);
  assert.doesNotMatch(headerSource, /Notifications/);
  assert.match(headerSource, /Toggle theme/);
});

test("homepage sections keep a roomier rhythm after the typography pass", () => {
  const heroSource = read("components/sections/hero/HeroSplit.tsx");
  const timelineSource = read("components/sections/work-timeline.tsx");
  const articlesSource = read("components/sections/featured-articles.tsx");
  const projectsSource = read("components/sections/featured-projects.tsx");
  const articleCardSource = read("components/sections/article-card.tsx");
  const projectCardSource = read("components/sections/project-card.tsx");

  assert.match(heroSource, /py-4/);
  assert.match(timelineSource, /py-16 md:py-20/);
  assert.match(articlesSource, /py-16 md:py-20/);
  assert.match(projectsSource, /py-16 md:py-20/);
  assert.match(articleCardSource, /featured = false/);
  assert.match(articleCardSource, /Editorial Feature/);
  assert.match(articleCardSource, /absolute inset-x-0 bottom-0 p-6/);
  assert.match(projectCardSource, /featured = false/);
  assert.match(projectCardSource, /Selected Work/);
});

test("featured homepage sections keep editorial placeholders when content is sparse", () => {
  const articlesSource = read("components/sections/featured-articles.tsx");
  const projectsSource = read("components/sections/featured-projects.tsx");

  assert.match(articlesSource, /Math\.max\(0,\s*3\s*-\s*articles\.length\)/);
  assert.match(articlesSource, /More writing is on the way/);
  assert.match(projectsSource, /More selected work is on the way/);
  assert.match(articlesSource, /featuredArticle/);
  assert.match(projectsSource, /completedProjects/);
  assert.match(projectsSource, /activeProject/);
});
