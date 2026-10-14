# Atlas review — 12 October 2026

This review was written in the prototype worktree. The explorer now lives in the main website draft; see [brain-explorer.md](brain-explorer.md). The same definitions now apply to both hemispheres (right-hemisphere counts are in that file and in `public/brains/provenance.json`). The EC boundary is unchanged: both hemispheres still use the Desikan–Killiany entorhinal parcel.

## Anterior cingulate

**Update (after the move to the main draft): trimmed to roughly half of parcel 6.** Mark asked whether a parcel cuts the added anterior parcel "in half-ish". Destrieux has no sub-parcel. Desikan–Killiany `caudalanteriorcingulate` overlaps parcel 6 by only 9 of 167 vertices (left) and 11 of 191 (right), so "aMCC + (6 ∩ DK caudal ACC)" would be nearly aMCC alone. But DK splits parcel 6 cleanly:

| Parcel 6 vertices labeled by DK as | Left | Right | Where |
| --- | ---: | ---: | --- |
| rostralanteriorcingulate | 68 | 48 | pregenual, around the genu (mean z ≈ 0 mm) |
| medialorbitofrontal | 27 | 47 | subgenual (z < 0) |
| superiorfrontal | 63 | 84 | dorsal bank above it (mean z ≈ 17 mm) |
| caudalanteriorcingulate | 9 | 11 | dorsal (z ≈ 20 mm) |

The entry now keeps Destrieux 7 plus the parcel-6 vertices DK calls superiorfrontal or caudalanteriorcingulate: 72 of 167 (43%) left, 95 of 191 (50%) right, one connected patch with aMCC. ACC totals: 285 → 190 (left), 332 → 236 (right). A geometric cut (parcel 6 above surface-RAS z = 10 mm) gives almost the same shape (68 / 80 kept) but is less principled, so the atlas-based version is used. Most of the dropped part (the parcel-6 vertices below z = 10 mm) still appears in gray as context through the vmPFC mask.

The original note follows.

The parcel immediately anterior to Destrieux `G_and_S_cingul-Mid-Ant` (7, aMCC) is `G_and_S_cingul-Ant` (6, ACC). The anterior parcel wraps around the genu and includes ventral territory; adding all of it would be misleading under an exclusively dACC label. At the user's request, the prototype now combines both under **anterior cingulate cortex** (285 left and 332 right fsaverage5 vertices).

[Destrieux et al. 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2937159/) describes the ACC/aMCC split and its anatomical boundaries. Numeric indices above refer to the names in the actual annotation used here; they must not be interchanged blindly with table numbers or other annotation versions.

## Anterior insula

The implemented guide combines the short insular gyri and anterior circular sulcus, and excludes the long gyri and full superior/inferior circular sulci. The central insular sulcus separates the anterior short gyri from posterior long gyri. The gray folded surface now becomes transparent to show this territory instead of inflating the whole brain.

Sources: [Destrieux et al. 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2937159/), [Description of sulcal organization of the insular cortex](https://pubmed.ncbi.nlm.nih.gov/19997920/).

## FreeSurfer EC choices

[FreeSurfer's EC documentation](https://surfer.nmr.mgh.harvard.edu/fswiki/Entorhinal) distinguishes two definitions:

1. The ordinary `aparc` / Desikan–Killiany entorhinal parcel. This is the current definition.
2. The cytoarchitectonically informed ex-vivo label, based on Fischl et al. 2009. `lh.entorhinal_exvivo.label` carries probability-like scalar values; `lh.entorhinal_exvivo.thresh.label` is a thresholded region suitable for an outline. The thresholded version is supplied by FreeSurfer; no custom threshold was applied during this comparison.

The detailed files were downloaded from the [official fsaverage distribution](https://www.freesurfer.net/pub/dist/freesurfer/tutorial_versions_centos6/freesurfer/subjects/fsaverage/), `label/` and `surf/`, into `/Users/markorloff/Documents/Codex/2026-09-08/we-n/work/brain-source/fsaverage/` (left hemisphere only so far). This is an inspection-only source directory, not a visitor download.

| Definition | Vertices in the inspected template |
| --- | ---: |
| Current DK EC on fsaverage5 | 48 |
| DK EC on full fsaverage | 1,102 |
| Thresholded ex-vivo EC on full fsaverage | 470 |
| Unthresholded ex-vivo EC on full fsaverage | 1,290 |

Only 292 vertices overlap between the full-resolution DK and thresholded ex-vivo definitions. Thus switching labels is a substantive anatomical change, separate from improving visual resolution. These counts are not measures of anatomical accuracy or tissue volume.

## Matching detail to hippocampus

A useful future rendering is an EC cortical ribbon from matching detailed pial and white surfaces, retaining actual cortical thickness. Merely subdividing the existing 48-vertex patch would add polygons without recovering anatomy. The same distinction applies to simply zooming in.

The full fsaverage pial has 163,842 vertices. Its coordinates do not exactly match the existing fsaverage5 surface: the largest nearest-vertex distance in the inspected pair was about 3.25 mm. Both use surface RAS, but importing a detailed EC patch into the current low-resolution cortex without checking alignment could create visible offsets. A coherent upgrade should use matching cortical geometry/registration and verify its relationship to the hippocampus.

The visitor-facing EC asset remains unchanged in this pass. The research supports comparing the thresholded ex-vivo definition with the current DK definition before choosing a new boundary, then upgrading the geometry consistently. The current source and proposed alternatives remain traceable in documentation even though footer references were removed.
