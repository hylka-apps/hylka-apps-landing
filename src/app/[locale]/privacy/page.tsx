import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { readFileSync } from "fs";
import { join } from "path";
import DocPage from "@/components/DocPage";
import { getLegalDoc } from "@/sanity/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const lang = locale as "en" | "uk";

  const cmsDoc = await getLegalDoc("privacy");
  const cmsContent = lang === "uk" ? cmsDoc?.contentUk : cmsDoc?.contentEn;
  const markdown =
    cmsContent || readFileSync(join(process.cwd(), "src/content/privacy.md"), "utf-8");
  const updated = cmsDoc?.updatedAt ?? t("updated");

  return <DocPage h1={t("h1")} updated={updated} markdown={markdown} />;
}
