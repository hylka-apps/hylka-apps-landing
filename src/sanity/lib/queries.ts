import { getSanityClient, isSanityConfigured } from "./client";
import { urlFor } from "./image";
import { siteConfig } from "@/config/site";

export type Loc = { en?: string; uk?: string };

// ── App page sections (polymorphic, ordered in Studio) ────────────────
export type AppSection =
  | { _type: "howItWorksSection"; _key: string; eyebrow?: Loc; heading?: Loc; steps?: { label?: Loc; title?: Loc; desc?: Loc }[] }
  | { _type: "statSection"; _key: string; number?: string; label?: Loc }
  | { _type: "featuresSection"; _key: string; eyebrow?: Loc; heading?: Loc; items?: { icon?: string; title?: Loc; desc?: Loc }[] }
  | { _type: "articlesSection"; _key: string; eyebrow?: Loc; heading?: Loc; items?: { icon?: string; title?: Loc; excerpt?: Loc }[] }
  | { _type: "testimonialsSection"; _key: string; eyebrow?: Loc; heading?: Loc; items?: { quote?: Loc; name?: string }[] }
  | { _type: "faqSection"; _key: string; eyebrow?: Loc; heading?: Loc; items?: { q?: Loc; a?: Loc }[] }
  | { _type: "ctaSection"; _key: string; heading?: Loc };

export type SanityApp = {
  slug: string;
  name?: Loc;
  kicker?: Loc;
  heroH1?: Loc;
  heroH1Accent?: Loc;
  heroSubtitle?: Loc;
  appStoreUrl?: string | null;
  iconUrl?: string | null;
  cardDescription?: Loc;
  cardChips?: Loc[];
  sections?: AppSection[];
};

// Lightweight shape for the landing grid + static params
export type SanityAppCard = {
  slug: string;
  name?: Loc;
  kicker?: Loc;
  cardDescription?: Loc;
  cardChips?: Loc[];
  appStoreUrl?: string | null;
  iconUrl?: string | null;
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

// `tags` lets the Sanity webhook purge instantly via revalidateTag("sanity");
// `revalidate` is the hourly safety net if the webhook ever misses.
const REVALIDATE = { next: { revalidate: 3600, tags: ["sanity"] } };

const APP_FIELDS = `
  "slug": slug.current,
  name, kicker, heroH1, heroH1Accent, heroSubtitle, appStoreUrl,
  "iconUrl": icon.asset->url,
  cardDescription, cardChips,
  sections
`;

const CARD_FIELDS = `
  "slug": slug.current,
  name, kicker, cardDescription, cardChips, appStoreUrl,
  "iconUrl": icon.asset->url
`;

export async function getApp(slug: string): Promise<SanityApp | null> {
  if (!isSanityConfigured()) return null;
  return getSanityClient().fetch(
    `*[_type == "app" && slug.current == $slug][0]{${APP_FIELDS}}`,
    { slug },
    REVALIDATE
  );
}

export async function getAllApps(): Promise<SanityAppCard[]> {
  if (!isSanityConfigured()) return [];
  return getSanityClient().fetch(
    `*[_type == "app" && defined(slug.current)] | order(_createdAt asc){${CARD_FIELDS}}`,
    {},
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

export async function getBrand(): Promise<Brand> {
  const s = await getSiteSettings();
  return {
    siteName: s?.siteName || siteConfig.brand.name,
    email: s?.email || siteConfig.brand.email,
    tagline: s?.footerTagline || null,
    logoUrl: s?.logo
      ? urlFor(s.logo).width(64).height(64).fit("max").url()
      : null,
  };
}
