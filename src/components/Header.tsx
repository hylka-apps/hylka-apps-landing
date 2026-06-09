"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const NAV = [
  { id: "apps", key: "apps", href: "/#apps" },
  { id: "more", key: "more", href: "/more" },
  { id: "about", key: "about", href: "/about" },
  { id: "contact", key: "contact", href: "/contact" },
] as const;

const LANG_LABEL: Record<string, { flag: string; short: string; full: string }> = {
  en: { flag: "🇬🇧", short: "EN", full: "English" },
  uk: { flag: "🇺🇦", short: "UK", full: "Українська" },
};

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link className="brand" href="/" aria-label="Hylka Apps home" onClick={onClick}>
      <span className="logo-mark">H</span>
      <span>Hylka Apps</span>
    </Link>
  );
}

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // close the language menu on any outside click
  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [langOpen]);

  // lock scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const switchLocale = (next: string) => {
    setLangOpen(false);
    setDrawerOpen(false);
    if (next === locale) return;
    // preserve the current path, swap the locale
    router.replace(pathname, { locale: next });
  };

  const cur = LANG_LABEL[locale] ?? LANG_LABEL.en;

  return (
    <header className="site-header">
      <div className="wrap">
        <Brand />

        <nav className="nav" aria-label="Primary">
          {NAV.map((it) => (
            <Link key={it.id} href={it.href}>
              {t(`nav.${it.key}`)}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <div className={`lang${langOpen ? " open" : ""}`}>
            <button
              type="button"
              className="lang-btn"
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-label={t("header.language")}
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen((o) => !o);
              }}
            >
              <span className="flag">{cur.flag}</span>
              <span>{cur.short}</span>
              <svg className="chev" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="lang-menu" role="menu">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className={loc === locale ? "sel" : ""}
                  onClick={() => switchLocale(loc)}
                >
                  <span className="flag">{LANG_LABEL[loc].flag}</span> {LANG_LABEL[loc].full}
                </button>
              ))}
            </div>
          </div>

          <Link className="btn btn-primary btn-sm header-cta-desktop" href="/#apps">
            {t("header.cta")}
          </Link>

          <button
            type="button"
            className="hamburger"
            aria-label={t("header.openMenu")}
            onClick={() => setDrawerOpen(true)}
          >
            <span></span>
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        className={`drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={`drawer${drawerOpen ? " open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-top">
          <Brand onClick={() => setDrawerOpen(false)} />
          <button
            type="button"
            className="drawer-close"
            aria-label={t("header.closeMenu")}
            onClick={() => setDrawerOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav>
          {NAV.map((it) => (
            <Link key={it.id} href={it.href} onClick={() => setDrawerOpen(false)}>
              {t(`nav.${it.key}`)}
            </Link>
          ))}
        </nav>
        <div className="drawer-foot">
          <Link className="btn btn-primary" href="/#apps" onClick={() => setDrawerOpen(false)}>
            {t("header.cta")}
          </Link>
          <div className="drawer-langs">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                type="button"
                className={loc === locale ? "sel" : ""}
                onClick={() => switchLocale(loc)}
              >
                {LANG_LABEL[loc].flag} {LANG_LABEL[loc].short}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
}
