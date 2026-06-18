/**
 * One-off: move homepage content fields out of the old `siteSettings` (Brand)
 * document into the new `homeContent` (Site content) singleton, so nothing you
 * already filled in is lost after the split.
 *
 * Run once:
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/migrate-home-content.mjs
 *
 * Idempotent — safe to re-run (it overwrites the homeContent doc each time).
 */
import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!token) throw new Error("Set SANITY_WRITE_TOKEN (an editor/deploy token)");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const FIELDS = [
  "heroEyebrow",
  "heroHeading",
  "heroSub",
  "heroPlates",
  "appsEyebrow",
  "appsHeading",
  "teaserKicker",
  "teaserName",
  "teaserDesc",
  "ctaHeading",
  "ctaSub",
];

const src = await client.fetch(
  `*[_type == "siteSettings"][0]{${FIELDS.join(", ")}}`
);

if (!src) {
  console.log("No siteSettings document found — nothing to migrate.");
  process.exit(0);
}

const doc = { _id: "homeContent", _type: "homeContent", ...src };
await client.createOrReplace(doc);

console.log(
  "Migrated to homeContent:",
  Object.keys(src).filter((k) => src[k] != null)
);
