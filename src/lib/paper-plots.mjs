import { escapeCopy } from "./copy-document.mjs";
import { copy, copyHtml } from "./site-copy.mjs";
import { jitter } from './plot-jitter.mjs';
import { summary } from './social-plot.mjs';

export function chartBox(width = 520, maxSide = 350) {
  const side = Math.max(150, Math.min(width - 70, maxSide));
  const left = (width-side)/2+12, top = 24;
  return { width, height: side+98, side, left, right: left+side, top, bottom: top+side,
    x: v => left+v*side, y: v => top+(1-v)*side };
}
export function peerLayout(data, width = 520, view = 'safe', brain = false) {
  const box = chartBox(width);
  const min = brain ? -1.5 : 0, max = brain ? 2 : 1;
  box.y = value => box.top + (max-value)/(max-min)*box.side;
  const means = data.groups.map((g,i) => {
    const stats = summary(data.participants.filter(p=>p.group===g.id).map(p=>p[view]));
    return {...g,...stats,n:data.participants.filter(p=>p.group===g.id).length,x:box.x(i===0?.25:.75),y:box.y(stats.mean),low:box.y(stats.mean-stats.sem),high:box.y(stats.mean+stats.sem)};
  });
  return {...box,view,brain,min,max,means,points:data.participants.map(p=>({...p,x:box.x(p.group==='naive'?.25:.75)+jitter(p.id)*box.side*.15,y:box.y(p[view])}))};
}
export function peerAxes(l) {
  return `<path class="chart-spine" d="M${l.left},${l.top}V${l.bottom}H${l.right}"/>${(l.brain?[-1,0,1,2]:[0,.5,1]).map(v=>`<text class="chart-number" x="${l.left-12}" y="${l.y(v)+5}" text-anchor="end">${v}</text>`).join('')}<path class="neutral-line" d="M${l.left},${l.y(l.brain?0:.5)}H${l.right}"/>${l.means.map((g,i)=>`<text x="${g.x}" y="${l.bottom+25}" text-anchor="middle">${i===0?copyHtml("ui.paper-plots.no-reported-use"):copyHtml("ui.paper-plots.reported-use")}</text><text class="chart-small" x="${g.x}" y="${l.bottom+44}" text-anchor="middle">${copyHtml("format.sample-size", {count:g.n})}</text>`).join('')}`;
}
export function peerMeans(l) { return l.means.map(g=>`<g class="series-${g.id}"><line class="mean-error" x1="${g.x}" x2="${g.x}" y1="${g.high}" y2="${g.low}"/><circle class="mean-point" cx="${g.x}" cy="${g.y}" r="8"/></g>`).join(''); }
export function peerSVG(l) {
  return `<svg viewBox="0 0 ${l.width} ${l.height}" width="${l.width}" height="${l.height}" role="img" aria-label="${copyHtml("ui.paper-plots.78-adolescents-social-value-estimates-higher")}"><g data-peer-axes>${peerAxes(l)}</g><g>${l.points.map(p=>`<g class="peer-dot series-${p.group}" data-peer-point="${p.id}" style="transform:translate(${p.x}px,${p.y}px)"><circle r="4"/><circle class="selection-ring" r="9"/></g>`).join('')}</g><g data-peer-means>${peerMeans(l)}</g></svg>`;
}

// Task geometry: ten probability and amount levels, excluding the six locations
// in each of the jointly low and jointly high corners (preprint Fig. 2A).
export const displayGambles = Array.from({length:100},(_,i)=>({id:`gamble-${i}`,p:(i%10+1)/10,a:Math.floor(i/10)+1}));
export const gambles = displayGambles.filter(d=>d.p*10+d.a>=5 && d.p*10+d.a<=17);
export const valuePairs = [[{p:.3,a:8},{p:.8,a:3}],[{p:.2,a:9},{p:.6,a:5}],[{p:.5,a:4},{p:.8,a:2}]];
export function probabilityWeight(p,alpha) { return p===1?1:Math.exp(-Math.pow(-Math.log(p),alpha)); }
export function valueCoordinates(p,a,alpha=1,rho=1) {
  const floor=probabilityWeight(.1,alpha);
  return {x:(probabilityWeight(p,alpha)-floor)/(1-floor),y:(a**rho-1)/(10**rho-1)};
}
export function valueLayout(width=520,view='objective',alpha=.7,rho=.65,pair=0) {
  const box=chartBox(width),weights=view==='subjective'?[alpha,rho]:[1,1];
  // Keep endpoint offers inside the axes so their locating guides stay visible.
  const gridX=v=>box.x(.07+.86*v),gridY=v=>box.y(.07+.86*v);
  const point=d=>{const c=valueCoordinates(d.p,d.a,...weights);return {...d,nx:c.x,ny:c.y,x:gridX(c.x),y:gridY(c.y)};};
  const chosen=(Array.isArray(pair)?pair:valuePairs[pair]).map(point),a=chosen[0],b=chosen[1];
  const distance=Math.hypot(b.nx-a.nx,b.ny-a.ny);
  const angle=(Math.atan2(b.ny-a.ny,b.nx-a.nx)*180/Math.PI+360)%360;
  return {...box,gridX,gridY,view,points:displayGambles.map(point),chosen,distance,angle};
}
export function valueAxes(l, subjectiveLabel=copy("ui.paper-plots.subjective-probability-normalized")) {
  const subjective=l.view==='subjective';
  return `<path class="chart-spine" d="M${l.left},${l.top}V${l.bottom}H${l.right}"/><text x="${l.left-12}" y="${l.gridY(1)+5}" text-anchor="end">${subjective?1:copyHtml("format.money",{amount:10})}</text><text x="${l.left-12}" y="${l.gridY(0)+5}" text-anchor="end">${subjective?0:copyHtml("format.money",{amount:1})}</text><text x="${l.gridX(0)}" y="${l.bottom+25}" text-anchor="middle">${subjective?0:copyHtml("format.percent",{percent:10})}</text><text x="${l.gridX(1)}" y="${l.bottom+25}" text-anchor="middle">${subjective?1:copyHtml("format.percent",{percent:100})}</text><text class="chart-axis-label" x="${l.x(.5)}" y="${l.bottom+58}" text-anchor="middle">${subjective?escapeCopy(subjectiveLabel):copyHtml("ui.paper-plots.chance-of-winning")}</text>`;
}
export function vectorPath(l) {return `M${l.chosen[0].x},${l.chosen[0].y}L${l.chosen[1].x},${l.chosen[1].y}`;}
export function valueSVG(l) {
  return `<svg viewBox="0 0 ${l.width} ${l.height}" width="${l.width}" height="${l.height}" role="img" aria-label="${copyHtml("ui.paper-plots.an-illustrative-grid-of-100-gamble")}"><g data-map-axes>${valueAxes(l)}</g><g>${l.points.map(p=>`<circle class="gamble-dot" data-gamble="${p.id}" r="3.4" style="transform:translate(${p.x}px,${p.y}px)"/>`).join('')}</g><g data-map-annotation></g><g data-map-guides></g><path class="decision-path" d="${vectorPath(l)}"/>${l.chosen.map((p,i)=>`<g class="option-point option-${i}" data-option="${i}" style="transform:translate(${p.x}px,${p.y}px)"><circle r="7"/><circle class="choice-ring" r="12" opacity="0"/><text y="-17" text-anchor="middle">${copyHtml(i===0?"ui.paper-plots.a":"ui.paper-plots.b")}</text></g>`).join('')}</svg>`;
}

export const landmarks = [
  {name:copy("ui.paper-plots.bakery"),odor:copy("ui.paper-plots.warm-bread"),x:.18,y:.78},
  {name:copy("ui.paper-plots.garden"),odor:copy("label.flowers"),x:.75,y:.8},
  {name:copy("ui.paper-plots.coffee-shop"),odor:copy("label.coffee"),x:.78,y:.26},
  {name:copy("ui.paper-plots.woodshop"),odor:copy("label.cedar"),x:.26,y:.3},
];
export function odorLayout(width=520,view='landmarks',target=1) {
  const box=chartBox(width),start={x:box.x(.12),y:box.y(.08)};
  const points=landmarks.map(p=>({...p,x:box.x(p.x),y:box.y(p.y),label:view==='odors'?p.odor:p.name}));
  const chosen=landmarks[target];
  return {...box,view,start,points,target,distance:Math.hypot(chosen.x-.12,chosen.y-.08)};
}
export function odorSVG(l) {
  return `<svg viewBox="0 0 ${l.width} ${l.height}" width="${l.width}" height="${l.height}" role="img" aria-label="${copyHtml("ui.paper-plots.illustrative-spatial-map-with-four-landmarks")}"><path class="decision-path" data-odor-path d="M${l.start.x},${l.start.y}L${l.points[l.target].x},${l.points[l.target].y}"/><circle cx="${l.start.x}" cy="${l.start.y}" r="5" fill="var(--color-fg)"/><text x="${l.start.x}" y="${l.start.y+25}" text-anchor="middle">${copyHtml("ui.paper-plots.start")}</text><g class="odor-compass" data-compass style="display:none"><circle class="compass-ring" r="54"/><line class="compass-truth" data-compass-truth/><line class="compass-preview" data-compass-preview/><line class="compass-aim" data-compass-aim/><circle class="compass-tip" data-compass-tip r="5"/></g>${l.points.map((p,i)=>`<g data-landmark="${i}" style="transform:translate(${p.x}px,${p.y}px)"><circle class="landmark-hit" r="25" fill="transparent"/><circle class="landmark-point" data-selected="${i===l.target}" r="9"/><text class="landmark-label" y="-20" text-anchor="middle">${escapeCopy(p.label)}</text></g>`).join('')}</svg>`;
}
export const places = [
  {name:copy("ui.paper-plots.a"),food:0,service:2}, {name:copy("ui.paper-plots.b"),food:1,service:0}, {name:copy("ui.paper-plots.c"),food:2,service:3}, {name:copy("ui.paper-plots.d"),food:3,service:1},
];
export const restPairs = [[0,2],[1,3],[0,3]];
export function restLayout(width=520,view='pieces',pair=0) {
  const box=chartBox(width,300);
  const points=['food','service'].flatMap((dimension,row)=>places.map((p,i)=>({...p,id:`${row}-${i}`,index:i,row,x:box.x(.13+(view==='pieces'?p[dimension]:p.food)*.245),y:view==='pieces'?box.y(row===0?.76:.3):box.y(.13+p.service*.245)})));
  const chosen=restPairs[pair].map(i=>points[i]);
  return {...box,view,pair,points,chosen};
}
export function restAxes(l) {
  return l.view==='pieces'?`<text class="chart-axis-label" x="${l.x(0)}" y="${l.y(.76)-36}">${copyHtml("ui.paper-plots.food-ranking")}</text><text class="chart-axis-label" x="${l.x(0)}" y="${l.y(.3)-36}">${copyHtml("ui.paper-plots.service-ranking")}</text><path class="neutral-line" d="M${l.x(.05)},${l.y(.76)}H${l.x(.95)}M${l.x(.05)},${l.y(.3)}H${l.x(.95)}"/>`:`<path class="chart-spine" d="M${l.left},${l.top}V${l.bottom}H${l.right}"/><text class="chart-axis-label" x="${l.left}" y="${l.top-12}">${copyHtml("ui.paper-plots.better-service")}</text><text class="chart-axis-label" x="${l.x(.5)}" y="${l.bottom+40}" text-anchor="middle">${copyHtml("ui.paper-plots.better-food")}</text>`;
}
export function restSVG(l) {
  return `<svg viewBox="0 0 ${l.width} ${l.height}" width="${l.width}" height="${l.height}" role="img" aria-label="${copyHtml("ui.paper-plots.illustration-four-places-ranked-separately-for")}"><g data-rest-axes>${restAxes(l)}</g><g data-replay-connections></g><path class="replay-trace" data-replay-trace pathLength="1" opacity="0"/><path class="decision-path" data-rest-path d="${vectorPath(l)}" opacity="0"/>${l.points.map(p=>`<g class="rest-point" data-rest-point="${p.id}" data-rest-index="${p.index}" style="transform:translate(${p.x}px,${p.y}px)"><circle class="replay-uncertainty" r="22" opacity="0"/><circle class="place-dot" r="8"/><text y="23" text-anchor="middle">${escapeCopy(p.name)}</text></g>`).join('')}<g class="replay-compare" data-replay-compare style="display:none"><path class="compare-best" data-compare-best/><path class="compare-worst" data-compare-worst/><text class="compare-label" data-compare-best-label text-anchor="middle"></text><text class="compare-label" data-compare-worst-label text-anchor="middle"></text></g></svg>`;
}

export function restRoute(layout, mode='map') {
  const [a,b]=restPairs[layout.pair ?? 0];
  const indices=mode==='memory'?Array.from({length:b-a+1},(_,i)=>a+i):[a,b];
  return {path:indices.map((index,i)=>`${i?'L':'M'}${layout.points[index].x},${layout.points[index].y}`).join(''),links:indices.length-1};
}

// A small replay map for comparing strategies: the same four places, links drawn by strength.
export function restMiniSVG(strengths, edges, linkWidth) {
  const l=restLayout(220,'map'),pts=l.points.slice(0,4);
  const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),pad=16,minX=Math.min(...xs)-pad,minY=Math.min(...ys)-pad,w=Math.max(...xs)-minX+pad,h=Math.max(...ys)-minY+pad;
  const links=edges.map(([a,b],i)=>`<line class="replay-link" x1="${pts[a].x}" y1="${pts[a].y}" x2="${pts[b].x}" y2="${pts[b].y}" style="stroke-width:${linkWidth(strengths[i])};opacity:${Math.min(1,.2+1.6*Math.max(0,strengths[i]-.35))}"/>`).join('');
  const dots=pts.map(p=>`<g class="rest-point" data-rest-index="${p.index}"><circle class="place-dot" cx="${p.x}" cy="${p.y}" r="6"/><text x="${p.x}" y="${p.y+17}" text-anchor="middle">${escapeCopy(p.name)}</text></g>`).join('');
  return `<svg viewBox="${minX} ${minY} ${w} ${h+8}" role="img" aria-hidden="true">${links}${dots}</svg>`;
}
