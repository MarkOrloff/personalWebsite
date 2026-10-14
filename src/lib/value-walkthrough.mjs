import { CHOICE_COUNT, nextQuestion, replayAnswers, estimatePreferences, predictChoice, unseenPair, answersFrom } from './value-calibration.mjs';
import { valuePairs } from './paper-plots.mjs';

export const scenes = ['game', 'place-a', 'place-b', 'review', 'new', 'reliable', 'adventurous', 'personal', 'brain'];
export const examplePreferences = { reliable: { alpha: 1.3, rho: .5 }, adventurous: { alpha: .55, rho: 1.35 } };
export class ValueSession {
  answers = [];
  scene = 'game';
  reviewIndex = 0;
  fit = null;
  origin = 'example';
  constructor(random = Math.random) { this.random = random; this.question = nextQuestion(replayAnswers([])); }
  choose(choice) {
    if (this.scene !== 'game' || this.answers.length >= CHOICE_COUNT || ![0, 1].includes(choice)) return false;
    this.answers.push({ question: this.question, choice });
    const posterior = replayAnswers(this.answers);
    this.fit = estimatePreferences(posterior); this.origin = 'answers';
    this.question = this.answers.length < CHOICE_COUNT ? nextQuestion(posterior, this.answers.map(a => a.question.id)) : undefined;
    return true;
  }
  /** Restores choices saved earlier in the visit, so moving around or reloading keeps them. */
  load(saved) {
    const answers = answersFrom(saved).slice(0, CHOICE_COUNT);
    if (!answers.length) return false;
    this.answers = answers;
    const posterior = replayAnswers(answers);
    this.fit = estimatePreferences(posterior); this.origin = 'answers';
    this.question = answers.length < CHOICE_COUNT ? nextQuestion(posterior, answers.map(a => a.question.id)) : undefined;
    return true;
  }
  undo() {
    if (!this.answers.length) return false;
    this.answers.pop();
    const posterior = replayAnswers(this.answers);
    this.fit = this.answers.length ? estimatePreferences(posterior) : null;
    this.origin = this.answers.length ? 'answers' : 'example';
    this.question = nextQuestion(posterior, this.answers.map(a => a.question.id));
    return true;
  }
  ensureFit() {
    if (!this.fit) this.fit = { alpha: .45 + Math.floor(this.random() * 22) * .05, rho: .45 + Math.floor(this.random() * 22) * .05 };
    return this.fit;
  }
  enter(scene) {
    if (!scenes.includes(scene)) return;
    if (scene !== 'game') this.ensureFit();
    if (scene === 'review' && this.scene !== 'review') this.reviewIndex = this.scene === 'new' ? this.reviews.length - 1 : 0;
    this.scene = scene;
  }
  get reviews() { return this.answers.length ? this.answers : [{ question: { options: valuePairs[0] }, choice: null }]; }
  get review() { return this.reviews[Math.min(this.reviewIndex, this.reviews.length - 1)]; }
  get pair() {
    if (this.scene === 'game') return this.question?.options || this.answers[this.answers.length - 1].question.options;
    if (this.scene === 'review') return this.review.question.options;
    if (['place-a', 'place-b'].includes(this.scene)) return this.reviews[0].question.options;
    return unseenPair;
  }
  get preferences() { return examplePreferences[this.scene] || this.ensureFit(); }
  get prediction() { const p = this.preferences; return predictChoice(this.pair, p.alpha, p.rho); }
  advance(direction) {
    if (this.scene === 'game' && direction < 0) return this.undo();
    if (this.scene !== 'review') return false;
    const target = this.reviewIndex + direction;
    if (target < 0 || target >= this.reviews.length) return false;
    this.reviewIndex = target; return true;
  }
  restore(params) {
    // Reading links contain map settings, never the visitor's choice history.
    // Keep answers intact when returning to a scene in the same page.
    if (!this.answers.length && params.has('alpha') && params.has('rho')) {
      const alpha = Number(params.get('alpha')), rho = Number(params.get('rho'));
      if ([alpha, rho].every(p => Number.isFinite(p) && p >= .35 && p <= 1.8)) {
        this.fit = { alpha, rho }; this.origin = 'shared';
      }
    }
    const index = Number(params.get('choice') || 1) - 1;
    if (Number.isInteger(index)) this.reviewIndex = Math.max(0, Math.min(this.reviews.length - 1, index));
  }
}
