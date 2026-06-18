import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAboutContent, getAllApps } from "@/sanity/lib/queries";
import { pick, pickOr } from "@/lib/i18n";
import { renderAccent } from "@/lib/accentText";
import "./about.css";

// Monochrome line icons for the three value cards, picked by index.
const ICON_SVG = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const VALUE_ICONS = [
  // Simple — a clean check (blue)
  <svg key="simple" {...ICON_SVG} stroke="var(--acc-blue)">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>,
  // Private by default — a lock (green)
  <svg key="private" {...ICON_SVG} stroke="var(--acc-green)">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>,
  // Made with care — a heart (coral)
  <svg key="care" {...ICON_SVG} stroke="var(--acc-coral)">
    <path d="M12 20.3C12 20.3 4 15.5 4 9.8 4 7.4 5.9 5.7 8.1 5.7 9.6 5.7 11 6.5 12 7.9 13 6.5 14.4 5.7 15.9 5.7 18.1 5.7 20 7.4 20 9.8 20 15.5 12 20.3 12 20.3Z" />
  </svg>,
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as "en" | "uk";
  const t = await getTranslations("about");
  const [about, apps] = await Promise.all([getAboutContent(), getAllApps()]);
  // CTA points at the first live app; falls back to the apps list if none.
  const ctaHref = apps[0] ? `/apps/${apps[0].slug}` : "/#apps";

  // Fallback to the translation file when a CMS field is empty.
  const tValues = t.raw("values.items") as Array<{ title: string; desc: string }>;
  const cmsValues = about?.valueItems ?? [];
  const values =
    cmsValues.length > 0
      ? cmsValues.map((v) => ({ title: pick(v.title, lang), desc: pick(v.desc, lang) }))
      : tValues;

  const heroHeading = pick(about?.heroHeading, lang);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="section white page-hero about-hero">
        <div className="wrap">
          <p className="eyebrow coral">{pickOr(about?.heroEyebrow, lang, t("eyebrow"))}</p>
          <h1 className="h1 page-h1 about-h1">
            {heroHeading
              ? renderAccent(heroHeading, "about-serif")
              : t.rich("h1", {
                  serif: (chunks) => <span className="about-serif">{chunks}</span>,
                })}
          </h1>
          <p className="lead about-lead">{pickOr(about?.heroLead, lang, t("lead"))}</p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="section surface about-story-sec">
        <div className="wrap">
          <div className="about-story">
            <p className="about-story-text">{pickOr(about?.story, lang, t("story"))}</p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section white">
        <div className="wrap">
          <div className="section-head center">
            <p className="eyebrow green">{pickOr(about?.valuesEyebrow, lang, t("values.eyebrow"))}</p>
            <h2 className="h2">{pickOr(about?.valuesHeading, lang, t("values.h2"))}</h2>
          </div>
          <div className="grid grid-3 mt-32">
            {values.map((v, i) => (
              <div key={i} className="info-card">
                <div className="ic" style={{ background: "var(--surface)" }}>
                  {VALUE_ICONS[i % VALUE_ICONS.length]}
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section white">
        <div className="wrap">
          <div className="cta-band soft center">
            <h2 className="h2">{pickOr(about?.ctaHeading, lang, t("cta.h2"))}</h2>
            <p className="lead" style={{ marginTop: 14, color: "var(--muted)" }}>
              {pickOr(about?.ctaSub, lang, t("cta.sub"))}
            </p>
            <div className="btn-row center mt-32">
              <Link className="btn btn-primary" href={ctaHref}>
                {pickOr(about?.ctaLabel, lang, t("cta.cta"))} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
