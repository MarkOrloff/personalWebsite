import { displayGambles, probabilityWeight, valueCoordinates } from './paper-plots.mjs';
import { replayAnswers, estimatePreferences, nextQuestion } from './value-calibration.mjs';
import { copy } from './site-copy.mjs';
export { answersFrom } from './value-calibration.mjs';

// The rescaling explainer follows each offer through three stages:
// amounts: dollars and chances as offered;
// felt: after preferences (a Prelec decision weight for the chance, power utility for the amount);
// map: both axes rescaled to the task's range, as on the walkthrough's map.
export const stages = ['amounts', 'felt', 'map'];
// alpha is the Prelec curvature, rho the power on amounts (as in value-calibration.mjs).
// The home page preview's settings: 80% counts like 64.5%, and $3 is worth 2.41 units.
export const examplePreferences = { alpha: .55, rho: .8 };
// All 100 grid positions, as on the walkthrough's map.
export const offers = displayGambles;
export const MAX_CHOICES = 30;

/** Utility units: $1 = 1 unit (anchor 1), or $10 = 10 units (anchor 10). Choices never depend on this. */
export function utility(amount, rho, anchor = 1) {
  const unit = anchor === 10 ? 10 / 10 ** rho : 1;
  return unit * amount ** rho;
}

/** One offer's position in each stage, plus the numbers shown when it is picked. */
export function offerStages(offer, { alpha, rho }, anchor = 1) {
  const weight = probabilityWeight(offer.p, alpha), units = utility(offer.a, rho, anchor);
  const map = valueCoordinates(offer.p, offer.a, alpha, rho);
  return { weight, units, map, amounts: { x: offer.p, y: offer.a }, felt: { x: weight, y: units } };
}

/** Axis ranges for a stage; the felt stage keeps the dollar axis when utility stays below $10. */
export function stageRange(stage, preferences, anchor = 1) {
  if (stage === 'map') return { x: 1, y: 1 };
  if (stage === 'amounts') return { x: 1, y: 10 };
  return { x: 1, y: Math.max(10, utility(10, preferences.rho, anchor)) };
}

/** Current estimate and next question after a list of answers; the example settings until the first choice. */
export function fitAnswers(answers) {
  const posterior = replayAnswers(answers);
  return {
    preferences: answers.length ? estimatePreferences(posterior) : examplePreferences,
    next: answers.length < MAX_CHOICES ? nextQuestion(posterior, answers.map(a => a.question.id)) : undefined,
  };
}

/**
 * Values for the explainer's text: the example settings until the visitor chooses, then their own fit.
 * The utility gaps use rounded units so the shown subtraction adds up.
 */
export function explainerTokens(preferences, count = 0) {
  const own = count > 0, units = amount => Number(utility(amount, preferences.rho).toFixed(2));
  const [u3, u5, u8, u10] = [3, 5, 8, 10].map(units), two = value => value.toFixed(2);
  const shape = Math.abs(preferences.rho - 1) < .01 ? 'same' : preferences.rho < 1 ? 'less' : 'more';
  const weight = (probabilityWeight(.8, preferences.alpha) * 100).toFixed(1).replace(/\.0$/, '');
  // Once the numbers are the visitor's own, they read "… to you".
  const toyou = own ? ` ${copy('value-rescale.to-you')}` : '';
  return {
    toyou,
    source: copy(own ? 'value-rescale.source.yours' : 'value-rescale.source.example'),
    weight: copy('format.percent', { percent: weight }),
    three: copy('format.money', { amount: two(u3) }),
    gaps: copy(`value-rescale.gaps.${shape}`, {
      whose: copy(own ? 'value-rescale.whose.yours' : 'value-rescale.whose.example'),
      toyou, low: two(u5 - u3), high: two(u10 - u8), u3: two(u3), u5: two(u5), u8: two(u8), u10: two(u10),
    }),
  };
}
