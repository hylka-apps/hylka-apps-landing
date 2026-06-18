import type { Loc } from "@/sanity/lib/queries";

export type Lang = "en" | "uk";

/**
 * Pick a localized string from a Sanity `Loc`, falling back to English and
 * then to an empty string. Single source of the locale-fallback rule.
 */
export function pick(loc: Loc | undefined, lang: Lang): string {
  return (loc?.[lang] ?? loc?.en ?? "").toString();
}

/**
 * Like `pick`, but returns `fallback` when the localized value is empty.
 * Lets CMS fields override a hardcoded default without breaking the page
 * when the field hasn't been filled in yet.
 */
export function pickOr(loc: Loc | undefined, lang: Lang, fallback: string): string {
  const v = pick(loc, lang);
  return v.trim() ? v : fallback;
}
