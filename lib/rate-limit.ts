type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as unknown as {
  __rateLimitStore?: Map<string, Bucket>;
};

const store = globalStore.__rateLimitStore ?? new Map<string, Bucket>();
globalStore.__rateLimitStore = store;

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    if (firstIp) return firstIp.trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now >= existing.resetAt) {
    const next = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    store.set(key, next);
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: next.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  const remaining = Math.max(0, options.limit - existing.count);
  return {
    success: existing.count <= options.limit,
    limit: options.limit,
    remaining,
    reset: existing.resetAt,
  };
}
