import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      initialValue: "Hylka Apps",
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      initialValue: "hello@hylkaapps.com",
    }),
    defineField({
      name: "footerTagline",
      title: "Footer tagline",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo (SVG / PNG)",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "siteName" },
  },
});
