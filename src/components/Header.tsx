"use client";

import { useEffect, useRef, useState } from "react";
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

function Brand({
  siteName,
  logoUrl,
  onClick,
}: {
  siteName: string;
  logoUrl: string | null;
  onClick?: () => void;
}) {
  return (
    <Link className="brand" href="/" aria-label={`${siteName} home`} onClick={onClick}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="logo-mark" src={logoUrl} alt="" width={28} height={28} />
      ) : (
        <span className="logo-mark">{siteName.charAt(0)}</span>
      )}
      <span>{siteName}</span>
    </Link>
  );
}

export default function Header({
  siteName,
  logoUrl,
}: {
  siteName: string;
  logoUrl: string | null;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

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

  // while the drawer is open: Esc closes it, and Tab is trapped inside it
  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusables = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const switchLocale = (next: string) => {
    setLangOpen(false);
    setDrawerOpen(false);
    if (next === locale) return;
    // preserve the current path, swap the locale
    router.replace(pathname, { locale: next });
  };

  const cur = LANG_LABEL[locale] ?? LANG_LABEL.en;

  // highlight the nav item for the current page (pathname is locale-stripped)
  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/") return pathname.startsWith("/apps"); // "Apps" → app pages
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <header className="site-header">
      <div className="wrap">
        <Brand siteName={siteName} logoUrl={logoUrl} />

        <nav className="nav" aria-label="Primary">
          {NAV.map((it) => {
            const active = isActive(it.href);
            return (
              <Link
                key={it.id}
                href={it.href}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {t(`nav.${it.key}`)}
              </Link>
            );
          })}
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
      <aside
        ref={drawerRef}
        className={`drawer${drawerOpen ? " open" : ""}`}
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label={t("header.openMenu")}
      >
        <div className="drawer-top">
          <Brand siteName={siteName} logoUrl={logoUrl} onClick={() => setDrawerOpen(false)} />
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
