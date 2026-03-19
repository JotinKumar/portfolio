import type { NavigationItem, PageContent } from "@/lib/db-types";

export type SiteNavLink = NavigationItem;

export function isManagedPublicPageEnabled(pageContent: PageContent | null): boolean {
  return pageContent !== null;
}
