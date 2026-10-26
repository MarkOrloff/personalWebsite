# website copy

This is the editing document for the whole website: page text, all five walkthroughs, game prompts and feedback, button labels, chart labels, captions, image descriptions, navigation, and publication citations.

Edit between the `copy` markers and keep their identifiers intact. Save to refresh the development site automatically. For a static preview, run `npm run build` and reload. No import step is needed. Missing, duplicate, or empty blocks produce an error instead of quietly keeping old text.

Text inside `{{double.braces}}` is filled in by the activity. Keep those placeholders when rewriting a message; their surrounding words and punctuation are editable. Use plain text, with normal punctuation and capitalization. In walkthrough text and the home page invite, wrap a word in asterisks for italics: `*relative*`. Line breaks within a block become spaces. Some paragraphs have separate blocks around links or names so their formatting stays intact.

Quick navigation:
- [bioRxiv story](#2026--subjective-value) · search `ui.value-map` for **game prompts, feedback, and the small text below the choices**.
- [safer peers](#2020--safer-peers), [smell and space](#2023--smell-and-space), [social conformity](#2024--social-conformity), [maps at rest](#2025--maps-at-rest).
- Search `ui.index`, `ui.about`, `ui.footer`, or `ui.navigation` for the rest of the site.
- [publication titles and citations](#publication-titles-citations-and-listing-descriptions).

Link destinations, numeric data, and interaction rules remain in code. Words already embedded in original paper figures and the CV PDF belong to those source files; editing this document changes their surrounding captions and descriptions. Published titles and statistics are included for editing, so please preserve their accuracy.

## 2020 · safer peers

### title

<!-- copy: safer-peers.title -->
when peer pressure makes teens safer
<!-- /copy -->

### deck

<!-- copy: safer-peers.deck -->
most research on teens and peer pressure is about peers encouraging risk-taking behavior. we asked what happens when teens observe their peers making safe choices, and found that teens who had never used substances were more influenced by these safe peers.
<!-- /copy -->

### the gist: paragraph 1

<!-- copy: safer-peers.gist.0 -->
when people talk about teens and peer pressure, it’s often about friends pushing each other toward risk. we wanted to know what happens when peers push others towards the safe option instead. 78 teens, ages 15 to 17, chose between gambles, sometimes on their own and sometimes after seeing what two other players picked.
<!-- /copy -->

### the gist: paragraph 2

<!-- copy: safer-peers.gist.1 -->
teens who said they’d never used substances gave more weight to peers’ safe choices than teens who had. we saw the same difference in vmPFC, a brain region that helps track how much we value different options. when peers picked the risky gamble, the two groups looked about the same. peer influence can work in both directions, and for these teens, the safe direction is the one that was associated with not using substances.
<!-- /copy -->

### opening game: navigation label

<!-- copy: safer-peers.steps.game.label -->
play the game
<!-- /copy -->

### opening game: heading

<!-- copy: safer-peers.steps.game.title -->
a quick game
<!-- /copy -->

### opening game: explanation

<!-- copy: safer-peers.steps.game.text -->
let’s start with a game. pick the gamble you’d rather play. after four rounds, you’ll see what two other players chose before you decide.
<!-- /copy -->

### opening game: continue the explanation

<!-- copy: safer-peers.steps.game.more -->
teens in our study played a version of this, sometimes alone and sometimes after seeing what peers chose. we wanted to know whether a peer’s choice made that option more appealing, and whether it mattered if the peers played it safe or took the risk.
<!-- /copy -->

### step 1: navigation label

<!-- copy: safer-peers.steps.0.label -->
what did they choose?
<!-- /copy -->

### step 1: heading

<!-- copy: safer-peers.steps.0.title -->
what 78 teens chose
<!-- /copy -->

### step 1: explanation

<!-- copy: safer-peers.steps.0.more -->
78 teens made ‘gamble’ choices like the ones you just made, sometimes alone and sometimes after seeing two peers’ choices. in the plot on the right, each dot is one teen. the higher the dot, the more extra value a peer’s safe choice added to that option for them.
<!-- /copy -->

### step 1: interaction hint

<!-- copy: safer-peers.steps.0.hint -->
blue dots are teens who said they’d never used substances. coral dots are teens who reported some use.
<!-- /copy -->

### step 2: navigation label

<!-- copy: safer-peers.steps.1.label -->
how peers change value
<!-- /copy -->

### step 2: heading

<!-- copy: safer-peers.steps.1.title -->
measuring the value a peer’s choice adds
<!-- /copy -->

### step 2: explanation

<!-- copy: safer-peers.steps.1.text -->
how did we quantify extra value? we used a computational model, a series of equations with parameters that are fit to the choices of each participant, that first estimates how much each person likes a gamble on its own, given how much risk they’re comfortable with (the ‘risk preference’ parameter). then it estimates how much seeing a peer pick that gamble adds on top (the ‘social value’ parameter, called other-conferred utility in the paper).
<!-- /copy -->

### continue the explanation

<!-- copy: safer-peers.steps.1.more -->
teens who had never used substances got a bigger value boost from peers’ safe choices than teens who had.
<!-- /copy -->

### step 2: interaction hint

<!-- copy: safer-peers.steps.1.hint -->
0.5 on this scale means a peer’s choice added nothing.
<!-- /copy -->

### step 3: navigation label

<!-- copy: safer-peers.steps.2.label -->
change the direction
<!-- /copy -->

### step 3: heading

<!-- copy: safer-peers.steps.2.title -->
when peers take the risk
<!-- /copy -->

### step 3: explanation

<!-- copy: safer-peers.steps.2.text -->
now look at trials where the peers picked the riskier gamble. the same teens’ dots move to show how much those risky choices added.
<!-- /copy -->

### continue the explanation

<!-- copy: safer-peers.steps.2.more -->
here the two group averages sit close together, and we didn’t find a difference tied to substance use. the difference only showed up for safe choices. in other words, differences between substance-use groups seemed specific to safe influence.
<!-- /copy -->

### step 4: navigation label

<!-- copy: safer-peers.steps.3.label -->
look in the brain
<!-- /copy -->

### step 4: heading

<!-- copy: safer-peers.steps.3.title -->
the same pattern in vmPFC
<!-- /copy -->

### step 4: explanation

<!-- copy: safer-peers.steps.3.text -->
31 of these teens also had fMRI scans, which track changes in blood flow as a stand-in for brain activity. we looked at vmPFC, a region whose activity tracks the value of a given option.
<!-- /copy -->

### continue the explanation

<!-- copy: safer-peers.steps.3.more -->
now each dot shows one teen’s vmPFC response to the value added by peers’ safe choices. the same pattern appeared: the response was stronger in teens who had never used substances. their choices and their brain’s value signal told the same story.
<!-- /copy -->

### step 4: interaction hint

<!-- copy: safer-peers.steps.3.hint -->
only the 31 teens who were scanned appear here, so there are fewer dots.
<!-- /copy -->

### step 5: navigation label

<!-- copy: safer-peers.steps.4.label -->
check both contexts
<!-- /copy -->

### step 5: heading

<!-- copy: safer-peers.steps.4.title -->
risky peers in vmPFC
<!-- /copy -->

### step 5: explanation

<!-- copy: safer-peers.steps.4.text -->
on the other hand, when we look at brain responses in vmPFC to risky peers, we didn’t find a difference in vmPFC between the two groups. again, this mirrors our computational model findings that there is no difference in risky influence between substance use groups.
<!-- /copy -->

### go deeper: paragraph 1

<!-- copy: safer-peers.deep.0 -->
the model is called the ‘other-conferred utility’ model. it starts with each person’s own value for a gamble, their risk preference, based on its possible outcomes and how much risk they like. then it adds a separate value ‘boost’ for the option that peers chose. we estimated that boost separately for safe and risky peer choices to see if teens responded differently to each type of influence.
<!-- /copy -->

### go deeper: paragraph 2

<!-- copy: safer-peers.deep.1 -->
for the brain analysis, we asked whether vmPFC activity tracked the value peers added, and whether that differed with substance use. again, this was measured separately for safe and risky influence so we could examine if they differed. the scanned group had 15 teens who reported no use and 16 who reported some.
<!-- /copy -->

### takeaway: heading

<!-- copy: safer-peers.takeawayTitle -->
why it matters
<!-- /copy -->

### takeaway

<!-- copy: safer-peers.takeaway -->
a lot of research frames peer influence in teens as a risk factor. our results suggest it can also be protective. for the teens in our study who weren’t using substances, peers’ safe choices carried extra weight, both in what they chose and in brain signals of reward. to understand social influence, it’s important to consider that in addition to pushing teens towards risky behavior, peers can also encourage safer behavior.
<!-- /copy -->

### sources / 0 / label

<!-- copy: safer-peers.sources.0.label -->
the paper
<!-- /copy -->

### sources / 1 / label

<!-- copy: safer-peers.sources.1.label -->
data & analysis code
<!-- /copy -->

### brain evidence

### brain / title

<!-- copy: safer-peers.brain.title -->
vmPFC responses to peers’ choices
<!-- /copy -->

### brain / measure

<!-- copy: safer-peers.brain.measure -->
fMRI · 31 of the 78 teens
<!-- /copy -->

### brain / intro

<!-- copy: safer-peers.brain.intro -->
this is the original figure from our paper: the spot in vmPFC we analyzed, and each teen’s estimates from that spot.
<!-- /copy -->

### brain / regions / 0 / role

<!-- copy: safer-peers.brain.regions.0.role -->
its activity tracks how much we value an option.
<!-- /copy -->

### brain / regions / 0 / finding

<!-- copy: safer-peers.brain.regions.0.finding -->
vmPFC responses to peers’ safe choices differed between teens who had and hadn’t used substances. we didn’t find that difference for peers’ risky choices.
<!-- /copy -->

### brain / alt

<!-- copy: safer-peers.brain.alt -->
figure 2A locates vmPFC and shows participant fMRI estimates for safe and risky peer influence by substance exposure
<!-- /copy -->

### brain / caption

<!-- copy: safer-peers.brain.caption -->
figure 2A from Chung, Orloff and colleagues. blue is safe influence and red is risky influence. minus means no reported substance use; plus means some.
<!-- /copy -->

### brain / links / 0 / label

<!-- copy: safer-peers.brain.links.0.label -->
data & code
<!-- /copy -->

## 2023 · smell and space

### originalStudy / title

<!-- copy: smell-and-space.originalStudy.title -->
Recruitment of grid-like responses in human entorhinal and piriform cortices by odor landmark-based navigation
<!-- /copy -->

### title

<!-- copy: smell-and-space.title -->
the brain can build a map from smells
<!-- /copy -->

### deck

<!-- copy: smell-and-space.deck -->
Raithel and colleagues found that people can build a mental map using smells as landmarks, with map-like brain activity in both a navigation region and a smell region. in our commentary, we discussed what this means for how the brain builds maps in general.
<!-- /copy -->

### the gist: paragraph 1

<!-- copy: smell-and-space.gist.0 -->
the smell of warm bread means a bakery is nearby; coffee means a café. once you know where smells come from, they can work as landmarks. Raithel and colleagues had participants navigate a virtual environment using smells as landmarks while their brain activity was measured with fMRI, which tracks changes in blood flow as a stand-in for brain activity.
<!-- /copy -->

### the gist: paragraph 2

<!-- copy: smell-and-space.gist.1 -->
they found a ‘grid-like’ pattern, a signature of the brain’s map-making system, in two places: entorhinal cortex, a navigation hub, and piriform cortex, a main smell-processing area. in our commentary, we put forth the idea that this points to two kinds of systems working together: a general one that maps relationships no matter what they’re about, and more specialized ones based on the type of stimulus being mapped, like scent or a social hierarchy.
<!-- /copy -->

### step 1: navigation label

<!-- copy: smell-and-space.steps.0.label -->
find your bearings
<!-- /copy -->

### step 1: heading

<!-- copy: smell-and-space.steps.0.title -->
finding places by smell
<!-- /copy -->

### step 1: explanation

<!-- copy: smell-and-space.steps.0.text -->
you arrive in a neighborhood with no signs. you smell warm bread in one spot, coffee in another, and flowers and cut wood somewhere else. where would you look for the bakery?
<!-- /copy -->

### continue the explanation

<!-- copy: smell-and-space.steps.0.more -->
try finding all four places from their smells. once you know which smell goes with which place, you can use it to find your way.
<!-- /copy -->

### step 1: interaction hint

<!-- copy: smell-and-space.steps.0.hint -->
tap a smell on the map on the right to make a guess.
<!-- /copy -->

### step 2: navigation label

<!-- copy: smell-and-space.steps.1.label -->
navigate by smell
<!-- /copy -->

### step 2: heading

<!-- copy: smell-and-space.steps.1.title -->
taking a shortcut
<!-- /copy -->

### step 2: explanation

<!-- copy: smell-and-space.steps.1.text -->
now you’ll start at one smell and point toward a place you’ve never walked to from there. if you remember where the smells were, you can work out which way to go.
<!-- /copy -->

### continue the explanation

<!-- copy: smell-and-space.steps.1.more -->
this is what a ‘cognitive map’, an internal map of how places relate to one another, lets you do: find routes you’ve never taken. Raithel and colleagues tested this kind of navigation in a virtual environment with smells as landmarks, while participants were in the scanner. they wanted to know whether smells could engage the same mapping system that’s usually studied with visual landmarks.
<!-- /copy -->

### step 3: navigation label

<!-- copy: smell-and-space.steps.2.label -->
look in the brain
<!-- /copy -->

### step 3: heading

<!-- copy: smell-and-space.steps.2.title -->
a grid-like pattern in two regions
<!-- /copy -->

### step 3: explanation

<!-- copy: smell-and-space.steps.2.text -->
smells did engage it! while participants navigated by smell, entorhinal cortex showed a ‘grid-like’ pattern, the signature of cells the brain uses to map space (the details tab explains how this pattern works). so did anterior piriform cortex, part of the brain’s smell system.
<!-- /copy -->

### continue the explanation

<!-- copy: smell-and-space.steps.2.more -->
the patterns in the two regions were also aligned, pointing in the same direction. this suggests that the navigation system and the smell system were organizing the same space together. the 3D map on the right shows their result in each region.
<!-- /copy -->

### step 4: navigation label

<!-- copy: smell-and-space.steps.3.label -->
connect the studies
<!-- /copy -->

### step 4: heading

<!-- copy: smell-and-space.steps.3.title -->
what’s shared and what’s specific
<!-- /copy -->

### step 4: explanation

<!-- copy: smell-and-space.steps.3.text -->
this is the point we raised in our commentary. some brain regions show map-like patterns in almost every mapping study, whatever is being mapped. others depend on what is being mapped.
<!-- /copy -->

### continue the explanation

<!-- copy: smell-and-space.steps.3.more -->
our figure on the right lays this out. entorhinal and medial prefrontal cortex show map-like patterns across many kinds of tasks. when the map is of visual objects, a visual region also shows the pattern, and when the map is built from smells, piriform cortex does. we proposed that the general regions provide the structure of the map, while the specialized regions keep the details that make each kind of information useful.
<!-- /copy -->

### go deeper: paragraph 1

<!-- copy: smell-and-space.deep.0 -->
‘grid-like’ refers to grid cells, neurons in entorhinal cortex that fire at locations arranged in a repeating hexagonal grid, like a honeycomb, as an animal moves around. because many grid cells share the same orientation, fMRI can pick up a signal that rises and falls every 60 degrees of movement direction. this is the signature Raithel and colleagues measured, and the orientation of that signal was aligned between entorhinal and piriform cortex. fMRI measures this at the level of large groups of cells, rather than recording individual grid cells.
<!-- /copy -->

### go deeper: paragraph 2

<!-- copy: smell-and-space.deep.1 -->
our figure puts this study next to others. Constantinescu and colleagues (2016) found grid-like patterns when people moved through a “space” of bird drawings that varied in neck and leg length, including in lateral occipital cortex, a visual object region. Park and colleagues (2021) found them for a social hierarchy. Raithel and colleagues add smell and piriform cortex. across all of them, entorhinal and medial prefrontal cortex keep showing up, while the other regions depend on what’s being mapped.
<!-- /copy -->

### takeaway: heading

<!-- copy: smell-and-space.takeawayTitle -->
our idea
<!-- /copy -->

### takeaway

<!-- copy: smell-and-space.takeaway -->
across studies, the brain seems to use the same general way of mapping relationships, whether the map is of places, visual objects, or smells. but a map is only useful if it keeps track of what’s actually at each location. what interests me is how the general and specialized systems work together, so that a map can be reused in a new situation without losing what made the original experience distinct.
<!-- /copy -->

### sources / 0 / label

<!-- copy: smell-and-space.sources.0.label -->
our commentary
<!-- /copy -->

### sources / 1 / label

<!-- copy: smell-and-space.sources.1.label -->
the original study
<!-- /copy -->

### brain evidence

### brain / title

<!-- copy: smell-and-space.brain.title -->
a grid-like pattern while navigating by smell
<!-- /copy -->

### brain / measure

<!-- copy: smell-and-space.brain.measure -->
fMRI · Raithel and colleagues’ study
<!-- /copy -->

### brain / intro

<!-- copy: smell-and-space.brain.intro -->
green marks where activity followed the grid pattern measured in each region.
<!-- /copy -->

### brain / regions / 0 / role

<!-- copy: smell-and-space.brain.regions.0.role -->
a hub for navigation and mental maps.
<!-- /copy -->

### brain / regions / 1 / role

<!-- copy: smell-and-space.brain.regions.1.role -->
a main smell-processing area.
<!-- /copy -->

### brain / regions / 0 / finding

<!-- copy: smell-and-space.brain.regions.0.finding -->
Raithel and colleagues found grid-like patterns in both regions, lined up in the same direction (figures 4 to 6 of their paper). the 3D map shows the parts of their whole-brain maps that touch each region.
<!-- /copy -->

### brain / alt

<!-- copy: smell-and-space.brain.alt -->
Raithel et al. figure 4: entorhinal anatomical mask, predicted sixfold modulation, and measured fMRI responses during odor navigation
<!-- /copy -->

### brain / caption

<!-- copy: smell-and-space.brain.caption -->
Raithel et al., 2023 · figure 4. the red overlay outlines the region analyzed. the lower panels show the measured effects (means and standard errors), with paired points for individual participants.
<!-- /copy -->

### smell map · tab label

<!-- copy: smell-brain.map.grid -->
grid-like code
<!-- /copy -->

### smell map · caption

<!-- copy: smell-brain.grid.caption -->
where activity rose and fell every 60 degrees as participants navigated by smell, in line with the grid orientation measured in each region. shown at P < 0.005, uncorrected.
<!-- /copy -->

### smell map · scale note

<!-- copy: smell-brain.scale -->
their group maps on a standard brain surface, showing only the clusters that touch entorhinal or anterior piriform cortex (the full maps are on NeuroVault). lighter means stronger evidence (the bar shows the t-statistic scale). the threshold is uncorrected and for display only; the paper’s main tests are within anatomically defined regions.
<!-- /copy -->

### smell map · screen reader label

<!-- copy: smell-brain.canvas-label -->
interactive 3D map of where activity followed each region’s grid pattern, on a standard brain surface. front points toward your forehead. drag to rotate, use the arrow keys, or zoom with the plus and minus keys.
<!-- /copy -->

## 2024 · social conformity

### introduction and methods

### title

<!-- copy: social-conformity.page.title -->
following the crowd as a shortcut
<!-- /copy -->

### deck

<!-- copy: social-conformity.page.deck -->
participants with damage to brain regions that help weigh risk relied more on copying other people’s choices. many healthy adults used the same shortcut, especially those whose own choices were harder to explain from their risk preferences.
<!-- /copy -->

### gist-1

<!-- copy: social-conformity.page.gist-1 -->
when you’re not sure how to judge a choice, other people’s choices can give you something to follow. we tested this in participants with damage to the insula or the dorsal anterior cingulate cortex (dACC), two regions that help weigh risk; the damage came from brain surgery they’d had before the study. they chose between gambles, sometimes after seeing what two other players picked. compared with 28 healthy adults, they relied more on simply copying the other players.
<!-- /copy -->

### gist-2

<!-- copy: social-conformity.page.gist-2 -->
many healthy adults used the same shortcut. across all participants, the harder it was to explain someone’s solo choices from their own risk preferences, the more they copied others when they had the chance. we think this reflects a general strategy: when judging the options yourself is difficult, other people’s choices can fill the gap.
<!-- /copy -->

### deep-1

<!-- copy: social-conformity.page.deep-1 -->
we fit a ‘hybrid’ model with several ways other people’s choices could matter. participants weigh each gamble using their own risk preferences, and another player’s choice can add value to an option (‘other-conferred utility’, the same idea from our 2020 study of teens). separately, participants can simply follow or go against others without that value calculation. fitting all of these together lets us distinguish “their choice makes this option worth more to me” from “i’ll do what they did.”
<!-- /copy -->

### deep-2

<!-- copy: social-conformity.page.deep-2 -->
the lesion groups didn’t only follow more (insula vs healthy adults: P = 0.036; dACC vs healthy adults: P = 0.025). the model also gave less weight to their own value-based weighing of the gambles, most clearly in the insula group. going against others didn’t differ between groups. in other words, in the lesion groups the balance shifted away from weighing the options and toward following.
<!-- /copy -->

### deep-method

<!-- copy: social-conformity.page.deep-method -->
statistics are from the paper. across all 44 people, solo mismatch and copying were correlated (r = 0.52, P = 2.7 × 10⁻⁴). “solo mismatch” is the negative median log likelihood of each person’s solo choices under the risk-preference model, across posterior draws, following the published analysis code.
<!-- /copy -->

### social-conformity.page.takeaway-title

<!-- copy: social-conformity.page.takeaway-title -->
why it matters
<!-- /copy -->

### deep-limitations

### takeaway

<!-- copy: social-conformity.takeaway -->
we studied participants with brain damage, but the shortcut wasn’t unique to them; many healthy adults relied on it too. what interests me is how often this probably happens in everyday life, any time we’re making a decision where we are highly uncertain: choosing a doctor in a new town, a retirement plan when your retirement may be 35 years away, or a dish in an unfamiliar cuisine. when we can’t judge the options ourselves, we rely on other people’s choices instead.
<!-- /copy -->

### opening game: navigation label

<!-- copy: social-conformity.steps.game.label -->
play the game
<!-- /copy -->

### opening game: heading

<!-- copy: social-conformity.steps.game.title -->
a game you can’t fully see
<!-- /copy -->

### opening game: explanation

<!-- copy: social-conformity.steps.game.text -->
imagine you’re at a trailhead in another country. the signs list each trail’s distance and difficulty, but you can’t read them. the trails are color-coded, though, and you see two hikers ahead of you take the red one. which would you take?
<!-- /copy -->

### opening game: continue the explanation

<!-- copy: social-conformity.steps.game.more -->
the game on the right works the same way. you’ll choose between a red gamble and a blue one, and you’ll always see which color two other players picked. some gambles are clear, and some are fogged over.
<!-- /copy -->

### step 1: navigation label

<!-- copy: social-conformity.steps.0.label -->
why these participants?
<!-- /copy -->

### step 1: heading

<!-- copy: social-conformity.steps.0.title -->
a choice that’s hard to judge
<!-- /copy -->

### step 1: explanation

<!-- copy: social-conformity.steps.0.text -->
the fog in the game is an analogy. the participants in our study could read the gambles just fine, but some of them had damage to brain areas that help weigh risk, which can make judging those gambles harder. we wanted to know whether they would rely more on other people’s choices.
<!-- /copy -->

### continue the explanation

<!-- copy: social-conformity.steps.0.more -->
we studied participants with damage to one of two regions that help weigh risk: the insula and the dorsal anterior cingulate cortex (dACC). the damage came from brain surgery they’d had before joining the study, and the maps on the right show where each group’s damage overlapped. like you, they chose between safer and riskier gambles, sometimes alone and sometimes after seeing two other players’ choices.
<!-- /copy -->

### step 1: interaction hint

<!-- copy: social-conformity.steps.0.hint -->
next: choices from 28 healthy adults, 10 people with insula damage, and 6 with dACC damage.
<!-- /copy -->

### step 2: navigation label

<!-- copy: social-conformity.steps.1.label -->
read the dots
<!-- /copy -->

### step 2: heading

<!-- copy: social-conformity.steps.1.title -->
two ways another person’s choice can sway you
<!-- /copy -->

### step 2: explanation

<!-- copy: social-conformity.steps.1.text -->
another person’s choice can sway you in two ways. it can make that option seem more valuable to you (what we called ‘other-conferred utility’ in our study of teens), or you can simply copy it without weighing the option yourself (‘following’).
<!-- /copy -->

### continue the explanation

<!-- copy: social-conformity.steps.1.more -->
how did we tell these apart? we used a computational model, a series of equations with parameters that are fit to each participant’s choices, that estimates how much each strategy drove their decisions, alongside their own ‘risk preference’. in the plot on the right, each dot is one participant, and higher means they relied more on following.
<!-- /copy -->

### step 2: interaction hint

<!-- copy: social-conformity.steps.1.hint -->
the height is the model’s ‘following weight’, not the share of times someone copied.
<!-- /copy -->

### step 3: navigation label

<!-- copy: social-conformity.steps.2.label -->
compare the groups
<!-- /copy -->

### step 3: heading

<!-- copy: social-conformity.steps.2.title -->
the lesion groups copied more
<!-- /copy -->

### step 3: explanation

<!-- copy: social-conformity.steps.2.text -->
both lesion groups relied on following more than the healthy adults did. the grey circles are the group averages.
<!-- /copy -->

### continue the explanation

<!-- copy: social-conformity.steps.2.more -->
now look at the individual dots. many healthy adults also relied on following, and every group varies a lot. studying the lesion groups helped us identify a strategy that shows up, to some degree, in everyone’s choices.
<!-- /copy -->

### step 4: navigation label

<!-- copy: social-conformity.steps.3.label -->
connect it to solo decisions
<!-- /copy -->

### step 4: heading

<!-- copy: social-conformity.steps.3.title -->
harder solo choices, more copying
<!-- /copy -->

### step 4: explanation

<!-- copy: social-conformity.steps.3.text -->
now the dots move sideways. left to right shows how well each participant’s solo choices, made without seeing anyone else, were explained by their own risk preferences (we call this ‘solo mismatch’). farther right means a worse fit: their own risk preferences explained their choices less well.
<!-- /copy -->

### continue the explanation

<!-- copy: social-conformity.steps.3.more -->
the line slopes up: participants whose solo choices were harder to explain from their own risk preferences relied more on following when they had the chance. in other words, following others may fill the gap when your own evaluation of the options isn’t giving you a clear answer.
<!-- /copy -->

### brain evidence

### brain / title

<!-- copy: social-conformity.brain.title -->
where the damage was
<!-- /copy -->

### brain / measure

<!-- copy: social-conformity.brain.measure -->
brain scans · where each group’s damage overlapped
<!-- /copy -->

### brain / intro

<!-- copy: social-conformity.brain.intro -->
warmer colors mean more people in that group had damage in that spot.
<!-- /copy -->

### brain / regions / 0 / role

<!-- copy: social-conformity.brain.regions.0.role -->
it brings together information about bodily feelings, uncertainty, and risk.
<!-- /copy -->

### brain / regions / 0 / finding

<!-- copy: social-conformity.brain.regions.0.finding -->
10 participants had damage here.
<!-- /copy -->

### brain / regions / 1 / role

<!-- copy: social-conformity.brain.regions.1.role -->
it helps evaluate risk and adjust behavior when decisions are demanding.
<!-- /copy -->

### brain / regions / 1 / finding

<!-- copy: social-conformity.brain.regions.1.finding -->
6 participants had damage here. both lesion groups relied more on following others than the healthy adults did.
<!-- /copy -->

### brain / alt

<!-- copy: social-conformity.brain.alt -->
published lesion overlap maps for dorsal anterior cingulate cortex and insula groups with a zero-to-one-hundred percent overlap scale
<!-- /copy -->

### brain / dACC slices label

<!-- copy: social-conformity.brain.panels.dacc -->
dACC group · 6 people
<!-- /copy -->

### brain / insula slices label

<!-- copy: social-conformity.brain.panels.insula -->
insula group · 10 people
<!-- /copy -->

### brain / caption

<!-- copy: social-conformity.brain.caption -->
figure 1B–C from our paper. colors show damage. everyone’s lesions are drawn on one side of the brain so the overlap is easy to see.
<!-- /copy -->

### brain / links / 0 / label

<!-- copy: social-conformity.brain.links.0.label -->
data & code
<!-- /copy -->

### brain / links / 1 / label

<!-- copy: social-conformity.brain.links.1.label -->
figure license
<!-- /copy -->

## 2025 · maps at rest

### originalStudy / title

<!-- copy: maps-at-rest.originalStudy.title -->
Human hippocampal ripples align new experiences with a grid-like schema
<!-- /copy -->

### title

<!-- copy: maps-at-rest.title -->
learning on a break
<!-- /copy -->

### deck

<!-- copy: maps-at-rest.deck -->
Xiao and colleagues found that brief bursts of hippocampal activity during a short break were associated with how people later combined what they’d learned. in our commentary, we discussed which experiences the brain might replay during rest, and how that could make later decisions easier.
<!-- /copy -->

### the gist: paragraph 1

<!-- copy: maps-at-rest.gist.0 -->
say you learn that restaurant b has better food than a, and that c has better food than b. you can work out that c beats a by following the chain (this is called ‘inference’: working out a relationship you never learned directly). but could your brain link a and c ahead of time, so the answer is ready when you need it?
<!-- /copy -->

### the gist: paragraph 2

<!-- copy: maps-at-rest.gist.1 -->
Xiao and colleagues recorded from electrodes inside participants’ brains while they learned relationships like these, took a short break, and then made new comparisons. brief bursts of activity in the hippocampus, a memory hub, during the break were associated with how participants organized and used what they’d learned afterward. in our commentary, we discussed what kinds of experiences the brain might replay during a break like this, and how that could help with future decisions.
<!-- /copy -->

### step 1: navigation label

<!-- copy: maps-at-rest.steps.0.label -->
learn the pieces
<!-- /copy -->

### step 1: heading

<!-- copy: maps-at-rest.steps.0.title -->
two rankings learned separately
<!-- /copy -->

### step 1: explanation

<!-- copy: maps-at-rest.steps.0.text -->
imagine learning about four restaurants one comparison at a time. you liked the food at b better than a, and then decided that c is better than b. to compare a and c, you’d chain those together: a → b → c.
<!-- /copy -->

### continue the explanation

<!-- copy: maps-at-rest.steps.0.more -->
you can do the same when comparing the service at these restaurants. now you have two separate rankings of the same four places, shown as the two rows on the right. participants in the study learned relationships like these between unfamiliar items, along two different dimensions.
<!-- /copy -->

### step 2: navigation label

<!-- copy: maps-at-rest.steps.1.label -->
rest & replay
<!-- /copy -->

### step 2: heading

<!-- copy: maps-at-rest.steps.1.title -->
replay during a break
<!-- /copy -->

### step 2: explanation

<!-- copy: maps-at-rest.steps.1.text -->
after learning these relationships, participants in the study rested for five minutes without learning anything new. from the outside nothing is happening, but the brain can be going back over what it learned and linking it together. this is called ‘replay’: the brain reactivating recent experiences, while you rest.
<!-- /copy -->

### continue the explanation

<!-- copy: maps-at-rest.steps.1.more -->
on the right, click the button and watch the replay run a → b → c. going over that sequence can also strengthen a direct a–c link, so next time you won’t need to go through b. thicker lines are links that are easier to ‘bring to mind’ and make choices between
<!-- /copy -->

### step 2: interaction hint

<!-- copy: maps-at-rest.steps.1.hint -->
the animation pauses when the a–c link forms.
<!-- /copy -->

### step 3: navigation label

<!-- copy: maps-at-rest.steps.2.label -->
make a new comparison
<!-- /copy -->

### step 3: heading

<!-- copy: maps-at-rest.steps.2.title -->
a comparison that’s ready to use
<!-- /copy -->

### step 3: explanation

<!-- copy: maps-at-rest.steps.2.text -->
later, someone asks you: a or c? there are two ways to answer. if you already have a direct a–c link, you just use it. if you don’t, you can still get there by walking through what you do remember, one link at a time: c beats b, and b beats a, so c beats a.
<!-- /copy -->

### continue the explanation

<!-- copy: maps-at-rest.steps.2.more -->
it’s like getting to a friend’s apartment. if you’ve been there before, you just go. if you haven’t, you take the way you know: drive to the grocery store you always go to, then walk over from there. it takes longer, but it gets you there. replay during a break could build the direct route before you need it through ‘simulation’ (i.e., replay), and Xiao and colleagues found that participants got better at these new comparisons after resting.
<!-- /copy -->

### maps-at-rest.steps.2.hint

<!-- copy: maps-at-rest.steps.2.hint -->
switch between “recall the learned links” and “use the map” to see both routes.
<!-- /copy -->

### step 4: navigation label

<!-- copy: maps-at-rest.steps.3.label -->
listen during the break
<!-- /copy -->

### step 4: heading

<!-- copy: maps-at-rest.steps.3.title -->
listening in on the break
<!-- /copy -->

### step 4: explanation

<!-- copy: maps-at-rest.steps.3.text -->
Xiao and colleagues could measure what happened during the break. their participants already had electrodes in their brains for medical reasons, which let the team record brief bursts of fast electrical activity in the hippocampus called ‘ripples’. ripples are thought to be one of the moments when replay happens.
<!-- /copy -->

### continue the explanation

<!-- copy: maps-at-rest.steps.3.more -->
activity around these ripples, along with coordination between the hippocampus and medial prefrontal cortex, a region that helps both organize knowledge into maps and track how much options are worth, was associated with the map participants formed and the comparisons they made afterward. on the right is our example map after a full break of replay: some links are now ready to use, while others would still need the long way around.
<!-- /copy -->

### step 5: navigation label

<!-- copy: maps-at-rest.steps.4.label -->
what should replay prioritize?
<!-- /copy -->

### step 5: heading

<!-- copy: maps-at-rest.steps.4.title -->
our idea: choosing what to replay
<!-- /copy -->

### step 5: explanation

<!-- copy: maps-at-rest.steps.4.text -->
this is where our commentary comes in. the brain has far more experiences to keep track of than it can rehearse, so it has to prioritize. which experiences it replays would decide which comparisons are ready when the next choice arrives.
<!-- /copy -->

### step 5: continue the explanation

<!-- copy: maps-at-rest.steps.4.more -->
we proposed a few possibilities: replaying the most rewarding options more often, replaying the links that connect the two kinds of knowledge (here, food and service), or simply replaying at random. the four maps on the right show the same break under each strategy, plus one more that favors the weakest links. each strategy prepares a different set of comparisons.
<!-- /copy -->

### step 5: interaction hint

<!-- copy: maps-at-rest.steps.4.hint -->
each map is the average of many breaks with that strategy, so the differences come from the strategy itself rather than chance.
<!-- /copy -->

### go deeper: paragraph 1

<!-- copy: maps-at-rest.deep.0 -->
in our commentary, we discussed what the brain might choose to replay, and what that would mean for later decisions. our final figure compares a few possibilities: replaying the most rewarding options more often, replaying links that connect the two kinds of knowledge (here, food and service), or replaying at random. these are our proposals for how rest could prepare you for future choices; the original study did not compare them.
<!-- /copy -->

### go deeper: paragraph 2

<!-- copy: maps-at-rest.deep.1 -->
the demo lets you try those three, plus a fourth: replaying whichever links are currently weakest, as if the brain prioritized what it remembers least. every version starts with the same a → b → c example. each replay strengthens the two links it visits plus the direct link between the ends, and links that don’t get replayed fade a little. different replay strategies end up preparing different comparisons.
<!-- /copy -->

### takeaway: heading

<!-- copy: maps-at-rest.takeawayTitle -->
our idea
<!-- /copy -->

### takeaway

<!-- copy: maps-at-rest.takeaway -->
even when we rest, the brain keeps working, rehearsing what we’ve learned to better prepare us for future choices. *replay* can turn a chain of experiences into a direct connection that’s ready when you need it. but the brain can’t replay everything, so what it prioritizes could determine which future choices become easier. what excites me is that this is testable: if replay favors certain kinds of experiences, we should be able to see which comparisons people get better at.
<!-- /copy -->

### sources / 0 / label

<!-- copy: maps-at-rest.sources.0.label -->
our commentary
<!-- /copy -->

### sources / 1 / label

<!-- copy: maps-at-rest.sources.1.label -->
the original study
<!-- /copy -->

### brain evidence

## 2026 · subjective value

The scenes appear in order. The scene titles are editing labels, not visible headlines. Keep tokens such as `{{a.amount}}` intact: the website replaces them with the visitor’s own offers. `text` and `more` are separate paragraphs; `hint` is the smaller line below them.

### title

<!-- copy: subjective-value.title -->
preferences shape how the brain maps options
<!-- /copy -->

### deck

<!-- copy: subjective-value.deck -->
we found evidence that brain regions known for navigation organize options by what they’re worth to each person. a map like this could help people evaluate options they’ve never encountered.
<!-- /copy -->

### the gist: paragraph 1

<!-- copy: subjective-value.gist.0 -->
how do you choose something you’ve never tried? say it’s your usual, dependable coffee shop versus a new café that might be amazing but could also be a letdown. even before you taste anything, its menu and reviews give you clues about how good the coffee could be and how likely it is to deliver, compared with the coffee shops you already know.
<!-- /copy -->

### the gist: paragraph 2

<!-- copy: subjective-value.gist.1 -->
those two clues, how good something could be and how likely you are to get it, are the basic ingredients of most uncertain choices. in the lab, we turned them into amounts of money and chances of winning, which we can control precisely. while 35 adults chose between these gambles, we used fMRI (which tracks blood flow as a stand-in for brain activity) to ask whether the brain lays them out as a ‘cognitive map’, an internal map of how options relate, like its maps of places. we found map-like patterns in entorhinal cortex, a navigation hub, and in medial prefrontal cortex, which helps both represent maps and track value. these patterns followed each participant’s own preferences (their ‘subjective value’), not just the objective numbers.
<!-- /copy -->

### scene 1: five choices

<!-- copy: subjective-value.steps.0.label -->
five choices
<!-- /copy -->

<!-- copy: subjective-value.steps.0.title -->
which would you rather play?
<!-- /copy -->

<!-- copy: subjective-value.steps.0.text -->
which gamble would you rather play? make these hypothetical choices—then i’ll explain what your brain is likely doing to help make these choices.
<!-- /copy -->

<!-- copy: subjective-value.steps.0.hint -->
participants in our study made tradeoffs like these. we’ll come back to your answers in a moment.
<!-- /copy -->

### scene 2: locate one option

<!-- copy: subjective-value.steps.1.label -->
locate one option
<!-- /copy -->

<!-- copy: subjective-value.steps.1.title -->
putting an option on the map
<!-- /copy -->

<!-- copy: subjective-value.steps.1.text -->
let’s put one of those offers on a map. option a offered {{a.amount}} with a {{a.chance}} chance of winning. go across to its chance, then up to its amount. that’s where it sits.
<!-- /copy -->

<!-- copy: subjective-value.steps.1.more -->
on the map to the right, each dot is a possible offer. farther right is a better chance and farther up is more money, so the top-right corner is a big reward you can count on (i.e., $10 with 100% chance). each offer gets a spot on the map, even one you’ve never seen.
<!-- /copy -->

<!-- copy: subjective-value.steps.1.hint -->
for now, the map is spaced by the plain numbers, the same for everyone.
<!-- /copy -->

### scene 3: locate the comparison

<!-- copy: subjective-value.steps.2.label -->
locate the comparison
<!-- /copy -->

<!-- copy: subjective-value.steps.2.title -->
a choice becomes a line on the map
<!-- /copy -->

<!-- copy: subjective-value.steps.2.text -->
option b offered {{b.amount}} with a {{b.chance}} chance. same rule, different spot. one option has more money at stake, and the other gives you a better shot at winning something.
<!-- /copy -->

<!-- copy: subjective-value.steps.2.more -->
the line between them is the tradeoff. a map keeps track of how all the options relate, so you can compare any two without memorizing an answer for every pair.
<!-- /copy -->

<!-- copy: subjective-value.steps.2.hint -->
the two colored dots are the offers on the cards.
<!-- /copy -->

### scene 4: revisit your choices

<!-- copy: subjective-value.steps.3.label -->
revisit your choices
<!-- /copy -->

<!-- copy: subjective-value.steps.3.title -->
your choices on the map
<!-- /copy -->

<!-- copy: subjective-value.steps.3.text -->
{{review.intro}} chance sets how far right each offer sits, and amount sets how high.
<!-- /copy -->

<!-- copy: subjective-value.steps.3.more -->
the map isn’t fitted to you yet. it’s the same layout for everyone, with your comparisons drawn on it.
<!-- /copy -->

<!-- copy: subjective-value.steps.3.hint -->
each line connects one pair you saw, and a ring marks the one you picked.
<!-- /copy -->

### scene 5: something new

<!-- copy: subjective-value.steps.4.label -->
something new
<!-- /copy -->

<!-- copy: subjective-value.steps.4.title -->
room for a new option
<!-- /copy -->

<!-- copy: subjective-value.steps.4.text -->
here are two offers you haven’t seen. we can place them right away because we know their chances and amounts. you don’t need to have played either one to compare them.
<!-- /copy -->

<!-- copy: subjective-value.steps.4.more -->
same with a new café. its menu and reviews hint at how good the coffee could be and how likely it is to deliver. that’s enough to place it among the cafés you already know. this is what makes a cognitive map useful: new things fit into an existing structure that represents café features.
<!-- /copy -->

<!-- copy: subjective-value.steps.4.hint -->
in our study, we tested whether brain regions known for navigation help organize these options.
<!-- /copy -->

### scene 6: a dependable cup

<!-- copy: subjective-value.steps.5.label -->
a dependable cup
<!-- /copy -->

<!-- copy: subjective-value.steps.5.title -->
preferences reshape the map
<!-- /copy -->

<!-- copy: subjective-value.steps.5.text -->
but the same offer can mean different things to different people. say you just need a decent cup of coffee. the familiar Starbucks is the safe bet, and a bad cup from somewhere new is not worth the risk.
<!-- /copy -->

<!-- copy: subjective-value.steps.5.more -->
with money, that’s like preferring a good chance at a smaller reward. this map is stretched to show those preferences, which we call a ‘subjective value’ map: higher means the reward feels more valuable, and farther right means the chance feels better. now b’s better odds count for more than a’s bigger prize, even though the offers themselves haven’t changed. to describe preferences like these, we use a computational model: a few equations, fit to someone’s choices, that capture how much they weigh chances against amounts.
<!-- /copy -->

<!-- copy: subjective-value.steps.5.hint -->
with these example preferences, the model picks b. this isn’t your map yet.
<!-- /copy -->

### scene 7: an adventurous day

<!-- copy: subjective-value.steps.6.label -->
an adventurous day
<!-- /copy -->

<!-- copy: subjective-value.steps.6.title -->
the same offers on an adventurous day
<!-- /copy -->

<!-- copy: subjective-value.steps.6.text -->
now say you’re feeling adventurous. you’re curious about the new café, and a shot at amazing coffee is worth the risk of a bad cup.
<!-- /copy -->

<!-- copy: subjective-value.steps.6.more -->
watch the two offers. a keeps most of its height, while b slides down and to the left. the bigger prize now matters more than the better odds, so the model picks a. the riskier option got more appealing without its odds changing at all.
<!-- /copy -->

<!-- copy: subjective-value.steps.6.hint -->
these are two example ways to weigh the same offers. next, a map based on your answers.
<!-- /copy -->

### scene 8: your rough map

<!-- copy: subjective-value.steps.7.label -->
your rough map
<!-- /copy -->

<!-- copy: subjective-value.steps.7.title -->
a rough sketch of your map
<!-- /copy -->

<!-- copy: subjective-value.steps.7.text -->
{{personal.intro}}
<!-- /copy -->

<!-- copy: subjective-value.steps.7.more -->
five choices can’t pin down exactly how someone weighs odds and rewards, so a map like this is only a rough sketch. in the lab, we ask participants many more questions. (it’s also not a personality test, or a prediction of your coffee order.)
<!-- /copy -->

<!-- copy: subjective-value.steps.7.hint -->
based on this map, the model predicts which of the two new offers would be preferred.
<!-- /copy -->

### scene 9: the brain result

<!-- copy: subjective-value.steps.8.label -->
the brain result
<!-- /copy -->

<!-- copy: subjective-value.steps.8.title -->
the personal map showed up in the brain
<!-- /copy -->

<!-- copy: subjective-value.steps.8.text -->
so does the brain use a map like this? while 35 participants compared offers in the scanner, we looked for a ‘grid-like code’, a signal that comes from cells the brain uses to create ‘cognitive maps’ of different spaces (the details tab explains how it works).
<!-- /copy -->

<!-- copy: subjective-value.steps.8.more -->
we found this signal in the two brain regions we expected: entorhinal cortex and medial prefrontal cortex, where grid-like signals have been found before. importantly, and what we found most interesting, the signal matched each participant’s own subjective value map, not the objective amounts and chances. what’s more, the brain showed this signal even when participants were making comparisons they had never made before. that last part is why i think the brain organizes options as a map: if it only stored a value for each pair it had already seen, a new comparison would have nothing to draw on, but a map lets you place a new option relative to the ones you already know.
<!-- /copy -->

<!-- copy: subjective-value.steps.8.hint -->
next: what “grid-like” means.
<!-- /copy -->

### go deeper: paragraph 1

<!-- copy: subjective-value.deep.0 -->
we found two kinds of evidence for a subjective value map. the first is about direction (the ‘grid-like code’). grid cells, neurons first found in the entorhinal cortex of navigating animals (a discovery that won a Nobel Prize), fire at locations arranged in a hexagonal grid, like a honeycomb. (this is not an accident! hexagons are the most efficient way to tile a flat surface, and they show up all over nature: in honeycombs, snowflakes, a fly’s eye, and even the storms at the poles of Saturn and Jupiter. but i digress…) grid-like signals have since been found in medial prefrontal cortex too. with fMRI, we looked for a signal that varied with this hexagonal pattern as participants compared gambles, treating each comparison as a step in some direction across the map.
<!-- /copy -->

### go deeper: paragraph 2

<!-- copy: subjective-value.deep.1 -->
the question was which map the signal followed: the objective one, or each participant’s *subjective* one. in entorhinal and medial prefrontal cortex, it followed the *subjective* map, including for pairs participants hadn’t practiced in training.
<!-- /copy -->

### go deeper: paragraph 3

<!-- copy: subjective-value.deep.2 -->
the second is about location (the ‘2D positional code’). if two options sit close together on someone’s subjective map, does the brain respond to them more similarly? we found that it did. this held even across two different sets of shapes we used to stand for the options, so the brain was tracking where an option sat on the map, not what it looked like.
<!-- /copy -->

### go deeper: paragraph 5

<!-- copy: subjective-value.deep.4 -->
about the demo: in the real task, participants learned amounts and chances from abstract shapes, then compared combinations in the scanner. here we just show the numbers. when the demo says “the model picks” an option, that’s our computational model’s prediction: it weighs each option’s chance and amount by the estimated preferences, combines them into one value, and favors the higher one. it doesn’t simply pick whichever option is closer to the top-right corner.
<!-- /copy -->

### takeaway: heading

<!-- copy: subjective-value.takeawayTitle -->
why i’m excited about it
<!-- /copy -->

### takeaway

<!-- copy: subjective-value.takeaway -->
this study shows one way that the brain can organize information, including how it can incorporate new options into an existing ‘map’ of preferences. it is difficult to store or memorize a value for every café, job, or opportunity you might come across, but relatively easier to organize information into a map by placing these new things *relative* to other things in the map. and because the map is shaped by your own preferences, where a new option lands depends on what matters to you.
<!-- /copy -->

### sources / 0 / label

<!-- copy: subjective-value.sources.0.label -->
read the preprint
<!-- /copy -->

### sources / 1 / label

<!-- copy: subjective-value.sources.1.label -->
study data
<!-- /copy -->

### sources / 2 / label

<!-- copy: subjective-value.sources.2.label -->
unthresholded brain maps
<!-- /copy -->

### figures / 0 / alt

<!-- copy: subjective-value.figures.0.alt -->
figure 2 shows objective and subjective value spaces, decision vectors, and predicted sixfold grid-like modulation
<!-- /copy -->

### figures / 0 / caption

<!-- copy: subjective-value.figures.0.caption -->
figure 2 · objective and subjective decision vectors, and the grid-like pattern tested in the preprint.
<!-- /copy -->

### brain evidence

### brain / title

<!-- copy: subjective-value.brain.title -->
a navigation system, applied to value
<!-- /copy -->

### brain / measure

<!-- copy: subjective-value.brain.measure -->
fMRI · 35 adults choosing between gambles
<!-- /copy -->

### brain / intro

<!-- copy: subjective-value.brain.intro -->
green marks where we found the grid-like signal following each person’s own map.
<!-- /copy -->

### brain / regions / 0 / role

<!-- copy: subjective-value.brain.regions.0.role -->
best known for keeping track of where things are as we navigate.
<!-- /copy -->

### brain / regions / 0 / finding

<!-- copy: subjective-value.brain.regions.0.finding -->
the right entorhinal cortex showed the grid-like signal for comparisons on the subjective value map, including ones participants had never made in training.
<!-- /copy -->

### brain / regions / 1 / role

<!-- copy: subjective-value.brain.regions.1.role -->
it helps represent maps of how things relate and track how much options are worth.
<!-- /copy -->

### brain / regions / 1 / finding

<!-- copy: subjective-value.brain.regions.1.finding -->
it showed the grid-like signal too, which fits both of its roles: representing maps and tracking value.
<!-- /copy -->

### brain / alt

<!-- copy: subjective-value.brain.alt -->
subjective grid-like fMRI map from figure 3A: green responses in medial prefrontal and entorhinal regions, with the original t-statistic scale
<!-- /copy -->

### brain / caption

<!-- copy: subjective-value.brain.caption -->
lighter green means stronger evidence (the bar shows the t-statistic scale). shown at P < 0.01, uncorrected; the paper’s tests are corrected within independently defined regions.
<!-- /copy -->

### brain / links / 0 / label

<!-- copy: subjective-value.brain.links.0.label -->
unthresholded study maps
<!-- /copy -->

### brain / links / 1 / label

<!-- copy: subjective-value.brain.links.1.label -->
background: grid cells
<!-- /copy -->

### brain / links / 2 / label

<!-- copy: subjective-value.brain.links.2.label -->
background: value in the brain
<!-- /copy -->






## research page and interactive introductions

### research · title

<!-- copy: research.title -->
what i work on
<!-- /copy -->

### research · intro

<!-- copy: research.intro -->
i study how the brain uses what we know to figure out what options are worth. i’m especially interested in how we piece separate experiences together, and how that helps us judge something new. two ideas run through all of my work: cognitive maps and subjective value.
<!-- /copy -->

### research · maps · title

<!-- copy: research.maps.title -->
cognitive maps
<!-- /copy -->

### research · maps · text

<!-- copy: research.maps.text -->
a street map shows how places relate, so you can plan a route you’ve never taken. a cognitive map is the brain’s version: an internal map of how things relate to each other. it can organize places, but also people or options, along whatever dimensions matter. this means relationships you already know can help answer questions you’ve never been asked.
<!-- /copy -->

### research · value · title

<!-- copy: research.value.title -->
subjective value
<!-- /copy -->

### research · value · text

<!-- copy: research.value.text -->
an option’s value is how much it’s worth to you, and that depends on its features, your preferences, and what you expect to happen. you might pick a reliable café over an exciting but uncertain one; someone else might take the gamble. i study how the brain combines those pieces into a choice.
<!-- /copy -->

### research · connection · title

<!-- copy: research.connection.title -->
using maps to figure out value
<!-- /copy -->

### research · connection · text

<!-- copy: research.connection.text -->
we can’t store a value for every choice we might face. in our latest study, we found that entorhinal cortex and medial prefrontal cortex, regions that help the brain map how things relate, organize the ingredients of value in a way that lets us compare options we’ve never seen. these maps followed each person’s own preferences, not just the objective numbers. in a commentary on a study where people navigated by smell, we also wrote about which parts of these maps are shared across senses and which are specialized.
<!-- /copy -->

### research · learning · title

<!-- copy: research.learning.title -->
how experiences become a map
<!-- /copy -->

### research · learning · text

<!-- copy: research.learning.text -->
experiences come one at a time, in different places and situations. in a commentary, we wrote about how the brain might stitch them into one map during a break, by replaying them, and which experiences it might choose to replay to make later decisions easier.
<!-- /copy -->

### research · social · title

<!-- copy: research.social.title -->
learning from other people’s choices
<!-- /copy -->

### research · social · text

<!-- copy: research.social.text -->
my PhD work looked at how other people’s choices change what an option is worth to us, and when copying them becomes a shortcut. we studied teens choosing alongside peers, and people with damage to brain regions that help weigh risk.
<!-- /copy -->

### research · methods

<!-- copy: research.methods -->
i combine decision tasks, computational models (equations that describe how someone might be making a choice), and measurements of brain activity: mostly fMRI, recordings from electrodes inside the brain, and studies of people with brain damage. the models make our ideas precise enough to test, and the behavior and brain data tell us which ideas fit best.
<!-- /copy -->

### home · preview · caption · objective

<!-- copy: home.preview.caption.objective -->
each dot is a possible gamble. the line connects the two offers above.
<!-- /copy -->

### home · preview · caption · subjective

<!-- copy: home.preview.caption.subjective -->
the offers haven’t changed. these example preferences change how they relate to each other.
<!-- /copy -->

### replay · intro

<!-- copy: replay.intro -->
no new experiences during this break. the brain can still be connecting the ones it already has.
<!-- /copy -->

### replay · broad · description

<!-- copy: replay.broad.description -->
after the opening example, each three-place sequence has the same chance of being replayed. practice spreads across the connections.
<!-- /copy -->

### replay · reward · description

<!-- copy: replay.reward.description -->
favor sequences that prepare comparisons involving c, the rewarding destination in this example. its relationships become easier to bring to mind.
<!-- /copy -->

### replay · uncertain · description

<!-- copy: replay.uncertain.description -->
favor sequences whose direct endpoint connection is weakest. this what-if rule gives more practice to relationships that are harder to bring to mind.
<!-- /copy -->

### replay · bridge · description

<!-- copy: replay.bridge.description -->
favor sequences connecting places whose food and service rankings disagree. replay could help bring those two kinds of knowledge together.
<!-- /copy -->


<!-- editorial note: the PLOS paper verifies prior surgery and hospital-registry recruitment but does not specify the diagnosis or indication. Confirm before adding epilepsy, tumor, or another clinical reason. -->

## lib/paper-plots · labels and small text

### ui.paper-plots.start

<!-- copy: ui.paper-plots.start -->
start
<!-- /copy -->

### ui.paper-plots.food-ranking

<!-- copy: ui.paper-plots.food-ranking -->
food ranking
<!-- /copy -->

### ui.paper-plots.service-ranking

<!-- copy: ui.paper-plots.service-ranking -->
service ranking
<!-- /copy -->

### ui.paper-plots.better-service

<!-- copy: ui.paper-plots.better-service -->
better service
<!-- /copy -->

### ui.paper-plots.better-food

<!-- copy: ui.paper-plots.better-food -->
better food →
<!-- /copy -->

### ui.paper-plots.78-adolescents-social-value-estimates-higher

<!-- copy: ui.paper-plots.78-adolescents-social-value-estimates-higher -->
78 adolescents’ social-value estimates. Higher values mean more added value from peers’ choices. 0.5 is neutral. Blue means no reported substance use; coral means reported substance use.
<!-- /copy -->

### ui.paper-plots.an-illustrative-grid-of-100-gamble

<!-- copy: ui.paper-plots.an-illustrative-grid-of-100-gamble -->
An illustrative grid of 100 gamble locations in probability and amount space. Two example options are connected by a comparison line.
<!-- /copy -->

### ui.paper-plots.illustrative-spatial-map-with-four-landmarks

<!-- copy: ui.paper-plots.illustrative-spatial-map-with-four-landmarks -->
Illustrative spatial map with four landmarks and a route from the starting point to the garden. Landmarks can be identified by names or odors.
<!-- /copy -->

### ui.paper-plots.illustration-four-places-ranked-separately-for

<!-- copy: ui.paper-plots.illustration-four-places-ranked-separately-for -->
Illustration: four places ranked separately for food and service. The same places can be combined into a two-dimensional map.
<!-- /copy -->

### ui.paper-plots.no-reported-use

<!-- copy: ui.paper-plots.no-reported-use -->
never used
<!-- /copy -->

### ui.paper-plots.reported-use

<!-- copy: ui.paper-plots.reported-use -->
some use
<!-- /copy -->

### ui.paper-plots.subjective-probability-normalized

<!-- copy: ui.paper-plots.subjective-probability-normalized -->
subjective probability (normalized)
<!-- /copy -->

### ui.paper-plots.chance-of-winning

<!-- copy: ui.paper-plots.chance-of-winning -->
chance of winning
<!-- /copy -->

### ui.paper-plots.bakery

<!-- copy: ui.paper-plots.bakery -->
bakery
<!-- /copy -->

### ui.paper-plots.warm-bread

<!-- copy: ui.paper-plots.warm-bread -->
warm bread
<!-- /copy -->

### ui.paper-plots.garden

<!-- copy: ui.paper-plots.garden -->
garden
<!-- /copy -->

### ui.paper-plots.coffee-shop

<!-- copy: ui.paper-plots.coffee-shop -->
coffee shop
<!-- /copy -->

### ui.paper-plots.woodshop

<!-- copy: ui.paper-plots.woodshop -->
woodshop
<!-- /copy -->

### ui.paper-plots.a

<!-- copy: ui.paper-plots.a -->
a
<!-- /copy -->

### ui.paper-plots.b

<!-- copy: ui.paper-plots.b -->
b
<!-- /copy -->

### ui.paper-plots.c

<!-- copy: ui.paper-plots.c -->
c
<!-- /copy -->

### ui.paper-plots.d

<!-- copy: ui.paper-plots.d -->
d
<!-- /copy -->

## lib/social-plot · labels and small text

### ui.social-plot.44-participant-estimates-of-following-weight

<!-- copy: ui.social-plot.44-participant-estimates-of-following-weight -->
44 participant estimates of following weight, on a scale from zero to one. Comparison group: 28 people; insula lesion group: 10; dacc lesion group: 6. Weights are model estimates, not percentages of choices.
<!-- /copy -->

## components/BrainEvidence · labels and small text

### ui.brain-evidence.the-brain-evidence

<!-- copy: ui.brain-evidence.the-brain-evidence -->
the brain evidence
<!-- /copy -->

### ui.brain-evidence.read-the-original-study-and-figure

<!-- copy: ui.brain-evidence.read-the-original-study-and-figure -->
read the original study and figure
<!-- /copy -->

### ui.brain-evidence.more-about-the-brain-result

<!-- copy: ui.brain-evidence.more-about-the-brain-result -->
what we found here
<!-- /copy -->

### ui.brain-evidence.original-study

<!-- copy: ui.brain-evidence.original-study -->
· original study ↗
<!-- /copy -->

### ui.brain-evidence.see-the-complete-brain-data-figure

<!-- copy: ui.brain-evidence.see-the-complete-brain-data-figure -->
see the complete brain-data figure
<!-- /copy -->

### ui.brain-evidence.complete-figure-3-with-brain-maps

<!-- copy: ui.brain-evidence.complete-figure-3-with-brain-maps -->
complete figure 3 with brain maps, individual estimates, symmetry controls, and behavioral correlations
<!-- /copy -->

## components/Footer · labels and small text

### ui.footer.mark-orloff

<!-- copy: ui.footer.mark-orloff -->
mark orloff
<!-- /copy -->

### ui.footer.decision-neuroscientist

<!-- copy: ui.footer.decision-neuroscientist -->
/ decision neuroscientist
<!-- /copy -->

### ui.footer.elsewhere

<!-- copy: ui.footer.elsewhere -->
elsewhere
<!-- /copy -->

### ui.footer.email

<!-- copy: ui.footer.email -->
email
<!-- /copy -->

### ui.footer.google-scholar

<!-- copy: ui.footer.google-scholar -->
Google Scholar
<!-- /copy -->

### ui.footer.github

<!-- copy: ui.footer.github -->
GitHub
<!-- /copy -->

### ui.footer.orcid

<!-- copy: ui.footer.orcid -->
ORCID
<!-- /copy -->

### ui.footer.x

<!-- copy: ui.footer.x -->
X
<!-- /copy -->

## components/Nav · labels and small text

### ui.nav.main-navigation

<!-- copy: ui.nav.main-navigation -->
main navigation
<!-- /copy -->

### ui.nav.mark-orloff-home

<!-- copy: ui.nav.mark-orloff-home -->
mark orloff — home
<!-- /copy -->

### ui.nav.mark-orloff

<!-- copy: ui.nav.mark-orloff -->
mark orloff
<!-- /copy -->

### theme toggle · switch to light mode (screen reader label)

<!-- copy: ui.theme.to-light -->
switch to light mode
<!-- /copy -->

### theme toggle · switch to dark mode (screen reader label)

<!-- copy: ui.theme.to-dark -->
switch to dark mode
<!-- /copy -->

## components/OdorMap · labels and small text

### ui.odor-map.different-cues-the-same-spatial-relationships

<!-- copy: ui.odor-map.different-cues-the-same-spatial-relationships -->
same places, different cues
<!-- /copy -->

### ui.odor-map.try-finding-the-places

<!-- copy: ui.odor-map.try-finding-the-places -->
try finding the places
<!-- /copy -->

### ui.odor-map.choose-a-scent-on-the-map

<!-- copy: ui.odor-map.choose-a-scent-on-the-map -->
choose a scent on the map. which one would lead you there?
<!-- /copy -->

### ui.odor-map.start-again

<!-- copy: ui.odor-map.start-again -->
start again
<!-- /copy -->

### ui.odor-map.destination

<!-- copy: ui.odor-map.destination -->
destination
<!-- /copy -->

### ui.odor-map.the-garden-and-its-floral-smell

<!-- copy: ui.odor-map.the-garden-and-its-floral-smell -->
the garden and its floral smell locate the same place in this example.
<!-- /copy -->

### ui.odor-map.illustrative-landmarks-odors-and-routes-map

<!-- copy: ui.odor-map.illustrative-landmarks-odors-and-routes-map -->
landmarks, smells, and routes in an imaginary neighborhood.
<!-- /copy -->

### ui.odor-map.the-study-discussed-in

<!-- copy: ui.odor-map.the-study-discussed-in -->
the study discussed in
<!-- /copy -->

### ui.odor-map.orloff-boorman-2023

<!-- copy: ui.odor-map.orloff-boorman-2023 -->
Orloff & Boorman, 2023
<!-- /copy -->

### ui.odor-map.used-odor-landmarks-in-a-virtual

<!-- copy: ui.odor-map.used-odor-landmarks-in-a-virtual -->
used odor landmarks in a virtual environment.
<!-- /copy -->

### shortcut round · prompt

<!-- copy: ui.odor-compass.prompt -->
you’re where it smells like {{odor}}. which way is the {{place}}?
<!-- /copy -->

### shortcut round · progress

<!-- copy: ui.odor-compass.progress -->
shortcut {{current}} of {{total}}
<!-- /copy -->

### shortcut round · how to answer

<!-- copy: ui.odor-compass.hint -->
click or tap in the direction you’d head. arrow keys and enter work too.
<!-- /copy -->

### shortcut round · close answer

<!-- copy: ui.odor-compass.close -->
nice, only {{degrees}}° off. you’ve never walked this route, but the map got you there.
<!-- /copy -->

### shortcut round · exact answer

<!-- copy: ui.odor-compass.perfect -->
perfect, right on target! you’ve never walked this route, but the map got you there.
<!-- /copy -->

### shortcut round · far answer

<!-- copy: ui.odor-compass.far -->
{{degrees}}° off. the {{place}} is where the dashed line points.
<!-- /copy -->

### shortcut round · finished

<!-- copy: ui.odor-compass.done -->
across all three shortcuts, you were {{degrees}}° off on average, on routes you’d never taken.
<!-- /copy -->

### shortcut round · your position

<!-- copy: ui.odor-compass.you-are-here -->
you · {{odor}}
<!-- /copy -->

### shortcut round · screen reader description

<!-- copy: ui.odor-compass.aria -->
map for the shortcut game. you’re where it smells like {{odor}}. choose a direction toward the {{place}} with the arrow keys, then press enter.
<!-- /copy -->

## components/PaperReader · labels and small text

### ui.paper-reader.figure-from-our-commentary

<!-- copy: ui.paper-reader.figure-from-our-commentary -->
figure from our commentary.
<!-- /copy -->

### ui.paper-reader.figure-2a-valuation-related-responses-to

<!-- copy: ui.paper-reader.figure-2a-valuation-related-responses-to -->
figure 2a · valuation-related responses to peers’ safe and risky choices.
<!-- /copy -->

### ui.paper-reader.all-publications

<!-- copy: ui.paper-reader.all-publications -->
← all publications
<!-- /copy -->

### ui.paper-reader.preprint-may-2026-not-yet-peer

<!-- copy: ui.paper-reader.preprint-may-2026-not-yet-peer -->
preprint · not yet peer reviewed
<!-- /copy -->

### ui.paper-reader.the-original-research

<!-- copy: ui.paper-reader.the-original-research -->
the original study
<!-- /copy -->

### ui.paper-reader.reading-depth

<!-- copy: ui.paper-reader.reading-depth -->
reading depth
<!-- /copy -->

### ui.paper-reader.the-gist

<!-- copy: ui.paper-reader.the-gist -->
the short version
<!-- /copy -->

### ui.paper-reader.30-seconds

<!-- copy: ui.paper-reader.30-seconds -->
30 seconds
<!-- /copy -->

### ui.paper-reader.walk-me-through-it

<!-- copy: ui.paper-reader.walk-me-through-it -->
walk through it
<!-- /copy -->

### ui.paper-reader.5-minutes

<!-- copy: ui.paper-reader.5-minutes -->
5 minutes
<!-- /copy -->

### ui.paper-reader.3-minutes

<!-- copy: ui.paper-reader.3-minutes -->
3 minutes
<!-- /copy -->

### ui.paper-reader.go-deeper

<!-- copy: ui.paper-reader.go-deeper -->
the details
<!-- /copy -->

### ui.paper-reader.another-layer

<!-- copy: ui.paper-reader.another-layer -->
methods & numbers
<!-- /copy -->

### ui.paper-reader.explore-the-idea-with-me

<!-- copy: ui.paper-reader.explore-the-idea-with-me -->
walk through it
<!-- /copy -->

### ui.paper-reader.see-the-original-figure

<!-- copy: ui.paper-reader.see-the-original-figure -->
see the original figure
<!-- /copy -->

### ui.paper-reader.open-the-original-figure-at-full

<!-- copy: ui.paper-reader.open-the-original-figure-at-full -->
open the original figure at full size
<!-- /copy -->

### ui.paper-reader.view-full-size

<!-- copy: ui.paper-reader.view-full-size -->
view full size →
<!-- /copy -->

### ui.paper-reader.read-the-full

<!-- copy: ui.paper-reader.read-the-full -->
read the full
<!-- /copy -->

### ui.paper-reader.figure-from-our-commentary.2

<!-- copy: ui.paper-reader.figure-from-our-commentary.2 -->
figure from our commentary
<!-- /copy -->

### ui.paper-reader.from-our-commentary

<!-- copy: ui.paper-reader.from-our-commentary -->
from our commentary ·
<!-- /copy -->

### ui.paper-reader.orloff-boorman

<!-- copy: ui.paper-reader.orloff-boorman -->
Orloff & Boorman,
<!-- /copy -->

### ui.paper-reader.back

<!-- copy: ui.paper-reader.back -->
← back
<!-- /copy -->

### ui.paper-reader.next

<!-- copy: ui.paper-reader.next -->
next →
<!-- /copy -->

### ui.paper-reader.the

<!-- copy: ui.paper-reader.the -->
the
<!-- /copy -->

### ui.paper-reader.equal-contribution

<!-- copy: ui.paper-reader.equal-contribution -->
· * equal contribution
<!-- /copy -->

## components/PeerPlot · labels and small text

### peer plot · title when peers choose safely

<!-- copy: ui.peer-plot.title-safe -->
safe influence
<!-- /copy -->

### peer plot · title when peers take a risk

<!-- copy: ui.peer-plot.title-risky -->
risky influence
<!-- /copy -->

### ui.peer-plot.behavior-or-brain-data

<!-- copy: ui.peer-plot.behavior-or-brain-data -->
behavior or brain data
<!-- /copy -->

### ui.peer-plot.in-their-choices

<!-- copy: ui.peer-plot.in-their-choices -->
in their choices
<!-- /copy -->

### ui.peer-plot.in-the-brain

<!-- copy: ui.peer-plot.in-the-brain -->
in the brain
<!-- /copy -->

### ui.peer-plot.anatomical-image-from-figure-2a-yellow

<!-- copy: ui.peer-plot.anatomical-image-from-figure-2a-yellow -->
interactive 3D view of the left half of the brain from the inside, with vmPFC in color. drag to rotate or use the arrow keys.
<!-- /copy -->

### ui.peer-plot.vmpfc

<!-- copy: ui.peer-plot.vmpfc -->
vmPFC
<!-- /copy -->

### ui.peer-plot.helps-represent-how-much-an-option

<!-- copy: ui.peer-plot.helps-represent-how-much-an-option -->
it helps track how much an option is worth to us. the color shows roughly where vmPFC is, not the exact spot the estimates below come from.
<!-- /copy -->
### ui.peer-plot.type-of-peer-influence

<!-- copy: ui.peer-plot.type-of-peer-influence -->
type of peer influence
<!-- /copy -->

### ui.peer-plot.peers-choose-safely

<!-- copy: ui.peer-plot.peers-choose-safely -->
peers choose safely
<!-- /copy -->

### ui.peer-plot.peers-take-a-risk

<!-- copy: ui.peer-plot.peers-take-a-risk -->
peers take a risk
<!-- /copy -->

### ui.peer-plot.safer-peers-a-stronger-response-in

<!-- copy: ui.peer-plot.safer-peers-a-stronger-response-in -->
safe peers: a stronger response in teens who had never used substances.
<!-- /copy -->

### ui.peer-plot.published-association-p-0-021

<!-- copy: ui.peer-plot.published-association-p-0-021 -->
for the aficionados: the difference between the groups from the paper: P = 0.021
<!-- /copy -->

### ui.peer-plot.no-reported-substance-use

<!-- copy: ui.peer-plot.no-reported-substance-use -->
never used substances
<!-- /copy -->

### ui.peer-plot.reported-substance-use

<!-- copy: ui.peer-plot.reported-substance-use -->
some substance use
<!-- /copy -->

### ui.peer-plot.social-value-index

<!-- copy: ui.peer-plot.social-value-index -->
social-value index
<!-- /copy -->

### ui.peer-plot.colored-dots-individuals-grey-circles-means

<!-- copy: ui.peer-plot.colored-dots-individuals-grey-circles-means -->
colored dots are individual teens; grey circles are group averages ± standard error. the dashed line at 0.5 means peers added nothing.
<!-- /copy -->

### ui.peer-plot.source

<!-- copy: ui.peer-plot.source -->
source:
<!-- /copy -->

### ui.peer-plot.chung-orloff-et-al-2020

<!-- copy: ui.peer-plot.chung-orloff-et-al-2020 -->
Chung, Orloff et al., 2020 ↗
<!-- /copy -->

### ui.peer-plot.figures-1b-2a

<!-- copy: ui.peer-plot.figures-1b-2a -->
· figures 1b & 2a.
<!-- /copy -->

### ui.peer-plot.see-the-plotted-values

<!-- copy: ui.peer-plot.see-the-plotted-values -->
see the plotted values
<!-- /copy -->

### ui.peer-plot.rescaled-model-estimates-these-are-not

<!-- copy: ui.peer-plot.rescaled-model-estimates-these-are-not -->
rescaled model estimates, not how often someone copied.
<!-- /copy -->

### ui.peer-plot.social-value-estimates-for-78-anonymous

<!-- copy: ui.peer-plot.social-value-estimates-for-78-anonymous -->
social-value estimates for all 78 teens (anonymized)
<!-- /copy -->

### ui.peer-plot.display-label

<!-- copy: ui.peer-plot.display-label -->
display label
<!-- /copy -->

### ui.peer-plot.safer-peers

<!-- copy: ui.peer-plot.safer-peers -->
safer peers
<!-- /copy -->

### ui.peer-plot.riskier-peers

<!-- copy: ui.peer-plot.riskier-peers -->
riskier peers
<!-- /copy -->

### ui.peer-plot.see-the-brain-estimates

<!-- copy: ui.peer-plot.see-the-brain-estimates -->
see the brain estimates
<!-- /copy -->

### ui.peer-plot.31-of-the-same-participants-value

<!-- copy: ui.peer-plot.31-of-the-same-participants-value -->
31 of the same teens; value-related estimates from vmPFC.
<!-- /copy -->

### ui.peer-plot.vmpfc-estimates-from-figure-2a

<!-- copy: ui.peer-plot.vmpfc-estimates-from-figure-2a -->
vmPFC estimates from figure 2a
<!-- /copy -->

## peer game · safer-peers opening game

### peer game · round counter

<!-- copy: ui.peer-game.progress -->
round {{current}} of {{total}}
<!-- /copy -->

### peer game · question when playing alone

<!-- copy: ui.peer-game.prompt-solo -->
which gamble would you rather play?
<!-- /copy -->

### peer game · question after seeing other players

<!-- copy: ui.peer-game.prompt-social -->
two other players picked first. which would you rather play?
<!-- /copy -->

### peer game · line under each gamble

<!-- copy: ui.peer-game.coin -->
a coin flip: you win one amount or the other
<!-- /copy -->

### peer game · what another player chose

<!-- copy: ui.peer-game.player -->
player {{number}} chose {{option}}
<!-- /copy -->

### peer game · after a choice

<!-- copy: ui.peer-game.got-it -->
got it.
<!-- /copy -->

### peer game · before the rounds with other players

<!-- copy: ui.peer-game.social-start -->
now you’ll see what two other players picked first.
<!-- /copy -->

### peer game · result heading

<!-- copy: ui.peer-game.summary-heading -->
did the other players sway you?
<!-- /copy -->

### peer game · result when you switched

<!-- copy: ui.peer-game.summary-switched -->
you switched to match the other players {{count}} of {{total}} times: {{safe}} when they played it safe and {{risky}} when they took the risk.
<!-- /copy -->

### peer game · result when you never switched

<!-- copy: ui.peer-game.summary-stayed -->
you never switched to match the other players. you stuck with what you picked on your own.
<!-- /copy -->

### peer game · counter when finished

<!-- copy: ui.peer-game.finished -->
done
<!-- /copy -->

### peer game · play again

<!-- copy: ui.peer-game.play-again -->
play again
<!-- /copy -->

### peer game · next button before finishing

<!-- copy: ui.peer-game.skip -->
skip the game →
<!-- /copy -->

### peer game · next button after finishing

<!-- copy: ui.peer-game.continue -->
see what 78 teens did →
<!-- /copy -->

### peer game · note under the game

<!-- copy: ui.peer-game.note -->
made-up gambles in the style of our task. no real money, and your answers stay on this page.
<!-- /copy -->

### peer game · screen reader label for the two gambles

<!-- copy: ui.peer-game.options -->
two gambles
<!-- /copy -->

### peer game · screen reader label for one gamble

<!-- copy: ui.peer-game.aria-option -->
option {{option}}: a coin flip between {{low}} and {{high}}{{peers}}
<!-- /copy -->

### peer game · screen reader note when the other players chose a gamble

<!-- copy: ui.peer-game.aria-peers -->
. both other players chose this
<!-- /copy -->

## fog game · social-conformity opening game

### fog game · question on a clear round

<!-- copy: ui.fog-game.prompt-clear -->
two other players chose {{color}}. which would you rather play?
<!-- /copy -->

### fog game · question on a foggy round

<!-- copy: ui.fog-game.prompt-foggy -->
this one’s fogged over. two other players chose {{color}}. which would you rather play?
<!-- /copy -->

### fog game · red

<!-- copy: ui.fog-game.red -->
red
<!-- /copy -->

### fog game · blue

<!-- copy: ui.fog-game.blue -->
blue
<!-- /copy -->

### fog game · line on a fogged card

<!-- copy: ui.fog-game.unreadable -->
too foggy to read
<!-- /copy -->

### fog game · result heading

<!-- copy: ui.fog-game.summary-heading -->
when did you follow them?
<!-- /copy -->

### fog game · result counts

<!-- copy: ui.fog-game.summary -->
on clear gambles, you went with the other players {{clear}} of {{clearTotal}} times. on foggy ones, {{foggy}} of {{foggyTotal}}.
<!-- /copy -->

### fog game · result when you followed more in the fog

<!-- copy: ui.fog-game.summary-more -->
when you couldn’t judge the gambles yourself, you relied on their choice instead.
<!-- /copy -->

### fog game · result otherwise

<!-- copy: ui.fog-game.summary-same -->
you followed about as often either way. in our study, how much people relied on others varied a lot, even among healthy adults.
<!-- /copy -->

### fog game · next button after finishing

<!-- copy: ui.fog-game.continue -->
see what 44 people did →
<!-- /copy -->

### fog game · screen reader label for the two gambles

<!-- copy: ui.fog-game.options -->
a red gamble and a blue gamble
<!-- /copy -->

### fog game · screen reader label for a foggy gamble

<!-- copy: ui.fog-game.aria-foggy -->
the {{color}} gamble, too foggy to read
<!-- /copy -->

### fog game · screen reader label for a clear gamble

<!-- copy: ui.fog-game.aria-clear -->
the {{color}} gamble: {{chance}} chance to win {{amount}}
<!-- /copy -->

## components/RestMap · labels and small text

### ui.rest-map.from-separate-experiences-to-a-shared

<!-- copy: ui.rest-map.from-separate-experiences-to-a-shared -->
from separate experiences to a shared map
<!-- /copy -->

### ui.rest-map.replay-selection-rule

<!-- copy: ui.rest-map.replay-selection-rule -->
replay selection rule
<!-- /copy -->

### ui.rest-map.simulate-12-replays

<!-- copy: ui.rest-map.simulate-12-replays -->
watch the first replay
<!-- /copy -->

### ui.rest-map.reset-map

<!-- copy: ui.rest-map.reset-map -->
start over
<!-- /copy -->

### ui.rest-map.0-simulated-replays

<!-- copy: ui.rest-map.0-simulated-replays -->
0 simulated replays
<!-- /copy -->

### ui.rest-map.how-to-connect-the-options

<!-- copy: ui.rest-map.how-to-connect-the-options -->
how to connect the options
<!-- /copy -->

### ui.rest-map.use-the-map

<!-- copy: ui.rest-map.use-the-map -->
use the map
<!-- /copy -->

### ui.rest-map.recall-the-learned-links

<!-- copy: ui.rest-map.recall-the-learned-links -->
recall the learned links
<!-- /copy -->

### ui.rest-map.each-row-ranks-the-same-four

<!-- copy: ui.rest-map.each-row-ranks-the-same-four -->
each row ranks the same four places by a different quality.
<!-- /copy -->

### ui.rest-map.conceptual-animation-of-combining-relationships-and

<!-- copy: ui.rest-map.conceptual-animation-of-combining-relationships-and -->
thicker lines are links that are easier to bring to mind; shrinking halos show a place’s position becoming clearer.
<!-- /copy -->

### ui.rest-map.inspired-by-the-question-discussed-in

<!-- copy: ui.rest-map.inspired-by-the-question-discussed-in -->
based on the discussion in
<!-- /copy -->

### ui.rest-map.orloff-boorman-2025

<!-- copy: ui.rest-map.orloff-boorman-2025 -->
Orloff & Boorman, 2025
<!-- /copy -->

## components/SocialPlot · labels and small text

### ui.social-plot.following-other-people-s-choices

<!-- copy: ui.social-plot.following-other-people-s-choices -->
following other people’s choices
<!-- /copy -->

### ui.social-plot.fig-3a

<!-- copy: ui.social-plot.fig-3a -->
fig. 3a
<!-- /copy -->

### ui.social-plot.plot-view

<!-- copy: ui.social-plot.plot-view -->
plot view
<!-- /copy -->

### ui.social-plot.compare-groups

<!-- copy: ui.social-plot.compare-groups -->
compare groups
<!-- /copy -->

### ui.social-plot.see-the-relationship

<!-- copy: ui.social-plot.see-the-relationship -->
see the relationship
<!-- /copy -->

### ui.social-plot.following-weight

<!-- copy: ui.social-plot.following-weight -->
following weight
<!-- /copy -->

### ui.social-plot.higher-more-reliance-on-following

<!-- copy: ui.social-plot.higher-more-reliance-on-following -->
higher = more reliance on following
<!-- /copy -->

### ui.social-plot.solo-utility-model-mismatch

<!-- copy: ui.social-plot.solo-utility-model-mismatch -->
solo utility-model mismatch
<!-- /copy -->

### ui.social-plot.higher-worse-fit

<!-- copy: ui.social-plot.higher-worse-fit -->
higher = worse fit
<!-- /copy -->

### ui.social-plot.highlight-a-participant-group

<!-- copy: ui.social-plot.highlight-a-participant-group -->
highlight a participant group
<!-- /copy -->

### ui.social-plot.all

<!-- copy: ui.social-plot.all -->
all
<!-- /copy -->

### ui.social-plot.healthy-adults

<!-- copy: ui.social-plot.healthy-adults -->
healthy adults
<!-- /copy -->

### ui.social-plot.insula

<!-- copy: ui.social-plot.insula -->
insula
<!-- /copy -->

### ui.social-plot.dacc

<!-- copy: ui.social-plot.dacc -->
dACC
<!-- /copy -->

### ui.social-plot.clear-selected-participant

<!-- copy: ui.social-plot.clear-selected-participant -->
clear selected participant
<!-- /copy -->

### ui.social-plot.clear

<!-- copy: ui.social-plot.clear -->
clear
<!-- /copy -->

### ui.social-plot.each-colored-dot-is-a-person

<!-- copy: ui.social-plot.each-colored-dot-is-a-person -->
each colored dot is a person. grey circles show group means; bars show ± standard error. for the aficionados: both lesion groups vs healthy adults, P = 0.014.
<!-- /copy -->

### ui.social-plot.redrawn-from

<!-- copy: ui.social-plot.redrawn-from -->
redrawn from
<!-- /copy -->

### ui.social-plot.orloff-et-al-2024

<!-- copy: ui.social-plot.orloff-et-al-2024 -->
Orloff et al., 2024
<!-- /copy -->

### ui.social-plot.data-code

<!-- copy: ui.social-plot.data-code -->
data & code ↗
<!-- /copy -->

### ui.social-plot.highlight-a-participant

<!-- copy: ui.social-plot.highlight-a-participant -->
highlight a participant
<!-- /copy -->

### ui.social-plot.choose-a-participant

<!-- copy: ui.social-plot.choose-a-participant -->
choose a participant
<!-- /copy -->

### ui.social-plot.anonymous-display-labels-weights-are-posterior

<!-- copy: ui.social-plot.anonymous-display-labels-weights-are-posterior -->
anonymous display labels; weights are posterior medians, not percentages of observed choices.
<!-- /copy -->

### ui.social-plot.participant-estimates-underlying-the-interactive-plot

<!-- copy: ui.social-plot.participant-estimates-underlying-the-interactive-plot -->
participant estimates underlying the interactive plot
<!-- /copy -->

### ui.social-plot.participant

<!-- copy: ui.social-plot.participant -->
participant
<!-- /copy -->

### ui.social-plot.solo-mismatch-log-likelihood

<!-- copy: ui.social-plot.solo-mismatch-log-likelihood -->
solo mismatch (−log likelihood)
<!-- /copy -->

## components/ValueMap · labels and small text

### ui.value-map.choice-1-of-5

<!-- copy: ui.value-map.choice-1-of-5 -->
choice 1 of 5
<!-- /copy -->

### ui.value-map.choices-completed

<!-- copy: ui.value-map.choices-completed -->
choices completed
<!-- /copy -->

### ui.value-map.two-money-options

<!-- copy: ui.value-map.two-money-options -->
two money options
<!-- /copy -->

### ui.value-map.option

<!-- copy: ui.value-map.option -->
option
<!-- /copy -->

### ui.value-map.chance-to-win

<!-- copy: ui.value-map.chance-to-win -->
% chance to win
<!-- /copy -->

### ui.value-map.otherwise-0

<!-- copy: ui.value-map.otherwise-0 -->
otherwise $0
<!-- /copy -->

### ui.value-map.choose-this

<!-- copy: ui.value-map.choose-this -->
choose this
<!-- /copy -->

### ui.value-map.amount-to-win

<!-- copy: ui.value-map.amount-to-win -->
amount to win
<!-- /copy -->

### ui.value-map.this-activity-needs-javascript-the-full

<!-- copy: ui.value-map.this-activity-needs-javascript-the-full -->
this activity needs javascript. the full explanation and original study remain available below.
<!-- /copy -->

## components/ValuePreview · labels and small text

### ui.value-preview.more-to-win-or-a-better

<!-- copy: ui.value-preview.more-to-win-or-a-better -->
a big win, or a likely one?
<!-- /copy -->

### ui.value-preview.preview-map

<!-- copy: ui.value-preview.preview-map -->
preview map
<!-- /copy -->

### ui.value-preview.the-objective-map

<!-- copy: ui.value-preview.the-objective-map -->
the objective map
<!-- /copy -->

### ui.value-preview.add-a-preference

<!-- copy: ui.value-preview.add-a-preference -->
add a preference
<!-- /copy -->

### ui.value-preview.a-30-chance-of-8-b

<!-- copy: ui.value-preview.a-30-chance-of-8-b -->
a: 30% chance of $8 · b: 80% chance of $3
<!-- /copy -->

## data/brain-evidence · labels and small text

### ui.brain-evidence.ventromedial-prefrontal-cortex-vmpfc

<!-- copy: ui.brain-evidence.ventromedial-prefrontal-cortex-vmpfc -->
ventromedial prefrontal cortex (vmPFC)
<!-- /copy -->

### ui.brain-evidence.chung-orloff-et-al-2020-pnas

<!-- copy: ui.brain-evidence.chung-orloff-et-al-2020-pnas -->
Chung, Orloff et al., 2020 · PNAS
<!-- /copy -->

### ui.brain-evidence.anterior-piriform-cortex

<!-- copy: ui.brain-evidence.anterior-piriform-cortex -->
anterior piriform cortex
<!-- /copy -->

### ui.brain-evidence.clara-u-raithel-alexander-j-miller

<!-- copy: ui.brain-evidence.clara-u-raithel-alexander-j-miller -->
Clara U. Raithel, Alexander J. Miller, Russell A. Epstein, Thorsten Kahnt & Jay A. Gottfried
<!-- /copy -->

### ui.brain-evidence.study-source-data

<!-- copy: ui.brain-evidence.study-source-data -->
study source data
<!-- /copy -->

### ui.brain-evidence.study-brain-maps

<!-- copy: ui.brain-evidence.study-brain-maps -->
study brain maps
<!-- /copy -->

### ui.brain-evidence.dorsal-anterior-cingulate-cortex-dacc

<!-- copy: ui.brain-evidence.dorsal-anterior-cingulate-cortex-dacc -->
dorsal anterior cingulate cortex (dACC)
<!-- /copy -->

### ui.brain-evidence.orloff-et-al-2024-plos-computational

<!-- copy: ui.brain-evidence.orloff-et-al-2024-plos-computational -->
Orloff et al., 2024 · PLOS Computational Biology
<!-- /copy -->

### ui.brain-evidence.zhibing-xiao-xiongfei-wang-jinbo-zhang

<!-- copy: ui.brain-evidence.zhibing-xiao-xiongfei-wang-jinbo-zhang -->
Zhibing Xiao, Xiongfei Wang, Jinbo Zhang, Jianxin Ou, Li He, Yukun Qu, Xiangyu Hu, Tim Behrens & Yunzhe Liu
<!-- /copy -->

### ui.brain-evidence.entorhinal-cortex

<!-- copy: ui.brain-evidence.entorhinal-cortex -->
entorhinal cortex
<!-- /copy -->

### ui.brain-evidence.medial-prefrontal-cortex

<!-- copy: ui.brain-evidence.medial-prefrontal-cortex -->
medial prefrontal cortex
<!-- /copy -->

### ui.brain-evidence.orloff-et-al-2026-biorxiv-preprint

<!-- copy: ui.brain-evidence.orloff-et-al-2026-biorxiv-preprint -->
Orloff et al., 2026 · bioRxiv preprint
<!-- /copy -->

## data/navigation · labels and small text

### ui.navigation.home

<!-- copy: ui.navigation.home -->
home
<!-- /copy -->

### ui.navigation.brain-regions

<!-- copy: ui.navigation.brain-regions -->
brain!
<!-- /copy -->

### ui.navigation.research

<!-- copy: ui.navigation.research -->
research
<!-- /copy -->

### ui.navigation.publications

<!-- copy: ui.navigation.publications -->
publications
<!-- /copy -->

### ui.navigation.cv

<!-- copy: ui.navigation.cv -->
cv
<!-- /copy -->

### ui.navigation.about

<!-- copy: ui.navigation.about -->
about
<!-- /copy -->

## data/paper-stories · labels and small text

### ui.paper-stories.social-influence-study-2020

<!-- copy: ui.paper-stories.social-influence-study-2020 -->
2020 study · PNAS
<!-- /copy -->

### ui.paper-stories.cognitive-maps-commentary-2023

<!-- copy: ui.paper-stories.cognitive-maps-commentary-2023 -->
2023 commentary · Current Biology
<!-- /copy -->

### ui.paper-stories.cognitive-maps-commentary-2025

<!-- copy: ui.paper-stories.cognitive-maps-commentary-2025 -->
2025 commentary · Neuron
<!-- /copy -->

### ui.paper-stories.subjective-value-biorxiv-preprint-2026

<!-- copy: ui.paper-stories.subjective-value-biorxiv-preprint-2026 -->
bioRxiv · 2026
<!-- /copy -->

## data/site · labels and small text

### ui.site.i-study-how-people-decide-what

<!-- copy: ui.site.i-study-how-people-decide-what -->
i’m a decision neuroscientist at UCLA. i study how we figure out what our options are worth, how other people sway our choices, and how the brain builds mental maps to help us decide.
<!-- /copy -->

## layouts/BaseLayout · labels and small text

### ui.base-layout.skip-to-content

<!-- copy: ui.base-layout.skip-to-content -->
skip to content
<!-- /copy -->

## lib/replay-demo · labels and small text

### ui.replay-demo.sample-broadly

<!-- copy: ui.replay-demo.sample-broadly -->
sample broadly
<!-- /copy -->

### ui.replay-demo.favor-rewarding-options

<!-- copy: ui.replay-demo.favor-rewarding-options -->
favor rewarding options
<!-- /copy -->

### ui.replay-demo.favor-uncertain-links

<!-- copy: ui.replay-demo.favor-uncertain-links -->
favor uncertain links
<!-- /copy -->

### ui.replay-demo.connect-the-dimensions

<!-- copy: ui.replay-demo.connect-the-dimensions -->
connect the dimensions
<!-- /copy -->

## lib/value-copy · labels and small text

### ui.value-copy.here-is-an-example-pair-neither

<!-- copy: ui.value-copy.here-is-an-example-pair-neither -->
here’s an example pair.
<!-- /copy -->

### ui.value-copy.this-is-an-example-map-the

<!-- copy: ui.value-copy.this-is-an-example-map-the -->
this is an example map. the interactive activity can sketch one from your answers.
<!-- /copy -->

## pages/404 · labels and small text

### ui.404.not-found

<!-- copy: ui.404.not-found -->
not found
<!-- /copy -->

### ui.404.page-not-found

<!-- copy: ui.404.page-not-found -->
page not found
<!-- /copy -->

### ui.404.the-page-you-requested-doesn-t

<!-- copy: ui.404.the-page-you-requested-doesn-t -->
the page you requested doesn’t exist.
<!-- /copy -->

### ui.404.go-home

<!-- copy: ui.404.go-home -->
go home
<!-- /copy -->

## pages/about · labels and small text

### ui.about.title

<!-- copy: ui.about.title -->
about me
<!-- /copy -->

### ui.about.mark

<!-- copy: ui.about.mark -->
mark
<!-- /copy -->

### ui.about.intro

<!-- copy: ui.about.intro -->
i’m mark orloff, a decision neuroscientist and postdoc at UCLA, where i work with
<!-- /copy -->

### ui.about.ucla

<!-- copy: ui.about.ucla -->
UCLA
<!-- /copy -->

### ui.about.erie-boorman

<!-- copy: ui.about.erie-boorman -->
Erie Boorman
<!-- /copy -->

### ui.about.intro-lab

<!-- copy: ui.about.intro-lab -->
in the Learning and Decision Making Lab.
<!-- /copy -->

### ui.about.research

<!-- copy: ui.about.research -->
i study how the brain figures out what our options are worth, especially options we’ve never tried. lately, that’s meant asking whether the brain’s navigation system, the one that helps us find our way around, also organizes our options in ‘cognitive maps.’ i use fMRI, recordings from electrodes inside the brain, and computational models to study questions like this.
<!-- /copy -->

### ui.about.path

<!-- copy: ui.about.path -->
before UCLA, i was at Virginia Tech for both my undergrad in psychology and my PhD in translational biology, medicine, and health. as an undergrad, i worked with John Richey on fMRI studies of how we recognize emotions. for my PhD, i worked with Pearl Chiu, studying social influence. i joined Erie’s lab at UC Davis in 2021 and moved with it to UCLA.
<!-- /copy -->

### ui.about.site

<!-- copy: ui.about.site -->
the goal of this website is to share my research in a way that’s clearer, more interactive, and more fun than the papers alone. if something was hard to follow or made you curious to learn more (or wasn’t fun), i’d love to hear about it. i’ll do my best to make things clearer and/or add more about things you’re interested in!
<!-- /copy -->

### ui.about.reach-out

<!-- copy: ui.about.reach-out -->
i’m always happy to talk about my research, so feel free to reach out!
<!-- /copy -->

### ui.about.my-cv

<!-- copy: ui.about.my-cv -->
my cv
<!-- /copy -->

## pages/cv · labels and small text

### ui.cv.mark-orloff-s-curriculum-vitae

<!-- copy: ui.cv.mark-orloff-s-curriculum-vitae -->
mark orloff’s curriculum vitae.
<!-- /copy -->

### ui.cv.curriculum-vitae

<!-- copy: ui.cv.curriculum-vitae -->
curriculum vitae
<!-- /copy -->

### ui.cv.download

<!-- copy: ui.cv.download -->
download the pdf
<!-- /copy -->

### ui.cv.you-can-also

<!-- copy: ui.cv.you-can-also -->
you can also
<!-- /copy -->

### ui.cv.open-the-cv

<!-- copy: ui.cv.open-the-cv -->
open the cv →
<!-- /copy -->

### ui.cv.mark-orloff-s-curriculum-vitae.2

<!-- copy: ui.cv.mark-orloff-s-curriculum-vitae.2 -->
mark orloff’s curriculum vitae
<!-- /copy -->

### ui.cv.open-the-cv-as-a-pdf

<!-- copy: ui.cv.open-the-cv-as-a-pdf -->
open the cv as a pdf
<!-- /copy -->

## pages/index · labels and small text

### ui.index.how-do-we-decide

<!-- copy: ui.index.how-do-we-decide -->
how do we decide
<!-- /copy -->

### ui.index.what-matters

<!-- copy: ui.index.what-matters -->
what matters?
<!-- /copy -->

### ui.index.i-m

<!-- copy: ui.index.i-m -->
i’m
<!-- /copy -->

### ui.index.bio

<!-- copy: ui.index.bio -->
, a decision neuroscientist at UCLA. i study how we figure out what our options are worth, how other people sway our choices, and how the brain builds mental maps to help us decide.
<!-- /copy -->

### ui.index.a-little-about-me

<!-- copy: ui.index.a-little-about-me -->
more about me
<!-- /copy -->

### ui.index.section-latest

<!-- copy: ui.index.section-latest -->
latest
<!-- /copy -->

### ui.index.new-preprint

<!-- copy: ui.index.new-preprint -->
new preprint
<!-- /copy -->

### ui.index.all-publications

<!-- copy: ui.index.all-publications -->
all publications →
<!-- /copy -->

### ui.index.feature-text

<!-- copy: ui.index.feature-text -->
how do you choose something you’ve never tried, like a new café? our newest study suggests the brain uses its navigation system to help, with a map shaped by your own preferences.
<!-- /copy -->

### ui.index.feature-invite

<!-- copy: ui.index.feature-invite -->
try the task yourself and see what *your* map looks like!
<!-- /copy -->

### ui.index.explore-the-study

<!-- copy: ui.index.explore-the-study -->
explore the study
<!-- /copy -->

### ui.index.try-it

<!-- copy: ui.index.try-it -->
try it
<!-- /copy -->

### ui.index.orloff-park-blumwald-domenech

<!-- copy: ui.index.orloff-park-blumwald-domenech -->
Orloff, Park, Blumwald, Domenech
<!-- /copy -->

### ui.index.colleagues

<!-- copy: ui.index.colleagues -->
& colleagues
<!-- /copy -->

### ui.index.biorxiv-may-2026

<!-- copy: ui.index.biorxiv-may-2026 -->
bioRxiv · may 2026
<!-- /copy -->

### ui.index.section-more

<!-- copy: ui.index.section-more -->
more research
<!-- /copy -->

### ui.index.study-2024

<!-- copy: ui.index.study-2024 -->
2024 study
<!-- /copy -->

### ui.index.social-summary

<!-- copy: ui.index.social-summary -->
when judging the options yourself is hard, copying other people becomes a shortcut. we saw it in people with damage to brain areas that help weigh risk, and in many healthy adults too.
<!-- /copy -->

### ui.index.commentary

<!-- copy: ui.index.commentary -->
commentary ·
<!-- /copy -->

### ui.index.rest-summary

<!-- copy: ui.index.rest-summary -->
what the brain might choose to replay during a break, and how that could make later decisions easier.
<!-- /copy -->

### ui.index.explore-the-idea

<!-- copy: ui.index.explore-the-idea -->
explore the idea
<!-- /copy -->

## pages/projects · labels and small text

### ui.projects.code-projects

<!-- copy: ui.projects.code-projects -->
code & projects
<!-- /copy -->

### ui.projects.code-and-data-accompanying-my-research

<!-- copy: ui.projects.code-and-data-accompanying-my-research -->
code and data accompanying my research.
<!-- /copy -->

### ui.projects.code-projects.2

<!-- copy: ui.projects.code-projects.2 -->
code & projects
<!-- /copy -->

### ui.projects.resources-accompanying-the-research

<!-- copy: ui.projects.resources-accompanying-the-research -->
resources accompanying the research.
<!-- /copy -->

### ui.projects.social-conformity-decision-making

<!-- copy: ui.projects.social-conformity-decision-making -->
social conformity & decision-making
<!-- /copy -->

### ui.projects.the-public-repository-includes-data-and

<!-- copy: ui.projects.the-public-repository-includes-data-and -->
the public repository includes data and analysis code for our study of social decision-making after insula and dacc lesions.
<!-- /copy -->

### ui.projects.browse-the-data-code

<!-- copy: ui.projects.browse-the-data-code -->
browse the data & code ↗
<!-- /copy -->

### ui.projects.walk-through-the-findings

<!-- copy: ui.projects.walk-through-the-findings -->
walk through the findings →
<!-- /copy -->

## pages/publications/social-conformity · labels and small text

### ui.social-conformity.a-guided-look-at-social-conformity

<!-- copy: ui.social-conformity.a-guided-look-at-social-conformity -->
an interactive walkthrough of our study on copying other people’s choices after damage to the insula or dACC.
<!-- /copy -->

### ui.social-conformity.a-study-in-social-decision-making

<!-- copy: ui.social-conformity.a-study-in-social-decision-making -->
2024 study · PLOS Computational Biology
<!-- /copy -->

### ui.social-conformity.see-the-original-figure-panel

<!-- copy: ui.social-conformity.see-the-original-figure-panel -->
see the original figure panel
<!-- /copy -->

### ui.social-conformity.original-figure-3a-following-weight-estimates

<!-- copy: ui.social-conformity.original-figure-3a-following-weight-estimates -->
original figure 3a: following-weight estimates by group, with individual points and group means and standard errors
<!-- /copy -->

### ui.social-conformity.figure-3a

<!-- copy: ui.social-conformity.figure-3a -->
figure 3a ·
<!-- /copy -->

### ui.social-conformity.cc-by

<!-- copy: ui.social-conformity.cc-by -->
cc by
<!-- /copy -->

### ui.social-conformity.read-the-full-paper

<!-- copy: ui.social-conformity.read-the-full-paper -->
read the full paper
<!-- /copy -->

### ui.social-conformity.the-paper

<!-- copy: ui.social-conformity.the-paper -->
the paper
<!-- /copy -->

### ui.social-conformity.paper

<!-- copy: ui.social-conformity.paper -->
paper ↗
<!-- /copy -->

### ui.social-conformity.figure-data-attribution-cc-by

<!-- copy: ui.social-conformity.figure-data-attribution-cc-by -->
figure & data attribution: cc by ↗
<!-- /copy -->

## pages/publications · labels and small text

### ui.publications.description

<!-- copy: ui.publications.description -->
my papers, most with an interactive walkthrough you can explore in a few minutes.
<!-- /copy -->

### ui.publications.publications

<!-- copy: ui.publications.publications -->
publications
<!-- /copy -->

### ui.publications.intro

<!-- copy: ui.publications.intro -->
check out my interactive walkthroughs or dive straight into the papers.
<!-- /copy -->

### ui.publications.new

<!-- copy: ui.publications.new -->
new ·
<!-- /copy -->

### ui.publications.biorxiv

<!-- copy: ui.publications.biorxiv -->
bioRxiv
<!-- /copy -->

### ui.publications.preprint

<!-- copy: ui.publications.preprint -->
preprint
<!-- /copy -->

### ui.publications.feature-invite

<!-- copy: ui.publications.feature-invite -->
try the task yourself and see a rough sketch of your own map, then find out what we saw in the brain.
<!-- /copy -->

### ui.publications.filter-publications

<!-- copy: ui.publications.filter-publications -->
filter publications
<!-- /copy -->

### ui.publications.all-work

<!-- copy: ui.publications.all-work -->
all work
<!-- /copy -->

### ui.publications.studies

<!-- copy: ui.publications.studies -->
studies
<!-- /copy -->

### ui.publications.commentaries

<!-- copy: ui.publications.commentaries -->
commentaries
<!-- /copy -->

### ui.publications.walk-through-it

<!-- copy: ui.publications.walk-through-it -->
walk through it →
<!-- /copy -->

### ui.publications.read

<!-- copy: ui.publications.read -->
read
<!-- /copy -->

### ui.publications.figure-for-value

<!-- copy: ui.publications.figure-for-value -->
figure for {{value1}}
<!-- /copy -->

### ui.publications.equal-contribution

<!-- copy: ui.publications.equal-contribution -->
* equal contribution
<!-- /copy -->

### ui.publications.value-publications-shown

<!-- copy: ui.publications.value-publications-shown -->
{{value1}} publications shown
<!-- /copy -->

## pages/research · labels and small text

### ui.research.background

<!-- copy: ui.research.background -->
background
<!-- /copy -->

### ui.research.topic-maps-value

<!-- copy: ui.research.topic-maps-value -->
cognitive maps
<!-- /copy -->

### ui.research.walk-through-the-study

<!-- copy: ui.research.walk-through-the-study -->
preferences shape the brain’s maps
<!-- /copy -->

### ui.research.topic-learning

<!-- copy: ui.research.topic-learning -->
learning during rest (replay)
<!-- /copy -->

### ui.research.learning-during-rest

<!-- copy: ui.research.learning-during-rest -->
learning on a break
<!-- /copy -->

### ui.research.maps-built-from-smell

<!-- copy: ui.research.maps-built-from-smell -->
maps built from smells
<!-- /copy -->

### ui.research.topic-social

<!-- copy: ui.research.topic-social -->
social influence
<!-- /copy -->

### ui.research.following-as-a-shortcut

<!-- copy: ui.research.following-as-a-shortcut -->
following as a shortcut
<!-- /copy -->

### ui.research.when-peers-play-it-safe

<!-- copy: ui.research.when-peers-play-it-safe -->
when peer pressure makes teens safer
<!-- /copy -->

### ui.research.how-i-study-this

<!-- copy: ui.research.how-i-study-this -->
methods i use
<!-- /copy -->

## scripts/paper-plots · labels and small text

### ui.paper-plots.brain-regression-estimates

<!-- copy: ui.paper-plots.brain-regression-estimates -->
(brain regression estimates)
<!-- /copy -->

### ui.paper-plots.participant-value-safer-peers-value-riskier

<!-- copy: ui.paper-plots.participant-value-safer-peers-value-riskier -->
participant {{value1}}: safer peers {{value2}} · riskier peers {{value3}}{{value4}}
<!-- /copy -->

### ui.paper-plots.value-related-brain-response-regression-estimate

<!-- copy: ui.paper-plots.value-related-brain-response-regression-estimate -->
value-related brain response (regression estimate)
<!-- /copy -->

### ui.paper-plots.riskier-peers-no-clear-association-with

<!-- copy: ui.paper-plots.riskier-peers-no-clear-association-with -->
risky peers: no clear difference between the groups.
<!-- /copy -->

### ui.paper-plots.published-association-p-value

<!-- copy: ui.paper-plots.published-association-p-value -->
for the aficionados: the difference between the groups from the paper: P = {{value1}}
<!-- /copy -->

### ui.paper-plots.colored-dots-the-31-participants-with

<!-- copy: ui.paper-plots.colored-dots-the-31-participants-with -->
colored dots are the 31 teens who were scanned. grey circles are group averages ± standard error. zero means no value-related response.
<!-- /copy -->

### ui.paper-plots.colored-dots-all-78-participants-grey

<!-- copy: ui.paper-plots.colored-dots-all-78-participants-grey -->
colored dots are all 78 teens. grey circles are group averages ± standard error. 0.5 means peers added no value.
<!-- /copy -->

### ui.paper-plots.vmpfc-brain-regression

<!-- copy: ui.paper-plots.vmpfc-brain-regression -->
vmPFC brain regression
<!-- /copy -->

### ui.paper-plots.value-adolescents-value-estimates-when-peers

<!-- copy: ui.paper-plots.value-adolescents-value-estimates-when-peers -->
{{value1}} adolescents’ {{value2}} estimates when peers choose the {{value3}} option. Blue: no reported substance use; coral: reported use. Grey means and standard errors are drawn above the participant dots.
<!-- /copy -->

### ui.paper-plots.continue-to-the-study

<!-- copy: ui.paper-plots.continue-to-the-study -->
continue to the study →
<!-- /copy -->

### ui.paper-plots.value-4-places

<!-- copy: ui.paper-plots.value-4-places -->
{{value1}} / 4 places
<!-- /copy -->

### ui.paper-plots.yes-the-value-points-to-the

<!-- copy: ui.paper-plots.yes-the-value-points-to-the -->
yes—the {{value1}} points to the {{value2}}.
<!-- /copy -->

### ui.paper-plots.that-location-smells-of-value-try

<!-- copy: ui.paper-plots.that-location-smells-of-value-try -->
that location smells of {{value1}}. try a different cue for the {{value2}}.
<!-- /copy -->

### ui.paper-plots.four-scents-one-usable-map

<!-- copy: ui.paper-plots.four-scents-one-usable-map -->
you found all four.
<!-- /copy -->

### ui.paper-plots.where-is-the-value

<!-- copy: ui.paper-plots.where-is-the-value -->
where is the {{value1}}?
<!-- /copy -->

### ui.paper-plots.you-used-a-sensory-cue-to

<!-- copy: ui.paper-plots.you-used-a-sensory-cue-to -->
you used a smell to work out a location. the experiment asked whether the brain’s mapping system can use smells as landmarks too.
<!-- /copy -->

### ui.paper-plots.upper-left

<!-- copy: ui.paper-plots.upper-left -->
upper left
<!-- /copy -->

### ui.paper-plots.upper-right

<!-- copy: ui.paper-plots.upper-right -->
upper right
<!-- /copy -->

### ui.paper-plots.lower-right

<!-- copy: ui.paper-plots.lower-right -->
lower right
<!-- /copy -->

### ui.paper-plots.lower-left

<!-- copy: ui.paper-plots.lower-left -->
lower left
<!-- /copy -->

### ui.paper-plots.choose-value-in-the-value

<!-- copy: ui.paper-plots.choose-value-in-the-value -->
choose {{value1}} in the {{value2}}
<!-- /copy -->

### ui.paper-plots.the-scent-tells-you-what-might

<!-- copy: ui.paper-plots.the-scent-tells-you-what-might -->
the scent tells you what might be there; its position tells you where to go.
<!-- /copy -->

### ui.paper-plots.destination-value-the-route-keeps-its

<!-- copy: ui.paper-plots.destination-value-the-route-keeps-its -->
destination: {{value1}}. the route keeps its geometry when you change the cues.
<!-- /copy -->

### ui.paper-plots.find-four-imaginary-places-from-the

<!-- copy: ui.paper-plots.find-four-imaginary-places-from-the -->
Find four imaginary places from the odor cues. Choose any scent with a click, tap, or Enter.
<!-- /copy -->

### ui.paper-plots.illustrative-map-route-from-the-start

<!-- copy: ui.paper-plots.illustrative-map-route-from-the-start -->
Illustrative map. Route from the start to {{value1}}.
<!-- /copy -->

### ui.paper-plots.value-simulated-replays

<!-- copy: ui.paper-plots.value-simulated-replays -->
{{value1}} simulated replays
<!-- /copy -->

### ui.paper-plots.pause-replay

<!-- copy: ui.paper-plots.pause-replay -->
pause replay
<!-- /copy -->

### ui.paper-plots.replayed-value-comparisons-brighter-lines-show

<!-- copy: ui.paper-plots.replayed-value-comparisons-brighter-lines-show -->
replayed {{value1}} sequences. thicker lines are links that are easier to bring to mind.
<!-- /copy -->

### ui.paper-plots.during-the-break-no-new-information

<!-- copy: ui.paper-plots.during-the-break-no-new-information -->
watch two remembered links become a direct connection, while the person feels like they’re just resting.
<!-- /copy -->

### ui.paper-plots.value-and-value-offer-a-tradeoff

<!-- copy: ui.paper-plots.value-and-value-offer-a-tradeoff -->
{{value1}} and {{value2}} offer a tradeoff: one ranks higher for food, the other for service. deciding between them needs both dimensions.
<!-- /copy -->

### ui.paper-plots.value-ranks-higher-than-value-for

<!-- copy: ui.paper-plots.value-ranks-higher-than-value-for -->
{{value1}} ranks higher than {{value2}} for both food and service. the combined map makes that relationship visible.
<!-- /copy -->

### ui.paper-plots.the-illustrated-food-ranking-route-takes

<!-- copy: ui.paper-plots.the-illustrated-food-ranking-route-takes -->
this route uses {{value1}} remembered links, which must be put together for the comparison.
<!-- /copy -->

### ui.paper-plots.the-map-makes-a-direct-comparison

<!-- copy: ui.paper-plots.the-map-makes-a-direct-comparison -->
the direct relationship is ready to use: one connection, with fewer pieces to put together at decision time.
<!-- /copy -->

### ui.paper-plots.conceptual-illustration-valuevalue

<!-- copy: ui.paper-plots.conceptual-illustration-valuevalue -->
Conceptual illustration. {{value1}}{{value2}}
<!-- /copy -->

## scripts/publication-reader · labels and small text

### ui.publication-reader.go-deeper

<!-- copy: ui.publication-reader.go-deeper -->
the details →
<!-- /copy -->

## scripts/social-plot · labels and small text

### ui.social-plot.fig-3d

<!-- copy: ui.social-plot.fig-3d -->
fig. 3d
<!-- /copy -->

### ui.social-plot.the-same-44-people-now-positioned

<!-- copy: ui.social-plot.the-same-44-people-now-positioned -->
the same 44 people, now positioned by solo mismatch. the line is a linear fit across all participants. for the aficionados: r = 0.52, P = 2.7 × 10⁻⁴.
<!-- /copy -->

### ui.social-plot.following-weights-for-44-participants-in

<!-- copy: ui.social-plot.following-weights-for-44-participants-in -->
Following weights for 44 participants in three groups, with group means and standard errors. Tap or hover over a point to inspect it; a text table is available below.
<!-- /copy -->

### ui.social-plot.the-same-44-participants-solo-model

<!-- copy: ui.social-plot.the-same-44-participants-solo-model -->
The same 44 participants: solo model mismatch on the horizontal axis, following weight on the vertical axis. Higher mismatch relates to higher following across participants.
<!-- /copy -->

### ui.social-plot.solo-mismatch-value

<!-- copy: ui.social-plot.solo-mismatch-value -->
· solo mismatch {{value1}}
<!-- /copy -->

### ui.social-plot.value-following-valuevalue

<!-- copy: ui.social-plot.value-following-valuevalue -->
{{value1}} · following {{value2}}{{value3}}
<!-- /copy -->


## scripts/value-map · labels and small text

### ui.value-map.put-my-choices-on-a-map

<!-- copy: ui.value-map.put-my-choices-on-a-map -->
put your choices on a map →
<!-- /copy -->

### ui.value-map.use-this-choice

<!-- copy: ui.value-map.use-this-choice -->
use this choice →
<!-- /copy -->

### ui.value-map.use-these-value-choices

<!-- copy: ui.value-map.use-these-value-choices -->
use these {{value1}} choices →
<!-- /copy -->

### ui.value-map.skip-with-example-choices

<!-- copy: ui.value-map.skip-with-example-choices -->
skip choices →
<!-- /copy -->

### ui.value-map.undo-choice

<!-- copy: ui.value-map.undo-choice -->
← undo choice
<!-- /copy -->

### ui.value-map.value-5-choices

<!-- copy: ui.value-map.value-5-choices -->
{{value1}} / 5 choices
<!-- /copy -->

### ui.value-map.next-choice

<!-- copy: ui.value-map.next-choice -->
next choice →
<!-- /copy -->

### ui.value-map.now-something-new

<!-- copy: ui.value-map.now-something-new -->
next →
<!-- /copy -->

### ui.value-map.your-choice-value-value

<!-- copy: ui.value-map.your-choice-value-value -->
your choice {{value1}} / {{value2}}
<!-- /copy -->

### ui.value-map.an-example-choice

<!-- copy: ui.value-map.an-example-choice -->
an example choice
<!-- /copy -->

### ui.value-map.place-the-other-option

<!-- copy: ui.value-map.place-the-other-option -->
place the other option →
<!-- /copy -->

### ui.value-map.revisit-my-choices

<!-- copy: ui.value-map.revisit-my-choices -->
revisit your choices →
<!-- /copy -->

### ui.value-map.compare-these-options

<!-- copy: ui.value-map.compare-these-options -->
compare these options →
<!-- /copy -->

### ui.value-map.what-changes-with-preferences

<!-- copy: ui.value-map.what-changes-with-preferences -->
what changes with preferences? →
<!-- /copy -->

### ui.value-map.feeling-more-adventurous

<!-- copy: ui.value-map.feeling-more-adventurous -->
feeling more adventurous →
<!-- /copy -->

### ui.value-map.reveal-my-map

<!-- copy: ui.value-map.reveal-my-map -->
reveal your map →
<!-- /copy -->

### ui.value-map.show-one-possible-map

<!-- copy: ui.value-map.show-one-possible-map -->
show your map! →
<!-- /copy -->

### ui.value-map.what-did-the-brain-show

<!-- copy: ui.value-map.what-did-the-brain-show -->
what did the brain show? →
<!-- /copy -->

### ui.value-map.explore-the-brain-result

<!-- copy: ui.value-map.explore-the-brain-result -->
explore the brain result →
<!-- /copy -->

### ui.value-map.that-s-five-let-s-look

<!-- copy: ui.value-map.that-s-five-let-s-look -->
that’s five. let’s look at what those choices have in common.
<!-- /copy -->

### ui.value-map.got-it-here-s-the-next

<!-- copy: ui.value-map.got-it-here-s-the-next -->
got it. here’s the next pair.
<!-- /copy -->

### ui.value-map.there-are-no-right-answers-which

<!-- copy: ui.value-map.there-are-no-right-answers-which -->
there are no right answers. which option would you rather play?
<!-- /copy -->

### ui.value-map.five-choices-made

<!-- copy: ui.value-map.five-choices-made -->
five choices made
<!-- /copy -->

### ui.value-map.choice-value-of-5

<!-- copy: ui.value-map.choice-value-of-5 -->
choice {{value1}} of 5
<!-- /copy -->

### ui.value-map.your-choice-value-of-value

<!-- copy: ui.value-map.your-choice-value-of-value -->
your choice {{value1}} of {{value2}}
<!-- /copy -->

### ui.value-map.an-example-comparison

<!-- copy: ui.value-map.an-example-comparison -->
an example comparison
<!-- /copy -->

### ui.value-map.a-rough-sketch-from-your-answers

<!-- copy: ui.value-map.a-rough-sketch-from-your-answers -->
one plausible map from your answers
<!-- /copy -->

### ui.value-map.an-illustrative-map-no-answers-yet

<!-- copy: ui.value-map.an-illustrative-map-no-answers-yet -->
an illustrative map · no answers yet
<!-- /copy -->

### ui.value-map.one-illustrative-preference

<!-- copy: ui.value-map.one-illustrative-preference -->
one illustrative preference
<!-- /copy -->

### ui.value-map.the-same-amounts-and-chances-for

<!-- copy: ui.value-map.the-same-amounts-and-chances-for -->
the same amounts and chances for everyone—the ‘objective’ map
<!-- /copy -->

### ui.value-map.chance-percent

<!-- copy: ui.value-map.chance-percent -->
{{value1}}%
<!-- /copy -->

### ui.value-map.chance-label

<!-- copy: ui.value-map.chance-label -->
chance to win
<!-- /copy -->

### ui.value-map.amount-label

<!-- copy: ui.value-map.amount-label -->
prize
<!-- /copy -->

### ui.value-map.choices-complete

<!-- copy: ui.value-map.choices-complete -->
choices complete
<!-- /copy -->

### ui.value-map.option-value-value-chance-to-win

<!-- copy: ui.value-map.option-value-value-chance-to-win -->
option {{value1}}: {{value2}}% chance to win ${{value3}}, otherwise $0{{value4}}
<!-- /copy -->

### ui.value-map.here-is-choice-value-from-your

<!-- copy: ui.value-map.here-is-choice-value-from-your -->
here’s choice {{value1}} from your game. you picked option {{value2}}, marked with a ring.
<!-- /copy -->

### ui.value-map.here-is-an-example-pair-because

<!-- copy: ui.value-map.here-is-an-example-pair-because -->
here’s an example pair.
<!-- /copy -->

### ui.value-map.using-your-value-answervalue-this-is

<!-- copy: ui.value-map.using-your-value-answervalue-this-is -->
using your {{value1}} answer{{value2}}, here’s our best rough guess at your map.
<!-- /copy -->

### ui.value-map.this-map-uses-the-settings-in

<!-- copy: ui.value-map.this-map-uses-the-settings-in -->
this is an example map, not an estimate of your preferences.
<!-- /copy -->

### ui.value-map.because-you-skipped-the-choices-this

<!-- copy: ui.value-map.because-you-skipped-the-choices-this -->
since you skipped the choices, this is a random example map, not an estimate of your preferences.
<!-- /copy -->

### ui.value-map.how-likely-it-feels

<!-- copy: ui.value-map.how-likely-it-feels -->
how likely it feels
<!-- /copy -->

### ui.value-map.how-much-the-reward-is-worth

<!-- copy: ui.value-map.how-much-the-reward-is-worth -->
how much the reward is worth to you
<!-- /copy -->

### ui.value-map.option-a-go-across-to-value

<!-- copy: ui.value-map.option-a-go-across-to-value -->
option a: go across to {{value1}}%, then up to ${{value2}}. those two ingredients locate the dot.
<!-- /copy -->

### ui.value-map.option-b-goes-at-value-and

<!-- copy: ui.value-map.option-b-goes-at-value-and -->
option b goes at {{value1}}% and ${{value2}}. the line shows how the two options differ.
<!-- /copy -->

### ui.value-map.the-ring-marks-your-answer-the

<!-- copy: ui.value-map.the-ring-marks-your-answer-the -->
the ring marks your answer. the map is still objective: its spacing has not used your preferences yet.
<!-- /copy -->

### ui.value-map.each-end-of-the-line-is

<!-- copy: ui.value-map.each-end-of-the-line-is -->
each end of the line is one offer. the map uses the amounts and chances printed on the cards.
<!-- /copy -->

### ui.value-map.these-settings-put-the-two-offers

<!-- copy: ui.value-map.these-settings-put-the-two-offers -->
these settings put the two offers close in value.
<!-- /copy -->

### ui.value-map.with-these-preferences-the-model-favors

<!-- copy: ui.value-map.with-these-preferences-the-model-favors -->
with these preferences, the model favors option {{value1}}.
<!-- /copy -->

### ui.value-map.value-the-offers-are-unchanged-their

<!-- copy: ui.value-map.value-the-offers-are-unchanged-their -->
{{value1}} the offers are unchanged; their spacing now reflects the weighting of chances and amounts.
<!-- /copy -->

### ui.value-map.two-new-offers-located-using-the

<!-- copy: ui.value-map.two-new-offers-located-using-the -->
two new offers, located using the same two ingredients. neither appeared in your five-choice game.
<!-- /copy -->

### ui.value-map.value-illustrative-value-map-value

<!-- copy: ui.value-map.value-illustrative-value-map-value -->
{{value1}} illustrative value map. {{value2}}
<!-- /copy -->

## Shared formats, short labels, and accessible descriptions

### format.money

<!-- copy: format.money -->
${{amount}}
<!-- /copy -->

### format.percent

<!-- copy: format.percent -->
{{percent}}%
<!-- /copy -->

### format.sample-size

<!-- copy: format.sample-size -->
n = {{count}}
<!-- /copy -->

### format.story-progress

<!-- copy: format.story-progress -->
{{current}} / {{total}}
<!-- /copy -->

### label.preprint

<!-- copy: label.preprint -->
preprint
<!-- /copy -->

### label.commentary

<!-- copy: label.commentary -->
commentary
<!-- /copy -->

### label.study

<!-- copy: label.study -->
study
<!-- /copy -->

### label.paper

<!-- copy: label.paper -->
paper
<!-- /copy -->

### label.objective

<!-- copy: label.objective -->
objective
<!-- /copy -->

### label.subjective

<!-- copy: label.subjective -->
subjective
<!-- /copy -->

### label.social-value

<!-- copy: label.social-value -->
social-value
<!-- /copy -->

### label.safer

<!-- copy: label.safer -->
safer
<!-- /copy -->

### label.riskier

<!-- copy: label.riskier -->
riskier
<!-- /copy -->

### label.flowers

<!-- copy: label.flowers -->
flowers
<!-- /copy -->

### label.coffee

<!-- copy: label.coffee -->
coffee
<!-- /copy -->

### label.cedar

<!-- copy: label.cedar -->
cedar
<!-- /copy -->

### contact.email

<!-- copy: contact.email -->
maorloff@ucla.edu
<!-- /copy -->

### value.option-chosen

<!-- copy: value.option-chosen -->
. you chose this option
<!-- /copy -->

### value.option-accessible

<!-- copy: value.option-accessible -->
option {{option}}: {{chance}} chance to win {{amount}}, otherwise $0{{chosen}}
<!-- /copy -->

### value.personal-one

<!-- copy: value.personal-one -->
based on your answer, here’s one plausible map of how you weighed these offers. it’s built the same way as the examples, but how much it weighs chance versus amount comes from your choice.
<!-- /copy -->

### value.personal-many

<!-- copy: value.personal-many -->
based on your {{count}} answers, here’s one plausible map of how you weighed these offers. it’s built the same way as the examples, but how much it weighs chance versus amount comes from your choices.
<!-- /copy -->

### value.annotation.favorable-corner

<!-- copy: value.annotation.favorable-corner -->
most appealing corner
<!-- /copy -->

### value.annotation.objective

<!-- copy: value.annotation.objective -->
toward the top right: more money and a better chance of winning.
<!-- /copy -->

### value.annotation.subjective

<!-- copy: value.annotation.subjective -->
toward the top right: a reward that feels more valuable and more likely. compare both dimensions when the options involve a tradeoff.
<!-- /copy -->

## Publication titles, citations, and listing descriptions

Author names are separated with a vertical bar (`|`). Links, dates, and data stay in the publication records.

### publication.safer-peers.title

<!-- copy: publication.safer-peers.title -->
Valuation of peers’ safe choices is associated with substance-naïveté in adolescents
<!-- /copy -->

### publication.safer-peers.venue

<!-- copy: publication.safer-peers.venue -->
Proceedings of the National Academy of Sciences, USA
<!-- /copy -->

### publication.safer-peers.summary

<!-- copy: publication.safer-peers.summary -->
teens who had never used substances put more value on peers’ safe choices, both in their decisions and in vmPFC, a brain region that tracks value.
<!-- /copy -->

### publication.safer-peers.figureAlt

<!-- copy: publication.safer-peers.figureAlt -->
main result figure for pnas article
<!-- /copy -->

### publication.safer-peers.authors

<!-- copy: publication.safer-peers.authors -->
Chung D* | Orloff MA* | Lauharatanahirun N | Chiu PH | King-Casas B
<!-- /copy -->

### publication.smell-and-space.title

<!-- copy: publication.smell-and-space.title -->
Cognitive maps: Constructing a route with your snout
<!-- /copy -->

### publication.smell-and-space.venue

<!-- copy: publication.smell-and-space.venue -->
Current Biology
<!-- /copy -->

### publication.smell-and-space.summary

<!-- copy: publication.smell-and-space.summary -->
our commentary on a study where people navigated by smell: we argue that a general mapping system works alongside specialized ones for each kind of information.
<!-- /copy -->

### publication.smell-and-space.figureAlt

<!-- copy: publication.smell-and-space.figureAlt -->
main result figure for current biology commentary showing cognitive map formation in piriform cortex for an olfactory navigation task
<!-- /copy -->

### publication.smell-and-space.authors

<!-- copy: publication.smell-and-space.authors -->
Orloff MA | Boorman ED
<!-- /copy -->

### publication.social-conformity.title

<!-- copy: publication.social-conformity.title -->
Social conformity is a heuristic when individual risky decision-making is disrupted
<!-- /copy -->

### publication.social-conformity.venue

<!-- copy: publication.social-conformity.venue -->
PLOS Computational Biology
<!-- /copy -->

### publication.social-conformity.summary

<!-- copy: publication.social-conformity.summary -->
people with insula or dACC damage relied more on copying others’ choices, and so did healthy adults whose own preferences explained their choices less well.
<!-- /copy -->

### publication.social-conformity.figureAlt

<!-- copy: publication.social-conformity.figureAlt -->
main result figure for plos computational biology article showing the effect of insula and dACC lesions on decision-making
<!-- /copy -->

### publication.social-conformity.authors

<!-- copy: publication.social-conformity.authors -->
Orloff MA* | Chung D* | Gu X* | Wang X | Gao Z | Song G | Tatineni C | Xu S | Casas B | Chiu PH
<!-- /copy -->

### publication.maps-at-rest.title

<!-- copy: publication.maps-at-rest.title -->
Off task map-making: Give it a rest!
<!-- /copy -->

### publication.maps-at-rest.venue

<!-- copy: publication.maps-at-rest.venue -->
Neuron
<!-- /copy -->

### publication.maps-at-rest.summary

<!-- copy: publication.maps-at-rest.summary -->
our commentary on a study of the brain at rest: we discuss how what the brain replays during a break could decide which future decisions get easier.
<!-- /copy -->

### publication.maps-at-rest.figureAlt

<!-- copy: publication.maps-at-rest.figureAlt -->
main result figure for neuron commentary showing the effect of rest on cognitive maps
<!-- /copy -->

### publication.maps-at-rest.authors

<!-- copy: publication.maps-at-rest.authors -->
Orloff MA | Boorman ED
<!-- /copy -->

### publication.subjective-value.title

<!-- copy: publication.subjective-value.title -->
A cognitive map of subjective value space for human risky choice
<!-- /copy -->

### publication.subjective-value.venue

<!-- copy: publication.subjective-value.venue -->
bioRxiv
<!-- /copy -->

### publication.subjective-value.summary

<!-- copy: publication.subjective-value.summary -->
we found that entorhinal and medial prefrontal cortex map options by what they’re worth to each person, not just by their objective odds and payoffs.
<!-- /copy -->

### publication.subjective-value.figureAlt

<!-- copy: publication.subjective-value.figureAlt -->
objective and subjective value spaces with example decision vectors
<!-- /copy -->

### publication.subjective-value.authors

<!-- copy: publication.subjective-value.authors -->
Orloff MA | Park SA | Blumwald J | Domenech P | Boorman ED
<!-- /copy -->

### comparison group label

<!-- copy: ui.social-plot.controls -->
healthy adults
<!-- /copy -->

## Anonymous participant display labels

<!-- copy: participant.group.control -->
comparison
<!-- /copy -->

<!-- copy: participant.label.control -->
comparison participant {{number}}
<!-- /copy -->

<!-- copy: participant.group.insula -->
insula lesion
<!-- /copy -->

<!-- copy: participant.label.insula -->
insula lesion participant {{number}}
<!-- /copy -->

<!-- copy: participant.group.acc -->
dacc lesion
<!-- /copy -->

<!-- copy: participant.label.acc -->
dacc lesion participant {{number}}
<!-- /copy -->

### one simulated replay

<!-- copy: replay.count.one -->
1 simulated replay
<!-- /copy -->


## Replay sequences · connections that become easier to use

### replay.run.start

<!-- copy: replay.run.start -->
watch {{a}} → {{b}} → {{c}}
<!-- /copy -->

### replay.run.continue

<!-- copy: replay.run.continue -->
keep replaying
<!-- /copy -->

### replay.run.resume

<!-- copy: replay.run.resume -->
resume replay
<!-- /copy -->

### replay.run.more

<!-- copy: replay.run.more -->
simulate 12 more sequences
<!-- /copy -->

### replay demo · label on the most-prepared comparison

<!-- copy: replay.compare.ready -->
ready to use
<!-- /copy -->

### replay demo · label on the least-prepared comparison

<!-- copy: replay.compare.long-way -->
still needs the long way
<!-- /copy -->

### replay demo · after a batch of replays

<!-- copy: replay.compare.summary -->
this strategy prepared {{best}} the most and {{worst}} the least. a well-practiced link can be used directly; a weak one means working through the chain of links instead.
<!-- /copy -->

### replay demo · comparison caption under the maps

<!-- copy: replay.compare.grid -->
the same break, four ways. thicker lines are links that are easier to bring to mind.
<!-- /copy -->

### replay demo · what sampling broadly does

<!-- copy: replay.broad.compare -->
practice spreads evenly, so the head start from the first replay (a → b → c) stays.
<!-- /copy -->

### replay demo · what favoring rewarding options does

<!-- copy: replay.reward.compare -->
the links to c, the rewarding place, end up strongest.
<!-- /copy -->

### replay demo · what favoring uncertain links does

<!-- copy: replay.uncertain.compare -->
the weakest links catch up, so the map evens out.
<!-- /copy -->

### replay demo · what connecting the dimensions does

<!-- copy: replay.bridge.compare -->
links between places that trade off food and service get more practice; a–d, the biggest tradeoff, ends up strongest.
<!-- /copy -->

### replay.key.thin

<!-- copy: replay.key.thin -->
harder to bring to mind
<!-- /copy -->

### replay.key.thick

<!-- copy: replay.key.thick -->
easier to bring to mind
<!-- /copy -->

### replay.stage.1

<!-- copy: replay.stage.1 -->
replay: {{a}} → {{b}}
<!-- /copy -->

### replay.stage.2

<!-- copy: replay.stage.2 -->
replay: {{a}} → {{b}} → {{c}}
<!-- /copy -->

### replay.stage.3

<!-- copy: replay.stage.3 -->
{{a}} → {{c}} is now easier to use
<!-- /copy -->

### replay.explanation.1

<!-- copy: replay.explanation.1 -->
first, revisit the relationship between {{a}} and {{b}}.
<!-- /copy -->

### replay.explanation.2

<!-- copy: replay.explanation.2 -->
then, connect that memory with {{b}} → {{c}}. the two experiences can be linked together.
<!-- /copy -->

### replay.explanation.3

<!-- copy: replay.explanation.3 -->
revisiting {{a}} → {{b}} → {{c}} also strengthened {{a}} → {{c}}. next time, you can compare them directly: one connection to use, instead of rebuilding a two-link chain. that work happened during the break.
<!-- /copy -->

### replay.comparison.unprepared

<!-- copy: replay.comparison.unprepared -->
{{a}}–{{c}} has not been strengthened during your replay yet. the faint, dashed line shows a comparison that could still use some preparation.
<!-- /copy -->

### replay.comparison.once

<!-- copy: replay.comparison.once -->
your replay strengthened {{a}}–{{c}} once. the direct connection is thicker now: this relationship has had some preparation before the choice arrives.
<!-- /copy -->

### replay.comparison.practiced

<!-- copy: replay.comparison.practiced -->
your replay strengthened {{a}}–{{c}} {{count}} times. its thicker direct connection reflects the preparation this particular comparison received.
<!-- /copy -->

### replay.comparison.not-ready

<!-- copy: replay.comparison.not-ready -->
you can still work this out using the learned links. the direct relationship has not yet been rehearsed in this replay session.
<!-- /copy -->

## Brain explorer

### explorer.title

<!-- copy: explorer.title -->
my favorite brain regions
<!-- /copy -->

### explorer.description

<!-- copy: explorer.description -->
pick a brain region to see where it is, what it does, and which of our studies looked at it. (no offense to the rest of the brain.)
<!-- /copy -->

### explorer.choose-region

<!-- copy: explorer.choose-region -->
choose a brain region
<!-- /copy -->

### explorer.hemisphere

<!-- copy: explorer.hemisphere -->
the left half of the brain
<!-- /copy -->

### explorer.canvas-label

<!-- copy: explorer.canvas-label -->
interactive view of the left half of the brain. front points toward your forehead. choose a region, drag to rotate, use the arrow keys, or zoom with the plus and minus keys.
<!-- /copy -->

### explorer.loading

<!-- copy: explorer.loading -->
bringing the brain into view…
<!-- /copy -->

### explorer.error

<!-- copy: explorer.error -->
the 3D view could not load. the region descriptions and study links are available below.
<!-- /copy -->

### explorer.camera

<!-- copy: explorer.camera -->
brain viewing angle
<!-- /copy -->

### explorer.medial

<!-- copy: explorer.medial -->
look inside
<!-- /copy -->

### explorer.lateral

<!-- copy: explorer.lateral -->
look outside
<!-- /copy -->

### explorer.reset

<!-- copy: explorer.reset -->
find this region
<!-- /copy -->

### explorer.gesture

<!-- copy: explorer.gesture -->
drag to rotate
<!-- /copy -->

### explorer.caption

<!-- copy: explorer.caption -->
the selected region is in color; other regions are gray. follow a study link to see the measured brain results.
<!-- /copy -->

### explorer.related

<!-- copy: explorer.related -->
my work about this brain region
<!-- /copy -->

### explorer.vmpfc.name

<!-- copy: explorer.vmpfc.name -->
vmPFC
<!-- /copy -->

### explorer.vmpfc.question

<!-- copy: explorer.vmpfc.question -->
what is this worth to me?
<!-- /copy -->

### explorer.vmpfc.text

<!-- copy: explorer.vmpfc.text -->
the ventromedial prefrontal cortex (vmPFC) helps track how much an option is worth to us. in our study of teens, its response to the value added by peers’ safe choices was stronger in those who had never used substances. i’m interested in how it brings together our own preferences, what we know about an option, and what other people choose.
<!-- /copy -->

### explorer.acc.name

<!-- copy: explorer.acc.name -->
anterior cingulate cortex
<!-- /copy -->

### explorer.acc.question

<!-- copy: explorer.acc.question -->
what happens when a decision is difficult?
<!-- /copy -->

### explorer.acc.text

<!-- copy: explorer.acc.text -->
anterior cingulate cortex contributes to evaluating actions and adjusting behavior when decisions are demanding. our lesion study focused on its dorsal portion: people with damage there relied more on following others’ choices. it offers a way to ask how we choose when our own evaluation is disrupted.
<!-- /copy -->

### explorer.insula.name

<!-- copy: explorer.insula.name -->
anterior insula
<!-- /copy -->

### explorer.insula.question

<!-- copy: explorer.insula.question -->
how do uncertainty and feelings enter a choice?
<!-- /copy -->

### explorer.insula.text

<!-- copy: explorer.insula.text -->
the anterior insula helps integrate information about bodily feelings, uncertainty, and risk. our work asks how decisions change when the insula is disrupted, including how we use other people’s choices.
<!-- /copy -->

### explorer.research-link

<!-- copy: explorer.research-link -->
explore my favorite brain regions →
<!-- /copy -->

### explorer.orient.head-label

<!-- copy: explorer.orient.head-label -->
head viewed from above, with the left half of the brain highlighted and the nose toward the top
<!-- /copy -->

### explorer.orient.head

<!-- copy: explorer.orient.head -->
your head, from above
<!-- /copy -->

### explorer.orient.medial

<!-- copy: explorer.orient.medial -->
looking at the inside: imagine opening the brain like a book. this is the inner face of its left half.
<!-- /copy -->

### explorer.orient.lateral

<!-- copy: explorer.orient.lateral -->
looking at the outside: this is the left side of the brain, beneath your left temple.
<!-- /copy -->

### explorer.orient.front

<!-- copy: explorer.orient.front -->
looking toward the front: the forehead is closest to you. the right half of the brain is hidden.
<!-- /copy -->

### explorer.orient.back

<!-- copy: explorer.orient.back -->
looking toward the back: the back of the head is closest to you. the right half of the brain is hidden.
<!-- /copy -->

### explorer.orient.front-label

<!-- copy: explorer.orient.front-label -->
front · forehead
<!-- /copy -->

### explorer.orient.back-label

<!-- copy: explorer.orient.back-label -->
back
<!-- /copy -->

### explorer.orient.top-label

<!-- copy: explorer.orient.top-label -->
top
<!-- /copy -->

### explorer.vmpfc.short

<!-- copy: explorer.vmpfc.short -->
vmPFC
<!-- /copy -->

### explorer.vmpfc.legend

<!-- copy: explorer.vmpfc.legend -->
coral · vmPFC; other regions · gray
<!-- /copy -->

### explorer.mpfc.name

<!-- copy: explorer.mpfc.name -->
medial prefrontal cortex
<!-- /copy -->

### explorer.mpfc.short

<!-- copy: explorer.mpfc.short -->
mPFC
<!-- /copy -->

### explorer.mpfc.question

<!-- copy: explorer.mpfc.question -->
how does a map of options become a choice?
<!-- /copy -->

### explorer.mpfc.text

<!-- copy: explorer.mpfc.text -->
medial prefrontal cortex (mPFC) both represents maps and tracks value. in our latest study, it showed a grid-like signal along with entorhinal cortex when people compared options. in our commentary on a study of navigating by smell, we pointed out that these two regions keep showing up together, whatever is being mapped. i’m interested in how mPFC uses a map like that to guide a choice.
<!-- /copy -->

### explorer.mpfc.legend

<!-- copy: explorer.mpfc.legend -->
violet · mPFC; other regions · gray
<!-- /copy -->

### explorer.hc.name

<!-- copy: explorer.hc.name -->
hippocampus
<!-- /copy -->

### explorer.hc.short

<!-- copy: explorer.hc.short -->
hippocampus
<!-- /copy -->

### explorer.hc.question

<!-- copy: explorer.hc.question -->
how do separate experiences become connected?
<!-- /copy -->

### explorer.hc.text

<!-- copy: explorer.hc.text -->
you might learn that a is better than b, and that b is better than c. connecting those experiences lets you work out something new: how a compares with c. the hippocampus helps form and relate memories, including relationships between places. i’m interested in how that system also supports the maps we use to think and decide, and what it may be building while we rest.
<!-- /copy -->

### explorer.hc.legend

<!-- copy: explorer.hc.legend -->
gold · hippocampus; neighboring regions · gray
<!-- /copy -->

### explorer.ec.name

<!-- copy: explorer.ec.name -->
entorhinal cortex
<!-- /copy -->

### explorer.ec.short

<!-- copy: explorer.ec.short -->
entorhinal cortex
<!-- /copy -->

### explorer.ec.question

<!-- copy: explorer.ec.question -->
could the brain’s navigation system map our options?
<!-- /copy -->

### explorer.ec.text

<!-- copy: explorer.ec.text -->
entorhinal cortex works closely with the hippocampus. it contains grid cells, whose hexagonal firing patterns help the brain map physical space. in our latest study, we found a grid-like signal here when people compared options, and it followed each person’s own preferences. a map like that could help us compare a new option as soon as we know where it fits.
<!-- /copy -->

### explorer.ec.legend

<!-- copy: explorer.ec.legend -->
green · entorhinal cortex; neighboring regions · gray
<!-- /copy -->

### explorer.acc.short

<!-- copy: explorer.acc.short -->
anterior cingulate cortex
<!-- /copy -->

### explorer.acc.legend

<!-- copy: explorer.acc.legend -->
gold · anterior cingulate and anterior midcingulate; other regions · gray
<!-- /copy -->

### explorer.insula.short

<!-- copy: explorer.insula.short -->
anterior insula
<!-- /copy -->

### explorer.insula.legend

<!-- copy: explorer.insula.legend -->
blue · anterior insula; other regions · gray
<!-- /copy -->

### explorer.zoom.label

<!-- copy: explorer.zoom.label -->
brain magnification
<!-- /copy -->

### explorer.zoom.in

<!-- copy: explorer.zoom.in -->
zoom in
<!-- /copy -->

### explorer.zoom.out

<!-- copy: explorer.zoom.out -->
zoom out
<!-- /copy -->

### explorer.zoom.level

<!-- copy: explorer.zoom.level -->
{{percent}}%
<!-- /copy -->

### which half of the brain to show

<!-- copy: explorer.half.label -->
which half of the brain to show
<!-- /copy -->

<!-- copy: explorer.half.left -->
left half
<!-- /copy -->

<!-- copy: explorer.half.right -->
right half
<!-- /copy -->

<!-- copy: explorer.half.both -->
both halves
<!-- /copy -->

<!-- copy: explorer.hemisphere.right -->
the right half of the brain
<!-- /copy -->

<!-- copy: explorer.hemisphere.both -->
both halves of the brain
<!-- /copy -->

<!-- copy: explorer.canvas-label.right -->
interactive view of the right half of the brain. front points toward your forehead. choose a region, drag to rotate, use the arrow keys, or zoom with the plus and minus keys.
<!-- /copy -->

<!-- copy: explorer.canvas-label.both -->
interactive view of both halves of the brain. front points toward your forehead. choose a region, drag to rotate, use the arrow keys, or zoom with the plus and minus keys.
<!-- /copy -->

<!-- copy: explorer.orient.head-label.right -->
head viewed from above, with the right half of the brain highlighted and the nose toward the top
<!-- /copy -->

<!-- copy: explorer.orient.head-label.both -->
head viewed from above, with both halves of the brain highlighted and the nose toward the top
<!-- /copy -->

### orientation sentences for the right half

<!-- copy: explorer.orient.medial.right -->
looking at the inside: imagine opening the brain like a book. this is the inner face of its right half.
<!-- /copy -->

<!-- copy: explorer.orient.lateral.right -->
looking at the outside: this is the right side of the brain, beneath your right temple.
<!-- /copy -->

<!-- copy: explorer.orient.front.right -->
looking toward the front: the forehead is closest to you. the left half of the brain is hidden.
<!-- /copy -->

<!-- copy: explorer.orient.back.right -->
looking toward the back: the back of the head is closest to you. the left half of the brain is hidden.
<!-- /copy -->

### orientation sentences for both halves

<!-- copy: explorer.orient.left.both -->
looking at the left side: the left half of the brain, beneath your left temple, is closest to you.
<!-- /copy -->

<!-- copy: explorer.orient.right.both -->
looking at the right side: the right half of the brain, beneath your right temple, is closest to you.
<!-- /copy -->

<!-- copy: explorer.orient.front.both -->
looking toward the front: the forehead is closest to you, with both halves side by side.
<!-- /copy -->

<!-- copy: explorer.orient.back.both -->
looking toward the back: the back of the head is closest to you, with both halves side by side.
<!-- /copy -->

<!-- copy: explorer.side.left -->
from the left
<!-- /copy -->

<!-- copy: explorer.side.right -->
from the right
<!-- /copy -->

<!-- copy: explorer.orient.below -->
looking from below: this is the underside of the left half of the brain.
<!-- /copy -->

<!-- copy: explorer.orient.below.right -->
looking from below: this is the underside of the right half of the brain.
<!-- /copy -->

<!-- copy: explorer.orient.below.both -->
looking from below: this is the underside of both halves of the brain.
<!-- /copy -->

## 3D brain maps · subjective value walkthrough

The interactive map in the brain panel of the subjective-value walkthrough. Zoom, half-of-the-brain, and orientation labels reuse the `explorer.*` blocks above.

<!-- copy: brain-map.choose -->
choose a brain map
<!-- /copy -->

<!-- copy: brain-map.reset -->
reset view
<!-- /copy -->

<!-- copy: brain-map.statistic -->
t
<!-- /copy -->

<!-- copy: brain-map.error -->
the 3D map could not load. the original figure is below.
<!-- /copy -->

<!-- copy: brain-region.error -->
the 3D brain could not load.
<!-- /copy -->

<!-- copy: value-brain.canvas-label -->
interactive 3D map of where the brain showed each code, on a standard brain surface. front points toward your forehead. drag to rotate, use the arrow keys, or zoom with the plus and minus keys.
<!-- /copy -->

<!-- copy: value-brain.map.grid -->
grid-like code
<!-- /copy -->

<!-- copy: value-brain.map.position -->
2D positional code
<!-- /copy -->

<!-- copy: value-brain.grid.caption -->
grid-like code: where activity rose and fell every 60 degrees as participants compared options on their own subjective value map. shown at P < 0.05, uncorrected.
<!-- /copy -->

<!-- copy: value-brain.position.caption -->
2D positional code: where options that sat close together on a participant’s own subjective value map got more similar brain responses. shown at P < 0.01, uncorrected.
<!-- /copy -->

<!-- copy: value-brain.scale -->
the group maps on a standard brain surface, showing only the clusters that touch entorhinal or medial prefrontal cortex (the full maps are on NeuroVault). lighter means stronger evidence (the bar shows the t-statistic scale). thresholds are uncorrected and for display only; the paper’s tests are corrected within independently defined regions.
<!-- /copy -->

## Subjective value · rescaling explainer

### page title

<!-- copy: value-rescale.title -->
why we rescale the value map
<!-- /copy -->

### page description

<!-- copy: value-rescale.description -->
how we turn dollars and chances into the value map in our study, and why both of its axes run from 0 to 1.
<!-- /copy -->

### intro

<!-- copy: value-rescale.intro -->
on the value maps, both axes run from 0 to 1. here’s how we get there from dollars and chances. pick any offer on the chart (hover or tap) to follow it through each step.
<!-- /copy -->

### step 1 · heading

<!-- copy: value-rescale.step1.heading -->
step 1: from dollars to value
<!-- /copy -->

### step 1 · text

<!-- copy: value-rescale.step1.text -->
first, we use your choices to estimate two curves. one turns each chance into a ‘subjective probability’: how much a chance *seems* when you choose. the other turns each amount into ‘utility’: how much that amount is worth to you. switch the chart to *after preferences* to watch every offer move.
<!-- /copy -->

### step 1 · decision weights

<!-- copy: value-rescale.weights.text -->
subjective probabilities have fixed ends: a 0% chance always counts as 0, and a 100% chance always counts as 1. so each one means something on its own. {{source}}, an 80% chance seems like {{weight}}{{toyou}}.
<!-- /copy -->

### step 1 · utility

<!-- copy: value-rescale.utility.text -->
utility is different: it has no natural unit. we could count $1 as 1 unit, or $10 as 10 units, and every choice the model predicts would stay exactly the same. so it isn’t quite right to say that $3 feels like {{three}}{{toyou}}. what is meaningful is the shape of the curve. {{gaps}}
<!-- /copy -->

### step 1 · whose numbers, before any choices

<!-- copy: value-rescale.source.example -->
with the example preferences (make a few choices below to see your own)
<!-- /copy -->

### step 1 · whose numbers, after choosing

<!-- copy: value-rescale.source.yours -->
based on the choices you’ve made
<!-- /copy -->

### step 1 · utility gaps, before any choices

<!-- copy: value-rescale.whose.example -->
with the example preferences
<!-- /copy -->

### step 1 · utility gaps, after choosing

<!-- copy: value-rescale.whose.yours -->
with your preferences
<!-- /copy -->

### step 1 · added after a number once it’s the visitor’s own

<!-- copy: value-rescale.to-you -->
*to you*
<!-- /copy -->

### step 1 · utility gaps when the curve flattens

<!-- copy: value-rescale.gaps.less -->
$3 and $5 are $2 apart, and so are $8 and $10. counted in utility {{whose}}, the first gap is {{low}} units ({{u5}} − {{u3}}), but the second is only {{high}} units ({{u10}} − {{u8}}): the same $2 is worth less{{toyou}} higher up. economists call this ‘diminishing marginal utility’.
<!-- /copy -->

### step 1 · utility gaps when the curve steepens

<!-- copy: value-rescale.gaps.more -->
$3 and $5 are $2 apart, and so are $8 and $10. counted in utility {{whose}}, the first gap is {{low}} units ({{u5}} − {{u3}}), and the second is {{high}} units ({{u10}} − {{u8}}): the same $2 is worth *more*{{toyou}} higher up. that’s the opposite of the usual ‘diminishing marginal utility’ in economics.
<!-- /copy -->

### step 1 · utility gaps when the curve is straight

<!-- copy: value-rescale.gaps.same -->
$3 and $5 are $2 apart, and so are $8 and $10. counted in utility {{whose}}, the gaps are {{low}} and {{high}} units: about the same, so each extra dollar is worth about the same{{toyou}}.
<!-- /copy -->

### step 2 · heading

<!-- copy: value-rescale.step2.heading -->
step 2: rescaling
<!-- /copy -->

### step 2 · text

<!-- copy: value-rescale.step2.text -->
since utility has no natural unit, we rescale both axes to the range of offers in the task: the least likely chance and the smallest prize sit at 0, and the surest chance and the biggest prize sit at 1. so a 10% offer at 0 doesn’t mean a 0% chance. it’s just the least likely offer in the set.
<!-- /copy -->

### step 2 · why the map needs it

<!-- copy: value-rescale.why.text -->
this matters for the map. the grid-like signal we looked for depends on the direction of each comparison across the map, and a direction only means something when both axes are on the same scale: stretch one axis, and every angle changes.
<!-- /copy -->

### step 2 · the brain

<!-- copy: value-rescale.brain.text -->
it also fits how the brain seems to handle value. dopamine neurons (Tobler and colleagues, 2005) and neurons in orbitofrontal cortex (Padoa-Schioppa, 2009) adapt their value signals to the range of options on offer, rather than coding amounts on a fixed scale, called 'range adaptation'. and in our study, the brain’s grid-like signal fit the rescaled map. when we try our same analyses on a map that does not rescale each axis, we do not see effects as strong as when we do rescale.
<!-- /copy -->

### game · heading

<!-- copy: value-rescale.game.heading -->
watch your map change
<!-- /copy -->

### game · text

<!-- copy: value-rescale.game.text -->
the more choices you make, the better we can estimate your map. keep choosing below, and watch your map shift with each answer.
<!-- /copy -->

### game · prompt

<!-- copy: value-rescale.game.prompt -->
which would you rather play?
<!-- /copy -->

### game · prompt when finished

<!-- copy: value-rescale.game.done -->
that’s {{count}} choices, as many as this demo asks. your map is as sharp as it gets here.
<!-- /copy -->

### game · screen reader label for the two offers

<!-- copy: value-rescale.game.options -->
two money offers
<!-- /copy -->

### game · fit before any choices

<!-- copy: value-rescale.fit.example -->
these are example preferences until you choose: an 80% chance seems like {{weight}}, and $10 is worth {{ratio}} times as much as $5.
<!-- /copy -->

### game · fit after one choice

<!-- copy: value-rescale.fit.one -->
after 1 choice: an 80% chance seems like {{weight}} *to you*, and $10 is worth {{ratio}} times as much as $5 *to you*.
<!-- /copy -->

### game · fit after several choices

<!-- copy: value-rescale.fit.yours -->
after {{count}} choices: an 80% chance seems like {{weight}} *to you*, and $10 is worth {{ratio}} times as much as $5 *to you*.
<!-- /copy -->

### game · start over

<!-- copy: value-rescale.reset -->
start over
<!-- /copy -->

### chart · step buttons label

<!-- copy: value-rescale.stage.label -->
which step to show
<!-- /copy -->

### chart · step: amounts

<!-- copy: value-rescale.stage.amounts -->
dollars and chances
<!-- /copy -->

### chart · step: after preferences

<!-- copy: value-rescale.stage.felt -->
after preferences
<!-- /copy -->

### chart · step: rescaled

<!-- copy: value-rescale.stage.map -->
rescaled map
<!-- /copy -->

### chart · axis: chance

<!-- copy: value-rescale.axis.amounts.x -->
chance of winning
<!-- /copy -->

### chart · axis: amount

<!-- copy: value-rescale.axis.amounts.y -->
amount to win
<!-- /copy -->

### chart · axis: decision weight

<!-- copy: value-rescale.axis.felt.x -->
subjective probability
<!-- /copy -->

### chart · axis: utility

<!-- copy: value-rescale.axis.felt.y -->
utility ($1 = 1 unit)
<!-- /copy -->

### chart · axis: rescaled weight

<!-- copy: value-rescale.axis.map.x -->
subjective probability, rescaled (0 = least likely offer)
<!-- /copy -->

### chart · axis: rescaled utility

<!-- copy: value-rescale.axis.map.y -->
utility, rescaled (0 = smallest prize)
<!-- /copy -->

### chart · readout: amounts

<!-- copy: value-rescale.readout.amounts -->
{{chance}} chance of {{amount}}, as offered.
<!-- /copy -->

### chart · readout: after preferences

<!-- copy: value-rescale.readout.felt -->
{{chance}} chance of {{amount}}: the chance seems like {{weight}}{{toyou}}, and the amount is worth {{units}} units. the dashed ring shows where it would sit with no preferences at all.
<!-- /copy -->

### chart · readout: rescaled

<!-- copy: value-rescale.readout.map -->
{{chance}} chance of {{amount}} sits {{x}} of the way across the rescaled map and {{y}} of the way up.
<!-- /copy -->

### chart · screen reader label

<!-- copy: value-rescale.canvas -->
chart of every offer in the task at the chosen step. use the arrow keys to pick an offer.
<!-- /copy -->

### references · heading

<!-- copy: value-rescale.references.heading -->
references
<!-- /copy -->

### references · Tobler

<!-- copy: value-rescale.references.tobler -->
Tobler, Fiorillo & Schultz (2005). Adaptive coding of reward value by dopamine neurons. Science.
<!-- /copy -->

### references · Padoa-Schioppa

<!-- copy: value-rescale.references.padoa -->
Padoa-Schioppa (2009). Range-adapting representation of economic value in the orbitofrontal cortex. Journal of Neuroscience.
<!-- /copy -->

### link from the value maps

<!-- copy: value-rescale.link -->
why rescale? learn more →
<!-- /copy -->
