import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Legal docs moved under /legal/<slug>; keep the old URLs working.
  async redirects() {
    return [
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/:locale(en|uk)/terms", destination: "/:locale/legal/terms", permanent: true },
      { source: "/:locale(en|uk)/privacy", destination: "/:locale/legal/privacy", permanent: true },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // Source-map upload runs only when SENTRY_ORG/PROJECT/AUTH_TOKEN are set
  // (e.g. on Vercel). Locally it's silently skipped.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
