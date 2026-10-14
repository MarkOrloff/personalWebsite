// Click-to-edit for the local dev server only (loaded from BaseLayout when import.meta.env.DEV).
// Clicking text finds the matching block in content/walkthrough-copy.md; saving writes it back,
// and the dev server reloads the page with the new text.
type Values = Record<string, string>;
const STORAGE_KEY = 'copy-editor-on';
const HEADERS = { 'x-copy-editor': '1' };

const css = `
.copy-editor-ui { position:fixed; z-index:9999; font:13px/1.45 -apple-system, BlinkMacSystemFont, sans-serif; text-transform:none; color:#e8ecf1; }
.copy-editor-toggle { left:16px; bottom:16px; background:#2b3340; border:1px solid #4b5566; border-radius:999px; padding:8px 14px; color:inherit; cursor:pointer; }
.copy-editor-toggle[aria-pressed="true"] { background:#ff7a6b; border-color:#ff7a6b; color:#14181f; }
.copy-editor-tip { left:16px; bottom:58px; background:#14181f; border:1px solid #4b5566; border-radius:8px; padding:6px 10px; color:#aeb6c2; }
.copy-editor-panel { right:16px; bottom:16px; width:min(520px, calc(100vw - 32px)); background:#14181f; border:1px solid #4b5566; border-radius:12px; padding:14px; box-shadow:0 10px 40px rgba(0,0,0,.5); }
.copy-editor-panel textarea { width:100%; min-height:120px; margin:8px 0; padding:10px; background:#1d232d; color:#e8ecf1; border:1px solid #4b5566; border-radius:8px; font:inherit; resize:vertical; }
.copy-editor-panel select, .copy-editor-panel button { font:inherit; color:inherit; background:#2b3340; border:1px solid #4b5566; border-radius:6px; padding:5px 10px; cursor:pointer; }
.copy-editor-panel select { width:100%; }
.copy-editor-panel .row { display:flex; gap:8px; justify-content:flex-end; align-items:center; }
.copy-editor-panel .key { font:11px ui-monospace, monospace; color:#aeb6c2; word-break:break-all; }
.copy-editor-panel .note { font-size:12px; color:#aeb6c2; margin:0 auto 0 0; }
.copy-editor-panel .save { background:#ff7a6b; border-color:#ff7a6b; color:#14181f; }
.copy-editor-panel .note-box textarea { min-height:70px; }
.copy-editor-progress-toggle { left:132px; }
.copy-editor-progress { max-height:70vh; overflow:auto; }
.copy-editor-progress ul { list-style:none; margin:8px 0 0; padding:0; }
.copy-editor-progress li { padding:5px 0; border-top:1px solid #2b3340; }
html.copy-editing main *:hover, html.copy-editing nav *:hover, html.copy-editing footer *:hover { outline:1px dashed rgba(255,122,107,.6); outline-offset:2px; cursor:text; }
`;

const norm = (text: string) => text.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tokenPattern = /\{\{[^}]+\}\}/;
const templateRegExp = (value: string, whole: boolean) => {
  const body = norm(value).split(/\{\{[^}]+\}\}/).map(escapeRegExp).join('[\\s\\S]+?');
  return new RegExp(whole ? `^${body}$` : body);
};

let values: Values = {};
type PageStatus = { page: string; reviewed: boolean };
async function loadReview(): Promise<PageStatus[]> {
  return (await fetch('/__copy/review', { headers: HEADERS })).json();
}
let panel: HTMLElement | null = null;
const ui: HTMLElement[] = [];

// Every block whose text matches what was clicked, best match first.
function findKeys(text: string): string[] {
  const t = norm(text);
  if (!t) return [];
  const entries = Object.entries(values);
  const exact = entries.filter(([, v]) => norm(v) === t).map(([k]) => k);
  if (exact.length) return exact;
  const templated = entries.filter(([, v]) => tokenPattern.test(v));
  const filled = templated.filter(([, v]) => templateRegExp(v, true).test(t)).map(([k]) => k);
  if (filled.length) return filled;
  const inside = entries.filter(([, v]) => norm(v).length > 1 && t.includes(norm(v)))
    .sort((a, b) => norm(b[1]).length - norm(a[1]).length).map(([k]) => k);
  const insideTemplates = templated.filter(([, v]) => templateRegExp(v, false).test(t)).map(([k]) => k);
  return [...new Set([...inside, ...insideTemplates])].slice(0, 12);
}

function clickedText(event: MouseEvent): string {
  const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null };
  const node = doc.caretPositionFromPoint?.(event.clientX, event.clientY)?.offsetNode
    ?? document.caretRangeFromPoint?.(event.clientX, event.clientY)?.startContainer;
  if (node && node.nodeType === Node.TEXT_NODE && norm(node.textContent || '')) return node.textContent || '';
  return (event.target as Element)?.textContent || '';
}

function closePanel() { panel?.remove(); panel = null; }

function openPanel(keys: string[], clicked: string) {
  closePanel();
  panel = document.createElement('div');
  panel.className = 'copy-editor-ui copy-editor-panel';
  if (!keys.length) {
    panel.innerHTML = `<p class="note"></p><div class="row"><button type="button" data-close>close</button></div>`;
    panel.querySelector('.note')!.textContent = `couldn't find this text in the copy document. it may come from a figure image or the paper's metadata. clicked: “${norm(clicked).slice(0, 120)}”`;
  } else {
    panel.innerHTML = `<select aria-label="copy block"></select><div class="key"></div><textarea aria-label="text"></textarea><div class="row"><p class="note"></p><button type="button" data-note>add a note</button><button type="button" data-close>cancel</button><button type="button" class="save" data-save>save</button></div><div class="note-box" hidden><textarea aria-label="note for claude" placeholder="a note about this text (saved as a comment in the copy file)"></textarea><div class="row"><button type="button" data-save-note>save note</button></div></div>`;
    const select = panel.querySelector('select')!;
    const textarea = panel.querySelector('textarea')!;
    const keyLabel = panel.querySelector('.key')!;
    const note = panel.querySelector('.note')!;
    for (const key of keys) select.add(new Option(`${norm(values[key]).slice(0, 70)}${norm(values[key]).length > 70 ? '…' : ''}`, key));
    select.hidden = keys.length === 1;
    const show = () => {
      keyLabel.textContent = select.value + (keys.length > 1 ? `  ·  ${keys.length} possible matches` : '');
      textarea.value = values[select.value];
      note.textContent = tokenPattern.test(values[select.value]) ? 'keep the {{…}} placeholders' : '⌘↵ to save';
    };
    select.addEventListener('change', show); show();
    const save = async () => {
      note.textContent = 'saving…';
      const response = await fetch('/__copy', { method: 'POST', headers: { ...HEADERS, 'content-type': 'application/json' }, body: JSON.stringify({ key: select.value, value: textarea.value }) });
      const result = await response.json();
      note.textContent = response.ok ? 'saved, reloading…' : result.error;
    };
    panel.querySelector('[data-save]')!.addEventListener('click', save);
    const noteBox = panel.querySelector<HTMLElement>('.note-box')!;
    const noteText = noteBox.querySelector('textarea')!;
    panel.querySelector('[data-note]')!.addEventListener('click', () => { noteBox.hidden = !noteBox.hidden; if (!noteBox.hidden) noteText.focus(); });
    panel.querySelector('[data-save-note]')!.addEventListener('click', async () => {
      note.textContent = 'saving note…';
      const response = await fetch('/__copy', { method: 'POST', headers: { ...HEADERS, 'content-type': 'application/json' }, body: JSON.stringify({ key: select.value, note: noteText.value }) });
      note.textContent = response.ok ? 'note saved' : (await response.json()).error;
    });
    textarea.addEventListener('keydown', event => { if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); save(); } });
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(textarea.value.length, textarea.value.length); });
  }
  panel.querySelector('[data-close]')!.addEventListener('click', closePanel);
  document.body.append(panel);
}

async function openProgress() {
  closePanel();
  panel = document.createElement('div');
  panel.className = 'copy-editor-ui copy-editor-panel copy-editor-progress';
  panel.innerHTML = '<div class="row"><p class="note">pages you’ve edited count as reviewed.</p><button type="button" data-close>close</button></div><ul></ul>';
  panel.querySelector('[data-close]')!.addEventListener('click', closePanel);
  document.body.append(panel);
  const list = panel.querySelector('ul')!;
  for (const { page, reviewed } of await loadReview()) {
    const item = document.createElement('li');
    item.textContent = `${reviewed ? '✓' : '○'}  ${page}${reviewed ? '' : '  · not reviewed yet'}`;
    list.append(item);
  }
}

function setEditing(on: boolean, toggle: HTMLButtonElement, tip: HTMLElement) {
  document.documentElement.classList.toggle('copy-editing', on);
  toggle.setAttribute('aria-pressed', String(on));
  tip.hidden = !on;
  try { on ? sessionStorage.setItem(STORAGE_KEY, '1') : sessionStorage.removeItem(STORAGE_KEY); } catch {}
  if (!on) closePanel();
}

async function start() {
  values = await (await fetch('/__copy', { headers: HEADERS })).json();
  const style = document.createElement('style'); style.textContent = css; document.head.append(style);
  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.className = 'copy-editor-ui copy-editor-toggle'; toggle.textContent = '✎ edit text';
  const tip = document.createElement('div');
  tip.className = 'copy-editor-ui copy-editor-tip'; tip.textContent = 'click any text to edit it · option-click to use the page normally';
  const progress = document.createElement('button');
  progress.type = 'button'; progress.className = 'copy-editor-ui copy-editor-toggle copy-editor-progress-toggle'; progress.textContent = '✓ pages reviewed';
  progress.addEventListener('click', openProgress);
  ui.push(toggle, tip, progress);
  document.body.append(toggle, tip, progress);
  let on = false; try { on = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch {}
  setEditing(on, toggle, tip);
  toggle.addEventListener('click', () => setEditing(!document.documentElement.classList.contains('copy-editing'), toggle, tip));
  document.addEventListener('click', event => {
    if (!document.documentElement.classList.contains('copy-editing') || event.altKey) return;
    const target = event.target as Element;
    if (ui.some(el => el.contains(target)) || panel?.contains(target)) return;
    event.preventDefault(); event.stopPropagation();
    const text = clickedText(event);
    let keys = findKeys(text);
    if (!keys.length && target?.textContent && target.textContent !== text) keys = findKeys(target.textContent);
    const block = target?.closest('p, h1, h2, h3, h4, li, figcaption, button, label');
    if (!keys.length && block?.textContent) keys = findKeys(block.textContent);
    openPanel(keys, text);
  }, true);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanel(); });
}

start();
