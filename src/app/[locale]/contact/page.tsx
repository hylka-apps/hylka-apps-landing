import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import "./contact.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const strings = {
    tabs: {
      suggestion: t("tabs.suggestion"),
      complaint: t("tabs.complaint"),
    },
    form: {
      name: t("form.name"),
      namePlaceholder: t("form.namePlaceholder"),
      email: t("form.email"),
      emailPlaceholder: t("form.emailPlaceholder"),
      subject: t("form.subject"),
      subjectPlaceholder: t("form.subjectPlaceholder"),
      message: t("form.message"),
      messagePlaceholder: t("form.messagePlaceholder"),
      submit: t("form.submit"),
    },
    success: t("success"),
    error: t("error"),
    emailLine: t("emailLine"),
  };

  return (
    <div>
      {/* ── HEADER ── */}
      <section className="section white contact-hero">
        <div className="wrap">
          <p className="eyebrow green">{t("eyebrow")}</p>
          <h1 className="h1 contact-h1">
            {t.rich("h1", {
              serif: (chunks) => <span className="contact-serif">{chunks}</span>,
            })}
          </h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: "48ch" }}>
            {t("intro")}
          </p>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="section surface">
        <div className="wrap">
          <ContactForm strings={strings} />
        </div>
      </section>
    </div>
  );
}
