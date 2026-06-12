"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Something went wrong</h1>
          <p style={{ color: "#666", margin: "0 0 20px" }}>
            We&apos;ve been notified. Please try again.
          </p>
          {/* Full reload from a broken app state — Link is intentionally avoided. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: 100,
              background: "#0a84ff",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back home
          </a>
        </div>
      </body>
    </html>
  );
}
