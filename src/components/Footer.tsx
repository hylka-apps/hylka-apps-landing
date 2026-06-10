import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

const DEFAULT_NAME = "Hylka Apps";
const DEFAULT_EMAIL = "hello@hylkaapps.com";

export default async function Footer() {
  const t = await getTranslations("footer");
  const settings = await getSiteSettings();

  const siteName = settings?.siteName ?? DEFAULT_NAME;
  const email = settings?.email ?? DEFAULT_EMAIL;
  const tagline = settings?.footerTagline ?? t("tagline");
  const logoUrl = settings?.logo
    ? urlFor(settings.logo).width(64).height(64).fit("max").url()
    : null;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/" aria-label={`${siteName} home`}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="logo-mark" src={logoUrl} alt="" width={28} height={28} />
              ) : (
                <span className="logo-mark">{siteName.charAt(0)}</span>
              )}
              <span>{siteName}</span>
            </Link>
            <p>{tagline}</p>
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
                <a href={`mailto:${email}`}>{email}</a>
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
