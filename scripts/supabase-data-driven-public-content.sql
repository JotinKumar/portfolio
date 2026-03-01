-- Data-driven public pages bootstrap
-- Run this in a write-enabled Supabase SQL session.

-- Schema migration
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
  "id" TEXT PRIMARY KEY DEFAULT 'default',
  "siteName" TEXT NOT NULL,
  "siteTagline" TEXT NOT NULL,
  "logoUrl" TEXT NOT NULL,
  "logoAlt" TEXT NOT NULL,
  "resumeUrl" TEXT NOT NULL,
  "primaryEmail" TEXT NOT NULL,
  "locationLabel" TEXT NOT NULL,
  "defaultTitle" TEXT NOT NULL,
  "defaultDescription" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "NavigationItem" (
  "id" TEXT PRIMARY KEY,
  "label" TEXT NOT NULL,
  "href" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "position" "NavPosition" NOT NULL,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "isExternal" BOOLEAN NOT NULL DEFAULT false,
  "openInNewTab" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "SocialLink" (
  "id" TEXT PRIMARY KEY,
  "platform" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "position" "SocialPosition" NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "HeroContent" (
  "id" TEXT PRIMARY KEY DEFAULT 'default',
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
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PageContent" (
  "id" TEXT PRIMARY KEY,
  "page" "PublicPage" UNIQUE NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL,
  "emptyTitle" TEXT,
  "emptyMessage" TEXT,
  "primaryCta" TEXT,
  "secondaryCta" TEXT,
  "content" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Competency" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

-- Seed baseline content
INSERT INTO "SiteConfig" ("id","siteName","siteTagline","logoUrl","logoAlt","resumeUrl","primaryEmail","locationLabel","defaultTitle","defaultDescription","updatedAt")
VALUES ('default','Jotin Kumar Madugula','Business Process Expert & Full Stack Developer','/images/logo.png','Jotin Portfolio Logo','/jotin-madugula-resume.pdf','contact@jotin.in','Hyderabad, India','Jotin Kumar Madugula - Portfolio','Business Process Expert & Full Stack Developer',NOW())
ON CONFLICT ("id") DO UPDATE SET
"siteName"=EXCLUDED."siteName","siteTagline"=EXCLUDED."siteTagline","logoUrl"=EXCLUDED."logoUrl","logoAlt"=EXCLUDED."logoAlt","resumeUrl"=EXCLUDED."resumeUrl","primaryEmail"=EXCLUDED."primaryEmail","locationLabel"=EXCLUDED."locationLabel","defaultTitle"=EXCLUDED."defaultTitle","defaultDescription"=EXCLUDED."defaultDescription","updatedAt"=NOW();

-- Navigation
INSERT INTO "NavigationItem" ("id","label","href","order","position","visible","isExternal","openInNewTab","updatedAt") VALUES
('HEADER-1','Home','/',1,'HEADER',true,false,false,NOW()),
('HEADER-2','Profile','/profile',2,'HEADER',true,false,false,NOW()),
('HEADER-3','Articles','/articles',3,'HEADER',true,false,false,NOW()),
('HEADER-4','Projects','/projects',4,'HEADER',true,false,false,NOW()),
('HEADER-5','Contact','/contact',5,'HEADER',true,false,false,NOW()),
('FOOTER_QUICK-1','Home','/',1,'FOOTER_QUICK',true,false,false,NOW()),
('FOOTER_QUICK-2','Profile','/profile',2,'FOOTER_QUICK',true,false,false,NOW()),
('FOOTER_QUICK-3','Articles','/articles',3,'FOOTER_QUICK',true,false,false,NOW()),
('FOOTER_QUICK-4','Projects','/projects',4,'FOOTER_QUICK',true,false,false,NOW()),
('FOOTER_RESOURCE-1','Resume','/jotin-madugula-resume.pdf',1,'FOOTER_RESOURCE',true,false,false,NOW()),
('FOOTER_RESOURCE-2','Contact','/contact',2,'FOOTER_RESOURCE',true,false,false,NOW()),
('FOOTER_LEGAL-1','Privacy Policy','/privacy',1,'FOOTER_LEGAL',true,false,false,NOW()),
('FOOTER_LEGAL-2','Terms of Service','/terms',2,'FOOTER_LEGAL',true,false,false,NOW())
ON CONFLICT ("id") DO UPDATE SET
"label"=EXCLUDED."label","href"=EXCLUDED."href","order"=EXCLUDED."order","position"=EXCLUDED."position","visible"=EXCLUDED."visible","isExternal"=EXCLUDED."isExternal","openInNewTab"=EXCLUDED."openInNewTab","updatedAt"=NOW();

INSERT INTO "SocialLink" ("id","platform","label","url","position","order","visible","updatedAt") VALUES
('social-github','github','GitHub','https://github.com/jotin','FOOTER',1,true,NOW()),
('social-linkedin','linkedin','LinkedIn','https://linkedin.com/in/jotin','FOOTER',2,true,NOW()),
('social-twitter','twitter','Twitter','https://twitter.com/jotin','FOOTER',3,true,NOW()),
('social-email','email','Email','mailto:contact@jotin.in','FOOTER',4,true,NOW()),
('contact-linkedin','linkedin','LinkedIn','https://linkedin.com/in/jotin','CONTACT',1,true,NOW()),
('contact-github','github','GitHub','https://github.com/jotin','CONTACT',2,true,NOW()),
('contact-twitter','twitter','Twitter','https://twitter.com/jotin','CONTACT',3,true,NOW())
ON CONFLICT ("id") DO UPDATE SET
"platform"=EXCLUDED."platform","label"=EXCLUDED."label","url"=EXCLUDED."url","position"=EXCLUDED."position","order"=EXCLUDED."order","visible"=EXCLUDED."visible","updatedAt"=NOW();

INSERT INTO "HeroContent" (
"id","displayName","professionalTitle","professionalSubtitle","techTitle","techSubtitle","professionalSkills","professionalInitialSkills","techSkills","techInitialSkills","professionalImageUrl","techImageUrl","exploreProfessionalLabel","exploreTechLabel","resetViewLabel","downloadResumeLabel","getInTouchLabel","viewProjectsLabel","viewArticlesLabel","homeWorkSectionTitle","homeFeaturedArticlesTitle","homeFeaturedProjectsTitle","homeViewAllArticlesLabel","homeViewAllProjectsLabel","updatedAt"
) VALUES (
'default','Jotin Kumar Madugula','Pricing and Solutions Director','A seasoned professional with 21+ years of experience in the BPO/ITES industry, including 13 years in US Healthcare Operations and 8+ years in Pricing and Financial Strategy.','Self-Taught Tech Enthusiast','A self-taught tech enthusiast driven by curiosity and a constant desire to learn. Actively exploring modern technologies including AI, machine learning, and full-stack development.',
ARRAY['Pricing & RFX','Ops Leadership','Cost Modeling','Process Re-engineering','Financial Analysis','RPA & Automation','Price-to-Win Strategy','US Healthcare','Analytics & MIS','Global Governance'],
ARRAY['Pricing & RFX','Ops Leadership','Financial Analysis','US Healthcare'],
ARRAY['Python','Node.js','React','Next.js','TypeScript','AI & ML','Excel & VBA','RPA & Automation','Full Stack','UI Design'],
ARRAY['AI & ML','Next.js','Python','Full Stack'],
'/images/professional-portrait.jpg','/images/tech-portrait.jpg','Explore Professional','Explore Tech Side','Reset View','Download Resume','Get in Touch','View Projects','View Articles','Work Experience','Featured Articles','Featured Projects','View All Articles','View All Projects',NOW()
)
ON CONFLICT ("id") DO UPDATE SET
"displayName"=EXCLUDED."displayName","professionalTitle"=EXCLUDED."professionalTitle","professionalSubtitle"=EXCLUDED."professionalSubtitle","techTitle"=EXCLUDED."techTitle","techSubtitle"=EXCLUDED."techSubtitle","professionalSkills"=EXCLUDED."professionalSkills","professionalInitialSkills"=EXCLUDED."professionalInitialSkills","techSkills"=EXCLUDED."techSkills","techInitialSkills"=EXCLUDED."techInitialSkills","professionalImageUrl"=EXCLUDED."professionalImageUrl","techImageUrl"=EXCLUDED."techImageUrl","exploreProfessionalLabel"=EXCLUDED."exploreProfessionalLabel","exploreTechLabel"=EXCLUDED."exploreTechLabel","resetViewLabel"=EXCLUDED."resetViewLabel","downloadResumeLabel"=EXCLUDED."downloadResumeLabel","getInTouchLabel"=EXCLUDED."getInTouchLabel","viewProjectsLabel"=EXCLUDED."viewProjectsLabel","viewArticlesLabel"=EXCLUDED."viewArticlesLabel","homeWorkSectionTitle"=EXCLUDED."homeWorkSectionTitle","homeFeaturedArticlesTitle"=EXCLUDED."homeFeaturedArticlesTitle","homeFeaturedProjectsTitle"=EXCLUDED."homeFeaturedProjectsTitle","homeViewAllArticlesLabel"=EXCLUDED."homeViewAllArticlesLabel","homeViewAllProjectsLabel"=EXCLUDED."homeViewAllProjectsLabel","updatedAt"=NOW();

INSERT INTO "PageContent" ("id","page","title","subtitle","emptyTitle","emptyMessage","primaryCta","secondaryCta","content","updatedAt") VALUES
('page-home','HOME','Home','Business and technology perspectives, projects, and career highlights.',NULL,NULL,NULL,NULL,NULL,NOW()),
('page-profile','PROFILE','Jotin Kumar Madugula','Pricing and Solutions Director',NULL,NULL,'Download Resume','Contact Me',
 '{"summary":"A seasoned professional with 21+ years of experience in the BPO/ITES industry, including 13 years in US Healthcare Operations and 8+ years in Pricing and Financial Strategy.","profileIntroBadge":"Hybrid Resume Profile","professionalSummaryTitle":"Professional Summary","professionalSummarySubtitle":"Executive overview tailored for pricing, operations, and transformation leadership.","timelineTitle":"Experience Timeline","timelineSubtitle":"Role progression with delivery impact, capabilities, and measurable contributions.","quickFactsTitle":"Quick Facts","quickFactLocationLabel":"Location","quickFactExperienceLabel":"Experience","quickFactFocusLabel":"Current Focus","achievementsTitle":"Key Achievements","skillsTitle":"Skills","commercialDeliveryTitle":"Commercial & Delivery","operationsTechnologyTitle":"Operations & Technology","contactLinksTitle":"Contact & Links","contactLinksSubtitle":"Available for consulting, leadership opportunities, and strategic partnerships."}'::jsonb,NOW()),
('page-articles','ARTICLES','Articles','Thoughts on business processes, technology, and the future of work.','No articles found','Try adjusting your filters to see more articles.','All','Clear','{"tagLabel":"Tag:","defaultEmptyMessage":"Articles will appear here once they are published."}'::jsonb,NOW()),
('page-projects','PROJECTS','Projects','A showcase of my latest work in web development, automation, and digital transformation.','No projects yet','Projects will appear here once they are added.','All',NULL,NULL,NOW()),
('page-contact','CONTACT','Get in Touch','Have a project in mind or just want to chat? I\'d love to hear from you.',NULL,NULL,'Send Message','Sending...',
 '{"formTitle":"Send a Message","formSubtitle":"Fill out the form below and I\'ll get back to you within 24 hours.","nameLabel":"Name","emailLabel":"Email","messageLabel":"Message","namePlaceholder":"Your full name","emailPlaceholder":"your.email@example.com","messagePlaceholder":"Tell me about your project or just say hello!","infoTitle":"Contact Information","infoSubtitle":"Prefer a different way to reach out? Here are some alternatives.","infoEmailLabel":"Email","infoLocationLabel":"Location","infoLocationValue":"Remote � Available Globally","infoResponseTimeLabel":"Response Time","infoResponseTimeValue":"Within 24 hours","socialTitle":"Let\'s Connect","socialSubtitle":"Follow me on social media for updates and insights.","successMessage":"Message sent successfully! I\'ll get back to you soon.","errorMessage":"Failed to send message","unexpectedErrorMessage":"An error occurred while sending your message"}'::jsonb,NOW())
ON CONFLICT ("page") DO UPDATE SET
"title"=EXCLUDED."title","subtitle"=EXCLUDED."subtitle","emptyTitle"=EXCLUDED."emptyTitle","emptyMessage"=EXCLUDED."emptyMessage","primaryCta"=EXCLUDED."primaryCta","secondaryCta"=EXCLUDED."secondaryCta","content"=EXCLUDED."content","updatedAt"=NOW();

INSERT INTO "Competency" ("id","name","category","order","visible","updatedAt") VALUES
('COMMERCIAL_DELIVERY-1','Strategic Pricing & RFX Ownership','COMMERCIAL_DELIVERY',1,true,NOW()),
('COMMERCIAL_DELIVERY-2','Multi-Geo Cost Modelling','COMMERCIAL_DELIVERY',2,true,NOW()),
('COMMERCIAL_DELIVERY-3','Executive Financial Storytelling','COMMERCIAL_DELIVERY',3,true,NOW()),
('COMMERCIAL_DELIVERY-4','Price-to-Win Strategy','COMMERCIAL_DELIVERY',4,true,NOW()),
('COMMERCIAL_DELIVERY-5','US Healthcare Life Cycle Expertise','COMMERCIAL_DELIVERY',5,true,NOW()),
('OPERATIONS_TECH-1','Operations Leadership','OPERATIONS_TECH',1,true,NOW()),
('OPERATIONS_TECH-2','Process Re-engineering','OPERATIONS_TECH',2,true,NOW()),
('OPERATIONS_TECH-3','RPA and Automation','OPERATIONS_TECH',3,true,NOW()),
('OPERATIONS_TECH-4','MIS & Performance Analytics','OPERATIONS_TECH',4,true,NOW()),
('OPERATIONS_TECH-5','Global Stakeholder Governance','OPERATIONS_TECH',5,true,NOW())
ON CONFLICT ("id") DO UPDATE SET
"name"=EXCLUDED."name","category"=EXCLUDED."category","order"=EXCLUDED."order","visible"=EXCLUDED."visible","updatedAt"=NOW();
