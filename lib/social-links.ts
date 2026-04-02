import type { SocialLink, SocialLinkKind, SocialPosition } from "@/lib/db-types";

export type SocialLinkGroups = Record<SocialPosition, SocialLink[]>;
export type SocialLinkRow = Omit<SocialLink, "kind" | "value"> & Partial<Pick<SocialLink, "kind" | "value">>;

export function normalizeSocialPlatform(platform: string) {
  const normalized = platform.trim().toLowerCase();

  if (!normalized) {
    return "unknown";
  }

  if (normalized.includes("twitter") || normalized === "x" || normalized.includes("x.com")) {
    return "x";
  }

  if (normalized.includes("linkedin")) {
    return "linkedin";
  }

  if (normalized.includes("github")) {
    return "github";
  }

  if (normalized.includes("whatsapp")) {
    return "whatsapp";
  }

  if (normalized.includes("mail") || normalized.includes("email")) {
    return "email";
  }

  if (normalized.includes("phone") || normalized.includes("tel")) {
    return "phone";
  }

  if (normalized.includes("location") || normalized.includes("map")) {
    return "location";
  }

  return normalized;
}

function inferSocialLinkKind(link: SocialLinkRow): SocialLinkKind {
  if (link.kind) {
    return link.kind;
  }

  const normalizedPlatform = normalizeSocialPlatform(link.platform);
  if (normalizedPlatform === "phone" || normalizedPlatform === "whatsapp" || normalizedPlatform === "email" || normalizedPlatform === "location") {
    return "CONTACT";
  }

  return "SOCIAL";
}

export function normalizeSocialLink(link: SocialLinkRow): SocialLink {
  const normalizedPlatform = normalizeSocialPlatform(link.platform);
  const inferredKind = inferSocialLinkKind(link);

  return {
    ...link,
    kind: inferredKind,
    platform: normalizedPlatform,
    label: normalizedPlatform === "x" ? "X" : link.label.trim(),
    value: (link.value ?? link.label).trim(),
    url: link.url.trim(),
  };
}

export function groupSocialLinksByPosition(links: SocialLinkRow[]): SocialLinkGroups {
  return links.reduce<SocialLinkGroups>(
    (groups, link) => {
      const normalized = normalizeSocialLink(link);
      groups[normalized.position].push(normalized);
      return groups;
    },
    {
      FOOTER: [],
      CONTACT: [],
      PROFILE: [],
    }
  );
}

export function resolveSocialLinkDisplayValue(link: SocialLink) {
  return link.value.trim() || link.label.trim();
}

export function resolveSocialLinkTarget(link: SocialLink) {
  return link.url.trim();
}

export function isExternalSocialLink(link: SocialLink) {
  const href = resolveSocialLinkTarget(link);
  if (!href) return false;
  return href.startsWith("http://") || href.startsWith("https://");
}

export function findSocialLinkByPlatform(links: SocialLink[], platform: string) {
  const normalizedPlatform = normalizeSocialPlatform(platform);
  return links.find((link) => normalizeSocialPlatform(link.platform) === normalizedPlatform);
}
