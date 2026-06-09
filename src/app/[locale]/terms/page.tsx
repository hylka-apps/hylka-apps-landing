import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { readFileSync } from "fs";
import { join } from "path";
import DocPage from "@/components/DocPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  const markdown = readFileSync(
    join(process.cwd(), "src/content/terms.md"),
    "utf-8"
  );

  return <DocPage h1={t("h1")} updated={t("updated")} markdown={markdown} />;
}
