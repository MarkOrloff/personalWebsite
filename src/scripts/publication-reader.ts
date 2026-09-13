import { copy } from "../lib/site-copy.mjs";
type ReadingPlot = HTMLElement & {
  setView?: (view: string) => void;
  readingState?: () => Record<string, string>;
  restoreReadingState?: (params: URLSearchParams) => void;
  storyNavigation?: () => { next?: string; previous?: string; canGoBack?: boolean; detail?: string };
  advanceStory?: (direction: number) => boolean;
  setReadingContext?: (depth: string, step: number) => void;
};
const reader = document.querySelector<HTMLElement>('[data-reader]');
if (reader) {
  const plot = reader.querySelector<ReadingPlot>('[data-story-plot]')!;
  const stepPanels = Array.from(reader.querySelectorAll<HTMLElement>('[data-step-panel]'));
  const steps = stepPanels.map(panel => ({ view: panel.dataset.view!, visual: panel.dataset.visual || 'plot', emphasis: panel.dataset.emphasis || 'all' }));
  const defaultView = plot.dataset.view!;
  const panels = reader.querySelectorAll<HTMLElement>('[data-depth-panel]');
  const tabs = Array.from(reader.querySelectorAll<HTMLButtonElement>('[data-depth]'));
  const pagination = reader.querySelector<HTMLElement>('.story-pagination')!;
  const previous = reader.querySelector<HTMLButtonElement>('[data-step-previous]')!;
  const next = reader.querySelector<HTMLButtonElement>('[data-step-next]')!;
  let depth = 'gist', step = 0, view = defaultView;
  reader.querySelectorAll<HTMLElement>('[data-enhanced]').forEach(el => el.hidden = false);

  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set('depth', depth);
    if (depth === 'story') url.searchParams.set('step', String(step + 1)); else url.searchParams.delete('step');
    url.searchParams.set('view', view);
    for (const key of ['alpha', 'rho', 'choice', 'pair', 'route', 'replay', 'destination']) url.searchParams.delete(key);
    if (plot.readingState) for (const [key, value] of Object.entries(plot.readingState())) url.searchParams.set(key, value);
    if (url.href !== location.href) history.pushState(null, '', url);
  }
  function navigation() {
    const state = plot.storyNavigation?.() || {};
    previous.disabled = step === 0 && !state.canGoBack;
    previous.textContent = state.previous || copy("ui.paper-reader.back");
    next.textContent = state.next || (step === steps.length - 1 ? copy("ui.publication-reader.go-deeper") : copy("ui.paper-reader.next"));
    reader!.querySelector<HTMLElement>('[data-step-count]')!.textContent = state.detail || copy("format.story-progress",{current:String(step+1).padStart(2,"0"),total:String(steps.length).padStart(2,"0")});
  }
  function render(push = true) {
    reader!.dataset.depth = depth;
    reader!.dataset.scene = steps[step].view;
    panels.forEach(panel => panel.hidden = panel.dataset.depthPanel !== depth);
    pagination.hidden = depth !== 'story';
    tabs.forEach(tab => { const active = tab.dataset.depth === depth; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    stepPanels.forEach((panel, i) => panel.hidden = i !== step);
    const visual = steps[step].visual;
    reader!.querySelector<HTMLElement>('.reader-figure')!.hidden = depth === 'gist';
    reader!.querySelector<HTMLElement>('[data-reader-plot]')!.hidden = depth === 'gist' || (depth === 'story' ? visual !== 'plot' : plot.localName === 'value-map');
    reader!.querySelector<HTMLElement>('[data-reader-brain]')!.hidden = depth === 'gist' || (depth === 'story' && visual !== 'brain');
    const commentary = reader!.querySelector<HTMLElement>('[data-reader-commentary]');
    if (commentary) commentary.hidden = depth !== 'story' || visual !== 'commentary';
    plot.dataset.emphasis = depth === 'story' ? steps[step].emphasis : 'all';
    plot.dataset.readingDepth = depth;
    plot.setReadingContext?.(depth, step);
    if (depth === 'story') view = steps[step].view;
    plot.setView?.(view);
    navigation();
    if (push) updateURL();
  }
  function readURL() {
    const params = new URL(location.href).searchParams;
    const requested = params.get('depth');
    depth = requested === 'story' || requested === 'deep' ? requested : 'gist';
    const parsed = Number(params.get('step') || 1);
    step = Number.isInteger(parsed) ? Math.max(0, Math.min(steps.length - 1, parsed - 1)) : 0;
    // In the walkthrough the scene is authoritative, including for old shared links.
    const requestedView = params.get('view');
    const validViews = new Set([...steps.map(s => s.view), defaultView, plot.dataset.deepView]);
    view = depth === 'story' ? steps[step].view : depth === 'deep'
      ? plot.localName !== 'value-map' && requestedView && validViews.has(requestedView) ? requestedView : plot.dataset.deepView || defaultView
      : defaultView;
    plot.restoreReadingState?.(params);
    render(false);
  }
  function selectDepth(value: string) {
    depth = value;
    if (depth === 'deep') view = plot.dataset.deepView || defaultView;
    render();
  }
  tabs.forEach(tab => tab.addEventListener('click', () => selectDepth(tab.dataset.depth!)));
  reader.querySelector('.depth-tabs')!.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[index].focus(); selectDepth(tabs[index].dataset.depth!);
  });
  reader.querySelector('[data-start-story]')!.addEventListener('click', () => { step = 0; selectDepth('story'); tabs[1].focus({ preventScroll: true }); });
  function advance(direction: number) {
    if (plot.advanceStory?.(direction)) { navigation(); updateURL(); return; }
    if (direction > 0 && step === steps.length - 1) { selectDepth('deep'); tabs[2].focus({ preventScroll: true }); }
    else { step = Math.max(0, Math.min(steps.length - 1, step + direction)); render(); }
    // Keep the next explanation in view when the previous scene was taller.
    const body = reader!.querySelector<HTMLElement>('.reader-body')!;
    if (body.getBoundingClientRect().top < 85) body.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  previous.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance(1));
  plot.addEventListener('plot-view-change', (event: CustomEvent) => {
    if (depth === 'story') return; // Figure exploration cannot move the story.
    view = event.detail.view; updateURL();
  });
  plot.addEventListener('plot-state-change', () => { navigation(); updateURL(); });
  reader.querySelector<HTMLButtonElement>('[data-share]')!.addEventListener('click', async () => {
    updateURL();
    try {
      await navigator.clipboard.writeText(location.href);
      reader.querySelector('[data-share]')!.textContent = copy("ui.publication-reader.link-copied");
      reader.querySelector('.share-status')!.textContent = copy("ui.publication-reader.reading-link-copied");
    } catch {
      const fallback = reader.querySelector<HTMLElement>('.share-fallback')!;
      fallback.hidden = false;
      const input = fallback.querySelector('input')!; input.value = location.href; input.focus(); input.select();
      reader.querySelector('.share-status')!.textContent = copy("ui.publication-reader.select-and-copy-the-reading-link");
    }
  });
  window.addEventListener('popstate', readURL);
  // One initialization after the figure is ready; no second reset of quiz state.
  customElements.whenDefined(plot.localName).then(readURL);
}
