import type { NextConfig } from "next";

export function buildContentSecurityPolicy(isDev: boolean) {
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = ["'self'", "https://*.supabase.co", "https://api.resend.com"];
  const directives = ["default-src 'self'"];

  if (isDev) {
    scriptSrc.push("'unsafe-eval'");
    connectSrc.push("ws://localhost:*", "ws://127.0.0.1:*", "http://localhost:*", "http://127.0.0.1:*");
  }

  directives.push(`script-src ${scriptSrc.join(" ")}`);
  directives.push("style-src 'self' 'unsafe-inline'");
  directives.push("img-src 'self' data: blob: https:");
  directives.push("font-src 'self' data:");
  directives.push(`connect-src ${connectSrc.join(" ")}`);
  directives.push("frame-src 'none'");
  directives.push("frame-ancestors 'none'");
  directives.push("base-uri 'self'");
  directives.push("form-action 'self'");
  directives.push("object-src 'none'");

  if (!isDev) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-site'
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: buildContentSecurityPolicy(process.env.NODE_ENV !== "production")
  }
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
