-- Ensure admin can perform write operations on Article and Project when RLS is enabled.
-- This keeps frontend CRUD behavior reproducible across environments.

DROP POLICY IF EXISTS "article_insert_admin" ON "public"."Article";
DROP POLICY IF EXISTS "article_update_admin" ON "public"."Article";
DROP POLICY IF EXISTS "article_delete_admin" ON "public"."Article";
DROP POLICY IF EXISTS "project_insert_admin" ON "public"."Project";
DROP POLICY IF EXISTS "project_update_admin" ON "public"."Project";
DROP POLICY IF EXISTS "project_delete_admin" ON "public"."Project";

CREATE POLICY "article_insert_admin"
ON "public"."Article"
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "article_update_admin"
ON "public"."Article"
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in')
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "article_delete_admin"
ON "public"."Article"
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "project_insert_admin"
ON "public"."Project"
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "project_update_admin"
ON "public"."Project"
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in')
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "project_delete_admin"
ON "public"."Project"
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in');
