import type { Article, Project } from "@/lib/db-types";

export const PREVIEW_BLOG_SLUG = "preview-editorial-detail";
export const PREVIEW_PROJECT_SLUG = "preview-case-study-detail";

export const previewArticle: Article = {
  id: "preview-article-detail",
  title: "Why portfolio writing should read like thinking, not like marketing",
  slug: PREVIEW_BLOG_SLUG,
  excerpt:
    "A good blog detail page should make ideas easier to follow, not compete with them. The design has to frame the text without turning every post into a campaign landing page.",
  content: `Most personal writing on portfolio sites gets pushed into templates that were really built for product promotion. A huge hero image lands first, the title comes second, and the body has to fight its way back into relevance.

That tradeoff works against the point of a blog. When someone opens an essay, they are usually there for the argument, the framing, the examples, and the texture of the thought process. The page should respect that immediately.

A stronger pattern is to let the text lead. Keep the metadata close enough to orient the reader, make the heading carry real weight, and allow any visual to support the piece instead of dominating it. A small image can still do useful work. It can set tone, reference a sketch, or give the page a pause point. It just should not pretend to be the main event.

The same principle applies to structure. Reading layouts benefit from a stable rhythm: one column that is comfortable to scan, enough whitespace to separate ideas, and side information that stays available without constantly interrupting the flow. Readers should feel like they are moving through a page that has been edited, not assembled.

That is the standard I wanted these detail pages to move toward. The design should feel authored, but the writing should remain the thing that carries the page.`,
  coverImage: "/images/projects/portfolio-cover.jpg",
  tags: JSON.stringify(["Editorial Design", "Writing", "Portfolio UX", "Information Hierarchy", "Reading Experience", "Content Systems"]),
  category: "Design Notes",
  authorName: "Jotin Kumar",
  authorAvatar: null,
  published: true,
  featured: true,
  readTime: 6,
  createdAt: "2026-03-20T00:00:00.000Z",
  updatedAt: "2026-03-27T00:00:00.000Z",
  publishedAt: "2026-03-24T00:00:00.000Z",
};

export const previewProject: Project = {
  id: "preview-project-detail",
  title: "Portfolio CMS And Editorial Surface Refresh",
  slug: PREVIEW_PROJECT_SLUG,
  description:
    `This project explores how a portfolio can behave more like a published body of work than a list of disconnected pages. The goal was to give projects and writing their own presentation logic, while still keeping the site unified by one editorial design system.\n\nThe redesign focuses on two content types with different needs. Blog detail pages now prioritize reading comfort, metadata clarity, and restrained supporting media. Project detail pages now prioritize proof of work, showing real screens early and keeping the narrative around the build concise and structured.\n\nThe broader intention is to make every public page feel curated rather than generated. That means fewer generic cards, stronger type hierarchy, and layouts that follow what the visitor is actually trying to learn from each page.`,
  shortDesc:
    "A case-study style redesign that turns blog details into reading pages and project details into screenshot-led portfolio narratives.",
  category: "Portfolio",
  status: "In Progress",
  order: 1,
  featured: true,
  liveUrl: "https://example.com/preview",
  githubUrl: "https://github.com/example/portfolio-preview",
  coverImage: "/images/projects/dashboard-cover.jpg",
  screenshots: JSON.stringify([
    "/images/projects/dashboard-cover.jpg",
    "/images/projects/dashboard-1.jpg",
    "/images/projects/dashboard-2.jpg",
    "/images/projects/portfolio-1.jpg",
    "/images/projects/portfolio-2.jpg",
    "/images/projects/portfolio-3.jpg"
  ]),
  techStack: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Prisma", "Playwright"]),
  tags: JSON.stringify(["Editorial UI", "Case Study Layout", "Content Modeling", "Responsive Design", "Visual QA"]),
  createdAt: "2026-03-18T00:00:00.000Z",
  updatedAt: "2026-03-27T00:00:00.000Z",
};

export function getPreviewArticle(slug: string) {
  if (process.env.NODE_ENV === "production") return null;
  return slug === PREVIEW_BLOG_SLUG ? previewArticle : null;
}

export function getPreviewProject(slug: string) {
  if (process.env.NODE_ENV === "production") return null;
  return slug === PREVIEW_PROJECT_SLUG ? previewProject : null;
}
