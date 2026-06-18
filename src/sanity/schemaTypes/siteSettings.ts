import { defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

// Brand-level settings (name, contact, logo). Homepage content lives in the
// separate "Site content" (homeContent) document.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Brand",
  type: "document",
  icon: CogIcon,
  fields: [
    { name: "siteName", title: "Site name", type: "string", initialValue: "Hylka Apps" },
    { name: "email", title: "Contact email", type: "string", initialValue: "hello@hylkaapps.com" },
    { name: "footerTagline", title: "Footer tagline", type: "string" },
    {
      name: "logo",
      title: "Logo (SVG / PNG)",
      type: "image",
      options: { hotspot: true },
    },
  ],
  preview: {
    select: { title: "siteName" },
    prepare: ({ title }) => ({ title: title || "Brand" }),
  },
});
