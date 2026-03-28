ALTER TABLE "SiteConfig"
ADD COLUMN IF NOT EXISTS "phone" TEXT NOT NULL DEFAULT '';

UPDATE "SiteConfig"
SET "phone" = '+91 90596 71178'
WHERE "id" = 'default' AND COALESCE("phone", '') = '';
