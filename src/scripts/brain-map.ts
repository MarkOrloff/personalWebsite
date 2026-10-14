import {overlayLevels} from '../lib/brain-geometry.mjs';
import {BrainViewElement,loadJSON,rgb,type HemisphereChoice} from './brain-viewer';
type MapConfig={id:string;url:string;low:string;high:string;hemisphere:HemisphereChoice;regions:string[]};
type ByHemisphere={left:number[];right:number[]};
/** Shown values, plus each expected region's clusters and the ring of vertices around them (scripts/project-brain-maps.py). */
type Overlay=ByHemisphere&{scale:number;threshold:number;max:number;regions?:Record<string,ByHemisphere>;outlines?:Record<string,ByHemisphere>};
type View={yaw:number;pitch:number;zoom?:number};
type Config={maps:MapConfig[];views:Record<HemisphereChoice,View>};

/** A statistical map on the cortical surface: gray below threshold, low → high color above it. */
class BrainMap extends BrainViewElement {
 config!:Config;active='';overlays:Record<string,Overlay>={};
 /** The region outlined in black, picked by its name in the brain key; '' for none. */
 outlined='';
 /** Until the visitor turns, zooms, or picks a half, each map opens on the half where its results are. */
 moved=false;
 configure(options:AddEventListenerOptions){
  this.config=JSON.parse(this.querySelector('[data-map-config]')!.textContent!);
  // See-through like the region views, so results on hidden surfaces (e.g. entorhinal cortex) show through.
  this.showHippocampus=false;this.seeThrough=true;this.maxPitch=1.2;this.active=this.config.maps[0].id;
  this.querySelectorAll<HTMLButtonElement>('[data-map]').forEach(button=>button.addEventListener('click',()=>this.choose(button.dataset.map!),options));
  this.querySelector<HTMLButtonElement>('[data-camera="reset"]')?.addEventListener('click',()=>this.resetView(),options);
  const moved=()=>{this.moved=true;};
  this.querySelectorAll('[data-zoom],[data-hemisphere-choice]').forEach(control=>control.addEventListener('click',moved,options));
  this.canvas.addEventListener('pointermove',()=>{if(this.drag)this.moved=true;},options);
  this.canvas.addEventListener('keydown',event=>{if(event.key!=='0')this.moved=true;},options);
  this.canvas.addEventListener('wheel',event=>{if(event.ctrlKey)this.moved=true;},options);
  // Region names in the key beside the map outline that region's clusters; picking it again clears the outline.
  this.closest('.brain-evidence')?.querySelectorAll<HTMLButtonElement>('[data-outline]').forEach(button=>button.addEventListener('click',()=>this.outline(button.dataset.outline!),options));
  this.updateZoomControls();
 }
 outline(region:string){
  this.outlined=this.outlined===region?'':region;
  this.closest('.brain-evidence')?.querySelectorAll<HTMLButtonElement>('[data-outline]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.outline===this.outlined)));
  // A region shown on a different map switches to that map.
  if(this.outlined&&!this.map().regions.includes(this.outlined)){const other=this.config.maps.find(m=>m.regions.includes(this.outlined));if(other)return void this.choose(other.id);}
  this.paint();
 }
 map(id=this.active){return this.config.maps.find(m=>m.id===id)!;}
 async overlay(id:string){return this.overlays[id]??=await loadJSON<Overlay>(this.map(id).url);}
 async load(){
  const [ready]=await Promise.all([super.load(),this.overlay(this.active)]);
  if(ready)this.paint();
  return ready;
 }
 async choose(id:string){
  this.active=id;
  if(this.outlined&&!this.map(id).regions.includes(this.outlined))this.outline(this.outlined);
  this.querySelectorAll<HTMLButtonElement>('[data-map]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.map===id)));
  this.querySelectorAll<HTMLElement>('[data-map-panel]').forEach(panel=>panel.hidden=panel.dataset.mapPanel!==id);
  if(!this.moved)this.resetView();
  if(!this.ready)return;
  try {await this.overlay(id);} catch(error) {console.error(error);return;}
  if(this.active===id)this.paint();
 }
 paint(){
  const map=this.map(),overlay=this.overlays[this.active];
  this.low=rgb(map.low);this.high=rgb(map.high);
  for(const mesh of this.meshes){
   if(mesh.kind!=='cortex')continue;
   const {mask,level}=overlay?overlayLevels(overlay[mesh.hemisphere],overlay):{mask:new Float32Array(mesh.vertices),level:new Float32Array(mesh.vertices)};
   const ring=new Float32Array(mesh.vertices);
   for(const index of overlay?.outlines?.[this.outlined]?.[mesh.hemisphere]??[])ring[index]=1;
   this.setVertexData(mesh,'aMask',mask);this.setVertexData(mesh,'aLevel',level);this.setVertexData(mesh,'aOutline',ring);
   // In see-through mode only region vertices are drawn solid: the shown results and any outline around them.
   this.setVertexData(mesh,'aRegion',mask.map((m,i)=>Math.max(m,ring[i])));
  }
  this.schedule();
 }
 /** Back to the current map's own half and camera. */
 resetView(){
  this.moved=false;
  const half=this.map().hemisphere;
  if(half!==this.hemisphere)return void this.setHemisphere(half);
  this.aim();
 }
 aim(){const view=this.config.views[this.hemisphere];this.look(view.yaw,view.pitch,view.zoom??1);}
 hemisphereChanged(){this.aim();}
}
if(!customElements.get('brain-map'))customElements.define('brain-map',BrainMap);
