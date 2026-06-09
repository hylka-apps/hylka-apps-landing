# HANDOFF.md — Hylka Apps prototype

Interactive, multi-page marketing-site prototype for **Hylka Apps**, built to spec from
`DESIGN.md` (visual system), `STRUCTURE.md` (page structure) and `CONTENT.md` (mock copy).
Visual language is the locked **Paste / Apple-style light theme** (no dark variant, Eney
design system intentionally not used per the brief).

---

## 1. Page / route map

| Page | Prototype file | Production route | Notes |
|------|----------------|------------------|-------|
| Landing | `index.html` | `/{locale}/` | Hero + 1-card apps grid + closing CTA |
| Product (template) | `focusly.html` | `/{locale}/apps/{slug}` | Data-driven template, built for Focusly |
| More | `more.html` | `/{locale}/more` | Index / link blocks |
| About | `about.html` | `/{locale}/about` | Story + values + CTA |
| Contact | `contact.html` | `/{locale}/contact` | Two-intent form + modal variant |
| Terms | `terms.html` | `/{locale}/terms` | Markdown-rendered |
| Privacy | `privacy.html` | `/{locale}/privacy` | Markdown-rendered |
| Variations | `Variations.html` | — (design artifact) | Hero / card / band explorations |

---

## 2. Component breakdown

Shared chrome is injected by `site.js` into `#site-header` / `#site-footer` placeholders so
every page stays identical:

- **Header** — sticky, translucent + `backdrop-blur`, brand mark + wordmark, centre nav,
  language switcher (dropdown), primary "Get the App" pill, hamburger → mobile drawer.
- **Footer** — dark `#0D0D0D`, 3 link columns (Apps / Company / Legal, no social) + email.
- **Contact modal** — appended once per page; opened by any `[data-open-contact]` element.
- **Reusable form** — `HILKA.contactFormHTML(idPrefix)` builds the intent tabs + form;
  `HILKA.wireContactForm(scope)` wires tabs, char counter, validation, honeypot, submit.
- **Markdown renderer** — `HILKA.renderMarkdown(md)` → `{ html, toc }`; used by `doc-render.js`.

Reusable CSS components in `styles.css`: `.btn` (primary/secondary/ghost + sizes),
`.appstore` badge, `.card` / `.app-card`, `.info-card`, `.phone` mockup, `.eyebrow`
(+ accent modifiers), `.faq-item`, `.quote-card`, `.cta-band`, `.intent` + `.form`, `.modal`,
`.markdown` + `.toc`.

### Product-page template flags
Sections **2, 3, 5, 7, 11, 13 are always present**; **4, 6, 8, 9, 10, 12 are optional**.
For Focusly: 4 (interactive try), 6 (stat band), 10 (articles), 12 (testimonials) are **ON**;
8 (showcase gallery) and 9 (related grid) are **OFF**. In the build, drive these from the
per-app content record.

---

## 3. Implementation notes for the engineering build (stack TBD)

- **Eyebrow accents rotate per section** via `.eyebrow.{green|coral|blue|orange|purple}`.
- **i18n** — prototype uses a `?lang=uk` query param + `data-i18n` keys in `i18n.js`, with
  automatic **EN fallback** (missing UK key keeps the EN text in the HTML). UK currently
  ships header + landing-hero + footer strings (per CONTENT.md); the rest falls back to EN.
  - **Production:** use locale-prefixed paths (`/en/...`, `/uk/...`) with the framework's
    i18n lib (next-intl / astro-i18n / @nuxtjs/i18n). The switcher must preserve the path.
- **Contact form** — client validation + honeypot (`name="company"`) are in place; submit is
  simulated. Wire to a real endpoint/form service delivering to the feedback email
  (mock `hello@hylkaapps.com`). Keep the honeypot; do **not** add a user-solved CAPTCHA.
- **Content without redeploy** — app listings + product-page content should come from an
  external source (headless CMS / hosted JSON-MD). The product template is already
  structured for data-driven rendering with the optional-section flags above.
- **Markdown docs** — Terms/Privacy source lives in an inline `<script type="text/markdown">`;
  in production load from the content source and render with the same (or a fuller) renderer.

---

## 4. Placeholders to replace before launch
- **Focusly** → real product: name, app icon, real screenshots (replace `.phone`/gradient
  placeholders), descriptions, real App Store URL (currently `id000000000`).
- Mock email `hello@hylkaapps.com` → real feedback address.
- "Hylka Apps" logo mark (currently a CSS gradient "H" tile).
- Final Terms / Privacy legal text.
- App Store badge is a CSS reproduction — swap for the official downloadable badge asset.

## 5. Responsive
- Mobile `<768px` (single column, hamburger), tablet `768–1024px` (2-col), desktop `>1024px`
  (full grids; nav appears `≥920px`). Content max-width 1200px; document pages 760px.
