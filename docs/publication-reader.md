# Publication reader

The reader at `/publications/social-conformity` uses the existing navy, coral,
blue, and lowercase style. Editorial hierarchy and real data supply its visual
identity. No extra client framework or chart dependency is needed.

## Chart contract

- Question: how does estimated social following vary across participants and groups,
  and how does it relate to solo utility-model fit?
- Evidence: 44 participant posterior medians (28 comparison, 10 insula, 6 dACC),
  taken from the public source repository at commit
  `27620f1444434327dacb5216b69509bf923f877f`.
- Views: a grouped strip plot with means +/- SEM (Figure 3A), and a scatter plot
  of the same people against solo negative log likelihood (Figure 3D).
- The following-weight axis stays fixed at 0–1. Horizontal jitter has no
  scientific meaning. The scatter x axis is padded from the real data.
- One point is one participant's model estimate, not a trial or percentage of
  observed copying. Group means and SEM are computed without filtering.
- Selecting a group highlights it without removing the other participants.
  Direct group labels and group highlighting supplement color; individual dots use the group colors; means are grey circles drawn above them.
- All views share participant identity and a selected point. Motion conveys
  the same people changing x position; reduced-motion preference disables it.
- QA: real browser at desktop and mobile widths; tap, hover, keyboard controls,
  share links, back/forward, no-JavaScript fallback, and data invariants.

## Source details

Run `python3 scripts/extract-social-conformity.py /path/to/source` with NumPy
and SciPy to rebuild the checked-in JSON. Source files and SHA-256 hashes are
recorded inside the JSON. Website visitors only download the 44 plotted estimates.

The archived scripts use older figure numbering: `fig2.m` contains the following
panel and its relationship plot. Follow estimates come from the explicit
`medianPosteriorOmegaFollow_*` arrays. Solo likelihoods come from the explicit
group arrays used by `fig1.m`; the separate combined `log_lik` variable does not
match them. The paired group arrays reproduce r = 0.5226164885 (paper: 0.52).
The archive also repeats oppose estimates in the utility-panel branch of
`fig2.m`. That branch is not used by this reader. No statistical tests are rerun
or newly inferred by the browser.

## Editing

The author note and tour prose live in `src/data/social-conformity-story.ts`.
The “why i'm excited about it” note follows Mark's own explanation of the result and its possible relevance to unfamiliar decisions.
Publication metadata stays in the existing content collection. A `walkthrough`
field links a citation to its reader. Commentaries are explicitly labeled.

Reading depth, step, and chart view are shareable URL parameters. Reading controls
are progressive enhancements; core findings, source links, and a static plot
are available with JavaScript disabled.

## All-paper readers (September 2026 update)

`src/data/paper-stories.ts` supplies four more walkthroughs, rendered by
`PaperReader.astro` and `/publications/[slug].astro`:

- `/publications/safer-peers`: PNAS 2020, 78 real paired estimates from Figure 1B.
  `scripts/extract-peer-influence.py` exports only `OCUsafe_trans`,
  `OCUrisky_trans`, and their public study group. No participant identifiers,
  demographic fields, or other survey variables are exported. Source commit:
  `4e1da2673f3abfe952d0525c315b4ca7e804a172`. The neutral transformed value is 0.5;
  estimates are not observed copying rates. The displayed SEM is descriptive;
  the cited P values come from the paper's adjusted logistic regressions.
- `/publications/subjective-value`: bioRxiv v1, DOI
  `10.64898/2026.05.19.726239`, posted May 21, 2026. The 88-location geometry
  follows Figure 2A (ten probability and amount levels, excluding the six
  locations in each jointly low/high corner). Sliders demonstrate the Prelec
  probability-weighting and power-utility functions, normalized over the task
  range. The five-choice adaptation supplies a rough illustrative preference sketch;
  it is not a validated preference assessment or a participant fit. The figure asset is extracted directly
  from page 7 of the author's local preprint PDF. No neural data are simulated.
- `/publications/smell-and-space`: the Current Biology 2023 commentary and the
  study by Raithel et al., DOI `10.1016/j.cub.2023.06.087`. The illustrative map
  preserves spatial geometry when cue labels change. It demonstrates a question
  about sensory and spatial representations, not an observed participant path.
- `/publications/maps-at-rest`: the Neuron 2025 commentary and the study by
  Xiao et al., DOI `10.1016/j.neuron.2025.07.028`. Four imaginary places merge
  from separate rankings into a joint map. A remembered ranking route can be
  compared with a direct route. These are conceptual paths and path lengths,
  not observed replay sequences, measured compute costs, or causal rest effects.

The two commentary walkthroughs distinguish the studies they discuss from our
commentaries. Their takeaways are proposed website copy based on the published
abstracts, original commentary figures, and primary study papers; they do not
claim these are novel results established by the commentaries. The bioRxiv
personal-interest paragraph is preserved exactly at the author's request.

The PLOS author note now follows Mark's explanation: healthy adults also used
following to varying degrees, and unfamiliar decisions are a potentially relevant
broader application. The page distinguishes that interpretation from the task's
empirical result.

Names in narrative and citations retain their capitalization; the lowercase
brand stays lowercase. UCLA and the verified UCLA email replace the old site
identity. The inherited CV PDF remains unchanged and is explicitly labeled an
older version, since it still lists UC Davis and its historical dates cannot be
updated from the information supplied.

## Visual treatment and interaction

Plot principles were adapted from `valuemap_meg/instructions/05_plotting_standards.md`
and its shared styling functions: sparse ticks, no grid, left/bottom spines,
round limits, colored individual dots, grey means drawn on top, capless SEM, square scatter
geometry, and regression only over the observed x range. Web plots retain the
site's dark background and coral/blue palette. Original pasted paper figures
alone receive padded white squircle frames, preserving the whole figure.

The PLOS regression is an ordinary least-squares fit over all 44 paired estimates.
Group highlight buttons do not filter the regression. Point cycling was removed;
direct hover/tap and the expandable text table remain. The PLOS expanded data
section also offers a keyboard-accessible participant selector.

Every walkthrough shares depth, step, and plot view in its URL; illustrative
maps also preserve slider, pair, destination, and route settings. On phones the
current story explanation and pagination move below the figure. With JavaScript
disabled, all narrative sections and the initial static SVG remain available.
Reduced motion disables transitions. Model and real-data tests cover sample
counts, source aggregates, regression limits, normalized transformations, and
identity/geometry preservation. Browser QA covers all routes at 320/390/768/1280px,
source figures, all story steps, keyboard/touch, sharing/back/reload, malformed
parameters, no-JavaScript reading, and reduced motion.

## Five-choice value-map demo and brain evidence

The source for the adaptive design was inspected at
`Box/Boorman Lab/Experiments/ValueGridCode/task/`: `training_gambles.m`,
`getOfferValue.m`, `updatePosteriorParams.m`, and `runTraining.m`.
The task chooses non-dominated lottery pairs by expected posterior entropy and
updates a posterior after each response. It originally estimates rho alone with
linear probability weighting. This website uses the same information-selection
principle with two dimensions (Prelec alpha and power-utility rho). It is an
adaptation, not the laboratory estimator or its parameter-recovery validation.

The browser evaluates a 30×30 parameter grid spanning 0.35–1.80, uses independent
log-normal priors centered at log(parameter)=0 with SD 0.5, and fixes inverse
choice temperature to 8 for utilities scaled by the maximum prize of $10.
Candidate pairs come from the 88 locations, require a probability/amount tradeoff,
and are deterministically thinned for speed. Offer sides are counterbalanced
across candidates. Previously asked pairs cannot repeat. Five binary choices
cannot identify two parameters precisely; a rounded posterior mean supplies one
illustrative sketch, with the caveat visible beside the result.

Both options of the held-out comparison (20%/$9 and 60%/$5) are excluded from the
entire question pool. The demonstration predicts this pair using the estimated
functions, not a replay of a prior response. All 32 answer branches are tested
for finite estimates, posterior normalization, residual uncertainty, distinct
sketches, and held-out option separation. Undo reconstructs the posterior from
the remaining responses. No choice logging, storage, payments, or network API
is used. Shared URLs retain map settings only; reloading never labels another
reader's shared settings as a new estimate of the current visitor.

BrainEvidence.astro presents actual source figures and plain-language context:
- PNAS: existing Figure 2A asset (vmPFC location and measured estimates; n=31).
- PLOS: publisher's Figure 1B–C lesion overlap panels. PNG downloaded from
  `journals.plos.org/ploscompbiol/article/figure/image?download=&id=10.1371%2Fjournal.pcbi.1012602.g001&size=large`;
  an SVG viewport displays the lesion panels with their original scale (CC BY).
- Raithel et al.: Figure 4 from the author's local copy of the primary study.
  Extracted with Poppler at 180 dpi from PDF page 6, pixel region
  x=205, y=242, width=1080, height=744. The ROI mask is identified as anatomical;
  panels D–F are measured fMRI results. Source data: OSF SN9XV.
- Xiao et al.: Figure 1 from PDF page 27 of the author manuscript, extracted
  as its original 540×623 JPEG. A 90-degree SVG transform and viewport show
  panels B–F upright: contact locations, a measured ripple, and its spectrum.
  The figure is explicitly labeled an author-manuscript excerpt; neural datasets
  and analysis code link to the authors' Zenodo and GitHub repositories.
- Orloff bioRxiv: original Figure 3 image extracted from PDF page 10. The
  fourth story stop shows the subjective map from panel A with its original
  t scale; the complete figure remains expandable. The display threshold
  (P<0.01 uncorrected) is distinguished from region-level corrected inference.
  Personal demo settings never change the study's brain map.

Each commentary now credits all original-study authors prominently near the top
and links directly to both the study and its original brain evidence. The
website's conceptual animations remain distinguishable from source measurements.

## Bulk copy editing

`content/walkthrough-copy.md` supplies every website interface label and narrative,
including game prompts, status messages, chart axes, captions, alt text, and publication
citations. `scripts/generate-copy.mjs` creates an ignored ES module before dev/test/build.
The Vite watcher regenerates and reloads when the document changes. Server rendering
and client interactions use the same module; template parameters use `{{name}}` tokens.
Astro escapes text, dynamic SVG uses `copyHtml` / `escapeCopy`, and a missing key or
malformed block fails loudly. Link destinations, numeric source data, and state IDs
remain in code. Embedded words in paper figures and the CV remain in those assets.

Tests cover all static copy references, unextracted Astro text/accessibility labels,
and safe template interpolation. In Chrome, changes to the initial game prompt,
the small caption below it, and a live subjective-axis label were verified directly
from saved edits, then restored. No separate copy import step is required.

## September 9 narration pass

- Home now features the May 2026 bioRxiv preprint with an interactive map preview.
  The previous PLOS feature remains linked among the other threads.
- Internal forward links use →; external text links use ↗. Profile/contact links
  reuse the existing Simple Icons assets with accessible labels and 44px targets.
- The research page adds a plain-language cognitive-map/value primer. Its current
  draft emphasizes how knowledge helps construct value; social influence is
  presented as published work, pending Mark's longer-term framing preferences.
- Main walkthroughs lead with a concrete decision and the significance of a finding.
  Grid-like/sixfold details are in Go Deeper for the value study. The unchanged
  excitement paragraph remains in the central editing document.
- Brain-source captions and region descriptions align beside source images on
  laptop layouts. Narrow layouts place the legend immediately after the figure.
- PLOS and PNAS use ID-derived, reproducible horizontal jitter. Vertical values
  and participant pairing are untouched; means are grey and drawn last.

### Actual PNAS neural estimates

`src/data/peer-brain.json` contains the 31 `safeValue` / `riskyValue` pairs from
`data/ROIs.mat` at the same archived repository commit as the behavioral dataset,
`4e1da2673f3abfe952d0525c315b4ca7e804a172`. `makeFigure2.m` identifies these as
vmPFC [-4,40,-8] estimates and pairs them with `anySubUse(1:31)` from `allVars.mat`.
The 15 no-reported-use and 16 reported-use participants retain the display IDs
of their corresponding behavioral rows. Both neural views use the same axis
range (-1.5 to 2); both behavior views use 0 to 1. P values are the published
association results, not newly computed tests of the plotted group means.
The anatomical inset clips the existing source Figure 2A with an SVG path;
the yellow cross locates the analysis region and is not an activation overlay.

### Guided reading modes and the five-choice game

All five readers use a short gist, an ordered walkthrough, and a deeper layer.
The gist hides the interactive figures. Story scenes show only the visual
being discussed; the shared back/next controls are the only way to advance.
View selectors and redundant scene headings are hidden during the walkthrough.
Deep mode allows figure exploration and shows the original brain evidence.

The bioRxiv walkthrough starts the game automatically and hides the map:

1. Make five choices (or continue with fewer).
2. Place option A using amount and probability, then place B.
3. Revisit the actual answered pairs using the same back/next controls.
4. Locate a held-out pair to explain how the structure accommodates new options.
5. Show two clearly labeled illustrative preference maps.
6. Reveal the visitor's approximate fitted map, then the brain result.

`ValueSession` keeps the answer history and fitted parameters separate from
illustrative preferences. The examples never overwrite the visitor's fit.
Leaving with 1–4 answers uses the partial posterior; no answers yields a labeled
random example. A reloaded reading link keeps settings but never claims its
example pairs are the visitor's answers. Answers are held only in page memory.

The display has all 100 locations, including both extreme corners. Question
selection retains the study's 88-location set and excludes both offers in the
held-out comparison. The full display is explicitly labeled as an illustration.

Copy stays in `content/walkthrough-copy.md`. BioRxiv `text` and `more` fields
supply separate paragraphs. Tokens like `{{a.amount}}` and `{{review.intro}}`
are replaced with the visitor's offers and answer context. Keep these tokens
intact. Scene titles remain available to screen readers, without visible
headlines competing with the prose.


### Replay and scent simulations

The odor game asks visitors to infer four imaginary places from bread, coffee,
cedar and floral cues. Mouse, touch and keyboard controls share the same state.
It is an analogy for the Raithel study, not its original experimental task.

The replay demo uses six potential connections among four fixed example places.
It now revisits three-place sequences: two remembered links can also strengthen
the direct relationship between their endpoints. The first sequence is always
a–b–c and pauses after the a–c connection appears. The visitor controls when to
continue; the rest of the batch contains eleven further sequences.

Each completed sequence applies s_new = s + 0.24*(1-s) to its two traversed edges
and to the endpoint edge. Unrelated edges are unchanged. Line thickness depicts
how readily a relationship can be brought to mind. Dots keep their positions,
size, and opacity. Secondary halos shrink and fade with the mean strength of a
place’s surrounding connections. These strengths and the
one-versus-two-link comparison are illustrative, not fitted neural measurements
or measured decision times.

After the common introductory sequence, twelve possible three-place sequences
are selected with one of four policies: uniform; 5:1 weighting of endpoint
comparisons involving c; (1-s)^3+0.01 weighting for weaker endpoint connections;
and 5:1 weighting of endpoint comparisons with opposing food/service rankings.
Changing policy resets to the same starting strengths. The first, second, and
fourth policies are inspired by the commentary's proposals; the weak-connection
policy is an additional what-if. These are not strategies experimentally compared
by Xiao and colleagues.

The inference view is now “what did replay make easier?” and preserves the
current replay session. Direct comparison lines scale with the corresponding
connection strength; unpracticed links are dashed. A pair-specific readout counts
how often that connection was reinforced. Switching to a different pair reveals
which relationships received preparation, including untouched pairs. The original
food-ranking route remains available for the comparison with more mental steps.

The pure ReplayActivity state machine is shared by animated and reduced-motion
presentations. A batch contains twelve completed sequences, with three visual
phases each. Reduced motion preserves the explanatory pause after the first
sequence, then completes the remaining batch without animation. Pause/resume,
view changes, tab visibility, and reset stop scheduled work without adding replay
events. The original study and commentary remain linked and credited.

### Clinical wording and source limits

PLOS Methods confirms hospital-registry recruitment and reports days since
surgery, but does not state the indication for surgery. The site therefore uses
prior surgery and pre-existing lesions, without claiming epilepsy or tumor.
An editor-only note in the copy document asks for verification before adding
that detail. Commentary claims about specificity/generality and proposed replay
priorities were checked against the original commentary figures already in the
site; experimental findings were checked against the primary study sources.

## September 12 refinement

- The 10%/$10 offer and locating guides sit inside the axes, with endpoint tick labels
  aligned to the inset grid. Data coordinates and model estimates are unchanged.
- A corner annotation and short reading key explain increasing reward and chance.
  The subjective scenes explain relative changes; distance to the corner is not used
  as a surrogate for the fitted choice rule.
- All five stories use fuller concrete examples before model / neural explanations,
  synchronized visual scenes, one next/back controller, and technical depth later.
- The bioRxiv grid-cell explanation uses six neighboring locations forming a hexagon.
- The planned anatomical surface explorer is developed separately from this release.
