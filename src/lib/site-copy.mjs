import { copyValues } from '../generated/copy-values.mjs';
import { formatCopy, escapeCopy } from './copy-document.mjs';
import { emphasize } from './emphasis.mjs';
export function copy(key, values) {
  if (!Object.hasOwn(copyValues, key)) throw new Error(`Missing copy block: ${key}`);
  return formatCopy(copyValues[key], values);
}
export const copyHtml = (key, values) => escapeCopy(copy(key, values));
export const hasCopy = key => Object.hasOwn(copyValues, key);
// Prose may use *word* for italics; everything else stays escaped plain text.
export const richText = text => emphasize(escapeCopy(text));
export const copyRich = (key, values) => richText(copy(key, values));
