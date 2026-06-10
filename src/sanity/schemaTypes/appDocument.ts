import { defineField, defineType } from "sanity";

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "string" }),
      defineField({ name: "uk", title: "Ukrainian", type: "string" }),
    ],
  });

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      defineField({ name: "uk", title: "Ukrainian", type: "text", rows: 3 }),
    ],
  });

export const appDocument = defineType({
  name: "app",
  title: "App",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name.en" },
      validation: (r) => r.required(),
    }),
    localizedString("name", "App name"),
    localizedString("kicker", "Kicker (short tag)"),
    localizedText("description", "Short description (landing card)"),
    localizedText("heroSubtitle", "Hero subtitle (product page)"),
    defineField({
      name: "appStoreUrl",
      title: "App Store URL",
      type: "url",
    }),
    defineField({
      name: "icon",
      title: "App icon",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "screenshots",
      title: "Screenshots",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Emoji icon", type: "string" }),
            localizedString("title", "Title"),
            localizedText("desc", "Description"),
          ],
        },
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            localizedString("q", "Question"),
            localizedText("a", "Answer"),
          ],
        },
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            localizedText("quote", "Quote"),
            defineField({ name: "name", title: "Author name", type: "string" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "slug.current" },
  },
});
