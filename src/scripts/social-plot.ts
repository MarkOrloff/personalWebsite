import { copy } from "../lib/site-copy.mjs";
import data from '../data/social-conformity.json';
import { plotLayout, axesMarkup, meansMarkup, participantLabel } from '../lib/social-plot.mjs';
import { fogRounds, fogColor, fogGameSummary } from '../lib/fog-game.mjs';
import { recall, remember } from '../lib/game-memory.mjs';

class SocialPlot extends HTMLElement {
  ready = false;
  hasDrawn = false;
  view = 'groups';
  group = 'all';
  selected: string | null = null;
  pinned: string | null = null;
  layout: ReturnType<typeof plotLayout>;
  resizeObserver?: ResizeObserver;
  abort?: AbortController;

  answers: ('red' | 'blue')[] = [];
  waiting = false;

  storyNavigation() {
    if (this.view !== 'game') return {};
    const done = this.answers.length === fogRounds.length;
    return { next: copy(done ? "ui.fog-game.continue" : "ui.peer-game.skip"), detail: done ? copy("ui.peer-game.finished") : copy("ui.peer-game.progress", { current: this.answers.length + 1, total: fogRounds.length }) };
  }

  chooseFog(side: number) {
    if (this.waiting || this.answers.length === fogRounds.length) return;
    this.answers.push(fogColor(fogRounds[this.answers.length], side)); remember('fog', this.answers);
    this.waiting = true;
    this.querySelectorAll('[data-fog-choice]').forEach((card, i) => card.classList.toggle('is-chosen', i === side));
    this.querySelector('[data-fog-response]')!.textContent = this.answers.length < fogRounds.length ? copy("ui.peer-game.got-it") : '';
    this.dispatchEvent(new CustomEvent('plot-state-change', { bubbles: true }));
    setTimeout(() => { this.waiting = false; this.drawGame(); }, 500);
  }

  drawGame() {
    const game = this.querySelector<HTMLElement>('[data-fog-game]')!, done = this.answers.length === fogRounds.length;
    game.dataset.done = String(done);
    this.querySelector<HTMLElement>('[data-fog-reset]')!.hidden = !done;
    const players = this.querySelector<HTMLElement>('[data-fog-players]')!;
    if (done) {
      const s = fogGameSummary(this.answers);
      game.dataset.foggy = 'false';
      this.querySelector('[data-fog-prompt]')!.textContent = copy("ui.fog-game.summary-heading");
      this.querySelector('[data-fog-response]')!.textContent = `${copy("ui.fog-game.summary", s)} ${copy(s.foggy > s.clear ? "ui.fog-game.summary-more" : "ui.fog-game.summary-same")}`;
      players.hidden = true; return;
    }
    const round = fogRounds[this.answers.length], color = (name: string) => copy(name === 'red' ? "ui.fog-game.red" : "ui.fog-game.blue");
    game.dataset.foggy = String(round.foggy);
    this.querySelector('[data-fog-prompt]')!.textContent = copy(round.foggy ? "ui.fog-game.prompt-foggy" : "ui.fog-game.prompt-clear", { color: color(round.peers) });
    if (this.answers.length) this.querySelector('[data-fog-response]')!.textContent = '';
    players.hidden = false; players.innerHTML = '';
    for (const number of [1, 2]) { const chip = document.createElement('span'); chip.innerHTML = `<i aria-hidden="true">${number}</i>`; chip.append(copy("ui.peer-game.player", { number, option: color(round.peers) })); players.append(chip); }
    this.querySelectorAll<HTMLButtonElement>('[data-fog-choice]').forEach((card, side) => {
      const name = fogColor(round, side), option = round[name];
      card.dataset.color = name; card.classList.remove('is-chosen');
      card.querySelector('[data-fog-color]')!.textContent = color(name);
      card.querySelector<HTMLElement>('.chance-pie')!.style.setProperty('--chance', `${option.p * 100}%`);
      card.querySelector('[data-fog-amount]')!.textContent = copy("format.money", { amount: option.a });
      card.querySelector('[data-fog-chance]')!.textContent = copy("ui.value-map.chance-percent", { value1: Math.round(option.p * 100) });
      card.querySelector('[data-fog-peers]')!.innerHTML = name === round.peers ? '<i aria-hidden="true">1</i><i aria-hidden="true">2</i>' : '';
      card.setAttribute('aria-label', round.foggy ? copy("ui.fog-game.aria-foggy", { color: color(name) }) : copy("ui.fog-game.aria-clear", { color: color(name), chance: `${Math.round(option.p * 100)}%`, amount: copy("format.money", { amount: option.a }) }));
    });
  }

  connectedCallback() {
    if (this.ready) return;
    this.ready = true;
    this.abort = new AbortController();
    const options = { signal: this.abort.signal };
    this.querySelectorAll<HTMLElement>('[data-enhanced]').forEach(el => el.hidden = false);
    this.addEventListener('click', event => {
      const button = (event.target as Element).closest<HTMLButtonElement>('button');
      if (!button) return;
      this.querySelector('.point-readout')!.setAttribute('aria-live', 'polite');
      if (button.dataset.viewButton) this.setView(button.dataset.viewButton, true);
      if (button.dataset.group) this.setGroup(button.dataset.group);
      if (button.hasAttribute('data-clear')) { this.pinned = null; this.select(null); }
    }, options);
    this.querySelector<HTMLSelectElement>('[data-inspect]')?.addEventListener('change', event => {
      const id = (event.target as HTMLSelectElement).value;
      this.setGroup('all');
      this.pinned = id || null;
      this.select(this.pinned);
    }, options);
    const canvas = this.querySelector<HTMLElement>('.plot-canvas')!;
    canvas.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || this.pinned) return;
      this.querySelector('.point-readout')!.setAttribute('aria-live', 'off');
      this.select(this.nearest(event, 24));
    }, options);
    canvas.addEventListener('pointerleave', () => { if (!this.pinned) this.select(null); }, options);
    canvas.addEventListener('click', event => {
      this.querySelector('.point-readout')!.setAttribute('aria-live', 'polite');
      const nearest = this.nearest(event, 38);
      this.pinned = nearest === this.pinned ? null : nearest;
      this.select(this.pinned);
    }, options);
    this.querySelectorAll<HTMLButtonElement>('[data-fog-choice]').forEach(card => card.addEventListener('click', () => this.chooseFog(Number(card.dataset.fogChoice)), options));
    this.answers = recall('fog', (a: unknown) => Array.isArray(a) && a.length <= fogRounds.length && a.every(x => x === 'red' || x === 'blue')) ?? [];
    this.querySelector('[data-fog-reset]')?.addEventListener('click', () => { this.answers = []; remember('fog', this.answers); this.drawGame(); this.dispatchEvent(new CustomEvent('plot-state-change', { bubbles: true })); this.querySelector<HTMLElement>('[data-fog-prompt]')!.focus({ preventScroll: true }); }, options);
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas);
    this.draw();
  }

  disconnectedCallback() { this.resizeObserver?.disconnect(); this.abort?.abort(); this.ready = false; }

  setView(view: string, notify = false) {
    const game = view === 'game';
    this.querySelector<HTMLElement>('[data-fog-game]')!.hidden = !game;
    if (game) { this.view = 'game'; this.dataset.view = 'game'; this.drawGame(); return; }
    const requested = view === 'relationship' ? 'relationship' : 'groups';
    if (this.view === requested && this.layout) return;
    const previousView = this.view;
    this.view = requested;
    this.dataset.view = this.view;
    this.querySelectorAll<HTMLButtonElement>('[data-view-button]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.viewButton === this.view)));
    this.querySelector<HTMLElement>('.figure-reference')!.textContent = this.view === 'groups' ? copy("ui.social-plot.fig-3a") : copy("ui.social-plot.fig-3d");
    this.querySelector<HTMLElement>('.x-axis-label')!.hidden = this.view === 'groups';
    this.querySelector<HTMLElement>('[data-plot-caption]')!.textContent = this.view === 'groups'
      ? copy("ui.social-plot.each-colored-dot-is-a-person")
      : copy("ui.social-plot.the-same-44-people-now-positioned");
    this.draw(previousView !== this.view);
    if (notify) this.dispatchEvent(new CustomEvent('plot-view-change', { detail: { view: this.view }, bubbles: true }));
  }

  setGroup(group: string) {
    this.group = ['control', 'insula', 'acc'].includes(group) ? group : 'all';
    this.querySelectorAll<HTMLButtonElement>('[data-group]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.group === this.group)));
    this.querySelectorAll<SVGElement>('[data-point]').forEach(el => {
      const point = data.participants.find(p => p.id === el.dataset.point)!;
      el.dataset.dimmed = String(this.group !== 'all' && point.group !== this.group);
    });
    this.querySelectorAll<SVGElement>('[data-mean]').forEach(el => el.dataset.dimmed = String(this.group !== 'all' && el.dataset.mean !== this.group));
    if (this.selected && this.group !== 'all' && data.participants.find(p => p.id === this.selected)?.group !== this.group) { this.pinned = null; this.select(null); }
    else this.select(this.selected);
  }

  draw(animate = false) {
    const canvas = this.querySelector<HTMLElement>('.plot-canvas')!;
    const width = canvas.getBoundingClientRect().width;
    if (!width) return;
    this.dataset.animate = String(animate && this.hasDrawn);
    this.hasDrawn = true;
    this.layout = plotLayout(data, width, this.view, this.dataset.compact === 'true');
    const svg = this.querySelector<SVGSVGElement>('svg')!;
    svg.setAttribute('viewBox', `0 0 ${width} ${this.layout.height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(this.layout.height));
    svg.setAttribute('aria-label', this.view === 'groups'
      ? copy("ui.social-plot.following-weights-for-44-participants-in")
      : copy("ui.social-plot.the-same-44-participants-solo-model"));
    this.querySelector('.plot-axes')!.innerHTML = axesMarkup(this.layout);
    this.querySelector('.plot-means')!.innerHTML = meansMarkup(this.layout);
    const clip = this.querySelector('.plot-clip')!;
    for (const [key,value] of Object.entries({ x: this.layout.left, y: this.layout.top, width: this.layout.right-this.layout.left, height: this.layout.bottom-this.layout.top })) clip.setAttribute(key,String(value));
    const [a, b] = this.layout.fit;
    this.querySelector('.plot-fit')!.setAttribute('d', `M${a.x},${a.y}L${b.x},${b.y}`);
    for (const point of this.layout.points) {
      this.querySelector<SVGElement>(`[data-point="${point.id}"]`)!.style.transform = `translate(${point.x}px,${point.y}px)`;
    }
    this.setGroup(this.group);
  }

  nearest(event: MouseEvent, radius: number) {
    if (!this.layout) return null;
    const rect = this.querySelector('svg')!.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const candidates = this.layout.points.filter(p => this.group === 'all' || p.group === this.group);
    let selected: string | null = null, distance = radius;
    for (const point of candidates) {
      const next = Math.hypot(point.x - x, point.y - y);
      if (next < distance) { distance = next; selected = point.id; }
    }
    return selected;
  }

  select(id: string | null) {
    this.selected = id;
    const inspector = this.querySelector<HTMLSelectElement>('[data-inspect]');
    if (inspector) inspector.value = id || '';
    this.querySelectorAll('[data-point]').forEach(el => el.classList.toggle('is-selected', el.getAttribute('data-point') === id));
    const point = data.participants.find(p => p.id === id);
    // Only a selected person gets a readout; the plot itself shows the groups.
    const text = point
      ? copy("ui.social-plot.value-following-valuevalue", { value1: participantLabel(point), value2: point.follow.toFixed(2), value3: this.view === 'relationship' ? (" " + copy("ui.social-plot.solo-mismatch-value", { value1: point.soloNll.toFixed(2) })) : '' })
      : '';
    const readout = this.querySelector<HTMLElement>('.point-readout')!;
    if (readout.textContent !== text) readout.textContent = text;
    this.querySelector<HTMLButtonElement>('[data-clear]')!.hidden = !point;
  }
}
if (!customElements.get('social-plot')) customElements.define('social-plot', SocialPlot);
