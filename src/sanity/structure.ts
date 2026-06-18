import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  HomeIcon,
  TagIcon,
  UsersIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
} from "@sanity/icons";

// The single existing Brand document — pinned so it opens directly.
const BRAND_DOC_ID = "a056b365-4af3-4f0d-b613-fd8a375822a4";

// Top level: Apps (drag-to-reorder), the "Site content" folder (the page
// singletons + Legal documents), a divider, then Brand.
export const structure: StructureResolver = (S, context) => {
  const page = (id: string, title: string, icon: typeof HomeIcon) =>
    S.listItem()
      .title(title)
      .id(id)
      .icon(icon)
      .child(S.document().schemaType(id).documentId(id).title(title));

  return S.list()
    .title("Content")
    .items([
      orderableDocumentListDeskItem({
        type: "app",
        title: "Apps",
        S,
        context,
      }),
      S.listItem()
        .title("Site content")
        .child(
          S.list()
            .title("Site content")
            .items([
              page("homeContent", "Home page", HomeIcon),
              page("morePage", "More page", EllipsisHorizontalIcon),
              page("aboutPage", "About page", UsersIcon),
              page("contactPage", "Contact page", EnvelopeIcon),
              S.documentTypeListItem("legalDoc").title("Legal documents"),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Brand")
        .id("brand")
        .icon(TagIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId(BRAND_DOC_ID)
            .title("Brand")
        ),
    ]);
};
