import { defineArrayMember, defineField, defineType } from "sanity";

// ── localization helpers ──────────────────────────────────────────────
const locString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: [
      defineField({ name: "en", title: "English", type: "string" }),
      defineField({ name: "uk", title: "Ukrainian", type: "string" }),
    ],
  });

const locText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: [
      defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      defineField({ name: "uk", title: "Ukrainian", type: "text", rows: 3 }),
    ],
  });

const headingFields = [locString("eyebrow", "Eyebrow (small label)"), locString("heading", "Heading")];

// ── section blocks (reorderable in the page builder) ──────────────────
const howItWorksSection = defineArrayMember({
  name: "howItWorksSection",
  title: "How it works",
  type: "object",
  fields: [
    ...headingFields,
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            locString("label", "Label (e.g. Step 01)"),
            locString("title", "Title"),
            locText("desc", "Description"),
          ],
          preview: { select: { title: "title.en" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: `How it works — ${title ?? ""}` }) },
});

const statSection = defineArrayMember({
  name: "statSection",
  title: "Stat band",
  type: "object",
  fields: [
    defineField({ name: "number", title: "Big number (e.g. 12,000+)", type: "string" }),
    locString("label", "Label"),
  ],
  preview: { select: { title: "number" }, prepare: ({ title }) => ({ title: `Stat — ${title ?? ""}` }) },
});

const featuresSection = defineArrayMember({
  name: "featuresSection",
  title: "Features",
  type: "object",
  fields: [
    ...headingFields,
    defineField({
      name: "items",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Emoji icon", type: "string" }),
            locString("title", "Title"),
            locText("desc", "Description"),
          ],
          preview: { select: { title: "title.en", subtitle: "icon" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: `Features — ${title ?? ""}` }) },
});

const articlesSection = defineArrayMember({
  name: "articlesSection",
  title: "Articles",
  type: "object",
  fields: [
    ...headingFields,
    defineField({
      name: "items",
      title: "Articles",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Emoji icon", type: "string" }),
            locString("title", "Title"),
            locText("excerpt", "Excerpt"),
          ],
          preview: { select: { title: "title.en", subtitle: "icon" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: `Articles — ${title ?? ""}` }) },
});

const testimonialsSection = defineArrayMember({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [
    ...headingFields,
    defineField({
      name: "items",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            locText("quote", "Quote"),
            defineField({ name: "name", title: "Author name", type: "string" }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: `Testimonials — ${title ?? ""}` }) },
});

const faqSection = defineArrayMember({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  fields: [
    ...headingFields,
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [locString("q", "Question"), locText("a", "Answer")],
          preview: { select: { title: "q.en" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: `FAQ — ${title ?? ""}` }) },
});

const ctaSection = defineArrayMember({
  name: "ctaSection",
  title: "Final call-to-action",
  type: "object",
  fields: [locString("heading", "Heading")],
  preview: { select: { title: "heading.en" }, prepare: ({ title }) => ({ title: `CTA — ${title ?? ""}` }) },
});

// ── the App document ──────────────────────────────────────────────────
export const appDocument = defineType({
  name: "app",
  title: "App",
  type: "document",
  groups: [
    { name: "hero", title: "Hero & card", default: true },
    { name: "sections", title: "Page sections" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Slug (URL: /apps/<slug>)",
      type: "slug",
      options: { source: "name.en" },
      validation: (r) => r.required(),
      group: "hero",
    }),
    { ...locString("name", "App name"), group: "hero" },
    { ...locString("kicker", "Kicker (hero eyebrow, e.g. iOS · Productivity)"), group: "hero" },
    { ...locString("heroH1", "Hero headline"), group: "hero" },
    { ...locString("heroH1Accent", "Hero headline accent (italic serif part)"), group: "hero" },
    { ...locText("heroSubtitle", "Hero subtitle"), group: "hero" },
    defineField({
      name: "appStoreUrl",
      title: "App Store URL",
      type: "url",
      group: "hero",
    }),
    defineField({
      name: "icon",
      title: "App icon",
      type: "image",
      options: { hotspot: true },
      group: "hero",
    }),
    { ...locText("cardDescription", "Landing card description"), group: "hero" },
    {
      ...defineField({
        name: "cardChips",
        title: "Landing card chips (short feature tags)",
        type: "array",
        of: [defineArrayMember(locString("label", "Label"))],
      }),
      group: "hero",
    },
    defineField({
      name: "sections",
      title: "Page sections (drag to reorder, remove to hide)",
      type: "array",
      group: "sections",
      of: [
        howItWorksSection,
        statSection,
        featuresSection,
        articlesSection,
        testimonialsSection,
        faqSection,
        ctaSection,
      ],
    }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "slug.current" },
  },
});
