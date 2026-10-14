import {corticalWeights,corticalRegions,regionCenterAcross,mirrorYaw} from '../lib/brain-geometry.mjs';
import {BrainViewElement,rgb,type Mesh} from './brain-viewer';
type View={yaw:number;pitch:number};
type Region=View&{id:string;name:string;legend:string;color:string;midline:boolean;both:View};

class BrainExplorer extends BrainViewElement {
 regions:Region[]=[];region='vmpfc';
 configure(options:AddEventListenerOptions){
  this.regions=JSON.parse(this.querySelector('[data-region-config]')!.textContent!);
  const asked=new URLSearchParams(location.search).get('region');
  this.region=this.regions.some(r=>r.id===asked)?asked!:this.dataset.regionId||this.regions[0].id;
  // The surface is always see-through, so buried regions (hippocampus, insula) stay findable.
  this.seeThrough=true;
  this.querySelectorAll<HTMLButtonElement>('[data-region]').forEach(button=>button.addEventListener('click',()=>this.select(button.dataset.region!),options));
  this.querySelectorAll<HTMLButtonElement>('[data-camera]').forEach(button=>button.addEventListener('click',()=>{
   const camera=button.dataset.camera!;
   if(camera==='reset')return this.select(this.region);
   // Yaw 0 looks from the right side: the left half's inner face, or the right half's outer face.
   const fromRight=camera.startsWith('side-')?camera==='side-right':(camera==='medial')===(this.hemisphere==='left');
   this.look(fromRight?0:Math.PI,.06,this.targetZoom);
  },options));
  this.select(this.region);
 }
 /** Region views are written for the left half; the right half mirrors them; both halves have their own. */
 view(region:Region):View {
  if(this.hemisphere==='both')return region.both;
  return this.hemisphere==='right'?{...region,yaw:mirrorYaw(region.yaw)}:region;
 }
 select(id:string){
  const region=this.regions.find(r=>r.id===id);if(!region)return;
  const view=this.view(region);
  this.region=id;this.dataset.regionId=id;this.color=rgb(region.color);
  this.paint();this.center=regionCenterAcross(this.placed,id) as [number,number,number];
  this.querySelectorAll<HTMLButtonElement>('[data-region]').forEach(button=>{
   button.setAttribute('aria-pressed',String(button.dataset.region===id));
  });
  this.querySelectorAll<HTMLElement>('[data-region-panel]').forEach(panel=>panel.hidden=panel.dataset.regionPanel!==id);
  this.querySelector<HTMLElement>('[data-region-legend]')!.textContent=region.legend;
  this.look(view.yaw,view.pitch,1);
  this.updateOrientation();
 }
 paint(){
  for(const mesh of this.meshes){
   const surface=this.surfaces[mesh.hemisphere]!;
   const ones=new Float32Array(mesh.vertices).fill(1);
   this.setVertexData(mesh,'aSelected',mesh.kind==='cortex'?corticalWeights(surface,this.region):ones);
   this.setVertexData(mesh,'aRegion',mesh.kind==='cortex'?corticalRegions(surface):ones);
  }
 }
 hippocampusColor(_mesh:Mesh){return this.region==='hc'?this.color:[.60,.60,.60];}
 resetView(){this.select(this.region);}
 hemisphereChanged(){this.select(this.region);}
 viewChanged(view:string){
  this.querySelectorAll<HTMLElement>('[data-view-description]').forEach(p=>p.hidden=p.dataset.viewDescription!==`${this.hemisphere}:${view}`);
 }
}
if(!customElements.get('brain-explorer'))customElements.define('brain-explorer',BrainExplorer);
