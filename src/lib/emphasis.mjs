// *word* in the copy document means italics, anywhere on the site. An opening asterisk must
// follow a space or opening punctuation and touch a letter, so author marks ("Orloff MA*")
// and "* equal contribution" stay as they are.
const marked = /(^|[\s(“‘"'[—–-])\*([\p{L}\p{N}’'][^*<>\n]*?[\p{L}\p{N}’'.!?)]|[\p{L}\p{N}])\*(?![\p{L}\p{N}])/gu;

export const emphasize = text => text.replace(marked, '$1<em>$2</em>');
export const unmark = text => text.replace(marked, '$1$2');

// Rewrites rendered HTML: text becomes <em>, labels read by screen readers just lose the asterisks.
// Script and style contents are never touched.
export function emphasizeHtml(html) {
  let skip = null;
  return html.split(/(<[^>]+>)/g).map(part => {
    if (part.startsWith('<')) {
      const tag = part.match(/^<\/?\s*([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();
      if (tag && !part.startsWith('</') && (tag === 'script' || tag === 'style') && !part.endsWith('/>')) skip = tag;
      else if (tag && part.startsWith('</') && tag === skip) skip = null;
      return part.replace(/\b(alt|aria-label|title|content|placeholder)="([^"]*)"/g, (_, name, value) => `${name}="${unmark(value)}"`);
    }
    return skip ? part : emphasize(part);
  }).join('');
}
