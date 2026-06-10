import { getSanityClient, isSanityConfigured } from "./client";
import { urlFor } from "./image";

type Localized = { en: string; uk: string };

export type SanityApp = {
  appStoreUrl: string | null;
  features: Array<{ icon: string; title: Localized; desc: Localized }> | null;
  faq: Array<{ q: Localized; a: Localized }> | null;
  testimonials: Array<{ quote: Localized; name: string }> | null;
};

export type SanityLegalDoc = {
  updatedAt: string | null;
  contentEn: string;
  contentUk: string;
};

export type SanitySiteSettings = {
  siteName: string | null;
  email: string | null;
  footerTagline: string | null;
  logo: { asset: { _ref: string } } | null;
};

const REVALIDATE = { next: { revalidate: 3600 } } as const;

export async function getApp(slug: string): Promise<SanityApp | null> {
  if (!isSanityConfigured()) return null;
  return getSanityClient().fetch(
    `*[_type == "app" && slug.current == $slug][0]{
      appStoreUrl,
      features[]{icon, title, desc},
      faq[]{q, a},
      testimonials[]{quote, name}
    }`,
    { slug },
    REVALIDATE
  );
}

export async function getLegalDoc(
  docType: "terms" | "privacy"
): Promise<SanityLegalDoc | null> {
  if (!isSanityConfigured()) return null;
  return getSanityClient().fetch(
    `*[_type == "legalDoc" && docType == $docType][0]{updatedAt, contentEn, contentUk}`,
    { docType },
    REVALIDATE
  );
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  if (!isSanityConfigured()) return null;
  return getSanityClient().fetch(
    `*[_type == "siteSettings"][0]{siteName, email, footerTagline, logo}`,
    {},
    REVALIDATE
  );
}

// Resolved brand values with defaults — single source of truth for name/email/logo.
export type Brand = {
  siteName: string;
  email: string;
  tagline: string | null;
  logoUrl: string | null;
};

const BRAND_DEFAULTS = {
  siteName: "Hylka Apps",
  email: "hello@hylkaapps.com",
};

export async function getBrand(): Promise<Brand> {
  const s = await getSiteSettings();
  return {
    siteName: s?.siteName || BRAND_DEFAULTS.siteName,
    email: s?.email || BRAND_DEFAULTS.email,
    tagline: s?.footerTagline || null,
    logoUrl: s?.logo
      ? urlFor(s.logo).width(64).height(64).fit("max").url()
      : null,
  };
}
