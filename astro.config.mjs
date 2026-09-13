import { defineConfig } from 'astro/config';
import { generateCopy, copySource, copyOutput } from './scripts/generate-copy.mjs';
generateCopy();

// Astro configuration for markorloff.com
export default defineConfig({
  site: 'https://markorloff.com',
  devToolbar: { enabled: false },
  vite: { plugins: [{
    name: 'editable-site-copy',
    handleHotUpdate(context) {
      if (context.file !== copySource) return;
      generateCopy();
      for (const module of context.server.moduleGraph.getModulesByFile(copyOutput) || []) context.server.moduleGraph.invalidateModule(module);
      context.server.ws.send({ type: 'full-reload' });
    },
  }] },
  markdown: { smartypants: false },
});

