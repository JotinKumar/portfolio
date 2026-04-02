INSERT INTO "public"."SocialLink" ("id", "kind", "platform", "label", "value", "url", "position", "order", "visible", "createdAt", "updatedAt")
VALUES
  ('profile-linkedin', 'SOCIAL', 'linkedin', 'LinkedIn', 'LinkedIn', 'https://linkedin.com/in/jotin', 'PROFILE', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('profile-github', 'SOCIAL', 'github', 'GitHub', 'GitHub', 'https://github.com/jotin', 'PROFILE', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('profile-x', 'SOCIAL', 'x', 'X', 'X', 'https://x.com/jotin', 'PROFILE', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('profile-whatsapp', 'CONTACT', 'whatsapp', 'WhatsApp', '+91 90596 71178', 'https://wa.me/919059671178', 'PROFILE', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
