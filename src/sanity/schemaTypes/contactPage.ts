import { defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";
import { locString, locText } from "./fields";

const ACCENT_HINT = "Wrap any part in *asterisks* to render it in italic serif.";

// Singleton: the Contact page header. The form labels stay in messages/*.json.
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    locString("heroEyebrow", "Eyebrow"),
    locString("heroHeading", "Headline", ACCENT_HINT),
    locText("heroIntro", "Intro"),
  ],
  preview: {
    select: { title: "_type" },
    prepare: () => ({ title: "Contact page" }),
  },
});
