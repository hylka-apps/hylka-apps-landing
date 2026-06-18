// One-off demo seeder: fills the new CMS fields with sample data so the
// effect is visible end-to-end. Safe to re-run (patches are idempotent).
//   node --env-file=.env.local scripts/seed-cms-demo.mjs
import { createClient } from "@sanity/client";
import { LexoRank } from "lexorank";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const color = (hex) => ({ _type: "color", hex, alpha: 1 });
const loc = (en, uk) => ({ en, uk });
const key = (k) => k;

// ── per-app demo content (accent + hero phone mockup) ──────────────────
const APP_DEMO = {
  focusly: {
    accent: "#0A84FF",
    mockup: {
      screenLabel: loc("Deep work", "Глибока робота"),
      screenValue: loc("24:00", "24:00"),
      screenSub: loc("Session · in flow", "Сесія · у потоці"),
      floats: [
        { label: loc("🔥 Streak", "🔥 Серія"), value: loc("12 days", "12 днів"), accent: "#9B4DEB" },
        { label: loc("⏱ Today", "⏱ Сьогодні"), value: loc("3h 40m", "3 год 40 хв"), accent: "#19B559" },
      ],
    },
  },
  arttick: {
    accent: "#7C5CFF",
    mockup: {
      screenLabel: loc("Today", "Сьогодні"),
      screenValue: loc("6", "6"),
      screenSub: loc("sketches done", "ескізів зроблено"),
      floats: [
        { label: loc("🎨 Streak", "🎨 Серія"), value: loc("9 days", "9 днів"), accent: "#FF8A33" },
        { label: loc("🖼 Saved", "🖼 Збережено"), value: loc("240", "240"), accent: "#E0544B" },
      ],
    },
  },
};

async function seedApps() {
  const apps = await client.fetch(
    `*[_type=="app" && !(_id in path("drafts.**"))]{_id,"slug":slug.current}`
  );
  let rank = LexoRank.middle();
  // Stable order: focusly first, then the rest alphabetically.
  apps.sort((a, b) =>
    a.slug === "focusly" ? -1 : b.slug === "focusly" ? 1 : a.slug.localeCompare(b.slug)
  );
  for (const app of apps) {
    const demo = APP_DEMO[app.slug];
    const patch = { orderRank: rank.toString() };
    if (demo) {
      patch.accentColor = color(demo.accent);
      patch.heroMockup = {
        screenLabel: demo.mockup.screenLabel,
        screenValue: demo.mockup.screenValue,
        screenSub: demo.mockup.screenSub,
        floats: demo.mockup.floats.map((f, i) => ({
          _key: key(`float-${i}`),
          label: f.label,
          value: f.value,
          accentColor: color(f.accent),
        })),
      };
    }
    await client.patch(app._id).set(patch).commit();
    console.log(`app ${app.slug} ← rank ${patch.orderRank}${demo ? " + accent + mockup" : ""}`);
    rank = rank.genNext();
  }
}

async function seedSiteSettings() {
  const ss = await client.fetch(`*[_type=="siteSettings" && !(_id in path("drafts.**"))][0]{_id}`);
  if (!ss?._id) return console.log("no siteSettings doc");
  await client
    .patch(ss._id)
    .set({
      heroEyebrow: loc("Indie iOS studio", "Інді iOS студія"),
      heroHeading: loc("Small apps, made with", "Маленькі застосунки, зроблені з"),
      heroHeadingAccent: loc("care.", "турботою."),
      heroSub: loc(
        "Hylka Apps builds focused, beautifully simple iOS apps that do one thing well — no clutter, no noise.",
        "Hylka Apps створює прості й продумані iOS-застосунки, що роблять одну справу добре — без зайвого та без шуму."
      ),
      heroPlates: [
        { _key: "p0", label: loc("Deep work", "Глибока робота"), sub: loc("Session · in flow", "Сесія · у потоці"), value: loc("24:00", "24:00"), accentColor: color("#0A84FF") },
        { _key: "p1", label: loc("This week", "Цей тиждень"), sub: loc("+38% focus", "+38% фокусу"), accentColor: color("#9B4DEB") },
        { _key: "p2", label: loc("Focus sounds", "Звуки фокусу"), sub: loc("Rainfall · 🎧", "Дощ · 🎧"), accentColor: color("#19B559") },
        { _key: "p3", value: loc("⏱️", "⏱️"), accentColor: color("#FF8A33") },
      ],
      teaserKicker: loc("In the works", "У роботі"),
      teaserName: loc("The next one is taking shape.", "Наступний уже народжується."),
      teaserDesc: loc(
        "We build slowly and deliberately — one focused app at a time. Something new is on the workbench. Be the first to know when it lands.",
        "Ми будуємо повільно й виважено — по одному застосунку. Дещо нове вже на верстаті. Дізнайся першою, коли він вийде."
      ),
    })
    .commit();
  console.log("siteSettings ← hero + plates + teaser");
}

async function seedLegal() {
  const docs = await client.fetch(
    `*[_type=="legalDoc" && !(_id in path("drafts.**"))]{_id,docType,"slug":slug.current}`
  );
  const TITLES = {
    terms: loc("Terms of Use", "Умови використання"),
    privacy: loc("Privacy Policy", "Політика конфіденційності"),
  };
  for (const d of docs) {
    const slug = d.slug || d.docType; // migrate from docType
    if (!slug) continue;
    await client
      .patch(d._id)
      .set({ slug: { _type: "slug", current: slug }, title: TITLES[slug] ?? loc(slug, slug) })
      .unset(["docType"])
      .commit();
    console.log(`legal ${d._id} ← slug "${slug}" + title`);
  }
}

(async () => {
  await seedApps();
  await seedSiteSettings();
  await seedLegal();
  console.log("✓ demo seed complete");
})().catch((e) => {
  console.error("seed failed:", e.message);
  process.exit(1);
});
