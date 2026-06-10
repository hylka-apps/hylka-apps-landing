import { defineField, defineType } from "sanity";

export const legalDoc = defineType({
  name: "legalDoc",
  title: "Legal Document",
  type: "document",
  fields: [
    defineField({
      name: "docType",
      title: "Document type",
      type: "string",
      options: {
        list: [
          { title: "Terms of Service", value: "terms" },
          { title: "Privacy Policy", value: "privacy" },
        ],
        layout: "radio",
      },
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
    select: { title: "docType", subtitle: "updatedAt" },
  },
});
