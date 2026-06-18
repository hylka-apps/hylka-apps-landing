import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";
import { locString, locText, ACCENT_HINT } from "./fields";

// Singleton: the About page content. Empty fields fall back to messages/*.json.
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: UsersIcon,
  fieldsets: [
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    { name: "story", title: "Story", options: { collapsible: true, collapsed: true } },
    { name: "values", title: "Values", options: { collapsible: true, collapsed: true } },
    { name: "cta", title: "Closing CTA", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // ── Hero ──
    { ...locString("heroEyebrow", "Eyebrow"), fieldset: "hero" },
    { ...locString("heroHeading", "Headline", ACCENT_HINT), fieldset: "hero" },
    { ...locText("heroLead", "Lead"), fieldset: "hero" },

    // ── Story ──
    { ...locText("story", "Story"), fieldset: "story" },

    // ── Values ──
    { ...locString("valuesEyebrow", "Eyebrow"), fieldset: "values" },
    { ...locString("valuesHeading", "Heading"), fieldset: "values" },
    {
      ...defineField({
        name: "valueItems",
        title: "Value cards (up to 3 — icons are styled automatically)",
        type: "array",
        validation: (r) => r.max(3),
        of: [
          defineArrayMember({
            type: "object",
            fields: [locString("title", "Title"), locText("desc", "Description")],
            preview: { select: { title: "title.en", subtitle: "desc.en" } },
          }),
        ],
      }),
      fieldset: "values",
    },

    // ── Closing CTA ──
    { ...locString("ctaHeading", "Heading"), fieldset: "cta" },
    { ...locText("ctaSub", "Subtitle"), fieldset: "cta" },
    { ...locString("ctaLabel", "Button label"), fieldset: "cta" },
  ],
  preview: {
    select: { title: "_type" },
    prepare: () => ({ title: "About page" }),
  },
});
