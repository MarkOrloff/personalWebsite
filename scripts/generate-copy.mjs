import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseCopyBlocks } from '../src/lib/copy-document.mjs';
export const copySource = fileURLToPath(new URL('../content/walkthrough-copy.md', import.meta.url));
export const copyOutput = fileURLToPath(new URL('../src/generated/copy-values.mjs', import.meta.url));
export function generateCopy() {
  const values = Object.fromEntries(parseCopyBlocks(readFileSync(copySource, 'utf8')));
  const output = '// Generated from content/walkthrough-copy.md. Edit that document, not this file.\nexport const copyValues = ' + JSON.stringify(values, null, 2) + ';\n';
  mkdirSync(new URL('../src/generated/', import.meta.url), { recursive: true });
  let old = ''; try { old = readFileSync(copyOutput, 'utf8'); } catch {}
  if (old !== output) writeFileSync(copyOutput, output);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) generateCopy();
