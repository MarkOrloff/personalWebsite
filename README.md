# mark orloff — website

sleek, modular astro site deployed to netlify.

## quick start

1. install deps
   - `npm install`
2. start dev server
   - `npm run dev`
3. build
   - `npm run build`

## structure

- `src/data/navigation.ts`: single source of truth for the nav items
- `src/data/site.ts`: site metadata (title, description, email, social)
- `src/styles/tokens.css`: design tokens (colors, spacing, typography)
- `src/styles/global.css`: base styles (lowercase utilities)
- `src/layouts/*`: shared page shells
- `src/components/*`: ui components
- `src/content/{publications,projects}`: markdown collections
- `public/`: static assets (`favicon.svg`, `og-image.png`, `cv.pdf`, `robots.txt`)

## editing guide

- add/edit nav items in `src/data/navigation.ts`
- update site metadata in `src/data/site.ts`
- create/edit pages in `src/pages/`
- add items:
  - publications → `src/content/publications/*.md`
  - projects → `src/content/projects/*.md`

## capitalization policy

- default: all text renders lowercase via `.lowercase-all`
- exceptions: wrap proper nouns in `.preserve-case`
- name rule:
  - alone → `mark orloff`
  - with co-authors → `Mark Orloff`
  - helper available: `renderName('solo' | 'with-others')`

## deployment (netlify)

- `netlify.toml` is configured (`astro build` → `dist/`)
- sitemap via `@netlify/plugin-sitemap`
- connect your repo to netlify, set the domain to `markorloff.com`

## replacing assets

- replace `public/og-image.png` with a 1200×630 png
- replace `public/headshot.png` with your headshot
- replace `public/cv.pdf` with your cv

## notes

- collections are defined in `src/content/config.ts`
- publications and projects pages auto-list from collections

