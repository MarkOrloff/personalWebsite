import { copyValues } from '../generated/copy-values.mjs';
import { formatCopy, escapeCopy } from './copy-document.mjs';
export function copy(key, values) {
  if (!Object.hasOwn(copyValues, key)) throw new Error(`Missing copy block: ${key}`);
  return formatCopy(copyValues[key], values);
}
export const copyHtml = (key, values) => escapeCopy(copy(key, values));
