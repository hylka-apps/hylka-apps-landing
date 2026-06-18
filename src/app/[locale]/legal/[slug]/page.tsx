import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import DocPage from "@/components/DocPage";
import { getLegalDoc, getAllLegalDocs, getBrand } from "@/sanity/lib/queries";
import { pick } from "@/lib/i18n";

export async function generateStaticParams() {
  const docs = await getAllLegalDocs();
  return docs.map((d) => ({ slug: d.slug }));
}

// Optional local Markdown fallback so the bundled terms/privacy keep working
// before the CMS docs are filled in. Any other slug simply has no fallback.
function localFallback(slug: string): string | null {
  const file = join(process.cwd(), "src/content", `${slug}.md`);
  return existsSync(file) ? readFileSync(file, "utf-8") : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as "en" | "uk";
  const [doc, brand] = await Promise.all([getLegalDoc(slug), getBrand()]);
  const title = pick(doc?.title, lang);
  if (!title) return {};
  return { title: `${title} · ${brand.siteName}` };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = locale as "en" | "uk";
  const t = await getTranslations("legal");

  const doc = await getLegalDoc(slug);
  const cmsContent = lang === "uk" ? doc?.contentUk : doc?.contentEn;
  const markdown = cmsContent || localFallback(slug);

  // No CMS doc and no bundled fallback → the slug doesn't exist.
  if (!doc && !markdown) notFound();

  const h1 =
    pick(doc?.title, lang) ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const updated = doc?.updatedAt
    ? `${t("updated")} ${doc.updatedAt}`
    : "";

  return <DocPage h1={h1} updated={updated} markdown={markdown ?? ""} />;
}
