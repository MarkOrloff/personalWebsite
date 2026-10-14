import { copy, copyHtml, richText } from "../lib/site-copy.mjs";
import { fillValueCopy } from '../lib/value-copy.mjs';
import { ValueSession } from '../lib/value-walkthrough.mjs';
import { valueLayout, valueAxes, vectorPath } from '../lib/paper-plots.mjs';
import { savedAnswers } from '../lib/value-calibration.mjs';
import { recall, remember } from '../lib/game-memory.mjs';

class ValueMap extends HTMLElement {
  session = new ValueSession();
  observer?: ResizeObserver;
  abort?: AbortController;
  drawn = false;
  connectedCallback() {
    this.abort = new AbortController();
    // Choices last for the visit; the rescaling explainer picks them up too.
    this.session.load(recall('value', (saved: unknown) => Array.isArray(saved)));
    this.querySelectorAll<HTMLButtonElement>('[data-value-choice]').forEach(button => button.addEventListener('click', () => {
      if (!this.session.choose(Number(button.dataset.valueChoice))) return;
      remember('value', savedAnswers(this.session.answers));
      this.draw();
      this.dispatchEvent(new CustomEvent('plot-state-change', { bubbles: true }));
      // Keep keyboard users at the next question, or at the one story control.
      if (this.session.answers.length === 5) this.closest('[data-reader]')!.querySelector<HTMLButtonElement>('[data-step-next]')!.focus({ preventScroll: true });
    }, { signal: this.abort.signal }));
    this.observer = new ResizeObserver(() => this.draw());
    this.observer.observe(this);
    this.draw();
  }
  disconnectedCallback() { this.observer?.disconnect(); this.abort?.abort(); }
  setView(view: string) { this.session.enter(view); this.dataset.view = this.session.scene; this.draw(true); }
  readingState() { return { ...(this.session.fit ? { alpha: this.session.fit.alpha.toFixed(2), rho: this.session.fit.rho.toFixed(2) } : {}), choice: String(this.session.reviewIndex + 1) }; }
  restoreReadingState(params: URLSearchParams) { this.session.restore(params); }
  advanceStory(direction: number) {
    const moved = this.session.advance(direction);
    if (moved) { remember('value', savedAnswers(this.session.answers)); this.draw(true); }
    return moved;
  }
  storyNavigation() {
    const s = this.session, n = s.answers.length;
    if (s.scene === 'game') return { next: n === 5 ? copy("ui.value-map.put-my-choices-on-a-map") : n ? n === 1 ? copy("ui.value-map.use-this-choice") : copy("ui.value-map.use-these-value-choices", { value1: n }) : copy("ui.value-map.skip-with-example-choices"), previous: copy("ui.value-map.undo-choice"), canGoBack: n > 0, detail: copy("ui.value-map.value-5-choices", { value1: n }) };
    if (s.scene === 'review') return { next: s.reviewIndex < s.reviews.length - 1 ? copy("ui.value-map.next-choice") : copy("ui.value-map.now-something-new"), detail: s.answers.length ? copy("ui.value-map.your-choice-value-value", { value1: s.reviewIndex + 1, value2: n }) : copy("ui.value-map.an-example-choice") };
    if (s.scene === 'place-a') return { next: copy("ui.value-map.place-the-other-option") };
    if (s.scene === 'place-b') return { next: n ? copy("ui.value-map.revisit-my-choices") : copy("ui.value-map.compare-these-options") };
    if (s.scene === 'new') return { next: copy("ui.value-map.what-changes-with-preferences") };
    if (s.scene === 'reliable') return { next: copy("ui.value-map.feeling-more-adventurous") };
    if (s.scene === 'adventurous') return { next: n ? copy("ui.value-map.reveal-my-map") : copy("ui.value-map.show-one-possible-map") };
    if (s.scene === 'personal') return { next: copy("ui.value-map.what-did-the-brain-show") };
    if (s.scene === 'brain') return { next: copy("ui.value-map.explore-the-brain-result") };
    return {};
  }
  draw(animate = false) {
    const s = this.session, n = s.answers.length, game = s.scene === 'game', finished = n === 5;
    const subjective = ['reliable', 'adventurous', 'personal'].includes(s.scene);
    const pair = s.pair;
    const reader = this.closest('[data-reader]')!;
    this.querySelector<HTMLElement>('[data-value-map]')!.hidden = game;
    this.querySelector<HTMLElement>('[data-game-progress]')!.hidden = !game;
    this.querySelector<HTMLElement>('[data-game-response]')!.hidden = !game;
    this.querySelector<HTMLProgressElement>('[data-calibration-progress]')!.value = n;
    this.querySelector('[data-game-response]')!.textContent = finished ? copy("ui.value-map.that-s-five-let-s-look") : n ? copy("ui.value-map.got-it-here-s-the-next") : copy("ui.value-map.there-are-no-right-answers-which");
    this.querySelector('[data-value-status]')!.textContent = game ? finished ? copy("ui.value-map.five-choices-made") : copy("ui.value-map.choice-value-of-5", { value1: n + 1 }) : s.scene === 'review' ? n ? copy("ui.value-map.your-choice-value-of-value", { value1: s.reviewIndex + 1, value2: n }) : copy("ui.value-map.an-example-comparison") : s.scene === 'personal' ? n ? copy("ui.value-map.a-rough-sketch-from-your-answers") : copy("ui.value-map.an-illustrative-map-no-answers-yet") : subjective ? copy("ui.value-map.one-illustrative-preference") : copy("ui.value-map.the-same-amounts-and-chances-for");
    pair.forEach((o, i) => {
      const card = this.querySelector<HTMLButtonElement>(`[data-value-choice="${i}"]`)!;
      card.disabled = !game || finished;
      card.classList.toggle('is-chosen', s.scene === 'review' && s.review.choice === i);
      card.classList.toggle('is-muted', s.scene === 'place-a' && i === 1);
      card.querySelector('[data-option-money]')!.textContent = copy("format.money",{amount:o.a});
      card.querySelector('[data-option-chance]')!.textContent = copy("ui.value-map.chance-percent", { value1: Math.round(o.p * 100) });
      card.querySelector<HTMLElement>('.chance-pie')!.style.setProperty('--chance', `${o.p * 100}%`);
      card.querySelector<HTMLElement>('[data-option-action]')!.hidden = !game;
      card.querySelector('[data-option-action]')!.textContent = finished ? copy("ui.value-map.choices-complete") : copy("ui.value-map.choose-this");
      card.setAttribute('aria-label', copy("value.option-accessible", {option:copy(i===0?"ui.paper-plots.a":"ui.paper-plots.b"), chance:copy("format.percent",{percent:Math.round(o.p*100)}), amount:copy("format.money",{amount:o.a}), chosen:s.scene==='review'&&s.review.choice===i?copy("value.option-chosen"):''}));
    });
    const choice = s.review.choice;
    const tokens = {
      'a.amount': copy("format.money",{amount:pair[0].a}), 'a.chance': copy("format.percent",{percent:Math.round(pair[0].p * 100)}),
      'b.amount': copy("format.money",{amount:pair[1].a}), 'b.chance': copy("format.percent",{percent:Math.round(pair[1].p * 100)}),
      'review.intro': n ? copy("ui.value-map.here-is-choice-value-from-your", { value1: s.reviewIndex + 1, value2: copy(choice === 0 ? "ui.paper-plots.a" : "ui.paper-plots.b") }) : copy("ui.value-map.here-is-an-example-pair-because"),
      'personal.intro': n ? copy(n===1 ? "value.personal-one" : "value.personal-many", {count:n}) : s.origin === 'shared' ? copy("ui.value-map.this-map-uses-the-settings-in") : copy("ui.value-map.because-you-skipped-the-choices-this"),
    };
    reader.querySelectorAll<HTMLElement>('[data-value-template]').forEach(el => { el.innerHTML = richText(fillValueCopy(el.dataset.valueTemplate!, tokens)); });
    if (game || s.scene === 'brain') return;
    const width = this.querySelector('.chart-canvas')!.getBoundingClientRect().width;
    if (!width) return;
    this.dataset.animate = String(animate && this.drawn); this.drawn = true;
    const fit = s.preferences;
    const l = valueLayout(width, subjective ? 'subjective' : 'objective', fit.alpha, fit.rho, pair);
    const svg = this.querySelector('.chart-canvas svg')!;
    svg.setAttribute('viewBox', `0 0 ${width} ${l.height}`);
    svg.setAttribute('width', String(width)); svg.setAttribute('height', String(l.height));
    this.querySelector('[data-map-axes]')!.innerHTML = valueAxes(l, copy("ui.value-map.how-likely-it-feels"));
    this.querySelector('[data-value-y]')!.textContent = subjective ? copy("ui.value-map.how-much-the-reward-is-worth") : copy("ui.value-map.amount-to-win");
    for (const p of l.points) this.querySelector<SVGElement>(`[data-gamble="${p.id}"]`)!.style.transform = `translate(${p.x}px,${p.y}px)`;
    l.chosen.forEach((p, i) => {
      const el = this.querySelector<SVGElement>(`[data-option="${i}"]`)!;
      el.style.transform = `translate(${p.x}px,${p.y}px)`;
      el.style.opacity = s.scene === 'place-a' && i === 1 ? '0' : '1';
      el.querySelector('.choice-ring')!.setAttribute('opacity', s.scene === 'review' && s.review.choice === i ? '1' : '0');
    });
    const path = this.querySelector<SVGElement>('.decision-path')!;
    const d = vectorPath(l); path.setAttribute('d', d); path.style.setProperty('d', `path("${d}")`);
    path.style.opacity = s.scene === 'place-a' ? '0' : '1';
    const guided = ['place-a', 'place-b'].includes(s.scene), p = l.chosen[s.scene === 'place-a' ? 0 : 1];
    this.querySelector('[data-map-guides]')!.innerHTML = guided ? `<path class="map-guide" d="M${l.left},${p.y}H${p.x}V${l.bottom}"/>${p.a!==1&&p.a!==10?`<text class="map-guide-label" text-anchor="end" x="${l.left - 10}" y="${p.y + 4}">${copyHtml("format.money",{amount:p.a})}</text>`:''}${p.p!==.1&&p.p!==1?`<text class="map-guide-label" text-anchor="middle" x="${p.x}" y="${l.bottom + 25}">${copyHtml("format.percent",{percent:Math.round(p.p*100)})}</text>`:''}` : '';
    this.querySelector('[data-map-annotation]')!.innerHTML = `<text class="map-corner-label" x="${l.right}" y="${l.top-10}" text-anchor="end">${copyHtml("value.annotation.favorable-corner")}</text><path class="map-corner-bracket" d="M${l.right-13},${l.top}H${l.right}V${l.top+13}"/>`;
    this.querySelector('[data-map-reading-key]')!.textContent = copy(subjective?'value.annotation.subjective':'value.annotation.objective');
    // The rescaled map links to the page explaining why its axes run from 0 to 1.
    this.querySelector<HTMLElement>('[data-rescale-link]')!.hidden = !subjective;
    const pred = s.prediction;
    const readout = s.scene === 'place-a' ? copy("ui.value-map.option-a-go-across-to-value", { value1: Math.round(pair[0].p * 100), value2: pair[0].a }) : s.scene === 'place-b' ? copy("ui.value-map.option-b-goes-at-value-and", { value1: Math.round(pair[1].p * 100), value2: pair[1].a }) : s.scene === 'review' ? n ? copy("ui.value-map.the-ring-marks-your-answer-the") : copy("ui.value-map.each-end-of-the-line-is") : subjective ? copy("ui.value-map.value-the-offers-are-unchanged-their", { value1: pred === null ? copy("ui.value-map.these-settings-put-the-two-offers") : copy("ui.value-map.with-these-preferences-the-model-favors", { value1: copy(pred === 0 ? "ui.paper-plots.a" : "ui.paper-plots.b") }) }) : copy("ui.value-map.two-new-offers-located-using-the");
    this.querySelector('[data-value-readout]')!.textContent = readout;
    svg.setAttribute('aria-label', copy("ui.value-map.value-illustrative-value-map-value", { value1: copy(subjective ? "label.subjective" : "label.objective"), value2: readout }));
  }
}
if (!customElements.get('value-map')) customElements.define('value-map', ValueMap);
