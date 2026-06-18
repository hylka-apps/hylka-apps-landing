import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AppStoreBadge from "@/components/AppStoreBadge";
import AppSections from "@/components/AppSections";
import AnchorLink from "@/components/AnchorLink";
import { getApp, getAllApps, getBrand } from "@/sanity/lib/queries";
import { preserveCase } from "@/lib/text";
import { pick, pickOr } from "@/lib/i18n";
import { accentGradient } from "@/lib/accent";
import { renderAccent } from "@/lib/accentText";
import HeroMedia from "@/components/HeroMedia";
import { resolveStoreUrl } from "@/config/site";
import "./app.css";

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

  // No real URL → undefined → the badge renders inert instead of a dead link.
  const appStoreUrl = resolveStoreUrl(app.appStoreUrl);
  const heroH1 = pick(app.heroH1, lang);

  // Hero phone mockup + floating chips. Chips only render when filled in.
  const chips = (app.heroChips ?? []).slice(0, 2);
  const CHIP_POS = ["fp-float-streak", "fp-float-today"] as const;
  const screenBg = accentGradient(app.accent, 172);

  return (
    <div className="fp-page">
      {/* Hidden apps aren't linked anywhere — this direct URL is the preview. */}
      {app.hidden ? (
        <div className="fp-preview-flag" role="status">
          {t("hiddenPreview")}
        </div>
      ) : null}
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="fp-hero">
        <div className="fp-hero-grid wrap">
          <div className="fp-copy">
            <span className="fp-eyebrow">
              <span
                className="fp-dot"
                style={
                  app.accent
                    ? { background: app.accent, boxShadow: `0 0 0 4px ${app.accent}2e` }
                    : undefined
                }
              />
              {preserveCase(pick(app.kicker, lang))}
            </span>
            <h1 className="fp-h1">{renderAccent(heroH1, "fp-serif")}</h1>
            <p className="fp-sub">{pick(app.heroSubtitle, lang)}</p>
            <div className="fp-cta-row">
              <AppStoreBadge href={appStoreUrl} />
              <AnchorLink className="btn btn-secondary" href="#how-it-works">
                {t("howItWorks")} ↓
              </AnchorLink>
            </div>
          </div>

          <div className="fp-stage">
            <div className="fp-phone">
              <div
                className="fp-screen"
                style={screenBg ? { background: screenBg } : undefined}
              >
                <div className="fp-notch" />
                {app.screenMedia?.url ? (
                  <HeroMedia
                    url={app.screenMedia.url}
                    mime={app.screenMedia.mime}
                    className="fp-screen-media"
                  />
                ) : (
                  <div className="fp-phone-inner">
                    <div className="fp-phone-label">
                      {pickOr(app.screenLabel, lang, "Deep work")}
                    </div>
                    <div className="fp-phone-time">
                      {pickOr(app.screenValue, lang, "24:00")}
                    </div>
                    <div className="fp-phone-sub">
                      {pickOr(app.screenSub, lang, "Session · in flow")}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {chips.map((c, i) => {
              const bg = accentGradient(c.accent, 150);
              return (
                <div
                  key={i}
                  className={`fp-float ${CHIP_POS[i]}`}
                  style={bg ? { background: bg } : undefined}
                >
                  <div className="fk">{pick(c.label, lang)}</div>
                  <div className="fv">{pick(c.value, lang)}</div>
                </div>
              );
            })}
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
