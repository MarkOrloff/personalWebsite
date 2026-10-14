// A plain-text block format keeps copy easy to edit and HTML safely escaped.
export function parseCopyBlocks(source) {
  const blocks=new Map();
  const pattern=/<!-- copy: ([a-zA-Z0-9._-]+) -->\s*([\s\S]*?)\s*<!-- \/copy -->/g;
  let match;
  while((match=pattern.exec(source))){
    if(blocks.has(match[1]))throw new Error(`Duplicate copy block: ${match[1]}`);
    const value=match[2].trim().replace(/\s*\n\s*/g,' ');
    if(!value || value.includes('<!--'))throw new Error(`Empty or malformed copy block: ${match[1]}`);
    blocks.set(match[1],value);
  }
  if(blocks.size!==Array.from(source.matchAll(/<!-- copy:/g)).length)throw new Error('Unclosed or malformed copy block');
  return blocks;
}

export function parseCopyDocument(source) {
  const blocks = parseCopyBlocks(source);
  return key => { if (!blocks.has(key)) throw new Error(`Missing copy block: ${key}`); return blocks.get(key); };
}
export function formatCopy(text, values) {
  if (values === undefined) return text;
  return text.replace(/\{\{([a-zA-Z0-9._-]+)\}\}/g, (_, key) => {
    if (!Object.prototype.hasOwnProperty.call(values, key)) throw new Error(`Missing copy value: ${key}`);
    return String(values[key]);
  });
}
export function escapeCopy(text) {
  return String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
// Used by the local click-to-edit mode: replaces one block's text and refuses edits that would break the document.
export function replaceCopyBlock(source, key, value) {
  if (typeof key !== 'string' || !/^[a-zA-Z0-9._-]+$/.test(key)) throw new Error('Invalid copy key');
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text || text.includes('<!--') || text.includes('-->')) throw new Error('Copy must be non-empty plain text');
  const pattern = new RegExp(`(<!-- copy: ${key.replace(/[.]/g, '\\.')} -->\\n)[\\s\\S]*?(\\n<!-- \\/copy -->)`);
  if (!pattern.test(source)) throw new Error(`Missing copy block: ${key}`);
  const next = source.replace(pattern, (_, open, close) => open + text + close);
  parseCopyBlocks(next);
  return next;
}
// Notes from the click-to-edit mode sit right after their block as comments; the site never shows them.
export function addCopyNote(source, key, note) {
  if (typeof key !== 'string' || !/^[a-zA-Z0-9._-]+$/.test(key)) throw new Error('Invalid copy key');
  const text = String(note ?? '').replace(/\s+/g, ' ').trim();
  if (!text || text.includes('-->')) throw new Error('Notes must be non-empty plain text');
  const pattern = new RegExp(`<!-- copy: ${key.replace(/[.]/g, '\\.')} -->\\n[\\s\\S]*?\\n<!-- \\/copy -->`);
  const match = pattern.exec(source);
  if (!match) throw new Error(`Missing copy block: ${key}`);
  const end = match.index + match[0].length;
  return source.slice(0, end) + `\n<!-- note: ${text} -->` + source.slice(end);
}
