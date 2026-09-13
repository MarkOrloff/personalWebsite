import { copy } from "../lib/site-copy.mjs";
import data from '../data/social-conformity.json';
import { plotLayout, axesMarkup, meansMarkup, participantLabel, participantGroupLabel } from '../lib/social-plot.mjs';

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
    this.resizeObserver = new ResizeObserver(() => this.draw());
    this.resizeObserver.observe(canvas);
    this.draw();
  }

  disconnectedCallback() { this.resizeObserver?.disconnect(); this.abort?.abort(); this.ready = false; }

  setView(view: string, notify = false) {
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
    const group = data.groups.find(g => g.id === this.group);
    const text = point
      ? copy("ui.social-plot.value-following-valuevalue", { value1: participantLabel(point), value2: point.follow.toFixed(2), value3: this.view === 'relationship' ? (" " + copy("ui.social-plot.solo-mismatch-value", { value1: point.soloNll.toFixed(2) })) : '' })
      : group ? copy("ui.social-plot.value-value-people-mean-value-value", { value1: participantGroupLabel(group), value2: group.n, value3: group.mean.toFixed(2), value4: group.sem.toFixed(2) })
      : copy("ui.social-plot.select-a-dot-to-see-one");
    const readout = this.querySelector<HTMLElement>('.point-readout')!;
    if (readout.textContent !== text) readout.textContent = text;
    this.querySelector<HTMLButtonElement>('[data-clear]')!.hidden = !point;
  }
}
if (!customElements.get('social-plot')) customElements.define('social-plot', SocialPlot);
