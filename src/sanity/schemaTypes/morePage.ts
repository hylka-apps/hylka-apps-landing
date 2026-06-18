import { defineType } from "sanity";
import { EllipsisHorizontalIcon } from "@sanity/icons";
import { locString, locText, ACCENT_HINT } from "./fields";

// Singleton: the More page header. The link sections stay in messages/*.json.
export const morePage = defineType({
  name: "morePage",
  title: "More page",
  type: "document",
  icon: EllipsisHorizontalIcon,
  fields: [
    locString("heroEyebrow", "Eyebrow"),
    locString("heroHeading", "Headline", ACCENT_HINT),
    locText("heroIntro", "Intro"),
  ],
  preview: {
    select: { title: "_type" },
    prepare: () => ({ title: "More page" }),
  },
});
