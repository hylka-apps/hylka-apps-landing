// One-off migration: move current Focusly content from messages/*.json into the
// Sanity `app` document so the new CMS-driven /apps/[slug] page renders fully.
// Run once:  node --env-file=.env.local scripts/seed-focusly.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const en = JSON.parse(readFileSync(new URL("../messages/en.json", import.meta.url)));
const uk = JSON.parse(readFileSync(new URL("../messages/uk.json", import.meta.url)));

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN (run with: node --env-file=.env.local scripts/seed-focusly.mjs)");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9ezzi55t",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const fe = en.focusly;
const fu = uk.focusly;
const he = en.home.apps.focusly;
const hu = uk.home.apps.focusly;

const L = (e, u) => ({ en: e ?? "", uk: u ?? "" });
const splitSerif = (s) => {
  const m = String(s).match(/^([\s\S]*?)<serif>([\s\S]*?)<\/serif>/);
  return m ? { main: m[1].trim(), accent: m[2].trim() } : { main: String(s ?? ""), accent: "" };
};
const zip = (e = [], u = [], fn) => e.map((item, i) => fn(item, u[i] || {}, i));

const h1en = splitSerif(fe.hero.h1);
const h1uk = splitSerif(fu.hero.h1);

const doc = {
  _type: "app",
  slug: { _type: "slug", current: "focusly" },
  name: L(he.name, hu.name),
  kicker: L(he.kicker, hu.kicker),
  heroH1: L(h1en.main, h1uk.main),
  heroH1Accent: L(h1en.accent, h1uk.accent),
  heroSubtitle: L(fe.hero.sub, fu.hero.sub),
  appStoreUrl: "https://apps.apple.com/app/id000000000",
  cardDescription: L(he.desc, hu.desc),
  cardChips: Object.keys(he.chips).map((key, i) => ({
    _key: `chip-${i}`,
    label: L(he.chips[key], hu.chips[key]),
  })),
  sections: [
    {
      _key: "howItWorks",
      _type: "howItWorksSection",
      eyebrow: L(fe.howItWorks.eyebrow, fu.howItWorks.eyebrow),
      heading: L(fe.howItWorks.h2, fu.howItWorks.h2),
      steps: zip(fe.howItWorks.steps, fu.howItWorks.steps, (e, u, i) => ({
        _key: `step-${i}`,
        label: L(e.label, u.label),
        title: L(e.title, u.title),
        desc: L(e.desc, u.desc),
      })),
    },
    {
      _key: "stat",
      _type: "statSection",
      number: fe.stat.number,
      label: L(fe.stat.label, fu.stat.label),
    },
    {
      _key: "features",
      _type: "featuresSection",
      eyebrow: L(fe.features.eyebrow, fu.features.eyebrow),
      heading: L(fe.features.h2, fu.features.h2),
      items: zip(fe.features.items, fu.features.items, (e, u, i) => ({
        _key: `feat-${i}`,
        icon: e.icon,
        title: L(e.title, u.title),
        desc: L(e.desc, u.desc),
      })),
    },
    {
      _key: "articles",
      _type: "articlesSection",
      eyebrow: L(fe.articles.eyebrow, fu.articles.eyebrow),
      heading: L(fe.articles.h2, fu.articles.h2),
      items: zip(fe.articles.items, fu.articles.items, (e, u, i) => ({
        _key: `art-${i}`,
        icon: e.icon,
        title: L(e.title, u.title),
        excerpt: L(e.excerpt, u.excerpt),
      })),
    },
    {
      _key: "testimonials",
      _type: "testimonialsSection",
      eyebrow: L(fe.testimonials.eyebrow, fu.testimonials.eyebrow),
      heading: L(fe.testimonials.h2, fu.testimonials.h2),
      items: zip(fe.testimonials.items, fu.testimonials.items, (e, u, i) => ({
        _key: `tst-${i}`,
        quote: L(e.quote, u.quote),
        name: e.name,
      })),
    },
    {
      _key: "faq",
      _type: "faqSection",
      eyebrow: L(fe.faq.eyebrow, fu.faq.eyebrow),
      heading: L(fe.faq.h2, fu.faq.h2),
      items: zip(fe.faq.items, fu.faq.items, (e, u, i) => ({
        _key: `faq-${i}`,
        q: L(e.q, u.q),
        a: L(e.a, u.a),
      })),
    },
    {
      _key: "cta",
      _type: "ctaSection",
      heading: L(fe.cta.h2, fu.cta.h2),
    },
  ],
};

const existingId = await client.fetch(`*[_type == "app" && slug.current == "focusly"][0]._id`);
const _id = existingId || "app-focusly";

await client.createOrReplace({ _id, ...doc });
console.log(`✓ Seeded Focusly into Sanity (_id: ${_id})`);
