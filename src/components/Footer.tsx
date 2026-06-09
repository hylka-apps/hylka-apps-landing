import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/" aria-label="Hylka Apps home">
              <span className="logo-mark">H</span>
              <span>Hylka Apps</span>
            </Link>
            <p>{t("tagline")}</p>
          </div>

          <div className="footer-col">
            <h4>{t("cols.apps")}</h4>
            <ul>
              <li>
                <Link href="/apps/focusly">Focusly</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t("cols.company")}</h4>
            <ul>
              <li>
                <Link href="/about">{t("links.about")}</Link>
              </li>
              <li>
                <Link href="/more">{t("links.more")}</Link>
              </li>
              <li>
                <Link href="/contact">{t("links.contact")}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t("cols.legal")}</h4>
            <ul>
              <li>
                <Link href="/terms">{t("links.terms")}</Link>
              </li>
              <li>
                <Link href="/privacy">{t("links.privacy")}</Link>
              </li>
              <li>
                <a href="mailto:hello@hylkaapps.com">hello@hylkaapps.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="wrap">
          <p>{t("copyright")}</p>
          <p>{t("legalnote")}</p>
        </div>
      </div>
    </footer>
  );
}
