import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AppStoreBadge from "@/components/AppStoreBadge";
import AppSections from "@/components/AppSections";
import { getApp, getAllApps, getBrand, type Loc } from "@/sanity/lib/queries";
import { preserveCase } from "@/lib/text";
import "./app.css";

const APP_STORE_URL_FALLBACK = "https://apps.apple.com/app/id000000000";

function pick(loc: Loc | undefined, lang: "en" | "uk"): string {
  return (loc?.[lang] ?? loc?.en ?? "").toString();
}

export async function generateStaticParams() {
  const apps = await getAllApps();
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as "en" | "uk";
  const [app, brand] = await Promise.all([getApp(slug), getBrand()]);
  if (!app) return {};
  const name = pick(app.name, lang) || brand.siteName;
  return {
    title: `${name} · ${brand.siteName}`,
    description: pick(app.heroSubtitle, lang) || undefined,
  };
}

export default async function AppPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = locale as "en" | "uk";

  const app = await getApp(slug);
  if (!app) notFound();

  const t = await getTranslations("appPage");
  const tHeader = await getTranslations("header");

  const appStoreUrl = app.appStoreUrl ?? APP_STORE_URL_FALLBACK;
  const heroH1 = pick(app.heroH1, lang);
  const heroAccent = pick(app.heroH1Accent, lang);

  return (
    <div className="fp-page">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="fp-hero">
        <div className="fp-hero-grid wrap">
          <div className="fp-copy">
            <span className="fp-eyebrow">
              <span className="fp-dot" />
              {preserveCase(pick(app.kicker, lang))}
            </span>
            <h1 className="fp-h1">
              {heroH1}
              {heroAccent ? <> <span className="fp-serif">{heroAccent}</span></> : null}
            </h1>
            <p className="fp-sub">{pick(app.heroSubtitle, lang)}</p>
            <div className="fp-cta-row">
              <AppStoreBadge href={appStoreUrl} />
              <a className="btn btn-secondary" href="#how-it-works">
                {t("howItWorks")} ↓
              </a>
            </div>
          </div>

          <div className="fp-stage">
            <div className="fp-phone">
              <div className="fp-screen">
                <div className="fp-notch" />
                <div className="fp-phone-inner">
                  <div className="fp-phone-label">Deep work</div>
                  <div className="fp-phone-time">24:00</div>
                  <div className="fp-phone-sub">Session · in flow</div>
                </div>
              </div>
            </div>
            <div className="fp-float fp-float-streak">
              <div className="fk">🔥 Streak</div>
              <div className="fv">12 days</div>
            </div>
            <div className="fp-float fp-float-today">
              <div className="fk">⏱ Today</div>
              <div className="fv">3h 40m</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REORDERABLE SECTIONS (from CMS) ──────────────── */}
      <AppSections
        sections={app.sections ?? []}
        lang={lang}
        appStoreUrl={appStoreUrl}
        downloadLabel={tHeader("cta")}
        contactLabel={t("contact")}
      />
    </div>
  );
}
