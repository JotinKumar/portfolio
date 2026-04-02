CREATE TABLE "public"."ProfileMilestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfileMilestone_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProfileMilestone_order_visible_idx" ON "public"."ProfileMilestone"("order", "visible");

ALTER TABLE "public"."ProfileMilestone" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile_milestone_select_public" ON "public"."ProfileMilestone";
DROP POLICY IF EXISTS "profile_milestone_insert_admin" ON "public"."ProfileMilestone";
DROP POLICY IF EXISTS "profile_milestone_update_admin" ON "public"."ProfileMilestone";
DROP POLICY IF EXISTS "profile_milestone_delete_admin" ON "public"."ProfileMilestone";

CREATE POLICY "profile_milestone_select_public"
ON "public"."ProfileMilestone"
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "profile_milestone_insert_admin"
ON "public"."ProfileMilestone"
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "profile_milestone_update_admin"
ON "public"."ProfileMilestone"
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in')
WITH CHECK ((auth.jwt() ->> 'email') = 'admin@jotin.in');

CREATE POLICY "profile_milestone_delete_admin"
ON "public"."ProfileMilestone"
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'admin@jotin.in');

INSERT INTO "public"."ProfileMilestone" (
  "id",
  "title",
  "month",
  "year",
  "order",
  "visible"
)
VALUES
  ('milestone-process-associate', 'Process Associate', 'Jun', 2004, 1, true),
  ('milestone-sr-mis-analyst', 'Sr. MIS Analyst', 'Apr', 2007, 2, true),
  ('milestone-team-lead-ops-mis', 'Team Lead (Ops & MIS)', 'Apr', 2008, 3, true),
  ('milestone-assistant-manager', 'Assistant Manager', 'Apr', 2010, 4, true),
  ('milestone-deputy-manager', 'Deputy Manager', 'Oct', 2011, 5, true),
  ('milestone-operations-manager', 'Operations Manager', 'Apr', 2013, 6, true),
  ('milestone-senior-manager-pricing-healthcare', 'Senior Manager, Pricing & Healthcare Solutions', 'Oct', 2016, 7, true),
  ('milestone-director-pricing-solutions', 'Director, Pricing & Solutions', 'Jan', 2026, 8, true)
ON CONFLICT ("id") DO UPDATE
SET
  "title" = EXCLUDED."title",
  "month" = EXCLUDED."month",
  "year" = EXCLUDED."year",
  "order" = EXCLUDED."order",
  "visible" = EXCLUDED."visible",
  "updatedAt" = CURRENT_TIMESTAMP;
