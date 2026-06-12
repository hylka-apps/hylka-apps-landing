import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import { getBrand, getAllApps } from "@/sanity/lib/queries";
import { pick } from "@/lib/i18n";
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
  const { email } = await getBrand();
  const lang = locale as "en" | "uk";
  const apps = await getAllApps();
  const appOptions = apps.map((a) => pick(a.name, lang));

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
      app: t("form.app"),
      appPlaceholder: t("form.appPlaceholder"),
      message: t("form.message"),
      messagePlaceholder: t("form.messagePlaceholder"),
      submit: t("form.submit"),
      required: t("form.required"),
      invalidEmail: t("form.invalidEmail"),
    },
    success: t("success"),
    error: t("error", { email }),
    emailLine: t("emailLine"),
    sendAnother: t("sendAnother"),
  };

  return (
    <div>
      {/* ── HEADER ── */}
      <section className="section white page-hero">
        <div className="wrap">
          <p className="eyebrow green">{t("eyebrow")}</p>
          <h1 className="h1 page-h1">
            {t.rich("h1", {
              serif: (chunks) => <span className="contact-serif">{chunks}</span>,
            })}
          </h1>
          <p className="lead contact-intro">{t("intro")}</p>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="section surface">
        <div className="wrap">
          <ContactForm strings={strings} email={email} appOptions={appOptions} />
        </div>
      </section>
    </div>
  );
}
