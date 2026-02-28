import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function makeArticleContent(index: number): string {
  return `# Dummy Article ${index}

This is demo content for article ${index}. It is intended for testing cards, detail pages, and admin workflows.

## Section 1

Sample paragraph text to simulate a real article body with enough content for layout testing.

## Section 2

- Point one for article ${index}
- Point two for article ${index}
- Point three for article ${index}
`;
}

async function seedDummyArticles() {
  for (let i = 1; i <= 10; i++) {
    const slug = `dummy-article-${String(i).padStart(2, "0")}`;
    const published = i % 2 === 0;

    await prisma.article.upsert({
      where: { slug },
      update: {
        title: `Dummy Article ${i}`,
        excerpt: `This is dummy article ${i} used for testing the portfolio content flow.`,
        content: makeArticleContent(i),
        coverImage: `https://picsum.photos/seed/article-${i}/1200/630`,
        tags: `Dummy,Testing,Sample,Article-${i}`,
        category: i % 3 === 0 ? "Technology" : i % 3 === 1 ? "Leadership" : "Business",
        featured: i <= 3,
        published,
        readTime: 4 + (i % 5),
        publishedAt: published ? new Date(Date.now() - i * 86_400_000) : null,
      },
      create: {
        title: `Dummy Article ${i}`,
        slug,
        excerpt: `This is dummy article ${i} used for testing the portfolio content flow.`,
        content: makeArticleContent(i),
        coverImage: `https://picsum.photos/seed/article-${i}/1200/630`,
        tags: `Dummy,Testing,Sample,Article-${i}`,
        category: i % 3 === 0 ? "Technology" : i % 3 === 1 ? "Leadership" : "Business",
        featured: i <= 3,
        published,
        readTime: 4 + (i % 5),
        publishedAt: published ? new Date(Date.now() - i * 86_400_000) : null,
      },
    });
  }
}

async function seedDummyProjects() {
  for (let i = 1; i <= 10; i++) {
    const slug = `dummy-project-${String(i).padStart(2, "0")}`;

    await prisma.project.upsert({
      where: { slug },
      update: {
        title: `Dummy Project ${i}`,
        shortDesc: `Sample project ${i} for testing project cards and admin CRUD.`,
        description: `Dummy Project ${i} is test data for validating the projects list, admin pages, and styling behavior in the portfolio app.`,
        category: i % 2 === 0 ? "Web Development" : "Business Intelligence",
        status: i % 3 === 0 ? "planned" : i % 3 === 1 ? "in-progress" : "completed",
        order: i,
        featured: i <= 4,
        liveUrl: `https://example.com/dummy-project-${i}`,
        githubUrl: `https://github.com/example/dummy-project-${i}`,
        coverImage: `https://picsum.photos/seed/project-${i}/1200/700`,
        screenshots: JSON.stringify([
          `https://picsum.photos/seed/project-${i}-a/1200/700`,
          `https://picsum.photos/seed/project-${i}-b/1200/700`,
          `https://picsum.photos/seed/project-${i}-c/1200/700`,
        ]),
        techStack: "Next.js,TypeScript,TailwindCSS,Supabase,Prisma",
        tags: `Dummy,Project,Sample,Project-${i}`,
      },
      create: {
        title: `Dummy Project ${i}`,
        slug,
        shortDesc: `Sample project ${i} for testing project cards and admin CRUD.`,
        description: `Dummy Project ${i} is test data for validating the projects list, admin pages, and styling behavior in the portfolio app.`,
        category: i % 2 === 0 ? "Web Development" : "Business Intelligence",
        status: i % 3 === 0 ? "planned" : i % 3 === 1 ? "in-progress" : "completed",
        order: i,
        featured: i <= 4,
        liveUrl: `https://example.com/dummy-project-${i}`,
        githubUrl: `https://github.com/example/dummy-project-${i}`,
        coverImage: `https://picsum.photos/seed/project-${i}/1200/700`,
        screenshots: JSON.stringify([
          `https://picsum.photos/seed/project-${i}-a/1200/700`,
          `https://picsum.photos/seed/project-${i}-b/1200/700`,
          `https://picsum.photos/seed/project-${i}-c/1200/700`,
        ]),
        techStack: "Next.js,TypeScript,TailwindCSS,Supabase,Prisma",
        tags: `Dummy,Project,Sample,Project-${i}`,
      },
    });
  }
}

async function reportCounts() {
  const [articleCount, projectCount] = await Promise.all([
    prisma.article.count({ where: { slug: { startsWith: "dummy-article-" } } }),
    prisma.project.count({ where: { slug: { startsWith: "dummy-project-" } } }),
  ]);

  console.log(`Dummy articles in DB: ${articleCount}`);
  console.log(`Dummy projects in DB: ${projectCount}`);
}

async function main() {
  console.log("Seeding 10 dummy articles and 10 dummy projects...");
  await seedDummyArticles();
  await seedDummyProjects();
  await reportCounts();
  console.log("Dummy content seeding complete.");
}

main()
  .catch((error) => {
    console.error("Dummy content seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
