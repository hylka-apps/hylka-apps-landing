import { defineType } from "sanity";
import { EllipsisHorizontalIcon } from "@sanity/icons";
import { locString, locText } from "./fields";

const ACCENT_HINT = "Wrap any part in *asterisks* to render it in italic serif.";

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
