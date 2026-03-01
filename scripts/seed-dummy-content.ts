import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function makeBlogContent(index: number): string {
  return `# Dummy Blog ${index}

This is demo content for blog ${index}. It is intended for testing cards, detail pages, and admin workflows.

## Section 1

Sample paragraph text to simulate a real blog body with enough content for layout testing.

## Section 2

- Point one for blog ${index}
- Point two for blog ${index}
- Point three for blog ${index}
`;
}

async function seedDummyBlogs() {
  for (let i = 1; i <= 10; i++) {
    const slug = `dummy-blog-${String(i).padStart(2, "0")}`;
    const published = i % 2 === 0;

    await prisma.blog.upsert({
      where: { slug },
      update: {
        title: `Dummy Blog ${i}`,
        excerpt: `This is dummy blog ${i} used for testing the portfolio content flow.`,
        content: makeBlogContent(i),
        coverImage: `https://picsum.photos/seed/blog-${i}/1200/630`,
        tags: `Dummy,Testing,Sample,Blog-${i}`,
        category: i % 3 === 0 ? "Technology" : i % 3 === 1 ? "Leadership" : "Business",
        featured: i <= 3,
        published,
        readTime: 4 + (i % 5),
        publishedAt: published ? new Date(Date.now() - i * 86_400_000) : null,
      },
      create: {
        title: `Dummy Blog ${i}`,
        slug,
        excerpt: `This is dummy blog ${i} used for testing the portfolio content flow.`,
        content: makeBlogContent(i),
        coverImage: `https://picsum.photos/seed/blog-${i}/1200/630`,
        tags: `Dummy,Testing,Sample,Blog-${i}`,
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
  const [blogCount, projectCount] = await Promise.all([
    prisma.blog.count({ where: { slug: { startsWith: "dummy-blog-" } } }),
    prisma.project.count({ where: { slug: { startsWith: "dummy-project-" } } }),
  ]);

  console.log(`Dummy blogs in DB: ${blogCount}`);
  console.log(`Dummy projects in DB: ${projectCount}`);
}

async function main() {
  console.log("Seeding 10 dummy blogs and 10 dummy projects...");
  await seedDummyBlogs();
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
