DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NavPosition') THEN
    CREATE TYPE "NavPosition" AS ENUM ('HEADER', 'FOOTER_QUICK', 'FOOTER_RESOURCE', 'FOOTER_LEGAL');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SocialPosition') THEN
    CREATE TYPE "SocialPosition" AS ENUM ('FOOTER', 'CONTACT');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PublicPage') THEN
    CREATE TYPE "PublicPage" AS ENUM ('HOME', 'PROFILE', 'ARTICLES', 'PROJECTS', 'CONTACT');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "SiteConfig" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "siteName" TEXT NOT NULL,
  "siteTagline" TEXT NOT NULL,
  "logoUrl" TEXT NOT NULL,
  "logoAlt" TEXT NOT NULL,
  "resumeUrl" TEXT NOT NULL,
  "primaryEmail" TEXT NOT NULL,
  "locationLabel" TEXT NOT NULL,
  "defaultTitle" TEXT NOT NULL,
  "defaultDescription" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "NavigationItem" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "href" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "position" "NavPosition" NOT NULL,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "isExternal" BOOLEAN NOT NULL DEFAULT false,
  "openInNewTab" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SocialLink" (
  "id" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "position" "SocialPosition" NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HeroContent" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "displayName" TEXT NOT NULL,
  "professionalTitle" TEXT NOT NULL,
  "professionalSubtitle" TEXT NOT NULL,
  "techTitle" TEXT NOT NULL,
  "techSubtitle" TEXT NOT NULL,
  "professionalSkills" TEXT[] NOT NULL,
  "professionalInitialSkills" TEXT[] NOT NULL,
  "techSkills" TEXT[] NOT NULL,
  "techInitialSkills" TEXT[] NOT NULL,
  "professionalImageUrl" TEXT NOT NULL,
  "techImageUrl" TEXT NOT NULL,
  "exploreProfessionalLabel" TEXT NOT NULL,
  "exploreTechLabel" TEXT NOT NULL,
  "resetViewLabel" TEXT NOT NULL,
  "downloadResumeLabel" TEXT NOT NULL,
  "getInTouchLabel" TEXT NOT NULL,
  "viewProjectsLabel" TEXT NOT NULL,
  "viewArticlesLabel" TEXT NOT NULL,
  "homeWorkSectionTitle" TEXT NOT NULL,
  "homeFeaturedArticlesTitle" TEXT NOT NULL,
  "homeFeaturedProjectsTitle" TEXT NOT NULL,
  "homeViewAllArticlesLabel" TEXT NOT NULL,
  "homeViewAllProjectsLabel" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HeroContent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PageContent" (
  "id" TEXT NOT NULL,
  "page" "PublicPage" NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL,
  "emptyTitle" TEXT,
  "emptyMessage" TEXT,
  "primaryCta" TEXT,
  "secondaryCta" TEXT,
  "content" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Competency" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Competency_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PageContent_page_key" ON "PageContent"("page");
CREATE INDEX IF NOT EXISTS "NavigationItem_position_order_visible_idx" ON "NavigationItem"("position", "order", "visible");
CREATE INDEX IF NOT EXISTS "SocialLink_position_order_visible_idx" ON "SocialLink"("position", "order", "visible");
CREATE INDEX IF NOT EXISTS "Competency_category_order_visible_idx" ON "Competency"("category", "order", "visible");