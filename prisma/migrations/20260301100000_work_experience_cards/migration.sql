CREATE TABLE "public"."WorkExperienceCard" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkExperienceCard_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WorkExperienceCard_order_idx" ON "public"."WorkExperienceCard"("order");

ALTER TABLE "public"."WorkExperienceCard" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "work_experience_card_select_public" ON "public"."WorkExperienceCard";

CREATE POLICY "work_experience_card_select_public"
ON "public"."WorkExperienceCard"
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO "public"."WorkExperienceCard" (
  "id",
  "company",
  "role",
  "location",
  "description",
  "achievements",
  "skills",
  "startDate",
  "endDate",
  "current",
  "order"
)
VALUES
(
  'wec_pricing_director',
  'Sutherland Global Services',
  'Pricing and Solutions - Director',
  'Hyderabad, India',
  'Own end-to-end pricing for complex global RFX/RFP opportunities across multiple geographies, combining healthcare domain depth with commercial rigor to deliver competitive and compliant financial solutions.',
  '["Designed and validated Cost-Plus, Outcome-Based, Transactional, T&M, TCO, and Revenue Share models aligned to margin and growth goals.","Built competitive benchmarks and analyzed cost drivers and financial risks for new-logo pursuits and expansion deals.","Led process automation using Excel VBA and RPA principles to improve data consistency and reduce turnaround time.","Drove innovation through strategic inputs for AI-enhanced internal tools to improve team productivity."]',
  '["Strategic Pricing","RFX/RFP Ownership","Multi-Geo Cost Modelling","Price-to-Win","Financial Modelling","Automation"]',
  'Oct 2018',
  NULL,
  true,
  1
),
(
  'wec_operations_manager',
  'Sutherland Global Services',
  'Operations Leadership - Deputy Manager / Manager',
  'Hyderabad, India',
  'Led end-to-end US healthcare operations covering Credentialing, Claims Administration, and Benefits with ownership of scale, quality, and contractual performance.',
  '["Managed 200+ FTEs across healthcare operations while maintaining efficiency and contractual targets.","Scaled operations across complex global delivery centers with strong quality outcomes.","Integrated automation and continuous improvement initiatives to improve productivity.","Built leadership bench strength by mentoring high-potential talent into expanded roles."]',
  '["Operations Leadership","SLA/KPI Governance","Capacity Planning","Stakeholder Management","People Management","Continuous Improvement"]',
  'Apr 2013',
  'Sep 2018',
  false,
  2
),
(
  'wec_team_manager',
  'Sutherland Global Services',
  'Operations - Team Manager / Associate Manager',
  'Hyderabad, India',
  'Managed healthcare backend operations teams with accountability for delivery quality, SLA adherence, client governance, and productivity improvement.',
  '["Led teams across stages of the US healthcare backend lifecycle with high data accuracy.","Owned performance tracking and governance calls as key client contact.","Implemented training and productivity enhancement programs to optimize workflows."]',
  '["Team Management","Client Governance","Healthcare Operations","Training & Coaching","Process Improvement"]',
  'Apr 2010',
  'Mar 2013',
  false,
  3
),
(
  'wec_associate_mis_sme',
  'Sutherland Global Services',
  'Entry-Level - Associate / MIS / SME',
  'Hyderabad, India',
  'Progressed through associate, MIS, and SME responsibilities by building data visibility, improving workflows, and supporting operational decision-making.',
  '["Developed automated dashboards and performance metrics for operations leadership.","Identified and removed bottlenecks in data validation and backend research workflows.","Managed small teams for daily SLA adherence and analytical support."]',
  '["MIS & Analytics","Dashboarding","Workflow Optimization","SLA Tracking","Team Supervision"]',
  'Jun 2004',
  'Mar 2010',
  false,
  4
)
ON CONFLICT ("id") DO UPDATE
SET
  "company" = EXCLUDED."company",
  "role" = EXCLUDED."role",
  "location" = EXCLUDED."location",
  "description" = EXCLUDED."description",
  "achievements" = EXCLUDED."achievements",
  "skills" = EXCLUDED."skills",
  "startDate" = EXCLUDED."startDate",
  "endDate" = EXCLUDED."endDate",
  "current" = EXCLUDED."current",
  "order" = EXCLUDED."order",
  "updatedAt" = CURRENT_TIMESTAMP;
