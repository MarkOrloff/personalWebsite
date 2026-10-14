import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {corticalWeights,corticalRegions,regionCenter,regionCenterAcross,rotateBrainPoint,mirrorYaw,viewName,sharedFrame,placeVertices,overlayLevels} from '../src/lib/brain-geometry.mjs';

const read=path=>readFileSync(new URL(`../public/brains/${path}`,import.meta.url));
const provenance=JSON.parse(read('provenance.json'));
const raw={left:read('fsaverage5-left.json'),right:read('fsaverage5-right.json')};
const brains={left:JSON.parse(raw.left),right:JSON.parse(raw.right)};
const anatomy=brains.left;

function assertClosed(vertices,faces,{sphere=false}={}){
 const n=vertices.length/3,edges=new Map();let volume=0;
 assert.ok(vertices.every(Number.isFinite));
 for(let i=0;i<faces.length;i+=3){
  const ids=faces.slice(i,i+3);
  assert.equal(new Set(ids).size,3);
  assert.ok(ids.every(index=>Number.isInteger(index)&&index>=0&&index<n));
  const [a,b,c]=ids.map(index=>vertices.slice(3*index,3*index+3));
  volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;
  for(let j=0;j<3;j++){const edge=[ids[j],ids[(j+1)%3]].sort((x,y)=>x-y).join(',');edges.set(edge,(edges.get(edge)||0)+1);}
 }
 assert.ok([...edges.values()].every(count=>count===2),'every edge joins exactly two triangles');
 if(sphere)assert.equal(n-edges.size+faces.length/3,2,'surface has spherical topology');
 return volume;
}

for(const hemi of ['left','right']){
 test(`the ${hemi} brain asset preserves a closed surface and matching anatomical labels`,()=>{
  const surface=brains[hemi],record=provenance.hemispheres[hemi];
  const n=surface.pial.length/3;
  assert.equal(n,10242);
  assert.equal(surface.faces.length,20480*3);
  assert.equal(surface.labels.length,n);
  assert.equal(surface.sulc.length,n);
  assert.equal(surface.hemisphere,hemi);
  assert.equal(createHash('sha256').update(raw[hemi]).digest('hex'),record.output_sha256);
  for(const values of [surface.pial,surface.sulc])assert.ok(values.every(Number.isFinite));
  assertClosed(surface.pial,surface.faces,{sphere:true});
  for(const label of surface.labels)assert.ok(Number.isInteger(label)&&label>=0&&label<surface.names.length);
  assert.equal(surface.names[7],'G_and_S_cingul-Mid-Ant');
  assert.equal(surface.names[31],'G_rectus');
  assert.equal(surface.names[18],'G_insular_short');
  // frame recovers surface RAS, which places each hemisphere on its own side of the midline.
  const x=surface.pial.filter((_,i)=>i%3===0).map(value=>value*surface.frame.scale+surface.frame.center[0]);
  assert.ok(hemi==='left'?Math.max(...x)<2:Math.min(...x)>-2,'cortex stays on its side of the midline (within 2 mm)');
  assert.deepEqual(Object.fromEntries(Object.entries(surface.masks).map(([k,v])=>[k,v.length])),record.masks);
 });
 test(`${hemi} region masks follow the shared anatomical definitions`,()=>{
  const surface=brains[hemi],acc=new Set(surface.masks.acc),insula=new Set(surface.masks.insula),vmpfc=new Set(surface.masks.vmpfc);
  const rasZ=index=>surface.pial[3*index+2]*surface.frame.scale+surface.frame.center[2];
  const kept=[],dropped=[];
  surface.labels.forEach((label,index)=>{
   // ACC: all of anterior midcingulate (7) and only the dorsal part of anterior cingulate (6).
   if(label===7)assert.ok(acc.has(index),'anterior midcingulate is fully included');
   else if(label===6)(acc.has(index)?kept:dropped).push(rasZ(index));
   else assert.ok(!acc.has(index),'ACC stays within Destrieux 6 and 7');
   assert.equal(insula.has(index),[18,48].includes(label));
   const z=surface.pial[3*index+2]*surface.frame.scale+surface.frame.center[2];
   // The export rounds display coordinates; skip vertices within rounding distance of the z=10 mm cut.
   if(Math.abs(z-10)>.01)assert.equal(vmpfc.has(index),[31,32,64,71].includes(label)||(label===6&&z<10));
  });
  const mean=values=>values.reduce((x,y)=>x+y,0)/values.length;
  assert.ok(kept.length>.35*(kept.length+dropped.length)&&kept.length<.6*(kept.length+dropped.length),'roughly half of parcel 6 is kept');
  assert.ok(mean(kept)>mean(dropped)+10,'the kept half sits above the genu wrap');
  assert.ok(Math.min(...kept)>-1,'no subgenual vertices remain');
  for(const indices of Object.values(surface.masks)){
   assert.equal(new Set(indices).size,indices.length);
   assert.ok(indices.every(i=>Number.isInteger(i)&&i>=0&&i<surface.pial.length/3));
  }
 });
 test(`${hemi} mPFC sits on the medial frontal wall between ACC and vmPFC`,()=>{
  const surface=brains[hemi],indices=surface.masks.mpfc;
  const ras=(index,axis)=>surface.pial[3*index+axis]*surface.frame.scale+surface.frame.center[axis];
  assert.ok(indices.length>80,'a real patch');
  assert.ok(indices.every(i=>surface.names[surface.labels[i]]!=='Medial_wall'),'cortex only');
  assert.ok(indices.every(i=>ras(i,1)>0),'in front of the anterior commissure');
  assert.ok(indices.every(i=>Math.abs(ras(i,0))<20),'on the medial wall');
 });
 test(`${hemi} hippocampus has valid closed geometry on the correct side`,()=>{
  const {vertices,faces}=brains[hemi].hippocampus,record=provenance.hemispheres[hemi].hippocampus;
  assert.ok(vertices.length/3<65536);
  assert.equal(vertices.length/3,record.vertices);
  assert.equal(record.aseg_label,hemi==='left'?17:53);
  assert.ok(assertClosed(vertices,faces)>0,'outward winding supports correct surface lighting');
  const [low,high]=record.ras_bounds;
  assert.ok(hemi==='left'?high[0]<0:low[0]>0,`hippocampus is in the ${hemi} hemisphere`);
  assert.ok(low[1]>-50&&high[1]<0,'matches the temporal-lobe bounds in the source template');
 });
}

test('region sizes match the documented definitions, and only folded cortex is shipped',()=>{
 assert.deepEqual(provenance.hemispheres.left.masks,{vmpfc:261,acc:190,insula:107,ec:48,mpfc:110});
 assert.deepEqual(provenance.hemispheres.right.masks,{vmpfc:259,acc:236,insula:107,ec:42,mpfc:119});
 assert.equal(anatomy.hippocampus.vertices.length/3,3646);
 for(const surface of Object.values(brains))assert.equal(surface.inflated,undefined,'no inflated coordinates');
 assert.ok(!Object.keys(provenance.sources).some(name=>name.startsWith('infl')));
 for(const name of Object.keys(provenance.sources))assert.match(provenance.sources[name].sha256,/^[0-9a-f]{64}$/);
});

test('selection colors only the chosen cortical region while preserving gray anatomical context',()=>{
 const vm=anatomy.masks.vmpfc;
 assert.ok(vm.some(i=>anatomy.labels[i]===32),'subcallosal medial wall is included');
 assert.ok(vm.some(i=>anatomy.labels[i]===6),'lower anterior cingulate is included');
 for(const [region,indices] of Object.entries(anatomy.masks)){
  const selected=new Set(indices),weights=corticalWeights(anatomy,region);
  assert.ok(weights.every((weight,index)=>weight===(selected.has(index)?1:0)),`${region} cannot color an unselected region`);
 }
 const context=corticalRegions(anatomy);
 assert.ok(Object.values(anatomy.masks).flat().every(i=>context[i]===1),'all named cortical regions remain in the context mesh');
 assert.equal(corticalWeights(anatomy,'hc').reduce((a,b)=>a+b,0),0,'HC is a separate volume-derived mesh, not a cortical patch');
 for(const region of [...Object.keys(anatomy.masks),'hc']){
  const center=regionCenter(anatomy,region);
  assert.equal(center.length,3);assert.ok(center.every(Number.isFinite));
 }
 assert.ok(regionCenter(anatomy,'hc')[2]<regionCenter(anatomy,'acc')[2],'zoom centers distinguish temporal and frontal anatomy');
});

test('one hemisphere keeps its own frame; two share one without moving anatomy',()=>{
 const {left,right}=brains;
 assert.equal(sharedFrame([left]),left.frame);
 assert.deepEqual(Array.from(placeVertices(left.pial.slice(0,30),left.frame,left.frame)),left.pial.slice(0,30).map(Math.fround));
 const frame=sharedFrame([left,right]);
 assert.ok(Math.abs(frame.center[0])<2,'the shared frame is centered near the midline');
 for(const surface of [left,right]){
  const placed=placeVertices(surface.pial,surface.frame,frame);
  for(let i=0;i<placed.length;i+=997){
   const ras=surface.pial[i]*surface.frame.scale+surface.frame.center[i%3];
   assert.ok(Math.abs(placed[i]*frame.scale+frame.center[i%3]-ras)<1e-3,'placement preserves surface RAS');
  }
  assert.ok(placed.every(v=>Math.abs(v)<=.84),'both hemispheres fit the same display extent');
 }
 const placedHalves=[left,right].map(s=>({...s,pial:placeVertices(s.pial,s.frame,frame)}));
 const ec=regionCenterAcross(placedHalves,'ec');
 assert.ok(Math.abs(ec[0])<.05,'a region shown in both halves is centered on the midline');
});

test('orientation labels and names turn with the brain, and the right half mirrors the left',()=>{
 const front=[0,1,0],top=[0,0,1];
 assert.deepEqual(rotateBrainPoint(front,0,0),[1,0,0]);
 assert.ok(rotateBrainPoint(front,Math.PI,0)[0]<-.99,'front switches sides in the outer view');
 assert.ok(rotateBrainPoint(front,-Math.PI/2,0)[2]>.99,'front is closest in the front view');
 assert.deepEqual(rotateBrainPoint(top,0,0),[0,1,0]);
 for(const yaw of [0,-.15,.7,Math.PI]){
  const point=[-.3,.4,.2],mirrored=[.3,.4,.2];
  const [h,v,d]=rotateBrainPoint(point,yaw,.06),[hm,vm,dm]=rotateBrainPoint(mirrored,mirrorYaw(yaw),.06);
  assert.ok(Math.abs(h+hm)<1e-9&&Math.abs(v-vm)<1e-9&&Math.abs(d-dm)<1e-9,'mirrored camera sees the mirror image');
 }
 assert.equal(viewName(0,'left'),'medial');assert.equal(viewName(Math.PI,'left'),'lateral');
 assert.equal(viewName(0,'right'),'lateral');assert.equal(viewName(Math.PI,'right'),'medial');
 assert.equal(viewName(0,'both'),'right');assert.equal(viewName(Math.PI,'both'),'left');
 assert.equal(viewName(-Math.PI/2,'both'),'front');assert.equal(viewName(-Math.PI/2,'both',-.75),'below');
});

const maps=JSON.parse(read('overlays/provenance.json'));
const studies=[maps,JSON.parse(read('overlays/provenance-raithel-2023.json'))];
// One-sided t thresholds from scipy.stats.t.isf(p, df).
const tThresholds={'0.05,34':1.69092,'0.01,34':2.44115,'0.005,27':2.77068};
for(const study of studies)for(const [file,record] of Object.entries(study.overlays)){
 test(`${record.name} overlay matches fsaverage5, applies its threshold, and keeps only its regions`,()=>{
  const bytes=read(`overlays/${file}`),overlay=JSON.parse(bytes),setting=study.thresholds[file];
  assert.equal(createHash('sha256').update(bytes).digest('hex'),record.output_sha256);
  for(const source of Object.values(record.sources))assert.match(source.source_sha256,/^[0-9a-f]{64}$/);
  assert.equal(overlay.df,record.df);assert.equal(overlay.p,setting.p_one_sided);
  assert.ok(Math.abs(overlay.threshold-tThresholds[`${overlay.p},${overlay.df}`])<1e-5);
  assert.ok(Math.abs(setting.t-overlay.threshold)<1e-5);
  assert.deepEqual(Object.keys(overlay.regions).sort(),Object.keys(record.regions).sort());
  let peak=0;
  for(const hemi of ['left','right']){
   const values=overlay[hemi],surface=brains[hemi];
   assert.equal(values.length,surface.pial.length/3,'one value per fsaverage5 vertex');
   assert.ok(values.every(v=>Number.isInteger(v)&&v>=0),'finite, positive-only, quantized values');
   const shown=values.filter(v=>v>0);
   assert.equal(shown.length,record.shown_vertices[hemi]);
   assert.ok(shown.every(v=>v>=Math.round(overlay.threshold*overlay.scale)),'nothing below the display threshold is stored');
   const kept=new Set(Object.values(overlay.regions).flatMap(region=>region[hemi]));
   assert.ok(values.every((v,i)=>(v>0)===kept.has(i)),'exactly the kept regions are shown');
   for(const ring of Object.values(overlay.outlines))assert.ok(ring[hemi].every(i=>!kept.has(i)),'outlines sit just outside the shown clusters');
   // Anterior piriform cortex falls in the medial-wall label, so only piriform maps may show values there.
   if(!('piriform' in overlay.regions))assert.ok(values.every((v,i)=>v===0||surface.names[surface.labels[i]]!=='Medial_wall'),'the medial wall stays blank');
   peak=Math.max(peak,...values);
   const {mask,level}=overlayLevels(values,overlay);
   assert.equal(mask.reduce((a,b)=>a+b,0),shown.length);
   assert.ok(level.every(l=>l>=0&&l<=1));
  }
  assert.equal(peak/overlay.scale,overlay.max);
 });
}

test('the subjective grid-like map has entorhinal-area and medial prefrontal results, as the paper reports',()=>{
 const grid=JSON.parse(read('overlays/neurovault-1009070.json')),record=maps.overlays['neurovault-1009070.json'];
 const checks={surface:record.checks.surface,volume:record.sources['1009070'].volume_check};
 const shownIn=(hemi,region)=>brains[hemi].masks[region].filter(i=>grid[hemi][i]>0).length;
 assert.ok(shownIn('left','vmpfc')>0,'medial prefrontal result on the cortical surface');
 const parahippocampal=checks.surface.right.by_desikan_label.parahippocampal;
 assert.ok(parahippocampal>0,'right medial temporal result beside entorhinal cortex');
 const right=checks.volume.largest_clusters.find(c=>c.peak_mni[0]>20&&c.peak_mni[1]>-30&&c.peak_mni[1]<0&&c.peak_mni[2]<-15);
 assert.ok(right&&right.peak_t>3,'right medial temporal cluster in the volume');
 const mpfc=checks.volume.largest_clusters.find(c=>Math.abs(c.peak_mni[0])<15&&c.peak_mni[1]>30&&c.peak_mni[2]<0);
 assert.ok(mpfc,'ventromedial prefrontal cluster in the volume');
});

test('the smell map shows entorhinal and piriform results, each from the map seeded in that region',()=>{
 const record=JSON.parse(read('overlays/provenance-raithel-2023.json')).overlays['neurovault-raithel-2023.json'];
 assert.deepEqual(record.regions,{ec:'796768',piriform:'796968'});
 const overlay=JSON.parse(read('overlays/neurovault-raithel-2023.json'));
 assert.ok(overlay.regions.ec.left.length>0&&overlay.regions.ec.right.length>0,'entorhinal results on both sides');
 assert.ok(overlay.regions.piriform.left.length>0,'a piriform result');
 assert.ok(overlay.regions.ec.left.some(i=>brains.left.masks.ec.includes(i)),'the entorhinal cluster includes entorhinal cortex');
});
