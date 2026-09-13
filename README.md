# mark orloff — website

an editorial research site with a dark, lowercase visual style, built with astro
and configured for netlify deployment.

## quick start

1. install deps
   - `npm ci`
2. start dev server
   - `npm run dev`
3. build
   - `npm run build`
4. verify the publication data and plot geometry
   - `npm test`

## structure

- `src/data/navigation.ts`: single source of truth for the nav items
- `src/data/site.ts`: site metadata (title, description, email, social)
- `src/styles/tokens.css`: design tokens (colors, spacing, typography)
- `src/styles/global.css`: base styles (lowercase utilities)
- `src/layouts/*`: shared page shells
- `src/components/*`: ui components
- `src/components/SocialPlot.astro`: accessible, connected participant plots
- `src/pages/publications/social-conformity.astro`: participant-data walkthrough
- `src/data/paper-stories.ts`: PNAS, bioRxiv, and commentary walkthrough copy
- `src/components/PaperReader.astro`: shared publication-reader layout
- `src/lib/paper-plots.mjs`: empirical and illustrative plot geometry
- `src/data/social-conformity-story.ts`: tour and author-note copy
- `src/data/social-conformity.json`: published estimates and source provenance
- `docs/publication-reader.md`: data extraction, chart contract, and editing notes
- `src/content/{publications,projects}`: markdown collections
- `public/`: static assets (`favicon.svg`, `headshot.jpg`, `cv.pdf`, `robots.txt`)

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
  - lowercase brand → `mark orloff`
  - people in prose and co-authors → `Mark Orloff`, `Erie Boorman`, etc.
  - helper available: `renderName('solo' | 'with-others')`

## deployment (netlify)

- `netlify.toml` is configured (`astro build` → `dist/`)
- sitemap via `@netlify/plugin-sitemap`
- connect your repo to netlify, set the domain to `markorloff.com`

## replacing assets

- update `public/headshot.jpg` with your headshot; it also supplies social previews
- replace `public/cv.pdf` with the current cv, then remove the earlier-version notice in `src/pages/cv.astro`

## notes

- collections are defined in `src/content/config.ts`
- publications auto-list from the content collection
- publications can link to a reader with the optional `walkthrough` field
- the projects page links to real research code; add projects when ready
- dependency folders and generated output belong outside version control;
  `.gitignore` excludes new `node_modules`, `.astro`, and `dist` files

## Edit all website text in one document

Open [`content/walkthrough-copy.md`](content/walkthrough-copy.md). It supplies page
text, all five stories, game prompts and feedback, buttons, chart labels, captions,
image descriptions, and publication citations. Edit plain text inside the blocks;
keep marker IDs and `{{placeholders}}` intact. Saving refreshes `npm run dev`.
For a static preview, build and reload. No manual synchronization is required.

`src/lib/site-copy.mjs` reads the generated module. `scripts/generate-copy.mjs`
regenerates it for dev, test, and build; the Vite plugin also watches document edits.
Publication records keep stable URLs and data; `withPublicationCopy` supplies their
visible titles, authors, venues, and descriptions from the editing document.
Original figure images and the CV PDF contain their own embedded text.
