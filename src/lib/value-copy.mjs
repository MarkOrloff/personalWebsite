import { copy } from "./site-copy.mjs";
// Readable server-rendered examples; the live activity supplies the visitor's values.
export const exampleValueTokens = {
  'a.amount': copy('format.money',{amount:8}), 'a.chance': copy('format.percent',{percent:30}), 'b.amount': copy('format.money',{amount:3}), 'b.chance': copy('format.percent',{percent:80}),
  'review.intro': copy("ui.value-copy.here-is-an-example-pair-neither"),
  'personal.intro': copy("ui.value-copy.this-is-an-example-map-the"),
};
export function fillValueCopy(text, tokens = exampleValueTokens) {
  return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    if (!Object.hasOwn(tokens, key)) throw new Error(`Unknown value-story token: ${key}`);
    return tokens[key];
  });
}
