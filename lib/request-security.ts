const SAFE_FETCH_SITES = new Set(["same-origin", "same-site", "none"]);

function normalizeOrigin(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function getSafeRedirectPath(nextParam: string | null | undefined, fallback = "/"): string {
  if (!nextParam) return fallback;

  // Only allow same-site relative paths. Block protocol-relative and backslash tricks.
  if (!nextParam.startsWith("/") || nextParam.startsWith("//") || nextParam.includes("\\")) {
    return fallback;
  }

  return nextParam;
}

export function isTrustedStateChangingRequest(request: Request): boolean {
  const requestOrigin = new URL(request.url).origin;
  const allowedOrigins = new Set([requestOrigin]);

  const appUrl = normalizeOrigin(process.env.APP_URL ?? null);
  if (appUrl) allowedOrigins.add(appUrl);

  const origin = normalizeOrigin(request.headers.get("origin"));
  if (origin && !allowedOrigins.has(origin)) return false;

  const referer = normalizeOrigin(request.headers.get("referer"));
  if (referer && !allowedOrigins.has(referer)) return false;

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite && !SAFE_FETCH_SITES.has(secFetchSite)) return false;

  return true;
}
