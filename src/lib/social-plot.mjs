import { escapeCopy } from "./copy-document.mjs";
import { copy, copyHtml } from "./site-copy.mjs";
import { jitter } from './plot-jitter.mjs';
export const groupOrder = ['control', 'insula', 'acc'];
export const groupNames = { control: copy("ui.social-plot.controls"), insula: copy("ui.social-plot.insula"), acc: copy("ui.social-plot.dacc") };

export const participantLabel = point => copy(`participant.label.${point.group}`, {number:point.id.split('-').at(-1)});
export const participantGroupLabel = group => copy(`participant.group.${group.id}`);

export function summary(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (values.length - 1);
  return { mean, sem: Math.sqrt(variance / values.length) };
}

export function plotLayout(data, width = 520, view = 'groups', compact = false) {
  const side = Math.min(width - 62, compact ? 300 : 355);
  const height = side + 74;
  const left = (width - side) / 2 + 12, right = left + side, top = 20, bottom = top + side;
  const step = (right - left) / 3;
  const xMax = Math.ceil(Math.max(...data.participants.map(d => d.soloNll)) / 5) * 5;
  const y = value => bottom - value * (bottom - top);
  return {
    width, height, left, right, top, bottom, xMax, view,
    points: data.participants.map(d => ({ ...d,
      x: view === 'relationship' ? left + d.soloNll / xMax * (right - left) : left + (groupOrder.indexOf(d.group) + .5) * step + jitter(d.id) * step * .26,
      y: y(d.follow)
    })),
    means: data.groups.map((g, i) => ({ ...g, x: left + (i + .5) * step, y: y(g.mean), low: y(g.mean - g.sem), high: y(g.mean + g.sem) })),
    fit: fitLine(data.participants).map(p => ({ x: left + p.x / xMax * (right - left), y: y(p.y) })),
    yticks: [0, .5, 1].map(value => ({ value, y: y(value) })),
    xticks: view === 'relationship'
      ? [0, xMax].map(value => ({ label: String(value), x: left + value / xMax * (right - left) }))
      : data.groups.map((g, i) => ({ label: groupNames[g.id], n: g.n, x: left + (i + .5) * step }))
  };
}

export function axesMarkup(layout) {
  return `<path class="plot-spine" d="M${layout.left},${layout.top}V${layout.bottom}H${layout.right}"/>${layout.yticks.map(t => `<text class="numeric-tick" x="${layout.left - 12}" y="${t.y + 5}" text-anchor="end">${t.value}</text>`).join('')}
    ${layout.xticks.map(t => `<text x="${t.x}" y="${layout.bottom + 23}" text-anchor="${layout.view === 'relationship' && t.x === layout.left ? 'start' : layout.view === 'relationship' && t.x === layout.right ? 'end' : 'middle'}">${escapeCopy(t.label)}</text>${t.n ? `<text class="plot-n" x="${t.x}" y="${layout.bottom + 41}" text-anchor="middle">${copyHtml("format.sample-size", {count:t.n})}</text>` : ''}`).join('')}`;
}

export function meansMarkup(layout) {
  return layout.means.map(g => `<g data-mean="${g.id}" class="group-${g.id}"><line x1="${g.x}" x2="${g.x}" y1="${g.high}" y2="${g.low}"/><circle cx="${g.x}" cy="${g.y}" r="8"/></g>`).join('');
}

export function fitLine(participants) {
  const xMean = summary(participants.map(p => p.soloNll)).mean;
  const yMean = summary(participants.map(p => p.follow)).mean;
  const slope = participants.reduce((sum,p) => sum + (p.soloNll-xMean)*(p.follow-yMean),0) / participants.reduce((sum,p) => sum+(p.soloNll-xMean)**2,0);
  const intercept = yMean - slope*xMean;
  return [Math.min(...participants.map(p => p.soloNll)), Math.max(...participants.map(p => p.soloNll))].map(x => ({ x, y: intercept+slope*x }));
}

export function pointShape(group) {
  return '<circle r="4.5"/>';
}

export function plotMarkup(layout, clipId = 'social-plot-clip') {
  return `<svg class="participant-plot" viewBox="0 0 ${layout.width} ${layout.height}" width="${layout.width}" height="${layout.height}" role="img" aria-label="${copyHtml("ui.social-plot.44-participant-estimates-of-following-weight")}">
    <defs><clipPath id="${clipId}"><rect class="plot-clip" x="${layout.left}" y="${layout.top}" width="${layout.right-layout.left}" height="${layout.bottom-layout.top}"/></clipPath></defs>
    <g class="plot-axes">${axesMarkup(layout)}</g>
    <path class="plot-fit" clip-path="url(#${clipId})" d="M${layout.fit[0].x},${layout.fit[0].y}L${layout.fit[1].x},${layout.fit[1].y}"/>
    <g class="plot-dots">${layout.points.map(p => `<g class="plot-dot group-${p.group}" data-point="${p.id}" style="transform:translate(${p.x}px,${p.y}px)">${pointShape(p.group)}<circle class="selection-ring" r="9"/></g>`).join('')}</g>
    <g class="plot-means">${meansMarkup(layout)}</g>
  </svg>`;
}
