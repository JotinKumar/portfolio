-- Rename content table from Article to Blog and align live content labels.
DO $$
BEGIN
  IF to_regclass('public."Article"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE "public"."Article" RENAME TO "Blog"';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Article_pkey'
  ) THEN
    EXECUTE 'ALTER TABLE "public"."Blog" RENAME CONSTRAINT "Article_pkey" TO "Blog_pkey"';
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public."Article_slug_key"') IS NOT NULL THEN
    EXECUTE 'ALTER INDEX "public"."Article_slug_key" RENAME TO "Blog_slug_key"';
  END IF;
  IF to_regclass('public."Article_slug_idx"') IS NOT NULL THEN
    EXECUTE 'ALTER INDEX "public"."Article_slug_idx" RENAME TO "Blog_slug_idx"';
  END IF;
  IF to_regclass('public."Article_published_idx"') IS NOT NULL THEN
    EXECUTE 'ALTER INDEX "public"."Article_published_idx" RENAME TO "Blog_published_idx"';
  END IF;
  IF to_regclass('public."Article_category_idx"') IS NOT NULL THEN
    EXECUTE 'ALTER INDEX "public"."Article_category_idx" RENAME TO "Blog_category_idx"';
  END IF;
END $$;

UPDATE "public"."NavigationItem"
SET
  "label" = 'Blogs',
  "href" = '/blogs',
  "updatedAt" = NOW()
WHERE "href" = '/articles' OR LOWER("label") = 'articles';

UPDATE "public"."HeroContent"
SET
  "viewArticlesLabel" = 'View Blogs',
  "homeFeaturedArticlesTitle" = 'Featured Blogs',
  "homeViewAllArticlesLabel" = 'View All Blogs',
  "updatedAt" = NOW()
WHERE "id" = 'default';

UPDATE "public"."PageContent"
SET
  "title" = 'Blogs',
  "emptyTitle" = 'No blogs found',
  "emptyMessage" = 'Try adjusting your filters to see more blogs.',
  "updatedAt" = NOW()
WHERE "page" = 'ARTICLES';
