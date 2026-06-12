import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// No DSN (e.g. local dev) → SDK is a no-op, nothing breaks.
Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tracesSampleRate: 1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
