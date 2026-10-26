#!/usr/bin/env node
// share/edit.mjs -- change the words of an encrypted share page by clicking on them (Node 18+, no packages).
//
//   node share/edit.mjs              # from the repo root; picks the page if public/share/ holds one
//   node share/edit.mjs <slug>       # public/share/<slug>/index.html
//   options: --port 4322, --file <encrypted index.html>
//
// Asks for the page's password (or reads $SHARE_PASSWORD), decrypts public/share/<slug>/index.html in
// memory and serves it on http://127.0.0.1:4322/ with an "edit text" button at the bottom left, as the
// main site's `npm run dev` does. With it on, click any of the page's own words, type, and press Enter
// (or click away) to save; Escape or Shift+Enter cancels. Every save writes the page's encrypted file
// again: same salt (so "remember on this device" keeps working for readers), a new IV, written to a
// temporary file and renamed. The plaintext never touches the disk. Publish by committing that one
// file on main and pushing (see share/README.md).
//
// Format (the page's unlock.js): base64(salt[16] | iv[12] | AES-256-GCM(gzip(page html)) + tag), key =
// PBKDF2-HMAC-SHA256(password, salt, ITERATIONS), AAD from the page. The words live in one JSON object,
// <script type="application/json" id="share-copy">, key -> plain text; elements show it by data-copy-key.
// Rules for an edit (as the main site's copy document): non-empty plain text, no comment markers, an
// existing key. The local endpoint answers only with the header x-copy-editor: 1 (a cross-site page
// cannot send it without a preflight this server never grants) and only for Host 127.0.0.1 / localhost.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { webcrypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const subtle = webcrypto.subtle;
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHARE = path.join(REPO, 'public', 'share');
const PAYLOAD = /(<script type="application\/octet-stream" id="payload">)([^<]*)(<\/script>)/;
const COPY = /(<script type="application\/json" id="share-copy">)([\s\S]*?)(<\/script>)/;
const enc = new TextEncoder();

function fail(message, code = 1) { console.error(message); process.exit(code); }

function parseArgs(argv) {
  const o = { slug: null, port: 4322, file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--port') o.port = Number(argv[++i]);
    else if (a === '--file') o.file = path.resolve(argv[++i]);
    else if (a === '-h' || a === '--help') fail('usage: node share/edit.mjs [slug] [--port 4322] [--file public/share/<slug>/index.html]', 0);
    else if (!a.startsWith('--') && !o.slug) o.slug = a;
    else fail(`unknown argument: ${a}`);
  }
  return o;
}

function pickFile(o) {
  if (o.file) return o.file;
  const slugs = fs.existsSync(SHARE) ? fs.readdirSync(SHARE).filter(s => fs.existsSync(path.join(SHARE, s, 'index.html'))) : [];
  if (o.slug) {
    if (!slugs.includes(o.slug)) fail(`no page public/share/${o.slug}/index.html (pages: ${slugs.join(', ') || 'none'})`);
    return path.join(SHARE, o.slug, 'index.html');
  }
  if (slugs.length === 1) return path.join(SHARE, slugs[0], 'index.html');
  fail(slugs.length ? `several pages; say which:\n  ${slugs.map(s => `node share/edit.mjs ${s}`).join('\n  ')}` : 'no pages under public/share/');
}

function askHidden(question) {
  return new Promise(resolve => {
    const input = process.stdin;
    if (!input.isTTY) {                                          // piped: read one line
      let buf = '';
      input.setEncoding('utf8');
      input.on('data', d => { buf += d; });
      input.on('end', () => resolve(buf.split(/\r?\n/)[0]));
      return;
    }
    process.stdout.write(question);
    input.setRawMode(true); input.resume(); input.setEncoding('utf8');
    let s = '';
    const onData = chunk => {
      for (const c of chunk) {
        if (c === '\r' || c === '\n') { input.setRawMode(false); input.pause(); input.removeListener('data', onData); process.stdout.write('\n'); resolve(s); return; }
        if (c === '\u0003') { process.stdout.write('\n'); process.exit(130); }
        if (c === '\u007f' || c === '\b') s = s.slice(0, -1); else s += c;
      }
    };
    input.on('data', onData);
  });
}

// ---------------------------------------------------------------- the encrypted page
async function openPage(file, password) {
  const wrapper = fs.readFileSync(file, 'utf8');
  const m = PAYLOAD.exec(wrapper);
  const it = /var ITERATIONS = (\d+)/.exec(wrapper), aad = /AAD = '([^']*)'/.exec(wrapper);
  if (!m || !it || !aad) fail(`${file} is not an encrypted share page`);
  const raw = Buffer.from(m[2].replace(/\s+/g, ''), 'base64');
  const salt = raw.subarray(0, 16), iv = raw.subarray(16, 28), body = raw.subarray(28);
  const base = await subtle.importKey('raw', enc.encode(password.trim().normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  const key = await subtle.deriveKey({ name: 'PBKDF2', salt, iterations: Number(it[1]), hash: 'SHA-256' }, base,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  let html;
  try {
    const plain = await subtle.decrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(aad[1]), tagLength: 128 }, key, body);
    html = zlib.gunzipSync(Buffer.from(plain)).toString('utf8');
  } catch { fail('that password does not open this page.', 2); }
  const c = COPY.exec(html);
  if (!c) fail('this page has no editable text (it was built before the editor existed); ask Claude to rebuild it.');
  return { wrapper, salt, key, aad: aad[1], html, copy: JSON.parse(c[2]) };
}

async function writePage(file, page) {
  page.html = page.html.replace(COPY, (_, a, __, b) => a + JSON.stringify(page.copy).replace(/<\//g, '<\\/') + b);
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const body = await subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(page.aad), tagLength: 128 }, page.key,
    zlib.gzipSync(Buffer.from(page.html, 'utf8'), { level: 9 }));
  const blob = Buffer.concat([page.salt, Buffer.from(iv), Buffer.from(body)]).toString('base64');
  page.wrapper = page.wrapper.replace(PAYLOAD, (_, a, __, b) => a + blob + b);
  const tmp = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`);
  fs.writeFileSync(tmp, page.wrapper);                          // ciphertext only
  fs.renameSync(tmp, file);
}

function checkEdit(page, key, value) {
  if (typeof key !== 'string' || !Object.prototype.hasOwnProperty.call(page.copy, key)) throw new Error(`unknown text key: ${key}`);
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text || text.includes('<!--') || text.includes('-->')) throw new Error('text must be non-empty plain text (no <!-- or -->)');
  return text;
}

// ---------------------------------------------------------------- the in-page editor (only here, never published)
const EDITOR = String.raw`
(function () {
  'use strict';
  var STORAGE = 'share-copy-editor-on';
  var css = '.copy-editor-ui{position:fixed;z-index:9999;font:13px/1.45 -apple-system,BlinkMacSystemFont,sans-serif;text-transform:none;color:#e8ecf1}' +
    '.copy-editor-toggle{left:16px;bottom:16px;background:#2b3340;border:1px solid #4b5566;border-radius:999px;padding:8px 14px;color:#e8ecf1;cursor:pointer}' +
    '.copy-editor-toggle[aria-pressed="true"]{background:#ff7a6b;border-color:#ff7a6b;color:#14181f}' +
    '.copy-editor-tip{left:16px;bottom:58px;background:#14181f;border:1px solid #4b5566;border-radius:8px;padding:6px 10px;color:#aeb6c2}' +
    '.copy-editor-notice{left:16px;bottom:100px;background:#14181f;border:1px solid #4b5566;border-radius:8px;padding:6px 10px}' +
    '.copy-editor-notice.error{border-color:#ff7a6b;color:#ff9d92}' +
    'html.copy-editing [data-copy-key]:not([data-copy-attr]):hover{outline:1px dashed rgba(255,122,107,.8);outline-offset:2px;cursor:text}' +
    'html.copy-editing [data-copy-key]:not([data-copy-attr]):focus{outline:2px solid #ff7a6b;outline-offset:2px}';
  var values = {}, items = [], notice, timer;
  var EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
  function editing() { return document.documentElement.classList.contains('copy-editing'); }
  function norm(t) { return String(t || '').replace(/\s+/g, ' ').trim(); }
  function fill(el, text) {
    if (el.getAttribute('data-copy-format') === 'contact') {
      el.textContent = ''; var last = 0;
      text.replace(EMAIL, function (m, at) {
        el.appendChild(document.createTextNode(text.slice(last, at)));
        var a = document.createElement('a'); a.href = 'mailto:' + m; a.textContent = m; el.appendChild(a);
        last = at + m.length; return m;
      });
      el.appendChild(document.createTextNode(text.slice(last)));
    } else el.textContent = text;
  }
  function fillKey(key) {
    items.forEach(function (el) { if (el.getAttribute('data-copy-key') === key) fill(el, values[key]); });
    if (key === 'page.title') document.title = values[key];
  }
  function say(text, error) {
    notice.textContent = text; notice.classList.toggle('error', !!error); notice.hidden = false;
    clearTimeout(timer); if (!error) timer = setTimeout(function () { notice.hidden = true; }, 1800);
  }
  function save(el) {
    var key = el.getAttribute('data-copy-key'), text = norm(el.textContent);
    if (text === values[key]) { fillKey(key); return; }
    say('saving…');
    fetch('/__copy', { method: 'POST', headers: { 'x-copy-editor': '1', 'content-type': 'application/json' }, body: JSON.stringify({ key: key, value: text }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok) { values[key] = res.j.value; fillKey(key); say('saved'); document.documentElement.setAttribute('data-copy-saved', key); }
        else { fillKey(key); say('not saved: ' + res.j.error, true); }
      }, function (err) { fillKey(key); say('not saved: ' + err.message, true); });
  }
  function setEditing(on, toggle, tip) {
    document.documentElement.classList.toggle('copy-editing', on);
    toggle.setAttribute('aria-pressed', String(on)); tip.hidden = !on;
    items.forEach(function (el) {
      if (on) { el.setAttribute('contenteditable', 'plaintext-only'); if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true'); }
      else el.removeAttribute('contenteditable');
    });
    try { on ? sessionStorage.setItem(STORAGE, '1') : sessionStorage.removeItem(STORAGE); } catch (e) {}
  }
  function start() {
    items = Array.prototype.slice.call(document.querySelectorAll('[data-copy-key]:not([data-copy-attr])'));
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var toggle = document.createElement('button');
    toggle.type = 'button'; toggle.className = 'copy-editor-ui copy-editor-toggle'; toggle.textContent = '✎ edit text';
    var tip = document.createElement('div');
    tip.className = 'copy-editor-ui copy-editor-tip'; tip.textContent = 'click outlined text to change it · enter saves · esc cancels';
    notice = document.createElement('div'); notice.className = 'copy-editor-ui copy-editor-notice'; notice.hidden = true; notice.setAttribute('role', 'status');
    document.body.appendChild(toggle); document.body.appendChild(tip); document.body.appendChild(notice);
    toggle.addEventListener('click', function () { setEditing(!editing(), toggle, tip); });
    items.forEach(function (el) {
      var cancelled = false;
      el.addEventListener('focus', function () { cancelled = false; });
      el.addEventListener('keydown', function (e) {
        if (!editing()) return;
        if (e.key === 'Escape' || (e.key === 'Enter' && e.shiftKey)) { e.preventDefault(); cancelled = true; fillKey(el.getAttribute('data-copy-key')); el.blur(); }
        else if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
      });
      el.addEventListener('blur', function () { if (!editing()) return; if (cancelled) { cancelled = false; return; } save(el); });
      el.addEventListener('paste', function (e) {
        if (!editing()) return;
        e.preventDefault(); document.execCommand('insertText', false, norm((e.clipboardData || window.clipboardData).getData('text/plain')));
      });
      el.addEventListener('click', function (e) { if (editing() && e.target.closest('a')) e.preventDefault(); });
    });
    fetch('/__copy', { headers: { 'x-copy-editor': '1' } }).then(function (r) { return r.json(); }).then(function (j) {
      values = j; document.documentElement.setAttribute('data-copy-loaded', '1');
    }, function (err) { say('could not load the text: ' + err.message, true); });
    var on = false; try { on = sessionStorage.getItem(STORAGE) === '1'; } catch (e) {}
    setEditing(on, toggle, tip);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
`;

// ---------------------------------------------------------------- server
async function main() {
  const o = parseArgs(process.argv.slice(2));
  const file = pickFile(o);
  const password = process.env.SHARE_PASSWORD ?? await askHidden('page password: ');
  const page = await openPage(file, password);
  const rel = path.relative(REPO, file);
  let queue = Promise.resolve();

  const server = http.createServer((req, res) => {
    const port = server.address().port;
    const send = (status, body, type = 'application/json') => {
      res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
      res.end(type === 'application/json' ? JSON.stringify(body) : body);
    };
    if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host)) return send(403, { error: 'wrong host' });
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === '/__copy') {
      if (req.headers['x-copy-editor'] !== '1') return send(403, { error: 'missing editor header' });
      const origin = req.headers.origin;
      if (origin && ![`http://127.0.0.1:${port}`, `http://localhost:${port}`].includes(origin)) return send(403, { error: 'wrong origin' });
      if (req.method === 'GET') return send(200, page.copy);
      if (req.method !== 'POST') return send(405, { error: 'use GET or POST' });
      let raw = '';
      req.on('data', chunk => { raw += chunk; if (raw.length > 65536) req.destroy(); });
      req.on('end', () => {
        queue = queue.then(async () => {
          try {
            const { key, value } = JSON.parse(raw || '{}');
            const text = checkEdit(page, key, value);
            const before = page.copy[key];
            page.copy[key] = text;
            try { await writePage(file, page); }
            catch (e) { page.copy[key] = before; throw e; }
            console.log(`saved ${key}`);
            send(200, { ok: true, key, value: text });
          } catch (e) { send(400, { error: e.message }); }
        });
      });
      return;
    }
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      const at = page.html.lastIndexOf('</body>');
      return send(200, page.html.slice(0, at) + `<script>${EDITOR}</script>\n` + page.html.slice(at), 'text/html; charset=utf-8');
    }
    send(404, { error: 'not found' });
  });
  server.on('error', e => fail(e.code === 'EADDRINUSE' ? `port ${o.port} is in use; add --port 4323` : e.message));
  server.listen(o.port, '127.0.0.1', () => {
    console.log(`editing ${rel} (decrypted in memory only; the file stays encrypted)`);
    console.log(`edit: http://127.0.0.1:${server.address().port}/`);
    console.log('click "edit text" at the bottom left, change the words, press enter. each save rewrites the encrypted file.');
    console.log(`publish: git checkout main && git add ${rel} && git commit -m "Update shared page text" && git push`);
    console.log('ctrl-c stops the editor.');
  });
}

main().catch(e => fail(e && e.stack || String(e)));
