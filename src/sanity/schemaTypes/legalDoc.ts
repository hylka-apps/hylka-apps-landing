import { defineField, defineType } from "sanity";

export const legalDoc = defineType({
  name: "legalDoc",
  title: "Legal Document",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      options: { columns: 2 },
      fields: [
        defineField({ name: "en", title: "English", type: "string" }),
        defineField({ name: "uk", title: "Ukrainian", type: "string" }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL: /legal/<slug>)",
      type: "slug",
      options: { source: "title.en" },
      description:
        "Add any new document kind by creating a doc with its own slug — no code changes needed. It appears automatically in the footer/More page Legal section.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "date",
    }),
    defineField({
      name: "contentEn",
      title: "Content (English, Markdown)",
      type: "text",
      rows: 20,
    }),
    defineField({
      name: "contentUk",
      title: "Content (Ukrainian, Markdown)",
      type: "text",
      rows: 20,
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "slug.current" },
  },
});
