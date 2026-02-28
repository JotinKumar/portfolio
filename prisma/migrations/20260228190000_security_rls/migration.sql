-- Enable Row Level Security (RLS) on public tables used via Supabase clients.
ALTER TABLE "public"."Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."WorkExperience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Contact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Settings" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent reruns).
DROP POLICY IF EXISTS "article_select_published" ON "public"."Article";
DROP POLICY IF EXISTS "article_select_admin_all" ON "public"."Article";
DROP POLICY IF EXISTS "project_select_public" ON "public"."Project";
DROP POLICY IF EXISTS "work_experience_select_public" ON "public"."WorkExperience";
DROP POLICY IF EXISTS "settings_select_public" ON "public"."Settings";
DROP POLICY IF EXISTS "contact_insert_public" ON "public"."Contact";
DROP POLICY IF EXISTS "contact_select_admin" ON "public"."Contact";

-- Public content readable by anyone.
CREATE POLICY "article_select_published"
ON "public"."Article"
FOR SELECT
TO anon, authenticated
USING (published = true);

-- Admin can read all articles, including drafts/unpublished.
CREATE POLICY "article_select_admin_all"
ON "public"."Article"
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "project_select_public"
ON "public"."Project"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "work_experience_select_public"
ON "public"."WorkExperience"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "settings_select_public"
ON "public"."Settings"
FOR SELECT
TO anon, authenticated
USING (true);

-- Contact form is publicly writable; reads are admin-only.
CREATE POLICY "contact_insert_public"
ON "public"."Contact"
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "contact_select_admin"
ON "public"."Contact"
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in');
