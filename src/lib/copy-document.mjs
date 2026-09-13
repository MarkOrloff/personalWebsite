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
    if (!Object.hasOwn(values, key)) throw new Error(`Missing copy value: ${key}`);
    return String(values[key]);
  });
}
export function escapeCopy(text) {
  return String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
