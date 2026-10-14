import { defineConfig } from 'astro/config';
import { readFileSync, writeFileSync } from 'node:fs';
import { generateCopy, copySource, copyOutput } from './scripts/generate-copy.mjs';
import { parseCopyBlocks, replaceCopyBlock, addCopyNote } from './src/lib/copy-document.mjs';
import { reviewSummary, markReviewed } from './src/lib/copy-review.mjs';

const reviewFile = new URL('./content/copy-review.json', import.meta.url);
const readReview = () => { try { return JSON.parse(readFileSync(reviewFile, 'utf8')); } catch { return { reviewed: {} }; } };
const saveReview = review => writeFileSync(reviewFile, JSON.stringify(review, null, 1) + '\n');
generateCopy();

// Astro configuration for markorloff.com
export default defineConfig({
  site: 'https://markorloff.com',
  devToolbar: { enabled: false },
  vite: { plugins: [{
    name: 'editable-site-copy',
    // Local-only endpoint for the click-to-edit mode (src/dev/copy-editor.ts). The custom header
    // forces a CORS preflight, so other websites can't write to the copy document.
    configureServer(server) {
      server.middlewares.use('/__copy', async (req, res) => {
        const send = (status, body) => { res.statusCode = status; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(body)); };
        if (req.headers['x-copy-editor'] !== '1') return send(403, { error: 'Missing editor header' });
        if (req.method === 'GET' && req.url?.startsWith('/review')) return send(200, reviewSummary(parseCopyBlocks(readFileSync(copySource, 'utf8')), readReview()));
        if (req.method === 'GET') return send(200, Object.fromEntries(parseCopyBlocks(readFileSync(copySource, 'utf8'))));
        if (req.method !== 'POST') return send(405, { error: 'Use GET or POST' });
        let raw = ''; for await (const chunk of req) raw += chunk;
        try {
          const { key, value, note, reviewed } = JSON.parse(raw || '{}');
          if (reviewed !== undefined) {
            if (!parseCopyBlocks(readFileSync(copySource, 'utf8')).has(key)) throw new Error(`Missing copy block: ${key}`);
            saveReview(markReviewed(readReview(), key, Boolean(reviewed)));
            return send(200, { ok: true });
          }
          const source = readFileSync(copySource, 'utf8');
          writeFileSync(copySource, note !== undefined ? addCopyNote(source, key, note) : replaceCopyBlock(source, key, value));
          // Anything Mark edits counts as reviewed.
          if (note === undefined) saveReview(markReviewed(readReview(), key, true));
          send(200, { ok: true });
        } catch (error) { send(400, { error: error.message }); }
      });
    },
    handleHotUpdate(context) {
      if (context.file !== copySource) return;
      generateCopy();
      for (const module of context.server.moduleGraph.getModulesByFile(copyOutput) || []) context.server.moduleGraph.invalidateModule(module);
      context.server.ws.send({ type: 'full-reload' });
    },
  }] },
  markdown: { smartypants: false },
});

