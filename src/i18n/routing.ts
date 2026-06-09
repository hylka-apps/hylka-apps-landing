import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uk"],
  defaultLocale: "en",
  // /en/... and /uk/... — always show the locale prefix
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
