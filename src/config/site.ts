/**
 * Central, non-secret site configuration.
 *
 * Single source of truth for values that were previously hardcoded across the
 * codebase (recipient emails, sender, brand fallbacks, store links).
 * Secrets (API keys, tokens) stay in env — never here.
 */
export const siteConfig = {
  /**
   * Where contact-form messages land. Also reused for ops notifications.
   * Add addresses to fan out to more inboxes.
   */
  notifyEmails: ["milagalko1@gmail.com"],

  /**
   * Resend sender. Must be a verified address/domain in Resend.
   * TODO: switch to "Hylka Apps <noreply@hylkaapps.com>" once the domain
   * is verified in Resend.
   */
  emailFrom: "Hylka Apps <onboarding@resend.dev>",

  /** Brand fallbacks — used only when Sanity siteSettings is empty. */
  brand: {
    name: "Hylka Apps",
    email: "hello@hylkaapps.com",
  },

  /**
   * App Store link used when an app has no `appStoreUrl` set in Sanity.
   * `null` → the badge renders inert (disabled) instead of pointing at a
   * dead link. Set a real URL here only if every app should share one.
   */
  appStoreFallbackUrl: null as string | null,
};

/**
 * Resolves an App Store URL coming from Sanity. The seed data ships a
 * placeholder (`id000000000`); treat that — and any empty value — as "not set"
 * so the badge renders inert instead of pointing at a dead App Store page.
 */
export function resolveStoreUrl(url?: string | null): string | undefined {
  if (!url || url.includes("id000000000")) {
    return siteConfig.appStoreFallbackUrl ?? undefined;
  }
  return url;
}
