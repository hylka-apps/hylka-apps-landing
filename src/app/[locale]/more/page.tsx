import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllApps } from "@/sanity/lib/queries";
import { pick, type Lang } from "@/lib/i18n";
import "./more.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "more.meta" });
  return { title: t("title"), description: t("description") };
}

type SectionData = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export default async function MorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("more");

  const sections = t.raw("sections") as Record<string, SectionData>;

  // The apps list is the single source of truth in Sanity — keep the section
  // title from translations but build its links from the live app list.
  const apps = await getAllApps();
  if (sections.apps) {
    sections.apps = {
      ...sections.apps,
      links: apps.map((app) => ({
        label: pick(app.name, locale as Lang),
        href: `/apps/${app.slug}`,
      })),
    };
  }

  return (
    <div>
      {/* ── HEADER ── */}
      <section className="section white page-hero more-hero">
        <div className="wrap">
          <p className="eyebrow blue">{t("eyebrow")}</p>
          <h1 className="h1 page-h1">{t("h1")}</h1>
          <p className="lead more-intro">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* ── LINK BLOCKS ── */}
      <section className="section surface">
        <div className="wrap">
          <div className="more-grid">
            {Object.values(sections).map((sec, i) => (
              <div key={i} className="more-block">
                <h2 className="more-block-title">{sec.title}</h2>
                <ul className="more-block-links">
                  {sec.links.map((link, j) => {
                    const external = /^https?:\/\//.test(link.href);
                    return (
                      <li key={j}>
                        {external ? (
                          <a
                            href={link.href}
                            className="more-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                            <span className="arr">→</span>
                          </a>
                        ) : (
                          <Link href={link.href} className="more-link">
                            {link.label}
                            <span className="arr">→</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
