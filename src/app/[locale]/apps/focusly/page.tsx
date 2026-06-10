import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AppStoreBadge from "@/components/AppStoreBadge";
import FaqAccordion from "@/components/FaqAccordion";
import { getApp } from "@/sanity/lib/queries";
import "./focusly.css";

const APP_STORE_URL_FALLBACK = "https://apps.apple.com/app/id000000000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "focusly.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function FocuslyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("focusly");
  const lang = locale as "en" | "uk";

  const cmsApp = await getApp("focusly");
  const APP_STORE_URL = cmsApp?.appStoreUrl ?? APP_STORE_URL_FALLBACK;

  const steps = t.raw("howItWorks.steps") as Array<{ label: string; title: string; desc: string }>;
  const articles = t.raw("articles.items") as Array<{ icon: string; title: string; excerpt: string }>;

  const features = cmsApp?.features?.length
    ? cmsApp.features.map((f) => ({ icon: f.icon, title: f.title[lang], desc: f.desc[lang] }))
    : (t.raw("features.items") as Array<{ icon: string; title: string; desc: string }>);

  const faqItems = cmsApp?.faq?.length
    ? cmsApp.faq.map((f) => ({ q: f.q[lang], a: f.a[lang] }))
    : (t.raw("faq.items") as Array<{ q: string; a: string }>);

  const testimonials = cmsApp?.testimonials?.length
    ? cmsApp.testimonials.map((item) => ({ quote: item.quote[lang], name: item.name }))
    : (t.raw("testimonials.items") as Array<{ quote: string; name: string }>);

  const stepColors = [
    "linear-gradient(150deg,#0A84FF,#5AA9FF)",
    "linear-gradient(150deg,#9B4DEB,#C77DFF)",
    "linear-gradient(150deg,#19B559,#5FE08A)",
  ];

  return (
    <div className="fp-page">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="fp-hero">
        <div className="fp-hero-grid wrap">
          <div className="fp-copy">
            <span className="fp-eyebrow">
              <span className="fp-dot" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="fp-h1">
              {t.rich("hero.h1", {
                serif: (chunks) => <span className="fp-serif">{chunks}</span>,
              })}
            </h1>
            <p className="fp-sub">{t("hero.sub")}</p>
            <div className="fp-cta-row">
              <AppStoreBadge href={APP_STORE_URL} />
              <a className="btn btn-secondary" href="#how-it-works">
                {t("hero.cta2")} ↓
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

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="section surface" id="how-it-works">
        <div className="wrap">
          <div className="section-head center">
            <p className="eyebrow blue">{t("howItWorks.eyebrow")}</p>
            <h2 className="h2">{t("howItWorks.h2")}</h2>
          </div>
          <div className="fp-steps">
            {steps.map((step, i) => (
              <div key={i} className="fp-step">
                <div
                  className="fp-step-num"
                  style={{ background: stepColors[i] }}
                >
                  {i + 1}
                </div>
                <p className="fp-step-label">{step.label}</p>
                <h3 className="fp-step-title">{step.title}</h3>
                <p className="fp-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAT BAND ────────────────────────────────────── */}
      <section className="section white">
        <div className="wrap">
          <div className="fp-stat-band">
            <div className="fp-stat-number">{t("stat.number")}</div>
            <p className="fp-stat-label">{t("stat.label")}</p>
            <a className="btn btn-primary" href={APP_STORE_URL}>
              {t("stat.cta")}
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="section surface">
        <div className="wrap">
          <div className="section-head center">
            <p className="eyebrow coral">{t("features.eyebrow")}</p>
            <h2 className="h2">{t("features.h2")}</h2>
          </div>
          <div className="grid grid-3 mt-32">
            {features.map((f, i) => (
              <div key={i} className="info-card">
                <div className="ic" style={{ background: "var(--surface)" }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES ─────────────────────────────────────── */}
      <section className="section white">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow orange">{t("articles.eyebrow")}</p>
            <h2 className="h2">{t("articles.h2")}</h2>
          </div>
          <div className="grid grid-3 mt-32">
            {articles.map((a, i) => (
              <div key={i} className="fp-article-card">
                <div className="fp-article-icon">{a.icon}</div>
                <h3 className="fp-article-title">{a.title}</h3>
                <p className="fp-article-excerpt">{a.excerpt}</p>
                <span className="textlink">
                  {t("articles.readMore")} →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="section surface">
        <div className="wrap">
          <div className="section-head center">
            <p className="eyebrow purple">{t("testimonials.eyebrow")}</p>
            <h2 className="h2">{t("testimonials.h2")}</h2>
          </div>
          <div className="grid grid-3 mt-32">
            {testimonials.map((item, i) => (
              <div key={i} className="fp-quote-card">
                <div className="fp-quote-stars">★★★★★</div>
                <p className="fp-quote-text">&ldquo;{item.quote}&rdquo;</p>
                <div className="fp-quote-who">
                  <div
                    className="fp-quote-av"
                    style={{
                      background: stepColors[i % stepColors.length],
                    }}
                  >
                    {item.name[0]}
                  </div>
                  <strong>{item.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="section white">
        <div className="wrap">
          <div className="fp-faq-layout">
            <div>
              <p className="eyebrow green">{t("faq.eyebrow")}</p>
              <h2 className="h2">{t("faq.h2")}</h2>
              <p className="lead" style={{ marginTop: 16, maxWidth: "32ch" }}>
                {t("hero.sub")}
              </p>
            </div>
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="section surface">
        <div className="wrap">
          <div className="cta-band accent">
            <h2 className="h2" style={{ color: "#fff" }}>
              {t("cta.h2")}
            </h2>
            <div className="btn-row center mt-32">
              <AppStoreBadge href={APP_STORE_URL} />
              <Link className="btn btn-ghost" href="/contact" style={{ color: "rgba(255,255,255,0.9)" }}>
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
