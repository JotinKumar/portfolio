-- Persist the production RLS hardening applied in Supabase so other
-- environments get the same public-schema security posture.

ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."_prisma_migrations" FROM anon, authenticated;

ALTER TABLE "public"."HeroContent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."NavigationItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PageContent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SiteConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SocialLink" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hero_content_select_public" ON "public"."HeroContent";
DROP POLICY IF EXISTS "navigation_item_select_public" ON "public"."NavigationItem";
DROP POLICY IF EXISTS "page_content_select_public" ON "public"."PageContent";
DROP POLICY IF EXISTS "site_config_select_public" ON "public"."SiteConfig";
DROP POLICY IF EXISTS "social_link_select_public" ON "public"."SocialLink";

CREATE POLICY "hero_content_select_public"
ON "public"."HeroContent"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "navigation_item_select_public"
ON "public"."NavigationItem"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "page_content_select_public"
ON "public"."PageContent"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "site_config_select_public"
ON "public"."SiteConfig"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "social_link_select_public"
ON "public"."SocialLink"
FOR SELECT
TO anon, authenticated
USING (true);
