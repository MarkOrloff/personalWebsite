import { copy, copyHtml, copyRich } from '../lib/site-copy.mjs';
import { chartBox, probabilityWeight } from '../lib/paper-plots.mjs';
import { offers, offerStages, stageRange, fitAnswers, answersFrom, examplePreferences, explainerTokens } from '../lib/rescale.mjs';
import { savedAnswers } from '../lib/value-calibration.mjs';
import { recall, remember } from '../lib/game-memory.mjs';

type Stage = 'amounts' | 'felt' | 'map';
type Preferences = { alpha: number; rho: number };
type Offer = { p: number; a: number };
type Answer = { question: { id: string; options: Offer[] }; choice: number };
const percent = (value: number, digits = 0) => copy('format.percent', { percent: (value * 100).toFixed(digits).replace(/\.0$/, '') });
const money = (amount: number) => copy('format.money', { amount });

/** Every task offer, followed from dollars and chances through preferences to the rescaled map. */
class RescaleExplainer extends HTMLElement {
  stage: Stage = 'felt'; picked = Math.max(0, offers.findIndex(o => o.p === .3 && o.a === 8));
  /** A clicked (or keyboard-picked) offer stays picked; hovering only previews until something is clicked. */
  pinned = false;
  base: Answer[] = []; extra: Answer[] = []; preferences: Preferences = examplePreferences; next?: Answer['question'];
  positions: { x: number; y: number }[] = []; drawn = false;
  observer?: ResizeObserver; abort?: AbortController;
  connectedCallback() {
    this.abort = new AbortController(); const options = { signal: this.abort.signal };
    this.querySelectorAll<HTMLElement>('[data-enhanced]').forEach(el => el.hidden = false);
    // The walkthrough's choices carry over; this page adds its own after them.
    this.base = answersFrom(recall('value', Array.isArray) ?? []);
    this.extra = answersFrom(recall('value-extra', Array.isArray) ?? []).filter((a: Answer) => !this.base.some(b => b.question.id === a.question.id));
    this.refit();
    this.querySelectorAll<HTMLButtonElement>('[data-stage-choice]').forEach(b => b.addEventListener('click', () => { this.stage = b.dataset.stageChoice as Stage; this.draw(true); }, options));
    this.querySelectorAll<HTMLButtonElement>('[data-rescale-choice]').forEach(b => b.addEventListener('click', () => this.choose(Number(b.dataset.rescaleChoice)), options));
    this.querySelector('[data-rescale-reset]')!.addEventListener('click', () => {
      this.base = []; this.extra = []; remember('value', []); remember('value-extra', []); this.refit(); this.draw(true);
    }, options);
    const svg = this.querySelector('svg')!;
    svg.addEventListener('pointermove', event => { if (!this.pinned && event.pointerType !== 'touch') this.pickAt(event); }, options);
    svg.addEventListener('click', event => this.pickAt(event, true), options);
    svg.addEventListener('keydown', event => this.pickByKey(event), options);
    this.observer = new ResizeObserver(() => this.draw()); this.observer.observe(this); this.draw();
  }
  disconnectedCallback() { this.observer?.disconnect(); this.abort?.abort(); }
  get answers() { return [...this.base, ...this.extra]; }
  refit() { const fit = fitAnswers(this.answers); this.preferences = fit.preferences; this.next = fit.next; }
  choose(choice: number) {
    if (!this.next) return;
    this.extra.push({ question: this.next, choice });
    remember('value-extra', savedAnswers(this.extra));
    this.refit(); this.draw(true);
  }
  pickAt(event: MouseEvent, click = false) {
    const rect = this.querySelector('svg')!.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    let best = -1, distance = 24;
    this.positions.forEach((p, i) => { const d = Math.hypot(p.x - x, p.y - y); if (d < distance) { distance = d; best = i; } });
    // Clicking an offer pins it; clicking the pinned offer again, or empty space, lets hovering preview again.
    if (click) this.pinned = best >= 0 && !(this.pinned && best === this.picked);
    if (best >= 0 && best !== this.picked) { this.picked = best; this.drawPicked(); }
  }
  pickByKey(event: KeyboardEvent) {
    const steps: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    const step = steps[event.key]; if (!step) return;
    event.preventDefault();
    const from = offers[this.picked];
    // Corners of the task grid have no offers, so keep stepping until one exists.
    for (let k = 1; k < 10; k++) {
      const p = Math.round((from.p * 10 + step[0] * k)) / 10, a = from.a + step[1] * k;
      const found = offers.findIndex(o => Math.abs(o.p - p) < 1e-9 && o.a === a);
      if (found >= 0) { this.picked = found; this.pinned = true; this.drawPicked(); return; }
      if (p < .1 || p > 1 || a < 1 || a > 10) return;
    }
  }
  /** Position as a 0–1 fraction of the plotted axes for the current stage. */
  fraction(offer: Offer, stage = this.stage) {
    const s = offerStages(offer, this.preferences), range = stageRange(stage, this.preferences);
    const point = stage === 'amounts' ? s.amounts : stage === 'felt' ? s.felt : s.map;
    return { x: point.x / range.x, y: point.y / range.y };
  }
  draw(animate = false) {
    const width = this.querySelector('.chart-canvas')!.getBoundingClientRect().width; if (!width) return;
    this.dataset.animate = String(animate && this.drawn); this.drawn = true;
    this.dataset.stage = this.stage;
    const box = this.box = chartBox(width, 380), svg = this.querySelector('svg')!;
    svg.setAttribute('viewBox', `0 0 ${width} ${box.height}`); svg.setAttribute('width', String(width)); svg.setAttribute('height', String(box.height));
    this.positions = offers.map(o => this.pixel(this.fraction(o)));
    this.positions.forEach((p, i) => this.querySelector<SVGElement>(`[data-offer="${i}"]`)!.style.transform = `translate(${p.x}px,${p.y}px)`);
    this.querySelector('[data-rescale-axes]')!.innerHTML = this.axes();
    this.querySelector('[data-rescale-y]')!.textContent = copy(`value-rescale.axis.${this.stage}.y`);
    this.querySelectorAll<HTMLButtonElement>('[data-stage-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.stageChoice === this.stage)));
    this.drawGame(); this.drawPicked();
  }
  box?: ReturnType<typeof chartBox>;
  /** The map's 0 and 1 are the task's extremes, so keep them off the axis lines, as on the walkthrough map. */
  pixel(f: { x: number; y: number }) {
    const box = this.box!, pad = this.stage === 'map' ? .07 : 0, span = this.stage === 'map' ? .86 : 1;
    return { x: box.x(pad + span * f.x), y: box.y(pad + span * f.y) };
  }
  axes() {
    const box = this.box!, range = stageRange(this.stage, this.preferences);
    const ticks = this.stage === 'map' ? [0, 1] : [0, .5, 1];
    const label = (axis: 'x' | 'y', t: number) => this.stage === 'amounts' ? (axis === 'x' ? percent(t) : money(t * 10))
      : this.stage === 'felt' ? (axis === 'x' ? String(t) : String(Math.round(t * range.y * 10) / 10)) : String(t);
    const at = (t: number) => this.pixel({ x: t, y: t });
    return `<path class="chart-spine" d="M${box.left},${box.top}V${box.bottom}H${box.right}"/>`
      + ticks.map(t => `<text x="${at(t).x}" y="${box.bottom + 24}" text-anchor="middle">${label('x', t)}</text><text x="${box.left - 10}" y="${at(t).y + 5}" text-anchor="end">${label('y', t)}</text>`).join('')
      + `<text class="chart-axis-label" x="${box.x(.5)}" y="${box.bottom + 56}" text-anchor="middle">${copyHtml(`value-rescale.axis.${this.stage}.x`)}</text>`;
  }
  drawPicked() {
    if (!this.box) return;
    const offer = offers[this.picked], s = offerStages(offer, this.preferences), p = this.positions[this.picked], box = this.box;
    const xText = this.stage === 'amounts' ? percent(offer.p) : this.stage === 'felt' ? `${percent(offer.p)} → ${s.weight.toFixed(2)}` : s.map.x.toFixed(2);
    const yText = this.stage === 'amounts' ? money(offer.a) : this.stage === 'felt' ? `${money(offer.a)} → ${s.units.toFixed(2)}` : s.map.y.toFixed(2);
    // After preferences, a faint ring marks where the offer would sit with no preferences at all.
    const ghost = this.stage === 'felt' ? this.pixel({ x: offer.p, y: offer.a / stageRange('felt', this.preferences).y }) : null;
    const moved = ghost && Math.hypot(ghost.x - p.x, ghost.y - p.y) > 4;
    this.querySelector('[data-rescale-shift]')!.innerHTML = moved ? `<circle class="rescale-ghost" cx="${ghost!.x}" cy="${ghost!.y}" r="6"/><path class="rescale-arrow" d="M${ghost!.x},${ghost!.y}L${p.x},${p.y}"/>` : '';
    this.querySelector('[data-rescale-picked]')!.innerHTML = `<path class="rescale-guide" d="M${box.left},${p.y}H${p.x}V${box.bottom}"/>`
      + `<text class="rescale-guide-label" x="${box.left + 6}" y="${p.y - 7}">${escapeText(yText)}</text>`
      + `<text class="rescale-guide-label" x="${p.x + 6}" y="${box.bottom - 7}">${escapeText(xText)}</text>`
      + `<circle class="rescale-dot" cx="${p.x}" cy="${p.y}" r="6"/>`;
    const toyou = this.answers.length ? ` ${copy('value-rescale.to-you')}` : '';
    const values = { chance: percent(offer.p), amount: money(offer.a), weight: percent(s.weight, 1), units: s.units.toFixed(2), x: percent(s.map.x), y: percent(s.map.y), toyou };
    this.querySelector('[data-rescale-readout]')!.innerHTML = copyRich(`value-rescale.readout.${this.stage}`, values);
  }
  drawGame() {
    const n = this.answers.length, { alpha, rho } = this.preferences;
    const summary = { count: n, weight: percent(probabilityWeight(.8, alpha), 1), ratio: (2 ** rho).toFixed(2) };
    this.querySelector('[data-rescale-fit]')!.innerHTML = copyRich(n === 0 ? 'value-rescale.fit.example' : n === 1 ? 'value-rescale.fit.one' : 'value-rescale.fit.yours', summary);
    this.querySelector<HTMLElement>('[data-rescale-reset]')!.hidden = n === 0;
    // The explainer's worked numbers follow the same preferences as the chart.
    const tokens = explainerTokens(this.preferences, n);
    this.querySelectorAll<HTMLElement>('[data-rescale-copy]').forEach(el => { el.innerHTML = copyRich(el.dataset.rescaleCopy!, tokens); });
    this.querySelector('[data-rescale-prompt]')!.textContent = this.next ? copy('value-rescale.game.prompt') : copy('value-rescale.game.done', { count: n });
    this.querySelectorAll<HTMLButtonElement>('[data-rescale-choice]').forEach((card, i) => {
      const offer = this.next?.options[i];
      card.hidden = !offer; if (!offer) return;
      card.querySelector('[data-option-money]')!.textContent = money(offer.a);
      card.querySelector('[data-option-chance]')!.textContent = percent(offer.p);
      card.querySelector<HTMLElement>('.chance-pie')!.style.setProperty('--chance', `${offer.p * 100}%`);
      card.setAttribute('aria-label', copy('value.option-accessible', { option: copy(i === 0 ? 'ui.paper-plots.a' : 'ui.paper-plots.b'), chance: percent(offer.p), amount: money(offer.a), chosen: '' }));
    });
  }
}
const escapeText = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
if (!customElements.get('rescale-explainer')) customElements.define('rescale-explainer', RescaleExplainer);
