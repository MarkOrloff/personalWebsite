import {corticalWeights,mirrorYaw} from '../lib/brain-geometry.mjs';
import {BrainViewElement,rgb,type Mesh} from './brain-viewer';
type Config={id:string;color:string;yaw:number;pitch:number};

/**
 * One explorer region in a compact, control-free view: same mask, color and see-through surface as
 * <brain-explorer>, opening on the region's own camera. Drag or arrow keys rotate; +/− zoom; 0 resets.
 */
class BrainRegion extends BrainViewElement {
 config!:Config;
 configure(){
  this.config=JSON.parse(this.querySelector('[data-region-config]')!.textContent!);
  this.color=rgb(this.config.color);this.seeThrough=true;
  // Only the chosen region stands out: no gray context regions, and the hippocampus only when it's the region.
  this.showHippocampus=this.config.id==='hc';
 }
 paint(){
  for(const mesh of this.meshes){
   const surface=this.surfaces[mesh.hemisphere]!,ones=new Float32Array(mesh.vertices).fill(1);
   this.setVertexData(mesh,'aSelected',mesh.kind==='cortex'?corticalWeights(surface,this.config.id):ones);
   this.setVertexData(mesh,'aRegion',mesh.kind==='cortex'?corticalWeights(surface,this.config.id):ones);
  }
 }
 hippocampusColor(_mesh:Mesh){return this.config.id==='hc'?this.color:[.60,.60,.60];}
 resetView(){
  // Compact views fill the frame with the whole half (zoom around the brain's center), not just the region.
  this.center=[0,0,0];
  this.look(this.hemisphere==='right'?mirrorYaw(this.config.yaw):this.config.yaw,this.config.pitch,Number(this.dataset.defaultZoom)||1);
 }
}
if(!customElements.get('brain-region'))customElements.define('brain-region',BrainRegion);
