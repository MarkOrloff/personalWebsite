# Brain explorer and 3D brain maps

The explorer now lives in the main website draft (`/Users/markorloff/repos/personalWebsite`, branch `work/website-redesign`) at `/brain-explorer`. It is not linked from the navigation or the research page yet. The earlier prototype worktree (`experiment/brain-explorer`, `/Users/markorloff/Documents/Codex/2026-09-08/we-n/work/brain-explorer-site`) is kept for reference only; edit the main draft.

The same renderer draws the interactive group maps in the subjective-value walkthrough (`/publications/subjective-value`, brain panel and "the details" tab).

## Code

- `src/scripts/brain-viewer.ts`: reusable WebGL viewer. `BrainViewElement` is a base custom element that loads one or both hemispheres, places them in a shared frame, and handles drag/arrow-key rotation, zoom (buttons, +/−, ctrl+wheel/pinch, 100–300%), "0" to reset, see-through rendering (`SEE_THROUGH_ALPHA`; the explorer always uses it, the map never does), orientation labels, lazy loading (`data-lazy`), and the left/right/both buttons (`data-hemisphere-choice`). Subclasses fill per-vertex attributes:
  - `src/scripts/brain-explorer.ts` → `<brain-explorer>`: anatomical region highlights.
  - `src/scripts/brain-map.ts` → `<brain-map>`: a thresholded statistical overlay with a two-color ramp (lighter = stronger). Used through `src/components/BrainMap.astro`.
- `src/lib/brain-geometry.mjs`: pure, tested helpers (rotation, mirror views, view names, shared frame, overlay levels, region centers, normals).
- `src/data/brain-explorer.ts`: region list, colors and default cameras. `src/data/brain-evidence.ts` (`subjective-value.map`): map files, colors, and default views for the walkthrough.
- UI colors use `src/styles/tokens.css` custom properties. Region and overlay colors are data constants.
- All visible text and accessible labels are in `content/walkthrough-copy.md`: `explorer.*` (explorer and shared viewer labels), `brain-map.*` and `value-brain.*` (walkthrough map).

## Reader experience: explorer

- The same folded cortical surface in every view; region changes never inflate or morph it.
- vmPFC, hippocampus, entorhinal cortex, anterior cingulate cortex, and anterior insula.
- Only the selected region has color. Other named cortical regions and hippocampus stay gray, including when transparency reveals them together.
- The surface is always see-through (cortex drawn at 36% opacity, up from the prototype's 28%), so buried regions such as the hippocampus and insula stay findable without changing the brain's shape. The earlier toggle and its notes were removed at Mark's request; one caption line explains the faded surface.
- Zoom from 100% to 300% brings the selected region toward the center. Drag or arrow keys rotate. The head locator, orientation sentence, and rotating front/back/top labels give context.
- **Halves of the brain.** Left half is the default; the cameras match the prototype (renders were pixel-identical before the see-through and ACC changes). Right half mirrors every region's camera (yaw → π − yaw). Both halves show the two hemispheres in their true relative position; each region then has its own `both` camera:
  - vmPFC, anterior cingulate, hippocampus: front view, so the left and right regions sit side by side. vmPFC and ACC (`midline: true`) add one sentence explaining that they line the inner face of each half.
  - entorhinal: view from below (both ECs face the viewer).
  - anterior insula: from the left side (as in the left half).
  - The "look inside / look outside" buttons become "from the left / from the right" with both halves. A "below" viewpoint name (pitch < −0.45) adds an orientation sentence for views from underneath.
- Source links stay out of the visitor-facing footer at Mark's request; attribution and licenses are here and in the provenance files.

## Reader experience: subjective-value brain panel

- The 3D map replaces the cropped figure in the brain panel (story step 9 and "the details"). Buttons switch between the **grid-like code** (NeuroVault image 1009070, green ramp sampled from figure 3) and the **2D positional code** (image 1009072, violet ramp). The original cropped figure and its caption sit behind "see the original figure"; the existing "complete brain-data figure" link is unchanged.
- Each map opens on the half where both its entorhinal-area and medial prefrontal results reach the cortical surface, viewed from the inner side and tilted to show the underside: grid-like → left half; positional → right half. Toggling maps follows each map's default until the visitor rotates, zooms or picks a half; "reset view" returns to the current map's default.
- The map downloads only when the panel scrolls near the screen, and fetches only the hemispheres shown.
- Caption: the group map on a standard surface, shown at P < 0.01 uncorrected for display only; the paper's tests are corrected within independently defined regions.

## Anatomy and definitions

Cortex: FreeSurfer **fsaverage5**, both hemispheres, distributed with [Nilearn](https://nilearn.github.io/stable/modules/generated/nilearn.datasets.fetch_surf_fsaverage.html): 10,242 vertices and 20,480 triangles each. Source pial coordinates and topology exactly match the FreeSurfer reference pial in each hemisphere.

Masks are identical definitions in both hemispheres (Destrieux indices refer to the annotation used here):

| Region | Definition | Left | Right |
| --- | --- | ---: | ---: |
| vmPFC | Destrieux rectus (31), subcallosal (32), medial orbital/olfactory sulcus (64), suborbital sulcus (71), and anterior cingulate (6) below surface-RAS z = 10 mm. Illustrative; includes medial orbital cortex. | 261 | 259 |
| Anterior cingulate | Destrieux 7 (`G_and_S_cingul-Mid-Ant`) plus the dorsal part of Destrieux 6 (`G_and_S_cingul-Ant`): its vertices that Desikan–Killiany labels `superiorfrontal` or `caudalanteriorcingulate`. This drops the pregenual/subgenual wrap around the genu (DK `rostralanteriorcingulate` and `medialorbitofrontal`). Was all of 6 + 7 (285 / 332); see [brain-atlas-review.md](brain-atlas-review.md). | 190 | 236 |
| Anterior insula | Short insular gyri (18) + anterior circular sulcus (48). | 107 | 107 |
| EC | Desikan–Killiany entorhinal parcel (unchanged; see [brain-atlas-review.md](brain-atlas-review.md)). | 48 | 42 |
| HC | fsaverage5 `aseg.mgz` label 17 (left) / 53 (right); Gaussian σ 0.65 voxel, marching cubes at 0.5; display smoothing only. | 3,646 vertices | 3,616 vertices |

Each hemisphere asset is centered on its own pial bounding box and scaled by 0.6 × its largest extent; `frame.center` and `frame.scale` recover surface RAS. One hemisphere is drawn in its own frame (so the left view is unchanged); two share the frame of their combined bounding box. HC uses `vox2ras_tkr` and the same hemisphere transform; it is never centered separately.

Only the folded pial surface is shipped. The unused inflated coordinates from the first prototype were removed from the left asset, the export script, provenance and tests (Mark doesn't want inflated views). Apart from the trimmed ACC mask, the left definitions (pial, faces, sulc, labels, other masks, hippocampus) are unchanged.

## Group maps (subjective value)

Sources: NeuroVault collection [21751](https://neurovault.org/collections/21751/) (Orloff et al., bioRxiv 2026), group T maps with df = 34 (35 participants), MNI152NLin2009cAsym, 3 mm voxels (`sform_code` 2, RAS, diagonal affine).

Projection (`scripts/project-brain-maps.py`):

1. fsaverage5 white and pial surfaces (Nilearn) are MNI305 coordinates. They are moved to MNI152 with FreeSurfer's linear MNI305→MNI152 matrix ([CoordinateSystems](https://surfer.nmr.mgh.harvard.edu/fswiki/CoordinateSystems), item 8). Residual nonlinear template differences remain (a few mm).
2. Each vertex samples the t map with trilinear interpolation at 7 evenly spaced depths from white to pial (`scipy.ndimage.map_coordinates`, order 1; voxels outside the image read as 0); the mean is kept.
3. Destrieux `Medial_wall` vertices are set to 0.
4. Display threshold: one-sided P < 0.01, uncorrected, t > `scipy.stats.t.isf(0.01, 34)` = **2.4411496**. Positive values only.
5. Stored as `round(t × 100)` per vertex (0 = not shown) in `public/brains/overlays/neurovault-<id>.json`, with display maxima 3.76 (grid-like) and 4.27 (positional).

Sanity checks (recorded in `public/brains/overlays/provenance.json`):

- Grid-like map, volume: a right medial temporal cluster (25 voxels, peak t = 3.51 at MNI [32.5, −18.5, −24.5], spanning down to z = −33.5) whose nearest voxel is about 3 mm from the paper's right-EC peak [30, −16, −36] (the map reads t = 2.42 exactly at that peak); a left ventromedial prefrontal cluster (20 voxels, peak t = 2.85 at [−9.5, 38.5, −9.5]) about 4 mm from the paper's mPFC peak [−6, 36, −10]. Also left MTL (peak 4.28) and a right vmPFC cluster that lies in white matter.
- Grid-like map, surface: left vmPFC mask 13 vertices (mOFC/rostral ACC); right parahippocampal gyrus 8 vertices, 3.3 mm from the right DK entorhinal parcel (fsaverage's DK EC lies just anterior to the cluster); left parahippocampal/EC 13 vertices.
- Positional map: volume peaks [26.5, 5.5, −39.5], [14.5, 38.5, 14.5], [−36.5, 2.5, −36.5] match the paper's reported right EC, mPFC and left EC peaks ([26, 6, −40], [14, 38, 14], [−34, 2, −36]) to within 3 mm. Surface: right EC 10 vertices, right anterior cingulate (trimmed mask) 17.
- The uncorrected whole-brain maps also show smaller spots elsewhere (e.g., supramarginal, precuneus, occipital). The caption calls the threshold display-only.

## Downloads and rebuilding

Source files live outside `public/`: anatomy in `/Users/markorloff/Documents/Codex/2026-09-08/we-n/work/brain-source/`, maps (plus the NeuroVault API responses) in `.../work/neurovault-21751/`. URLs, sizes and SHA-256 hashes are in `public/brains/provenance.json` and `public/brains/overlays/provenance.json`. Keep the Nilearn license file with the source files.

The system `python3` (3.9) cannot load the compiled packages in `brain-tools`; use the Python 3.12 runtime that built them:

```sh
PY=/Users/markorloff/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
W=/Users/markorloff/Documents/Codex/2026-09-08/we-n/work
PYTHONPATH=$W/brain-tools $PY -P scripts/export-brain-surface.py $W/brain-source
PYTHONPATH=$W/brain-tools $PY -P scripts/project-brain-maps.py $W/brain-source $W/neurovault-21751
```

Re-running reproduces the committed assets byte-for-byte.

Asset sizes (raw / gzip -9): `fsaverage5-left.json` 1.35 MB / 432 KB; `fsaverage5-right.json` 1.36 MB / 432 KB; each overlay 41 KB / 0.7–1.2 KB. Netlify compresses JSON.

## Verification

`npm test` (`tests/brain-surface.test.mjs`) covers, for both hemispheres: closed spherical geometry, vertex counts, provenance hashes, region definitions, hippocampus side and winding; the trimmed ACC (all of Destrieux 7, roughly half of 6, none of the subgenual part); documented mask sizes and no inflated data; shared-frame placement; mirrored right-half views; and, for both overlays, vertex counts, threshold, finite positive values, blank medial wall, and the entorhinal-area / medial prefrontal sanity checks. Browser review covers region selection in all three halves, the always-on see-through surface, zoom/reset/keyboard, map toggle and rotation, desktop and 375 px layouts, and console errors.
