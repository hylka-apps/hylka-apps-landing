import type { Loc } from "@/sanity/lib/queries";

export type Lang = "en" | "uk";

/**
 * Pick a localized string from a Sanity `Loc`, falling back to English and
 * then to an empty string. Single source of the locale-fallback rule.
 */
export function pick(loc: Loc | undefined, lang: Lang): string {
  return (loc?.[lang] ?? loc?.en ?? "").toString();
}
