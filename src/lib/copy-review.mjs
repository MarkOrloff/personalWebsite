// Tracks which copy blocks Mark has reviewed (edited, or marked as fine) for the local editor.
// Stored in content/copy-review.json as { reviewed: { key: "YYYY-MM-DD" } }.
const pages = [
  ['home', /^(ui\.index\.|home\.|ui\.value-preview\.)/],
  ['research', /^(research\.|ui\.research\.)/],
  ['publications', /^(ui\.publications\.|publication\.)/],
  ['about', /^ui\.about\./],
  ['cv', /^ui\.cv\./],
  ['brain', /^(explorer\.|brain-region\.)/],
  ['when peer pressure makes teens safer', /^(safer-peers\.|ui\.peer-plot\.|ui\.peer-game\.)/],
  ['the brain can build a map from smells', /^(smell-and-space\.|smell-brain\.|ui\.odor-map\.|ui\.odor-compass\.)/],
  ['following the crowd as a shortcut', /^(social-conformity\.|ui\.social-plot\.|ui\.fog-game\.|ui\.social-conformity\.)/],
  ['learning on a break', /^(maps-at-rest\.|ui\.rest-map\.|replay\.)/],
  ['preferences shape how the brain maps options', /^(subjective-value\.|ui\.value-map\.|ui\.value-copy\.|value\.|value-brain\.|brain-map\.|value-rescale\.)/],
];
export const pageOf = key => pages.find(([, pattern]) => pattern.test(key))?.[0] ?? 'shared bits (charts, labels, nav, footer)';
export const pageOrder = [...pages.map(([name]) => name), 'shared bits (charts, labels, nav, footer)'];

// Page-level: once Mark has edited anything on a page, the whole page counts as reviewed.
export function reviewSummary(blocks, review) {
  const reviewed = review?.reviewed ?? {};
  const keys = [...blocks.keys()];
  return pages.map(([page]) => ({ page, reviewed: keys.some(key => pageOf(key) === page && reviewed[key]) }));
}

export function markReviewed(review, key, value = true, today = new Date().toISOString().slice(0, 10)) {
  const reviewed = { ...(review?.reviewed ?? {}) };
  if (value) reviewed[key] = today; else delete reviewed[key];
  return { reviewed };
}
