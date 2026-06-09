# Hylka Apps — Landing

Marketing website for **Hylka Apps**, an indie iOS studio.

## Stack

**Next.js** · **Sanity** (CMS) · **next-intl** (i18n: EN + UK) · **Vercel** (hosting) · **Cloudflare** (DNS + email routing)

## Repository structure

```
docs/          — design specifications
prototype/     — HTML/CSS prototype (design reference)
src/           — app source
public/        — static assets
```

### Design docs
- **[docs/DESIGN.md](docs/DESIGN.md)** — visual design system: typography, colors, components, header/footer.
- **[docs/STRUCTURE.md](docs/STRUCTURE.md)** — page-by-page structure for every page.
- **[docs/CONTENT.md](docs/CONTENT.md)** — example copy (mock product "Focusly", to be replaced via CMS).
- **[docs/HANDOFF-PROMPT.md](docs/HANDOFF-PROMPT.md)** — brief for the design/prototyping phase.
- **[prototype/HANDOFF.md](prototype/HANDOFF.md)** — component breakdown and implementation notes from the prototype.

## Key decisions

- Light, Apple-style visual system; apps-grid landing page + per-app product pages.
- Languages: **English** (default) and **Ukrainian**.
- One app at launch; content editable via Sanity CMS (no redeploy needed).
- No social media.

## Status

Implementation — Next.js project initialised. Spec docs reviewed; prototype in `prototype/`.
