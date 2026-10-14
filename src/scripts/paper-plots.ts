import { copy } from "../lib/site-copy.mjs";
import { replayEdges, replayPolicies, sequenceEdges, nodeClarity, ReplayActivity, replayLinkWidth, expectedStrengths } from '../lib/replay-demo.mjs';
import peerData from '../data/peer-influence.json';
import peerBrain from '../data/peer-brain.json';
import { peerLayout, peerAxes, peerMeans, odorLayout, landmarks, restLayout, restAxes, restRoute, restMiniSVG } from '../lib/paper-plots.mjs';
import { gamblePairs, gameRounds, soloRounds, gambleKind, peerGameSummary } from '../lib/peer-game.mjs';
import { recall, remember } from '../lib/game-memory.mjs';

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
  answers:('safe'|'risky')[]=[]; waiting=false;
  acceptsView(view:string) { return ['game','safe','risky','brain-safe','brain-risky'].includes(view); }
  storyNavigation() {
    if(this.view!=='game')return {};
    const done=this.answers.length===gameRounds.length;
    return {next:copy(done?"ui.peer-game.continue":"ui.peer-game.skip"),detail:done?copy("ui.peer-game.finished"):copy("ui.peer-game.progress",{current:this.answers.length+1,total:gameRounds.length})};
  }
  chooseGamble(side:number) {
    if(this.waiting||this.answers.length===gameRounds.length)return;
    this.answers.push(gambleKind(gameRounds[this.answers.length],side));remember('peer',this.answers);
    this.waiting=true;
    this.querySelectorAll('[data-gamble-choice]').forEach((card,i)=>card.classList.toggle('is-chosen',i===side));
    const next=this.answers.length;
    this.querySelector('[data-peer-game-response]')!.textContent=next===soloRounds?copy("ui.peer-game.social-start"):next<gameRounds.length?copy("ui.peer-game.got-it"):'';
    this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));
    setTimeout(()=>{this.waiting=false;this.drawGame();},next===soloRounds?1200:450);
  }
  drawGame() {
    const game=this.querySelector<HTMLElement>('[data-peer-game]')!,done=this.answers.length===gameRounds.length;
    game.dataset.done=String(done);
    this.querySelector<HTMLElement>('[data-peer-game-reset]')!.hidden=!done;
    const players=this.querySelector<HTMLElement>('[data-peer-players]')!;
    if(done){
      const summary=peerGameSummary(this.answers);
      this.querySelector('[data-peer-game-prompt]')!.textContent=copy("ui.peer-game.summary-heading");
      this.querySelector('[data-peer-game-response]')!.textContent=summary.toward?copy("ui.peer-game.summary-switched",{count:summary.toward,total:gameRounds.length-soloRounds,safe:summary.towardSafe,risky:summary.towardRisky}):copy("ui.peer-game.summary-stayed");
      players.hidden=true;return;
    }
    const round=gameRounds[this.answers.length],pair=gamblePairs[round.pair];
    this.querySelector('[data-peer-game-prompt]')!.textContent=copy(round.peers?"ui.peer-game.prompt-social":"ui.peer-game.prompt-solo");
    if(this.answers.length!==soloRounds)this.querySelector('[data-peer-game-response]')!.textContent='';
    const peerSide=round.peers?((round.peers==='safe')===round.safeLeft?0:1):-1;
    const letter=(side:number)=>copy(side===0?"ui.paper-plots.a":"ui.paper-plots.b");
    players.hidden=!round.peers;
    players.innerHTML='';
    if(round.peers)for(const number of [1,2]){const chip=document.createElement('span');chip.innerHTML=`<i aria-hidden="true">${number}</i>`;chip.append(copy("ui.peer-game.player",{number,option:letter(peerSide)}));players.append(chip);}
    this.querySelectorAll<HTMLButtonElement>('[data-gamble-choice]').forEach((card,side)=>{
      const kind=gambleKind(round,side),[low,high]=pair[kind];
      card.classList.remove('is-chosen');
      card.querySelector('[data-gamble-low]')!.textContent=copy("format.money",{amount:low});
      card.querySelector('[data-gamble-high]')!.textContent=copy("format.money",{amount:high});
      card.querySelector('[data-gamble-peers]')!.innerHTML=side===peerSide?'<i aria-hidden="true">1</i><i aria-hidden="true">2</i>':'';
      card.setAttribute('aria-label',copy("ui.peer-game.aria-option",{option:letter(side),low:copy("format.money",{amount:low}),high:copy("format.money",{amount:high}),peers:side===peerSide?copy("ui.peer-game.aria-peers"):''}));
    });
  }
  setup() {
    this.querySelectorAll<HTMLButtonElement>('[data-gamble-choice]').forEach(card=>card.addEventListener('click',()=>this.chooseGamble(Number(card.dataset.gambleChoice)),{signal:this.abort!.signal}));
    this.answers=recall('peer',(a:unknown)=>Array.isArray(a)&&a.length<=gameRounds.length&&a.every(x=>x==='safe'||x==='risky'))??[];
    this.querySelector('[data-peer-game-reset]')!.addEventListener('click',()=>{this.answers=[];remember('peer',this.answers);this.drawGame();this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));this.querySelector<HTMLElement>('[data-peer-game-prompt]')!.focus({preventScroll:true});},{signal:this.abort!.signal});
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
    this.querySelector('[data-peer-readout]')!.textContent=p?copy("ui.paper-plots.participant-value-safer-peers-value-riskier", { value1: p.id, value2: p.safe.toFixed(2), value3: p.risky.toFixed(2), value4: brain?(" " + copy("ui.paper-plots.brain-regression-estimates")):'' }):'';
  }
  draw(animate=false) {
    const game=this.view==='game';
    this.querySelector<HTMLElement>('[data-peer-game]')!.hidden=!game;
    if(game){this.drawGame();return;}
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
    this.querySelector('[data-peer-heading]')!.textContent=copy(context==='safe'?"ui.peer-plot.title-safe":"ui.peer-plot.title-risky");
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
  target=1;game=false;round=0;solved:number[]=[];feedback='';order=[0,2,3,1];advance?:ReturnType<typeof setTimeout>;
  readingStep=-1; started=false;
  // Shortcut round: start at one smell, point toward a place never walked to from there.
  shortcuts=[[2,0],[3,1],[1,2]] as const; shortcut=0; aims:(number|null)[]=[null,null,null]; errors:(number|null)[]=[null,null,null]; preview:number|null=null; you?:{x:number,y:number}; goal?:{x:number,y:number};
  acceptsView(view:string) { return ['landmarks','odors','compass'].includes(view); }
  setReadingContext(depth:string,step:number) {
    this.readingStep=depth==='story'?step:-1;
    if(depth==='story') {
      this.game=step===0;
      if(this.game&&!this.started){this.started=true;if(!this.solved.length){this.round=0;this.feedback='';}this.target=this.order[this.round];}
    }
  }
  storyNavigation() {
    if(this.view==='compass'&&this.readingStep>=0){
      return {canGoBack:this.shortcut>0, detail:copy("ui.odor-compass.progress",{current:this.shortcut+1,total:this.shortcuts.length})};
    }
    if(this.readingStep!==0)return {};
    return {next:copy("ui.paper-plots.continue-to-the-study"), canGoBack:this.round>0, detail:copy("ui.paper-plots.value-4-places", { value1: this.solved.length })};
  }
  advanceStory(direction:number) {
    if(this.view==='compass'&&this.readingStep>=0){
      if(direction<0&&this.shortcut>0){clearTimeout(this.advance);this.shortcut--;this.preview=null;this.draw();return true;}
      return false;
    }
    if(this.readingStep!==0)return false;
    if(direction<0&&this.round>0){clearTimeout(this.advance);this.round--;this.target=this.order[this.round];this.feedback='';this.draw();return true;}
    return false;
  }
  setView(view:string,notify=false){if(view==='landmarks')this.game=false;super.setView(view,notify);}
  readingState() { return { destination:String(this.target) }; }
  restoreReadingState(params:URLSearchParams) { this.target=parameter(params,'destination',1,0,3,true);this.draw(); }
  save() { remember('odor',{solved:this.solved,round:this.round,aims:this.aims,errors:this.errors,shortcut:this.shortcut}); }
  setup() {
    const saved=recall('odor',(s:any)=>s&&Array.isArray(s.solved)&&s.solved.length<=4&&s.round>=0&&s.round<4&&Array.isArray(s.aims)&&s.aims.length===3&&Array.isArray(s.errors)&&s.errors.length===3&&s.shortcut>=0&&s.shortcut<3);
    if(saved){
      // Pick up at the first unanswered place and shortcut, in case the page closed mid-pause.
      Object.assign(this,{solved:saved.solved,round:Math.min(saved.solved.length,3),aims:saved.aims,errors:saved.errors,shortcut:saved.shortcut});
      if(this.aims[this.shortcut]!==null&&this.shortcut<this.shortcuts.length-1)this.shortcut++;
    }
    this.querySelectorAll<HTMLButtonElement>('[data-destination]').forEach(button=>button.addEventListener('click',()=>this.choose(Number(button.dataset.destination)),{signal:this.abort!.signal}));
    this.querySelectorAll<SVGElement>('[data-landmark]').forEach((point,i)=>{
      point.addEventListener('click',()=>this.choose(i),{signal:this.abort!.signal});
      point.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();this.choose(i);}}, {signal:this.abort!.signal});
    });
    this.querySelectorAll('[data-odor-play],[data-odor-reset]').forEach(button=>button.addEventListener('click',()=>{
      clearTimeout(this.advance);this.game=true;this.round=0;this.solved=[];this.feedback='';this.save();this.setView('odors',true);this.querySelector<HTMLElement>('[data-odor-prompt]')!.focus({preventScroll:true});
    },{signal:this.abort!.signal}));
    const svg=this.querySelector<SVGSVGElement>('.chart-canvas svg')!;
    const angleAt=(event:PointerEvent)=>{const r=svg.getBoundingClientRect();return Math.atan2(event.clientY-r.top-this.you!.y,event.clientX-r.left-this.you!.x);};
    svg.addEventListener('pointermove',event=>{if(this.view!=='compass'||this.aims[this.shortcut]!==null||event.pointerType==='touch'||!this.you)return;this.preview=angleAt(event);this.drawCompass();},{signal:this.abort!.signal});
    svg.addEventListener('pointerleave',()=>{if(this.view==='compass'){this.preview=null;this.drawCompass();}},{signal:this.abort!.signal});
    svg.addEventListener('pointerdown',event=>{if(this.view!=='compass'||!this.you)return;event.preventDefault();this.aim(angleAt(event));},{signal:this.abort!.signal});
    svg.addEventListener('keydown',event=>{
      if(this.view!=='compass'||this.aims[this.shortcut]!==null)return;
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();this.preview=(this.preview??0)+(event.key==='ArrowRight'?1:-1)*Math.PI/12;this.drawCompass();}
      if((event.key==='Enter'||event.key===' ')&&this.preview!==null){event.preventDefault();this.aim(this.preview);}
    },{signal:this.abort!.signal});
  }
  aim(angle:number) {
    if(this.aims[this.shortcut]!==null)return;
    this.aims[this.shortcut]=angle;this.errors[this.shortcut]=this.errorDegrees(angle);this.preview=null;this.save();this.draw(true);
    this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));
    // The next shortcut comes up on its own, after time to see the true direction.
    if(this.shortcut<this.shortcuts.length-1){clearTimeout(this.advance);const shortcut=this.shortcut;this.advance=setTimeout(()=>{if(this.shortcut!==shortcut||this.view!=='compass')return;this.shortcut++;this.save();this.preview=null;this.draw(true);this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));},2600);}
  }
  errorDegrees(angle:number) {
    const truth=Math.atan2(this.goal!.y-this.you!.y,this.goal!.x-this.you!.x);
    return Math.round(Math.abs(Math.atan2(Math.sin(angle-truth),Math.cos(angle-truth)))*180/Math.PI);
  }
  drawCompass() {
    const group=this.querySelector<SVGGElement>('[data-compass]')!;
    if(this.view!=='compass'||!this.you||!this.goal){group.style.display='none';return;}
    group.style.display='';group.setAttribute('transform',`translate(${this.you.x} ${this.you.y})`);
    const length=Math.hypot(this.goal.x-this.you.x,this.goal.y-this.you.y),aim=this.aims[this.shortcut];
    const line=(selector:string,angle:number|null,size=length)=>{const el=group.querySelector<SVGLineElement>(selector)!;el.style.display=angle===null?'none':'';if(angle!==null){el.setAttribute('x1','0');el.setAttribute('y1','0');el.setAttribute('x2',String(Math.cos(angle)*size));el.setAttribute('y2',String(Math.sin(angle)*size));}};
    line('[data-compass-preview]',aim===null?this.preview:null);
    line('[data-compass-aim]',aim);
    line('[data-compass-truth]',aim===null?null:Math.atan2(this.goal.y-this.you.y,this.goal.x-this.you.x));
    const tip=group.querySelector<SVGCircleElement>('[data-compass-tip]')!;tip.style.display=aim===null?'none':'';
    if(aim!==null){tip.setAttribute('cx',String(Math.cos(aim)*length));tip.setAttribute('cy',String(Math.sin(aim)*length));}
  }
  choose(index:number) {
    if(this.view==='compass')return;
    this.target=index;
    if(this.game&&this.round<4&&!this.solved.includes(this.order[this.round])){
      if(index===this.order[this.round]){
        this.solved.push(index);this.save();this.feedback=copy("ui.paper-plots.yes-the-value-points-to-the", { value1: landmarks[index].odor, value2: landmarks[index].name });
        // Like the other games, the next place comes up on its own after a moment.
        if(this.solved.length<4){clearTimeout(this.advance);const round=this.round;this.advance=setTimeout(()=>{if(this.round!==round||!this.game)return;this.round++;this.save();this.target=this.order[this.round];this.feedback='';this.draw(true);this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));},1300);}
      }
      else this.feedback=copy("ui.paper-plots.that-location-smells-of-value-try", { value1: landmarks[index].odor, value2: landmarks[this.order[this.round]].name });
    }
    this.draw(true);this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));
  }
  draw(animate=false) {
    const width=this.canvas(animate);if(!width)return;const compass=this.view==='compass';
    const l=odorLayout(width,this.game||compass?'odors':this.view,this.target);this.size(width,l.height);
    const [from,to]=this.shortcuts[this.shortcut],aim=this.aims[this.shortcut];
    this.you=l.points[from];this.goal=l.points[to];
    this.querySelector<HTMLElement>('[data-compass-ui]')!.hidden=!compass;
    this.querySelector<HTMLElement>('.destination-controls')!.style.display=compass?'none':'';
    this.querySelector<HTMLElement>('.odor-game:not([data-compass-ui])')!.style.display=compass?'none':'';
    if(compass){
      this.querySelector('[data-compass-prompt]')!.textContent=copy("ui.odor-compass.prompt",{odor:landmarks[from].odor,place:landmarks[to].name});
      const error=aim===null?null:this.errorDegrees(aim);
      this.querySelector('[data-compass-feedback]')!.textContent=error===null?'':this.shortcut===this.shortcuts.length-1&&this.aims.every(a=>a!==null)?`${copy(error===0?"ui.odor-compass.perfect":error<=20?"ui.odor-compass.close":"ui.odor-compass.far",{degrees:error,place:landmarks[to].name})} ${copy("ui.odor-compass.done",{degrees:Math.round(this.errors.reduce((sum,e)=>sum+(e??0),0)/this.errors.length)})}`:copy(error===0?"ui.odor-compass.perfect":error<=20?"ui.odor-compass.close":"ui.odor-compass.far",{degrees:error,place:landmarks[to].name});
    }
    const completed=this.solved.length===4,answered=this.solved.includes(this.order[this.round]);
    this.querySelector<HTMLElement>('[data-odor-play]')!.hidden=this.game;
    this.querySelector<HTMLElement>('[data-odor-question]')!.hidden=!this.game;
    this.querySelector('[data-odor-prompt]')!.textContent=completed?copy("ui.paper-plots.four-scents-one-usable-map"):copy("ui.paper-plots.where-is-the-value", { value1: landmarks[this.order[this.round]].name });
    this.querySelector('[data-odor-feedback]')!.textContent=completed?copy("ui.paper-plots.you-used-a-sensory-cue-to"):this.feedback;
    const path=this.querySelector<SVGElement>('[data-odor-path]')!;
    setPath(path,`M${l.start.x},${l.start.y}L${l.points[this.target].x},${l.points[this.target].y}`);path.style.opacity=compass||(this.game&&!answered)?'0':'1';
    l.points.forEach((p,i)=>{
      const point=this.querySelector<SVGElement>(`[data-landmark="${i}"]`)!;point.style.transform=`translate(${p.x}px,${p.y}px)`;
      const label=compass?(i===from?copy("ui.odor-compass.you-are-here",{odor:p.odor}):i===to&&aim!==null?p.name:''):this.game&&this.solved.includes(i)?p.name:p.label;
      point.querySelector('text')!.textContent=label;
      point.querySelector('.landmark-point')!.setAttribute('data-selected',String(compass?i===from:this.game?this.solved.includes(i):i===this.target));
      point.style.pointerEvents=compass?'none':'';
      point.setAttribute('role','button');point.setAttribute('tabindex','0');point.setAttribute('aria-label',copy("ui.paper-plots.choose-value-in-the-value", { value1: label, value2: i===0?copy("ui.paper-plots.upper-left"):i===1?copy("ui.paper-plots.upper-right"):i===2?copy("ui.paper-plots.lower-right"):copy("ui.paper-plots.lower-left") }));
      const button=this.querySelector<HTMLButtonElement>(`[data-destination="${i}"]`)!;button.textContent=label;button.setAttribute('aria-pressed',String(i===this.target));
    });
    const svg=this.querySelector('.chart-canvas svg')!;svg.setAttribute('role','group');
    (svg.querySelector('circle[cx]') as SVGElement).style.display=compass?'none':'';(svg.querySelector('text[x]') as SVGElement).style.display=compass?'none':'';
    svg.setAttribute('tabindex',compass?'0':'-1');
    svg.querySelector('circle[cx]')!.setAttribute('cx',String(l.start.x));svg.querySelector('circle[cx]')!.setAttribute('cy',String(l.start.y));
    const start=svg.querySelector('text[x]')!;start.setAttribute('x',String(l.start.x));start.setAttribute('y',String(l.start.y+25));
    this.querySelector('[data-odor-readout]')!.textContent=this.game?copy("ui.paper-plots.the-scent-tells-you-what-might"):copy("ui.paper-plots.destination-value-the-route-keeps-its", { value1: l.points[this.target].label });
    this.drawCompass();
    if(compass){this.querySelector('[data-odor-readout]')!.textContent='';svg.setAttribute('aria-label',copy("ui.odor-compass.aria",{odor:landmarks[from].odor,place:landmarks[to].name}));return;}
    svg.setAttribute('aria-label',this.game?copy("ui.paper-plots.find-four-imaginary-places-from-the"):copy("ui.paper-plots.illustrative-map-route-from-the-start", { value1: l.points[this.target].label }));
  }
}
type ReplayPolicy = 'broad'|'reward'|'uncertain'|'bridge';
// The comparison maps all share one stretched scale, so differences between strategies are easy to see.
const miniLinkWidth=(strength:number)=>.6+18*Math.max(0,strength-.35)**1.2;
class RestMap extends PaperPlot {
  pair=0;mode='map';policy:ReplayPolicy='broad';
  activity=new ReplayActivity();timer?:ReturnType<typeof setTimeout>;traceKey='';
  acceptsView(view:string) { return ['pieces','map','inference','rested','priorities'].includes(view); }
  get mapLike() { return ['map','rested','priorities'].includes(this.view); }
  /** Runs the opening replay plus a dozen more without animation, so the story can show a settled map. */
  settle() {
    this.stopReplay();const activity=this.activity;
    if(activity.replays===0){activity.start(1);while(activity.advance(this.policy)){/* opening a → b → c */}}
    if(activity.replays<13){activity.start(13-activity.replays);while(activity.advance(this.policy)){/* the rest of the break */}}
    activity.checkpoint=false;
  }
  readingState() { return { route:this.mode, replay:this.policy }; }
  restoreReadingState(params:URLSearchParams) {
    this.stopReplay();
    this.policy=(Object.hasOwn(replayPolicies,params.get('replay')||'')?params.get('replay'):'broad') as ReplayPolicy;
    this.activity.reset();this.mode=params.get('route')==='memory'?'memory':'map';
    this.draw();
  }
  disconnectedCallback(){this.stopReplay();super.disconnectedCallback();}
  setReadingContext(depth:string) { if(depth==='gist')this.stopReplay(); }
  setView(view:string,notify=false){
    if(view!=='map')this.stopReplay();
    if(view==='rested'&&(this.activity.replays<13||this.activity.remaining>0))this.settle();
    // Comparing a and c builds on the map from the replay step, even when a reader jumps straight here.
    if(view==='inference'&&this.activity.replays===0){this.activity.start(1);while(this.activity.advance(this.policy)){/* opening a → b → c */}}
    super.setView(view,notify);
  }
  stopReplay(){if(this.timer)clearTimeout(this.timer);this.timer=undefined;}
  runReplay(){
    if(this.timer){this.stopReplay();this.draw();return;}
    if(this.getBoundingClientRect().top>128&&this.querySelector('.chart-canvas')!.getBoundingClientRect().bottom>innerHeight-100){
      this.scrollIntoView({block:'start',behavior:'instant'});
    }
    this.activity.start();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      while(this.activity.advance(this.policy)) { /* same phases, without motion */ }
      this.draw();return;
    }
    const tick=()=>{
      const more=this.activity.advance(this.policy);
      this.timer=more?setTimeout(tick,this.activity.phase===3?600:1050):undefined;
      this.draw(true);
    };
    tick();
  }
  resetReplay(){this.stopReplay();this.activity.reset();this.traceKey='';this.draw();}
  setup() {
    this.querySelectorAll<HTMLButtonElement>('[data-replay-policy]').forEach(button=>button.addEventListener('click',()=>{
      this.policy=button.dataset.replayPolicy as ReplayPolicy;this.resetReplay();
      this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));
    },{signal:this.abort!.signal}));
    this.querySelector('[data-replay-run]')!.addEventListener('click',()=>this.runReplay(),{signal:this.abort!.signal});
    this.querySelector('[data-replay-reset]')!.addEventListener('click',()=>this.resetReplay(),{signal:this.abort!.signal});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){this.stopReplay();this.draw();}},{signal:this.abort!.signal});
    this.querySelectorAll<HTMLButtonElement>('[data-inference-mode]').forEach(button=>button.addEventListener('click',()=>{
      this.mode=button.dataset.inferenceMode!;this.draw(true);this.dispatchEvent(new CustomEvent('plot-state-change',{bubbles:true}));
    },{signal:this.abort!.signal}));
  }
  draw(animate=false) {
    // The last story step compares the strategies side by side, each as its average outcome.
    const grid=this.querySelector<HTMLElement>('[data-replay-grid]')!;grid.hidden=this.view!=='priorities';
    if(this.view==='priorities'){
      grid.querySelectorAll<HTMLElement>('[data-mini]').forEach(panel=>{panel.querySelector('[data-mini-map]')!.innerHTML=restMiniSVG(expectedStrengths(panel.dataset.mini as ReplayPolicy),replayEdges,miniLinkWidth);});
      for(const selector of ['[data-replay-controls]','[data-replay-moment]','[data-rest-preparation]','[data-inference-controls]'])this.querySelector<HTMLElement>(selector)!.hidden=true;
      this.querySelector<HTMLElement>('[data-replay-key]')!.hidden=false;
      this.querySelector('[data-rest-readout]')!.textContent=copy('replay.compare.grid');
      return;
    }
    const width=this.canvas(animate);if(!width)return;
    const l=restLayout(width,this.view,this.pair),state=this.activity;this.size(width,l.height);
    const names={a:l.points[0].name,b:l.points[1].name,c:l.points[2].name};
    const sequenceNames=state.sequence?{a:l.points[state.sequence[0]].name,b:l.points[state.sequence[1]].name,c:l.points[state.sequence[2]].name}:names;
    this.dataset.replayPhase=String(state.phase);this.dataset.replayPaused=String(!this.timer);
    this.querySelector('[data-rest-axes]')!.innerHTML=restAxes(l);
    for(const p of l.points){
      const el=this.querySelector<SVGElement>(`[data-rest-point="${p.id}"]`)!;
      el.style.transform=`translate(${p.x}px,${p.y}px)`;el.style.opacity=this.view!=='pieces'&&p.row===1?'0':'1';
      el.setAttribute('aria-hidden',String(this.view!=='pieces'&&p.row===1));
    }
    this.querySelector<HTMLElement>('[data-replay-controls]')!.hidden=this.view!=='map';
    this.querySelector<HTMLElement>('[data-replay-key]')!.hidden=!this.mapLike&&this.view!=='inference';
    this.querySelectorAll<HTMLButtonElement>('[data-replay-policy]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.replayPolicy===this.policy)));
    this.querySelector('[data-replay-rule]')!.textContent=this.querySelector(`[data-replay-rule-text="${this.policy}"]`)!.textContent;
    this.querySelector('[data-replay-count]')!.textContent=state.replays===1?copy('replay.count.one'):copy('ui.paper-plots.value-simulated-replays',{value1:state.replays});
    const runKey=this.timer?'ui.paper-plots.pause-replay':state.remaining>0?(state.checkpoint?'replay.run.continue':'replay.run.resume'):state.replays?'replay.run.more':'replay.run.start';
    this.querySelector('[data-replay-run]')!.textContent=copy(runKey,names);
    const moment=this.querySelector<HTMLElement>('[data-replay-moment]')!;
    // Step-by-step narration only for the opening a → b → c replay; later ones move too fast to read.
    const firstReplay=state.replays===0||(state.replays===1&&state.checkpoint);
    moment.hidden=this.view!=='map'||state.phase===0||!firstReplay;
    moment.textContent=state.phase?copy(`replay.stage.${state.phase}`,sequenceNames):'';
    moment.classList.toggle('is-shortcut',state.phase===3);

    const strengths=state.visibleStrengths(),edges=state.sequence?sequenceEdges(state.sequence):[];
    for(const p of l.points){
      const halo=this.querySelector(`[data-rest-point="${p.id}"] .replay-uncertainty`)!;
      const clarity=nodeClarity(strengths,p.index);
      halo.setAttribute('r',String(11+17*(1-clarity)));
      halo.setAttribute('opacity',this.mapLike?String(.12+.24*(1-clarity)):'0');
    }
    const layer=this.querySelector<SVGGElement>('[data-replay-connections]')!;
    if(!layer.childElementCount)layer.innerHTML=replayEdges.map((_,i)=>`<path class="replay-link" data-replay-link="${i}"/>`).join('');
    layer.style.opacity=this.mapLike?'1':this.view==='inference'?'.55':'0';
    replayEdges.forEach(([a,b],i)=>{
      const line=layer.children[i] as SVGPathElement;
      line.setAttribute('d',`M${l.points[a].x},${l.points[a].y}L${l.points[b].x},${l.points[b].y}`);
      line.dataset.strength=String(strengths[i]);
      line.style.strokeWidth=String(replayLinkWidth(strengths[i]));line.style.opacity=String(.15+.85*strengths[i]);
      line.classList.toggle('replay-inferred',state.phase===3&&i===edges[2]);
    });
    const trace=this.querySelector<SVGPathElement>('[data-replay-trace]')!;
    trace.style.opacity=this.view==='map'&&state.sequence?'1':'0';
    if(state.sequence){
      const [a,b,c]=state.sequence,from=state.phase===2?b:a,to=state.phase===1?b:c;
      trace.setAttribute('d',`M${l.points[from].x},${l.points[from].y}L${l.points[to].x},${l.points[to].y}`);
      trace.style.stroke=state.phase===3?'var(--color-accent-2)':'var(--color-accent)';
      const key=`${state.replays}:${state.phase}`;
      if(key!==this.traceKey){
        this.traceKey=key;trace.getAnimations().forEach(animation=>animation.cancel());
        if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)trace.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:800,easing:'ease-out'});
      }
    }
    // After a batch of replays, mark the best- and least-prepared comparisons on the map itself.
    const compare=this.querySelector<SVGGElement>('[data-replay-compare]')!;
    const settled=this.mapLike&&this.view!=='priorities'&&!this.timer&&state.replays>1&&!state.checkpoint&&state.remaining===0;
    compare.style.display=settled?'':'none';
    let compareNote='';
    if(settled){
      const order=replayEdges.map((_,i)=>i).sort((x,y)=>state.strengths[y]-state.strengths[x]);
      const label=(i:number)=>`${l.points[replayEdges[i][0]].name}–${l.points[replayEdges[i][1]].name}`;
      for(const [kind,edge] of [['best',order[0]],['worst',order[order.length-1]]] as const){
        const [from,to]=replayEdges[edge].map(index=>l.points[index]);
        compare.querySelector(`[data-compare-${kind}]`)!.setAttribute('d',`M${from.x},${from.y}L${to.x},${to.y}`);
        const text=compare.querySelector<SVGTextElement>(`[data-compare-${kind}-label]`)!;
        // Labels sit partway along each link (not at the middle), so crossing links don't stack their labels.
        const at=kind==='best'?.3:.7,x=from.x+(to.x-from.x)*at,y=from.y+(to.y-from.y)*at;
        text.setAttribute('x',String(x));text.setAttribute('y',String(y-10));
        text.textContent=copy(kind==='best'?'replay.compare.ready':'replay.compare.long-way');
      }
      compareNote=copy('replay.compare.summary',{best:label(order[0]),worst:label(order[order.length-1])});
    }
    const route=restRoute(l,this.mode);
    const path=this.querySelector<SVGElement>('[data-rest-path]')!;setPath(path,route.path);path.style.opacity=this.view==='inference'?'1':'0';
    path.style.stroke=this.mode==='map'?'var(--color-accent-2)':'var(--color-accent)';
    const selectedEdge=replayEdges.findIndex(edge=>edge.includes(l.chosen[0].index)&&edge.includes(l.chosen[1].index));
    const practiced=state.practiceCounts[selectedEdge];
    path.style.strokeWidth=this.mode==='map'?String(replayLinkWidth(state.strengths[selectedEdge])):'2';
    path.style.strokeDasharray=this.mode==='map'&&!practiced?'4 6':'none';
    const preparation=this.querySelector<HTMLElement>('[data-rest-preparation]')!;
    preparation.hidden=this.view!=='inference';
    preparation.textContent=copy(practiced===0?'replay.comparison.unprepared':practiced===1?'replay.comparison.once':'replay.comparison.practiced',{
      a:l.chosen[0].name,c:l.chosen[1].name,count:practiced,replays:state.replays
    });
    this.querySelector<HTMLElement>('[data-inference-controls]')!.hidden=this.view!=='inference';
    this.querySelectorAll<HTMLButtonElement>('[data-inference-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.inferenceMode===this.mode)));
    const [a,b]=l.chosen,tradeoff=(b.food-a.food)*(b.service-a.service)<0;
    const replayText=compareNote?compareNote:!firstReplay?copy('ui.paper-plots.replayed-value-comparisons-brighter-lines-show',{value1:state.replays}):state.phase?copy(`replay.explanation.${state.phase}`,sequenceNames):copy('ui.paper-plots.during-the-break-no-new-information');
    const text=this.view==='pieces'?copy('ui.rest-map.each-row-ranks-the-same-four'):this.view==='priorities'?copy('replay.compare.grid'):this.mapLike?replayText:tradeoff?copy('ui.paper-plots.value-and-value-offer-a-tradeoff',{value1:a.name,value2:b.name}):copy('ui.paper-plots.value-ranks-higher-than-value-for',{value1:b.name,value2:a.name});
    const routeNote=this.view==='inference'?' '+(this.mode==='memory'?copy('ui.paper-plots.the-illustrated-food-ranking-route-takes',{value1:route.links}):copy(practiced?'ui.paper-plots.the-map-makes-a-direct-comparison':'replay.comparison.not-ready')):'';
    const readout=this.querySelector<HTMLElement>('[data-rest-readout]')!;
    readout.textContent=text+routeNote;readout.classList.toggle('replay-insight',this.view==='map'&&state.phase===3);
    this.querySelector('.chart-canvas svg')!.setAttribute('aria-label',copy('ui.paper-plots.conceptual-illustration-valuevalue',{value1:text,value2:routeNote}));
  }
}
for(const [name,element] of [['peer-plot',PeerPlot],['odor-map',OdorMap],['rest-map',RestMap]] as const)if(!customElements.get(name))customElements.define(name,element);
