import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import AppStoreBadge from "@/components/AppStoreBadge";
import { getApp } from "@/sanity/lib/queries";
import "./landing.css";

const APP_STORE_URL_FALLBACK = "https://apps.apple.com/app/id000000000";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const cmsApp = await getApp("focusly");
  const APP_STORE_URL = cmsApp?.appStoreUrl ?? APP_STORE_URL_FALLBACK;

  return (
    <div className="landing-page">
      {/* ============ SHOWCASE / HERO ============ */}
      <section className="showcase">
        <div className="plates" aria-hidden="true">
          <div className="plate p-timer">
            <div className="plate-float">
              <div className="pl-pad">
                <div className="pl-label">Deep work</div>
                <div className="pl-sub">Session · in flow</div>
                <div className="big-time">24:00</div>
              </div>
            </div>
          </div>
          <div className="plate p-stats">
            <div className="plate-float">
              <div className="pl-pad">
                <div className="pl-label">This week</div>
                <div className="pl-sub">+38% focus</div>
                <div className="bars">
                  <i style={{ height: "42%" }} />
                  <i style={{ height: "66%" }} />
                  <i style={{ height: "50%" }} />
                  <i style={{ height: "88%" }} />
                  <i style={{ height: "72%" }} />
                  <i style={{ height: "100%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="plate p-sounds">
            <div className="plate-float">
              <div className="pl-pad">
                <div className="pl-label">Focus sounds</div>
                <div className="pl-sub">Rainfall · 🎧</div>
                <div className="wave">
                  {[0, 0.15, 0.3, 0.1, 0.4, 0.25, 0.5, 0.2].map((d, i) => (
                    <i key={i} style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="plate p-icon">
            <div className="plate-float">
              <div className="pl-pad">
                <div className="live-chip">LIVE</div>
                <div className="app-tile-emoji">⏱️</div>
              </div>
            </div>
          </div>
        </div>

        <div className="showcase-inner">
          <span className="lp-eyebrow">
            <span className="dot" />
            <span>{t("eyebrow")}</span>
          </span>
          <h1 className="lp-h1">
            {t.rich("h1", {
              serif: (chunks) => <span className="serif">{chunks}</span>,
            })}
          </h1>
          <p className="lp-sub">{t("sub")}</p>
          <div className="lp-cta-row">
            <a className="lp-btn lp-btn-primary" href="#apps">
              {t("cta1")}
            </a>
            <Link className="lp-btn lp-btn-ghost" href="/about">
              {t("cta2")} <span className="arr">→</span>
            </Link>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span className="mouse" />
          <span>{t("scrollCue")}</span>
        </div>
      </section>

      {/* ============ APPS ============ */}
      <section className="apps-sec" id="apps">
        <div className="apps-head center">
          <span className="lp-eyebrow">
            <span
              className="dot"
              style={{
                background: "var(--acc-coral)",
                boxShadow: "0 0 0 4px rgba(229,84,75,.18)",
              }}
            />
            {t("apps.eyebrow")}
          </span>
          <h2 className="apps-h2">{t("apps.h2")}</h2>
        </div>

        <div className="apps-col">
          {/* Focusly — rich wide plate, fully tappable */}
          <Link className="appcard" href="/apps/focusly" aria-label={`${t("apps.focusly.name")} — ${t("apps.focusly.more")}`}>
            <div className="ac-media">
              <div
                className="media-bg"
                style={{ background: "linear-gradient(150deg,#0A84FF 0%,#5AA9FF 55%,#8EC5FF 100%)" }}
              />
              <span className="ac-live">{t("apps.live")}</span>
              <div className="ac-scene">
                <div className="ac-phone">
                  <div className="notch2" />
                  <div className="scr">
                    <div className="t">24:00</div>
                    <div className="l">Deep work</div>
                  </div>
                </div>
                <div className="ac-minis">
                  <div className="ac-mini" style={{ background: "linear-gradient(150deg,#9B4DEB,#C77DFF)" }}>
                    <div className="mk">🔥 Streak</div>
                    <div className="mv">12 days</div>
                  </div>
                  <div className="ac-mini" style={{ background: "linear-gradient(150deg,#19B559,#5FE08A)" }}>
                    <div className="mk">⏱ Today</div>
                    <div className="mv">3h 40m</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ac-body">
              <span className="ac-kicker">{t("apps.focusly.kicker")}</span>
              <h3 className="ac-name">{t("apps.focusly.name")}</h3>
              <p className="ac-desc">{t("apps.focusly.desc")}</p>
              <div className="ac-chips">
                <span className="ac-chip">{t("apps.focusly.chips.timer")}</span>
                <span className="ac-chip">{t("apps.focusly.chips.sounds")}</span>
                <span className="ac-chip">{t("apps.focusly.chips.stats")}</span>
                <span className="ac-chip">{t("apps.focusly.chips.sync")}</span>
              </div>
              <div className="ac-foot">
                <AppStoreBadge />
                <span className="ac-more">
                  {t("apps.focusly.more")} <span className="arr">→</span>
                </span>
              </div>
            </div>
          </Link>

          {/* What's next — honest teaser plate */}
          <Link className="appcard teaser" href="/contact" aria-label={t("apps.teaser.more")}>
            <div className="ac-body">
              <span className="ac-kicker">{t("apps.teaser.kicker")}</span>
              <h3 className="ac-name">{t("apps.teaser.name")}</h3>
              <p className="ac-desc">{t("apps.teaser.desc")}</p>
              <div className="teaser-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className="ac-foot">
                <span className="ac-more">
                  {t("apps.teaser.more")} <span className="arr">→</span>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ============ CLOSING CTA BAND ============ */}
      <section className="section white">
        <div className="wrap">
          <div className="cta-band accent">
            <h2 className="h2" style={{ color: "#fff" }}>
              {t("cta.h2")}
            </h2>
            <p className="lead" style={{ margin: "14px auto 30px", maxWidth: 480 }}>
              {t("cta.sub")}
            </p>
            <div className="btn-row" style={{ justifyContent: "center" }}>
              <AppStoreBadge href={APP_STORE_URL} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
