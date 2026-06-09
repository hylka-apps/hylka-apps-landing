import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import "./about.css";

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
                <div className="ic" style={{ background: "var(--surface)", fontSize: 28 }}>
                  {v.icon}
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
