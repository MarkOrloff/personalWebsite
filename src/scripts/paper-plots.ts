import { copy } from "../lib/site-copy.mjs";
import { replayEdges, initialStrengths, replayPolicies, chooseReplay, reinforce, nodeClarity } from '../lib/replay-demo.mjs';
import peerData from '../data/peer-influence.json';
import peerBrain from '../data/peer-brain.json';
import { peerLayout, peerAxes, peerMeans, odorLayout, landmarks, restLayout, restAxes, restRoute } from '../lib/paper-plots.mjs';

type Layout = ReturnType<typeof peerLayout>;
function setPath(element:SVGElement, path:string) {
  // SVG attributes preserve correct geometry in browsers without CSS d support.
  element.setAttribute('d',path);
  element.style.setProperty('d',`path("${path}")`);
}
class PaperPlot extends HTMLElement {
  view = ''; ready = false; hasDrawn = false;
  resizeObserver?: ResizeObserver;
  abort?: AbortController;
  connectedCallback() {
    if (this.ready) return;
    this.ready = true; this.abort = new AbortController();
    this.view = this.dataset.view!;
    this.querySelectorAll<HTMLElement>('[data-plot-enhanced]').forEach(el=>el.hidden=false);
    this.addEventListener('click',event=>{
      const button=(event.target as Element).closest<HTMLButtonElement>('[data-plot-view]');
      if (button) this.setView(button.dataset.plotView!, true);
    }, {signal:this.abort.signal});
    this.setup();
    this.addEventListener('change', () => this.dispatchEvent(new CustomEvent('plot-state-change', { bubbles: true })), { signal: this.abort.signal });
    this.resizeObserver=new ResizeObserver(()=>this.draw());
    this.resizeObserver.observe(this.querySelector('.chart-canvas')!);
    this.draw();
  }
  disconnectedCallback() {this.resizeObserver?.disconnect();this.abort?.abort();this.ready=false;}
  setup() {}
  acceptsView(view:string) { return Boolean(this.querySelector(`[data-plot-view="${view}"]`)); }
  setView(view:string,notify=false) {
    if (!this.acceptsView(view)) return;
    const changed=this.view!==view;
    this.view=view; this.dataset.view=view;
    this.querySelectorAll<HTMLButtonElement>('[data-plot-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.plotView===view)));
    this.draw(changed);
    if (notify) this.dispatchEvent(new CustomEvent('plot-view-change',{detail:{view},bubbles:true}));
  }
  canvas(animate:boolean) {
    const width=this.querySelector('.chart-canvas')!.getBoundingClientRect().width;
    this.dataset.animate=String(animate&&this.hasDrawn);this.hasDrawn=true;
    return width;
  }
  size(width:number,height:number) {
    const svg=this.querySelector('.chart-canvas svg')!;
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('width',String(width));svg.setAttribute('height',String(height));
  }
  draw(_animate=false) {}
}
class PeerPlot extends PaperPlot {
  layout?:Layout; selected:string|null=null; pinned:string|null=null;
  acceptsView(view:string) { return ['safe','risky','brain-safe','brain-risky'].includes(view); }
  setup() {
    this.querySelectorAll<HTMLButtonElement>('[data-peer-context]').forEach(button=>button.addEventListener('click',()=>this.setView((this.view.startsWith('brain')?'brain-':'')+button.dataset.peerContext,true),{signal:this.abort!.signal}));
    this.querySelectorAll<HTMLButtonElement>('[data-peer-measure]').forEach(button=>button.addEventListener('click',()=>this.setView((button.dataset.peerMeasure==='brain'?'brain-':'')+(this.view.endsWith('risky')?'risky':'safe'),true),{signal:this.abort!.signal}));
    const canvas=this.querySelector<HTMLElement>('.chart-canvas')!;
    canvas.addEventListener('pointermove',event=>{
      if (event.pointerType==='touch'||this.pinned) return;
      this.querySelector('[data-peer-readout]')!.setAttribute('aria-live','off');this.select(this.nearest(event,24));
    },{signal:this.abort!.signal});
    canvas.addEventListener('pointerleave',()=>{if(!this.pinned)this.select(null);},{signal:this.abort!.signal});
    canvas.addEventListener('click',event=>{
      this.querySelector('[data-peer-readout]')!.setAttribute('aria-live','polite');
      const id=this.nearest(event,35);this.pinned=id===this.pinned?null:id;this.select(this.pinned);
    },{signal:this.abort!.signal});
  }
  nearest(event:MouseEvent,radius:number) {
    if(!this.layout)return null;
    const rect=this.querySelector('.chart-canvas svg')!.getBoundingClientRect();let id:string|null=null;
    for(const p of this.layout.points){const d=Math.hypot(p.x-(event.clientX-rect.left),p.y-(event.clientY-rect.top));if(d<radius){radius=d;id=p.id;}}
    return id;
  }
  select(id:string|null) {
    this.selected=id;this.querySelectorAll<SVGElement>('[data-peer-point]').forEach(el=>el.classList.toggle('is-selected',el.dataset.peerPoint===id));
    const brain=this.view.startsWith('brain');
    const p=(brain?peerBrain:peerData).participants.find(p=>p.id===id);
    this.querySelector('[data-peer-readout]')!.textContent=p?copy("ui.paper-plots.participant-value-safer-peers-value-riskier", { value1: p.id, value2: p.safe.toFixed(2), value3: p.risky.toFixed(2), value4: brain?(" " + copy("ui.paper-plots.brain-regression-estimates")):'' }):copy("ui.paper-plots.each-colored-dot-is-a-person");
  }
  draw(animate=false) {
    const width=this.canvas(animate);if(!width)return;
    const brain=this.view.startsWith('brain'),context=this.view.endsWith('risky')?'risky':'safe';
    const data=brain?peerBrain:peerData;
    const l=this.layout=peerLayout(data,width,context,brain);
    this.size(width,l.height);
    this.querySelector('[data-peer-axes]')!.innerHTML=peerAxes(l);this.querySelector('[data-peer-means]')!.innerHTML=peerMeans(l);
    this.querySelectorAll<SVGElement>('[data-peer-point]').forEach(el=>{
      const p=l.points.find(p=>p.id===el.dataset.peerPoint);
      el.style.display=p?'':'none';if(p)el.style.transform=`translate(${p.x}px,${p.y}px)`;
    });
    this.querySelectorAll<HTMLButtonElement>('[data-peer-context]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.peerContext===context)));
    this.querySelectorAll<HTMLButtonElement>('[data-peer-measure]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.peerMeasure==='brain')===brain)));
    this.querySelector<HTMLElement>('[data-peer-brain-key]')!.hidden=!brain;
    this.querySelector('[data-peer-heading]')!.textContent=brain?copy("ui.paper-plots.the-same-pattern-in-a-value"):copy("ui.peer-plot.what-peers-choices-add-to-an");
    this.querySelector('[data-peer-eyebrow]')!.textContent=brain?copy("ui.paper-plots.31-adolescents-measured-brain-data-fig"):copy("ui.peer-plot.78-adolescents-behavioral-estimates-fig-1b");
    this.querySelector('[data-peer-y]')!.textContent=brain?copy("ui.paper-plots.value-related-brain-response-regression-estimate"):copy("ui.peer-plot.social-value-index");
    this.querySelector('[data-peer-interpretation]')!.textContent=context==='safe'?copy("ui.peer-plot.safer-peers-a-stronger-response-in"):copy("ui.paper-plots.riskier-peers-no-clear-association-with");
    this.querySelector('[data-peer-statistic]')!.textContent=copy("ui.paper-plots.published-association-p-value", { value1: brain?(context==='safe'?'0.027':'0.16'):(context==='safe'?'0.021':'0.12') });
    this.querySelector('[data-peer-caption]')!.textContent=brain?copy("ui.paper-plots.colored-dots-the-31-participants-with"):copy("ui.paper-plots.colored-dots-all-78-participants-grey");
    this.querySelector('.chart-canvas svg')!.setAttribute('aria-label',copy("ui.paper-plots.value-adolescents-value-estimates-when-peers", { value1: data.participants.length, value2: brain?copy("ui.paper-plots.vmpfc-brain-regression"):copy("label.social-value"), value3: copy(context==='safe'?"label.safer":"label.riskier") }));
    this.select(this.selected);
  }
}
function parameter(params:URLSearchParams,key:string,fallback:number,min:number,max:number,integer=false) {
  if(!params.has(key))return fallback;
  const value=Number(params.get(key));
  return Number.isFinite(value)&&value>=min&&value<=max&&(!integer||Number.isInteger(value))?value:fallback;
}
class OdorMap extends PaperPlot {
  target=1;game=false;round=0;solved:number[]=[];feedback='';order=[0,2,3,1];
  readingStep=-1; started=false;
  setReadingContext(depth:string,step:number) {
    this.readingStep=depth==='story'?step:-1;
    if(depth==='story') {
      this.game=step===0;
      if(this.game&&!this.started){this.started=true;this.round=0;this.solved=[];this.feedback='';this.target=this.order[0];}
    }
  }
  storyNavigation() {
    if(this.readingStep!==0)return {};
    const answered=this.solved.includes(this.order[this.round]);
    return {next:answered&&this.solved.length<4?copy("ui.paper-plots.find-the-next-place"):copy("ui.paper-plots.continue-to-the-study"), canGoBack:this.round>0, detail:copy("ui.paper-plots.value-4-places", { value1: this.solved.length })};
  }
  advanceStory(direction:number) {
    if(this.readingStep!==0)return false;
    if(direction>0&&this.solved.includes(this.order[this.round])&&this.solved.length<4){this.round++;this.target=this.order[this.round];this.feedback='';this.draw();return true;}
    if(direction<0&&this.round>0){this.round--;this.target=this.order[this.round];this.feedback='';this.draw();return true;}
    return false;
  }
  setView(view:string,notify=false){if(view==='landmarks')this.game=false;super.setView(view,notify);}
  readingState() { return { destination:String(this.target) }; }
  restoreReadingState(params:URLSearchParams) { this.target=parameter(params,'destination',1,0,3,true);this.draw(); }
  setup() {
    this.querySelectorAll<HTMLButtonElement>('[data-destination]').forEach(button=>button.addEventListener('click',()=>this.choose(Number(button.dataset.destination)),{signal:this.abort!.signal}));
    this.querySelectorAll<SVGElement>('[data-landmark]').forEach((point,i)=>{
      point.addEventListener('click',()=>this.choose(i),{signal:this.abort!.signal});
      point.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();this.choose(i);}}, {signal:this.abort!.signal});
    });
    this.querySelectorAll('[data-odor-play],[data-odor-reset]').forEach(button=>button.addEventListener('click',()=>{
      this.game=true;this.round=0;this.solved=[];this.feedback='';this.setView('odors',true);this.querySelector<HTMLElement>('[data-odor-prompt]')!.focus({preventScroll:true});
    },{signal:this.abort!.signal}));
    this.querySelector('[data-odor-next]')!.addEventListener('click',()=>{this.round++;this.feedback='';this.draw();this.querySelector<HTMLElement>('[data-odor-prompt]')!.focus({preventScroll:true});},{signal:this.abort!.signal});
  }
  choose(index:number) {
    this.target=index;
    if(this.game&&this.round<4&&!this.solved.includes(this.order[this.round])){
      if(index===this.order[this.round]){this.solved.push(index);this.feedback=copy("ui.paper-plots.yes-the-value-points-to-the", { value1: landmarks[index].odor, value2: landmarks[index].name });}
      else this.feedback=copy("ui.paper-plots.that-location-smells-of-value-try", { value1: landmarks[index].odor, value2: landmarks[this.order[this.round]].name });
    }
    this.draw(true);this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));
  }
  draw(animate=false) {
    const width=this.canvas(animate);if(!width)return;const l=odorLayout(width,this.game?'odors':this.view,this.target);this.size(width,l.height);
    const completed=this.solved.length===4,answered=this.solved.includes(this.order[this.round]);
    this.querySelector<HTMLElement>('[data-odor-play]')!.hidden=this.game;
    this.querySelector<HTMLElement>('[data-odor-question]')!.hidden=!this.game;
    this.querySelector('[data-odor-prompt]')!.textContent=completed?copy("ui.paper-plots.four-scents-one-usable-map"):copy("ui.paper-plots.where-is-the-value", { value1: landmarks[this.order[this.round]].name });
    this.querySelector('[data-odor-progress]')!.textContent=copy("ui.paper-plots.value-of-4-places-found", { value1: this.solved.length });
    this.querySelector('[data-odor-feedback]')!.textContent=completed?copy("ui.paper-plots.you-used-a-sensory-cue-to"):this.feedback;
    this.querySelector<HTMLElement>('[data-odor-next]')!.hidden=!answered||completed;
    const path=this.querySelector<SVGElement>('[data-odor-path]')!;
    setPath(path,`M${l.start.x},${l.start.y}L${l.points[this.target].x},${l.points[this.target].y}`);path.style.opacity=this.game&&!answered?'0':'1';
    l.points.forEach((p,i)=>{
      const point=this.querySelector<SVGElement>(`[data-landmark="${i}"]`)!;point.style.transform=`translate(${p.x}px,${p.y}px)`;
      const label=this.game&&this.solved.includes(i)?p.name:p.label;
      point.querySelector('text')!.textContent=label;
      point.querySelector('.landmark-point')!.setAttribute('data-selected',String(this.game?this.solved.includes(i):i===this.target));
      point.setAttribute('role','button');point.setAttribute('tabindex','0');point.setAttribute('aria-label',copy("ui.paper-plots.choose-value-in-the-value", { value1: label, value2: i===0?copy("ui.paper-plots.upper-left"):i===1?copy("ui.paper-plots.upper-right"):i===2?copy("ui.paper-plots.lower-right"):copy("ui.paper-plots.lower-left") }));
      const button=this.querySelector<HTMLButtonElement>(`[data-destination="${i}"]`)!;button.textContent=label;button.setAttribute('aria-pressed',String(i===this.target));
    });
    const svg=this.querySelector('.chart-canvas svg')!;svg.setAttribute('role','group');
    svg.querySelector('circle[cx]')!.setAttribute('cx',String(l.start.x));svg.querySelector('circle[cx]')!.setAttribute('cy',String(l.start.y));
    const start=svg.querySelector('text[x]')!;start.setAttribute('x',String(l.start.x));start.setAttribute('y',String(l.start.y+25));
    this.querySelector('[data-odor-readout]')!.textContent=this.game?copy("ui.paper-plots.the-scent-tells-you-what-might"):copy("ui.paper-plots.destination-value-the-route-keeps-its", { value1: l.points[this.target].label });
    svg.setAttribute('aria-label',this.game?copy("ui.paper-plots.find-four-imaginary-places-from-the"):copy("ui.paper-plots.illustrative-map-route-from-the-start", { value1: l.points[this.target].label }));
  }
}
class RestMap extends PaperPlot {
  pair=0;mode='map';policy:keyof typeof replayPolicies='broad';strengths=initialStrengths();replays=0;activeEdge=-1;timer?:ReturnType<typeof setTimeout>;
  readingState() { return { pair:String(this.pair), route:this.mode, replay:this.policy }; }
  restoreReadingState(params:URLSearchParams) { this.pair=parameter(params,'pair',0,0,2,true);this.stopReplay();this.policy=(Object.hasOwn(replayPolicies,params.get('replay')||'')?params.get('replay'):'broad') as keyof typeof replayPolicies;this.strengths=initialStrengths();this.replays=0;this.activeEdge=-1;this.mode=params.get('route')==='memory'?'memory':'map';this.querySelector<HTMLSelectElement>('[data-rest-pair]')!.value=String(this.pair);this.draw(); }
  disconnectedCallback(){this.stopReplay();super.disconnectedCallback();}
  setReadingContext(depth:string) { if(depth==='gist')this.stopReplay(); }
  setView(view:string,notify=false){if(view!=='map')this.stopReplay();super.setView(view,notify);}
  stopReplay(){if(this.timer)clearTimeout(this.timer);this.timer=undefined;}
  replayOnce(){this.activeEdge=chooseReplay(this.strengths,this.policy);this.strengths=reinforce(this.strengths,this.activeEdge);this.replays++;this.draw(true);}
  runReplay(){
    if(this.timer){this.stopReplay();this.draw();return;}
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){for(let i=0;i<12;i++)this.replayOnce();return;}
    let left=12;
    const tick=()=>{this.replayOnce();left--;if(left)this.timer=setTimeout(tick,650);else{this.timer=undefined;this.draw();}};
    this.timer=setTimeout(tick,0);this.draw();
  }
  setup() {
    this.querySelectorAll<HTMLButtonElement>('[data-replay-policy]').forEach(button=>button.addEventListener('click',()=>{
      this.stopReplay();this.policy=button.dataset.replayPolicy as keyof typeof replayPolicies;this.strengths=initialStrengths();this.replays=0;this.activeEdge=-1;this.draw();this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));
    },{signal:this.abort!.signal}));
    this.querySelector('[data-replay-run]')!.addEventListener('click',()=>this.runReplay(),{signal:this.abort!.signal});
    this.querySelector('[data-replay-one]')!.addEventListener('click',()=>{this.stopReplay();this.replayOnce();},{signal:this.abort!.signal});
    this.querySelector('[data-replay-reset]')!.addEventListener('click',()=>{this.stopReplay();this.strengths=initialStrengths();this.replays=0;this.activeEdge=-1;this.draw();},{signal:this.abort!.signal});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){this.stopReplay();this.draw();}},{signal:this.abort!.signal});

    this.querySelectorAll<HTMLButtonElement>('[data-inference-mode]').forEach(button=>button.addEventListener('click',()=>{this.mode=button.dataset.inferenceMode!;this.draw(true);this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));},{signal:this.abort!.signal}));
    this.querySelector<HTMLSelectElement>('[data-rest-pair]')!.addEventListener('change',event=>{this.pair=Number((event.target as HTMLSelectElement).value);this.setView('inference',true);},{signal:this.abort!.signal});
  }
  draw(animate=false) {
    const width=this.canvas(animate);if(!width)return;const l=restLayout(width,this.view,this.pair);this.size(width,l.height);
    this.querySelector('[data-rest-axes]')!.innerHTML=restAxes(l);
    for(const p of l.points){const el=this.querySelector<SVGElement>(`[data-rest-point="${p.id}"]`)!;el.style.transform=`translate(${p.x}px,${p.y}px)`;el.style.opacity=this.view!=='pieces'&&p.row===1?'0':'1';}
    this.querySelector<HTMLElement>('[data-replay-controls]')!.hidden=this.view!=='map';
    this.querySelectorAll<HTMLButtonElement>('[data-replay-policy]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.replayPolicy===this.policy)));
    this.querySelector('[data-replay-rule]')!.textContent=this.querySelector(`[data-replay-rule-text="${this.policy}"]`)!.textContent;
    this.querySelector('[data-replay-count]')!.textContent=this.replays===1?copy("replay.count.one"):copy("ui.paper-plots.value-simulated-replays", { value1: this.replays });
    this.querySelector('[data-replay-run]')!.textContent=this.timer?copy("ui.paper-plots.pause-replay"):copy("ui.rest-map.simulate-12-replays");
    this.querySelector('[data-replay-connections]')!.innerHTML=this.view==='map'?replayEdges.map(([a,b],i)=>`<path class="replay-link ${i===this.activeEdge?'replay-active':''}" d="M${l.points[a].x},${l.points[a].y}L${l.points[b].x},${l.points[b].y}" style="opacity:${.08+.92*this.strengths[i]};stroke-width:${1+2*this.strengths[i]}"/>`).join(''):'';
    for(const p of l.points){
      const el=this.querySelector<SVGElement>(`[data-rest-point="${p.id}"]`)!;
      const clarity=nodeClarity(this.strengths,p.index),ring=el.querySelector('.replay-uncertainty')!,dot=el.querySelector<SVGElement>('.place-dot')!;
      ring.setAttribute('r',String(8+24*(1-clarity)));ring.setAttribute('opacity',this.view==='map'?'.45':'0');
      dot.style.opacity=this.view==='map'?String(.22+.78*clarity):'1';
    }
    const route=restRoute(l,this.mode);
    const path=this.querySelector<SVGElement>('[data-rest-path]')!;setPath(path,route.path);path.style.opacity=this.view==='inference'?'1':'0';
    path.style.stroke=this.mode==='map'?'var(--color-accent-2)':'var(--color-accent)';
    this.querySelector<HTMLElement>('[data-inference-controls]')!.hidden=this.view!=='inference';
    this.querySelectorAll<HTMLButtonElement>('[data-inference-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.inferenceMode===this.mode)));
    const [a,b]=l.chosen;
    const tradeoff=(b.food-a.food)*(b.service-a.service)<0;
    const text=this.view==='pieces'?copy("ui.rest-map.each-row-ranks-the-same-four"):this.view==='map'?this.replays?copy("ui.paper-plots.replayed-value-comparisons-brighter-lines-show", { value1: this.replays }):copy("ui.paper-plots.during-the-break-no-new-information"):tradeoff?copy("ui.paper-plots.value-and-value-offer-a-tradeoff", { value1: a.name, value2: b.name }):copy("ui.paper-plots.value-ranks-higher-than-value-for", { value1: b.name, value2: a.name });
    const routeNote=this.view==='inference'?this.mode==='memory'?(" " + copy("ui.paper-plots.the-illustrated-food-ranking-route-takes", { value1: route.links })):(" " + copy("ui.paper-plots.the-map-makes-a-direct-comparison")):'';
    this.querySelector('[data-rest-readout]')!.textContent=text+routeNote;this.querySelector('.chart-canvas svg')!.setAttribute('aria-label',copy("ui.paper-plots.conceptual-illustration-valuevalue", { value1: text, value2: routeNote }));
  }
}
for(const [name,element] of [['peer-plot',PeerPlot],['odor-map',OdorMap],['rest-map',RestMap]] as const)if(!customElements.get(name))customElements.define(name,element);
