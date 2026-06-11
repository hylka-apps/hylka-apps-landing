import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import "./about.css";

// Consistent monochrome line icons for the three value cards (by index).
// Replaces the mixed emoji set (glyph + emoji, with an invisible white heart).
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
  // Simple — a clean check
  <svg key="simple" {...ICON_SVG}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>,
  // Private by default — a lock
  <svg key="private" {...ICON_SVG}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>,
  // Made with care — a heart
  <svg key="care" {...ICON_SVG}>
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
  const t = await getTranslations("about");
  const values = t.raw("values.items") as Array<{ icon: string; title: string; desc: string }>;

  return (
    <div>
      {/* ── HERO ── */}
      <section className="section white about-hero">
        <div className="wrap">
          <p className="eyebrow coral">{t("eyebrow")}</p>
          <h1 className="h1 about-h1">
            {t.rich("h1", {
              serif: (chunks) => <span className="about-serif">{chunks}</span>,
            })}
          </h1>
          <p className="lead about-lead">{t("lead")}</p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="section surface">
        <div className="wrap">
          <div className="about-story">
            <p className="about-story-text">{t("story")}</p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section white">
        <div className="wrap">
          <div className="section-head center">
            <h2 className="h2">{t("values.h2")}</h2>
          </div>
          <div className="grid grid-3 mt-32">
            {values.map((v, i) => (
              <div key={i} className="info-card">
                <div className="ic" style={{ background: "var(--surface)", color: "var(--text)" }}>
                  {VALUE_ICONS[i] ?? v.icon}
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section surface">
        <div className="wrap">
          <div className="cta-band soft center">
            <h2 className="h2">{t("cta.h2")}</h2>
            <div className="btn-row center mt-32">
              <Link className="btn btn-primary" href="/apps/focusly">
                {t("cta.cta")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
