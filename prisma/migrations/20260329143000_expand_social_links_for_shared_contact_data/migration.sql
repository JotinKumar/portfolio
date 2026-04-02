ALTER TYPE "public"."SocialPosition" ADD VALUE IF NOT EXISTS 'PROFILE';

DO $$
BEGIN
  CREATE TYPE "public"."SocialLinkKind" AS ENUM ('SOCIAL', 'CONTACT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "public"."SocialLink"
  ADD COLUMN IF NOT EXISTS "kind" "public"."SocialLinkKind" NOT NULL DEFAULT 'SOCIAL',
  ADD COLUMN IF NOT EXISTS "value" TEXT NOT NULL DEFAULT '';

UPDATE "public"."SocialLink"
SET
  "platform" = 'x',
  "label" = 'X',
  "url" = REPLACE(COALESCE("url", ''), 'twitter.com', 'x.com'),
  "value" = CASE
    WHEN COALESCE("value", '') = '' THEN 'X'
    ELSE "value"
  END
WHERE LOWER("platform") LIKE '%twitter%' OR LOWER("platform") = 'x' OR LOWER("platform") LIKE '%x.com%';

UPDATE "public"."SocialLink"
SET
  "value" = CASE
    WHEN COALESCE("value", '') <> '' THEN "value"
    WHEN "url" LIKE 'mailto:%' THEN REPLACE("url", 'mailto:', '')
    WHEN "url" LIKE 'tel:%' THEN REPLACE("url", 'tel:', '')
    ELSE "label"
  END;

INSERT INTO "public"."SocialLink" ("id", "kind", "platform", "label", "value", "url", "position", "order", "visible", "createdAt", "updatedAt")
VALUES
  ('contact-phone', 'CONTACT', 'phone', 'Phone Number', '+91 90596 71178', 'tel:+919059671178', 'CONTACT', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('contact-whatsapp', 'CONTACT', 'whatsapp', 'Whatsapp number', '+91 90596 71178', 'https://wa.me/919059671178', 'CONTACT', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('contact-personal-email', 'CONTACT', 'personal_email', 'Personal email', 'contact@jotin.in', 'mailto:contact@jotin.in', 'CONTACT', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('contact-support-email', 'CONTACT', 'support_email', 'Support email', 'support@jotin.in', 'mailto:support@jotin.in', 'CONTACT', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('contact-location', 'CONTACT', 'location', 'Location', 'Hyderabad, India', 'https://www.google.com/maps?q=Hyderabad%2C%20India', 'CONTACT', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE
SET
  "kind" = EXCLUDED."kind",
  "platform" = EXCLUDED."platform",
  "label" = EXCLUDED."label",
  "value" = EXCLUDED."value",
  "url" = EXCLUDED."url",
  "position" = EXCLUDED."position",
  "order" = EXCLUDED."order",
  "visible" = EXCLUDED."visible",
  "updatedAt" = CURRENT_TIMESTAMP;
