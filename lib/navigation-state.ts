export function isNavigationItemActive(pathname: string, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  if (href === "/") return pathname === "/";

  const normalizedHref = href.endsWith("/") ? href.slice(0, -1) : href;
  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
}
