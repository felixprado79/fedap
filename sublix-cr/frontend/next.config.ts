import type { NextConfig } from "next";

// Content Security Policy — controls which resources the browser may load.
// 'self' = same origin only. Adjust connect-src if you add analytics later.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' blob: data: https:;
  connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? ""};
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\n/g, " ").trim();

// Security headers applied to every response from Next.js.
// In production these are served before Nginx, which can add its own layer.
const securityHeaders = [
  // Stops MIME-type sniffing (e.g., serving a .txt file as JavaScript)
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Prevents the site from being loaded in an iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },

  // Controls how much of the URL is sent in the Referer header
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Disable browser features we don't use (camera, mic, location, payment)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },

  // Enforce HTTPS for 2 years, include subdomains, allow preload list
  // Only applies in production — Next.js removes it in dev automatically via the condition below
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),

  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig: NextConfig = {
  // Allow optimized images from our own domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sublix.cr",
      },
    ],
  },

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Proxy /api/* calls to FastAPI during development.
  // In production, Nginx handles this routing at the infra level.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
