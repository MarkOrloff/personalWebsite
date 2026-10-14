/** Matches the WebGL anatomical-coordinate rotation, so labels follow the brain. */
export function rotateBrainPoint([x,y,z],yaw,pitch) {
 const horizontal=Math.cos(yaw)*y+Math.sin(yaw)*x;
 const depth=-Math.sin(yaw)*y+Math.cos(yaw)*x;
 return [horizontal,Math.cos(pitch)*z-Math.sin(pitch)*depth,Math.sin(pitch)*z+Math.cos(pitch)*depth];
}
/** The same camera, mirrored across the midline: a left-hemisphere view becomes the matching right-hemisphere view. */
export const mirrorYaw=yaw=>Math.PI-yaw;
/**
 * Names the current viewpoint. Yaw 0 looks from the right side (+x), which faces the left hemisphere's
 * inner surface. Pitch below -0.45 looks up at the underside.
 */
export function viewName(yaw,hemisphere='left',pitch=0) {
 const cosine=Math.cos(yaw),sine=Math.sin(yaw);
 if(pitch<-.45)return 'below';
 if(Math.abs(cosine)<=.55)return sine<0?'front':'back';
 const fromRight=cosine>0;
 if(hemisphere==='both')return fromRight?'right':'left';
 return fromRight===(hemisphere==='left')?'medial':'lateral';
}
export function corticalWeights(surface,region) {
 const weights=new Float32Array(surface.pial.length/3);
 for(const index of surface.masks[region]||[])weights[index]=1;
 return weights;
}
/** Context patches remain gray when transparency exposes the selected region. */
export function corticalRegions(surface) {
 const regions=new Float32Array(surface.pial.length/3);
 for(const indices of Object.values(surface.masks))for(const index of indices)regions[index]=1;
 return regions;
}
export function regionCenter(surface,region) {
 return regionCenterAcross([surface],region);
}
/** Center of a region's bounding box across one or both hemispheres (already placed in one frame). */
export function regionCenterAcross(surfaces,region) {
 const low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
 for(const surface of surfaces){
  const vertices=region==='hc'?surface.hippocampus.vertices:surface.pial;
  const indices=region==='hc'?Array.from({length:vertices.length/3},(_,i)=>i):surface.masks[region]||[];
  for(const index of indices)for(let axis=0;axis<3;axis++){
   const value=vertices[index*3+axis];low[axis]=Math.min(low[axis],value);high[axis]=Math.max(high[axis],value);
  }
 }
 if(low[0]===Infinity)return [0,0,0];
 return [0,1,2].map(axis=>(low[axis]+high[axis])/2);
}
/**
 * Each hemisphere asset is centered on itself: display = (surface RAS - frame.center) / frame.scale.
 * One hemisphere keeps its own frame, so it looks exactly as it does alone. Two share the frame of
 * their combined bounding box, with the same 0.6 × largest-extent scale used by the export script.
 */
export function sharedFrame(surfaces) {
 if(surfaces.length===1)return surfaces[0].frame;
 const low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
 for(const {pial,frame} of surfaces)for(let i=0;i<pial.length;i+=3)for(let axis=0;axis<3;axis++){
  const value=pial[i+axis]*frame.scale+frame.center[axis];
  low[axis]=Math.min(low[axis],value);high[axis]=Math.max(high[axis],value);
 }
 return {center:[0,1,2].map(axis=>(low[axis]+high[axis])/2),scale:Math.max(...[0,1,2].map(axis=>high[axis]-low[axis]))*.6};
}
export function placeVertices(vertices,from,to) {
 if(from===to)return Float32Array.from(vertices);
 const result=new Float32Array(vertices.length),ratio=from.scale/to.scale;
 for(let i=0;i<vertices.length;i++){const axis=i%3;result[i]=vertices[i]*ratio+(from.center[axis]-to.center[axis])/to.scale;}
 return result;
}
/**
 * Per-vertex overlay: values are stored as round(t × scale), 0 where not shown.
 * mask is 1 at or above the display threshold; level runs from 0 (threshold) to 1 (max), so lighter = stronger.
 */
export function overlayLevels(values,{scale,threshold,max}) {
 const mask=new Float32Array(values.length),level=new Float32Array(values.length);
 const low=Math.round(threshold*scale)/scale,range=Math.max(max-low,1e-6);
 for(let i=0;i<values.length;i++){
  const t=values[i]/scale;
  if(values[i]>0&&t>=low){mask[i]=1;level[i]=Math.min(1,Math.max(0,(t-low)/range));}
 }
 return {mask,level};
}
export function surfaceNormals(vertices,faces) {
 const result=new Float32Array(vertices.length);
 for(let i=0;i<faces.length;i+=3){
  const a=faces[i]*3,b=faces[i+1]*3,c=faces[i+2]*3;
  const u=[0,1,2].map(k=>vertices[b+k]-vertices[a+k]),v=[0,1,2].map(k=>vertices[c+k]-vertices[a+k]);
  const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  for(const start of [a,b,c])for(let k=0;k<3;k++)result[start+k]+=n[k];
 }
 for(let i=0;i<result.length;i+=3){const length=Math.hypot(result[i],result[i+1],result[i+2])||1;for(let k=0;k<3;k++)result[i+k]/=length;}
 return result;
}
