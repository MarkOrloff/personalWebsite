// Reusable WebGL brain surface viewer. Subclasses decide what each vertex shows:
// <brain-explorer> colors anatomical regions; <brain-map> shows a thresholded statistical overlay.
import {rotateBrainPoint,surfaceNormals,sharedFrame,placeVertices,viewName} from '../lib/brain-geometry.mjs';

export type Hemisphere='left'|'right';
export type HemisphereChoice=Hemisphere|'both';
export type Frame={center:number[];scale:number};
export type Surface={hemisphere:Hemisphere;pial:number[];faces:number[];sulc:number[];masks:Record<string,number[]>;hippocampus:{vertices:number[];faces:number[]};frame:Frame};
/** A hemisphere as drawn: positions moved into the shared frame of everything on screen. */
export type PlacedSurface={hemisphere:Hemisphere;pial:Float32Array;masks:Record<string,number[]>;hippocampus:{vertices:Float32Array;faces:number[]}};
type Attribute={buffer:WebGLBuffer;size:number};
export type Mesh={hemisphere:Hemisphere;kind:'cortex'|'hippocampus';attributes:Record<string,Attribute>;indices:WebGLBuffer;count:number;vertices:number};

const vertexSource=`
 attribute vec3 aPial,aPialNormal;
 attribute float aSulc,aSelected,aRegion,aMask,aLevel,aOutline;
 uniform float uYaw,uPitch,uAspect,uZoom;
 uniform vec2 uFocus;
 varying float vShade,vGrey,vSelected,vRegion,vMask,vLevel,vOutline;
 vec3 rotate(vec3 p){
  p=vec3(p.y,p.z,p.x);
  p=vec3(cos(uYaw)*p.x+sin(uYaw)*p.z,p.y,-sin(uYaw)*p.x+cos(uYaw)*p.z);
  return vec3(p.x,cos(uPitch)*p.y-sin(uPitch)*p.z,sin(uPitch)*p.y+cos(uPitch)*p.z);
 }
 void main(){
  vec3 p=rotate(aPial);
  vec3 n=normalize(rotate(aPialNormal));
  gl_Position=vec4((p.x-uFocus.x)*uZoom/uAspect,(p.y-uFocus.y)*uZoom,-p.z*.5,1.);
  vShade=.62+.38*max(dot(n,normalize(vec3(-.35,.6,1.))),0.);
  vGrey=clamp(.82-.10*aSulc,.48,.94);vSelected=aSelected;vRegion=aRegion;vMask=aMask;vLevel=aLevel;vOutline=aOutline;
 }`;
// Cortex brightness, see-through opacity and the gray of context regions follow the page theme
// (--brain-tone, --brain-alpha and --brain-context in tokens.css), so the brain reads on light and dark pages.
const fragmentSource=`
 precision mediump float;
 uniform vec3 uColor,uLow,uHigh;
 uniform float uPass,uTone,uAlpha,uContext;
 varying float vShade,vGrey,vSelected,vRegion,vMask,vLevel,vOutline;
 void main(){
  // Passes: 1 = faded surface, 2 = regions drawn solid, 3 = faded surface except where a region is nearest.
  bool regionPass=uPass>1.5&&uPass<2.5, veilPass=(uPass>.5&&uPass<1.5)||uPass>2.5;
  vec3 cortex=vec3(vGrey*uTone*(regionPass?uContext:1.));
  if(regionPass && vRegion<.5)discard;
  if(uPass>2.5 && vRegion>.5)discard;
  vec3 color=mix(cortex,uColor,smoothstep(.3,.9,vSelected));
  if(veilPass){gl_FragColor=vec4(cortex*vShade,uAlpha);return;}
  vec3 shown=vMask>.5?mix(uLow,uHigh,clamp(vLevel,0.,1.))*(.55+.45*vShade):color*vShade;
  // A ring of outline vertices around a result draws as a dark band about one edge wide, with soft edges.
  gl_FragColor=vec4(mix(shown,vec3(.05),smoothstep(.35,.6,vOutline)),1.);
 }`;
const attributeNames=['aPial','aPialNormal','aSulc','aSelected','aRegion','aMask','aLevel','aOutline'];
export const rgb=(hex:string)=>hex.slice(1).match(/../g)!.map(v=>parseInt(v,16)/255);
const requests=new Map<string,Promise<unknown>>();
/** Shared between viewers on a page, so each asset downloads once. */
export function loadJSON<T>(url:string):Promise<T> {
 if(!requests.has(url))requests.set(url,fetch(url).then(response=>{if(!response.ok)throw Error(`${url}: ${response.status}`);return response.json();}).catch(error=>{requests.delete(url);throw error;}));
 return requests.get(url) as Promise<T>;
}

export abstract class BrainViewElement extends HTMLElement {
 canvas!:HTMLCanvasElement;gl!:WebGLRenderingContext;program?:WebGLProgram;
 uniforms:Record<string,WebGLUniformLocation|null>={};locations:Record<string,number>={};
 surfaces:Partial<Record<Hemisphere,Surface>>={};placed:PlacedSurface[]=[];meshes:Mesh[]=[];
 hemisphere:HemisphereChoice='left';loadToken=0;viewKey='';
 abort?:AbortController;observer?:ResizeObserver;visibility?:IntersectionObserver;
 frame=0;ready=false;started=false;drag?:{x:number;y:number};
 yaw=0;pitch=.06;targetYaw=0;targetPitch=.06;zoom=1;targetZoom=1;maxPitch=.8;
 center:[number,number,number]=[0,0,0];viewOffset=[0,0];
 seeThrough=false;showHippocampus=true;color=[1,1,1];low=[0,0,0];high=[1,1,1];
 reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 /** Until the first interaction, the brain sways slowly so its see-through depth is easier to read. */
 idle=true;baseYaw=0;idleFrame=0;onScreen=false;screen?:IntersectionObserver;
 /** Read configuration and wire subclass controls. Runs before anything loads. */
 abstract configure(options:AddEventListenerOptions):void;
 /** Fill per-vertex attributes (aSelected, aRegion, aMask, aLevel) for the current content. */
 abstract paint():void;
 /** The view the "0" key and reset buttons return to. */
 abstract resetView():void;
 /** Called after the visible hemispheres change and new meshes are ready. */
 hemisphereChanged(){}
 /** Called whenever the named viewpoint (medial, lateral, front, back, left, right) may have changed. */
 viewChanged(_view:string){}
 hippocampusColor(_mesh:Mesh){return [.60,.60,.60];}

 shading={tone:1,alpha:.36,context:.65};
 readShading(){
  const style=getComputedStyle(this),value=(name:string,fallback:number)=>{const number=parseFloat(style.getPropertyValue(name));return Number.isFinite(number)?number:fallback;};
  this.shading={tone:value('--brain-tone',1),alpha:value('--brain-alpha',.36),context:value('--brain-context',.65)};
 }
 connectedCallback(){
  this.abort=new AbortController();this.canvas=this.querySelector('canvas')!;
  this.readShading();
  const restyle=()=>{this.readShading();this.schedule();};
  document.addEventListener('theme-change',restyle,{signal:this.abort.signal});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',restyle,{signal:this.abort.signal});
  const initial=this.dataset.hemisphere as HemisphereChoice;
  this.hemisphere=['left','right','both'].includes(initial)?initial:'left';
  const options={signal:this.abort.signal};
  this.configure(options);this.bindControls(options);this.updateHemisphereControls();
  if(!this.hasAttribute('data-lazy'))return void this.start();
  // Lazy viewers wait until they are near the screen, so hidden panels never download the brain.
  this.visibility=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){this.visibility?.disconnect();this.start();}},{rootMargin:'200px'});
  this.visibility.observe(this);
 }
 disconnectedCallback(){
  this.ready=false;this.started=false;this.abort?.abort();this.observer?.disconnect();this.visibility?.disconnect();this.screen?.disconnect();cancelAnimationFrame(this.frame);cancelAnimationFrame(this.idleFrame);this.frame=0;
  if(this.gl){this.deleteMeshes();if(this.program)this.gl.deleteProgram(this.program);}
 }
 async start(){
  if(this.started)return;this.started=true;
  try {
   const context=this.canvas.getContext('webgl',{alpha:true,antialias:true});
   if(!context)throw Error('WebGL unavailable');this.gl=context;this.compile();
   if(!await this.load())return;
   this.ready=true;this.resetView();
   this.querySelector<HTMLElement>('[data-brain-loading]')!.hidden=true;
   this.querySelectorAll<HTMLElement>('[data-show-when-ready]').forEach(el=>el.hidden=false);
   this.observer=new ResizeObserver(()=>this.schedule());this.observer.observe(this.canvas);this.schedule();
   this.startIdle();
  } catch(error) {
   if(!this.isConnected)return;
   console.error(error);this.ready=false;
   this.querySelector<HTMLElement>('[data-brain-loading]')!.hidden=true;
   this.querySelector<HTMLElement>('[data-brain-error]')!.hidden=false;
   this.querySelectorAll<HTMLButtonElement>('[data-zoom],[data-camera],[data-hemisphere-choice],[data-map]').forEach(control=>control.disabled=true);
  }
 }
 visibleHemispheres():Hemisphere[]{return this.hemisphere==='both'?['left','right']:[this.hemisphere];}
 /** Fetches what is missing and rebuilds meshes. False if a newer request replaced this one. */
 async load(){
  const token=++this.loadToken,list=this.visibleHemispheres();
  const surfaces=await Promise.all(list.map(h=>this.surfaces[h]?Promise.resolve(this.surfaces[h]!):loadJSON<Surface>(`/brains/fsaverage5-${h}.json`)));
  if(!this.isConnected||token!==this.loadToken)return false;
  list.forEach((h,i)=>this.surfaces[h]=surfaces[i]);
  const frame=sharedFrame(surfaces);
  this.placed=surfaces.map(s=>({hemisphere:s.hemisphere,masks:s.masks,pial:placeVertices(s.pial,s.frame,frame),
   hippocampus:{vertices:placeVertices(s.hippocampus.vertices,s.frame,frame),faces:s.hippocampus.faces}}));
  this.deleteMeshes();
  this.meshes=this.placed.flatMap((p,i)=>[
   this.mesh(p.hemisphere,'cortex',p.pial,surfaces[i].faces,surfaces[i].sulc),
   this.mesh(p.hemisphere,'hippocampus',p.hippocampus.vertices,p.hippocampus.faces,new Array(p.hippocampus.vertices.length/3).fill(0)),
  ]);
  this.paint();
  return true;
 }
 async setHemisphere(choice:HemisphereChoice){
  if(choice===this.hemisphere||!['left','right','both'].includes(choice))return;
  this.hemisphere=choice;this.dataset.hemisphere=choice;this.updateHemisphereControls();
  if(!this.ready)return;
  try {if(!await this.load())return;} catch(error) {console.error(error);return;}
  this.hemisphereChanged();this.schedule();
 }
 updateHemisphereControls(){
  this.querySelectorAll<HTMLButtonElement>('[data-hemisphere-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.hemisphereChoice===this.hemisphere)));
  this.querySelectorAll<HTMLElement>('[data-hemi-only]').forEach(el=>el.hidden=!el.dataset.hemiOnly!.split(' ').includes(this.hemisphere));
  const label=this.canvas.dataset[`label${this.hemisphere[0].toUpperCase()}${this.hemisphere.slice(1)}`];
  if(label)this.canvas.setAttribute('aria-label',label);
 }
 compile(){
  const gl=this.gl;
  const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Shader compilation failed');return shader;};
  const program=this.program=gl.createProgram()!;
  const shaders=[compile(gl.VERTEX_SHADER,vertexSource),compile(gl.FRAGMENT_SHADER,fragmentSource)];
  shaders.forEach(shader=>gl.attachShader(program,shader));gl.linkProgram(program);shaders.forEach(shader=>gl.deleteShader(shader));
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link failed');gl.useProgram(program);
  for(const name of ['uYaw','uPitch','uZoom','uFocus','uColor','uLow','uHigh','uAspect','uPass','uTone','uAlpha','uContext'])this.uniforms[name]=gl.getUniformLocation(program,name);
  for(const name of attributeNames)this.locations[name]=gl.getAttribLocation(program,name);
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
 }
 mesh(hemisphere:Hemisphere,kind:Mesh['kind'],positions:Float32Array,faces:number[],sulc:number[]):Mesh {
  const gl=this.gl,attributes:Mesh['attributes']={},count=positions.length/3,zeros=()=>new Float32Array(count);
  const values:[string,Float32Array,number][]=[
   ['aPial',positions,3],['aPialNormal',surfaceNormals(positions,faces),3],['aSulc',new Float32Array(sulc),1],
   ['aSelected',zeros(),1],['aRegion',zeros(),1],['aMask',zeros(),1],['aLevel',zeros(),1],['aOutline',zeros(),1],
  ];
  for(const [name,data,size] of values){const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);attributes[name]={buffer,size};}
  const indices=gl.createBuffer()!;gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(faces),gl.STATIC_DRAW);
  return {hemisphere,kind,attributes,indices,count:faces.length,vertices:count};
 }
 setVertexData(mesh:Mesh,name:string,data:Float32Array){
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER,mesh.attributes[name].buffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,data,this.gl.DYNAMIC_DRAW);
 }
 deleteMeshes(){
  for(const mesh of this.meshes){for(const a of Object.values(mesh.attributes))this.gl.deleteBuffer(a.buffer);this.gl.deleteBuffer(mesh.indices);}
  this.meshes=[];
 }
 renderMesh(mesh:Mesh,color:number[],pass=0){
  const gl=this.gl;
  for(const [name,{buffer,size}] of Object.entries(mesh.attributes)){
   if(this.locations[name]<0)continue;
   gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(this.locations[name]);gl.vertexAttribPointer(this.locations[name],size,gl.FLOAT,false,0,0);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.indices);gl.uniform3fv(this.uniforms.uColor,color);gl.uniform1f(this.uniforms.uPass,pass);
  gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);
 }
 changeZoom(amount:number){
  this.targetZoom=Math.max(1,Math.min(3,this.targetZoom+amount));
  this.updateZoomControls();this.schedule();
 }
 updateZoomControls(){
  const out=this.querySelector<HTMLButtonElement>('[data-zoom="out"]'),inn=this.querySelector<HTMLButtonElement>('[data-zoom="in"]');
  if(out)out.disabled=this.targetZoom<=1;if(inn)inn.disabled=this.targetZoom>=3;
  const status=this.querySelector<HTMLOutputElement>('[data-zoom-status]');
  if(status)status.textContent=this.dataset.zoomLabel!.replace('{{percent}}',String(Math.round(this.targetZoom*100)));
 }
 /** Points the camera; yaw and pitch use the left-hemisphere convention of the region data. */
 startIdle(){
  this.screen=new IntersectionObserver(entries=>{this.onScreen=entries.some(entry=>entry.isIntersecting);});this.screen.observe(this);
  const stop=()=>{this.idle=false;};
  const options={signal:this.abort!.signal};
  for(const type of ['pointerdown','keydown','wheel'])this.canvas.addEventListener(type,stop,options);
  this.addEventListener('click',event=>{if((event.target as Element).closest('button'))stop();},options);
  const start=performance.now();
  const tick=(time:number)=>{
   if(!this.idle||!this.ready)return;
   if(this.onScreen&&!this.reduced&&!document.hidden){this.targetYaw=this.baseYaw+Math.sin((time-start)/2600)*.35;this.schedule();}
   this.idleFrame=requestAnimationFrame(tick);
  };
  this.idleFrame=requestAnimationFrame(tick);
 }
 look(yaw:number,pitch:number,zoom=1){
  this.baseYaw=yaw;
  this.targetYaw=yaw;this.targetPitch=Math.max(-this.maxPitch,Math.min(this.maxPitch,pitch));this.targetZoom=zoom;
  this.updateZoomControls();this.schedule();
 }
 updateOrientation(){
  const view=viewName(this.yaw,this.hemisphere,this.pitch),key=`${this.hemisphere}:${view}`;
  if(this.viewKey!==key){this.viewKey=key;this.dataset.view=view;this.viewChanged(view);}
  const cosine=Math.cos(this.yaw),aspect=this.canvas.clientWidth/this.canvas.clientHeight||1.5;
  const points:Record<string,[number,number,number]>={front:[0,1.03,0],back:[0,-1.03,0],top:[0,0,.78]};
  for(const [name,point] of Object.entries(points)){
   const label=this.querySelector<HTMLElement>(`[data-landmark="${name}"]`);if(!label)continue;
   const [x,y]=rotateBrainPoint(point,this.yaw,this.pitch);
   const left=50+(x-this.viewOffset[0])*this.zoom/aspect*50,top=50-(y-this.viewOffset[1])*this.zoom*50;
   label.style.left=`${Math.max(10,Math.min(90,left))}%`;
   label.style.top=`${Math.max(8,Math.min(92,top))}%`;
   // In a face-on view these endpoints overlap. The orientation sentence takes over.
   label.hidden=(name!=='top'&&Math.abs(cosine)<.35)||(name==='top'&&this.pitch<-.45)||(this.zoom>1.05&&(left<5||left>95||top<5||top>95));
  }
 }
 bindControls(options:AddEventListenerOptions){
  this.querySelectorAll<HTMLButtonElement>('[data-hemisphere-choice]').forEach(button=>button.addEventListener('click',()=>this.setHemisphere(button.dataset.hemisphereChoice as HemisphereChoice),options));
  this.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach(button=>button.addEventListener('click',()=>this.changeZoom(button.dataset.zoom==='in'?.25:-.25),options));
  this.canvas.addEventListener('pointerdown',event=>{this.drag={x:event.clientX,y:event.clientY};this.canvas.setPointerCapture(event.pointerId);},options);
  this.canvas.addEventListener('pointermove',event=>{
   if(!this.drag)return;this.targetYaw+=(event.clientX-this.drag.x)*.008;
   this.targetPitch=Math.max(-this.maxPitch,Math.min(this.maxPitch,this.targetPitch+(event.clientY-this.drag.y)*.008));
   this.drag={x:event.clientX,y:event.clientY};this.schedule();
  },options);
  this.canvas.addEventListener('pointerup',()=>{this.drag=undefined;},options);
  this.canvas.addEventListener('pointercancel',()=>{this.drag=undefined;},options);
  this.canvas.addEventListener('keydown',event=>{
   if(['+','=','-','0'].includes(event.key)){
    event.preventDefault();if(event.key==='0')this.resetView();else this.changeZoom(event.key==='-'?-.25:.25);return;
   }
   if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();
   this.targetYaw+=(event.key==='ArrowRight'?.15:event.key==='ArrowLeft'?-.15:0);
   this.targetPitch=Math.max(-this.maxPitch,Math.min(this.maxPitch,this.targetPitch+(event.key==='ArrowDown'?.15:event.key==='ArrowUp'?-.15:0)));this.schedule();
  },options);
  this.canvas.addEventListener('wheel',event=>{
   if(!event.ctrlKey)return;event.preventDefault();this.changeZoom(-event.deltaY*.01);
  },{...options,passive:false});
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change',()=>{this.reduced=motion.matches;this.schedule();},options);
 }
 schedule(){if(this.ready&&!this.frame)this.frame=requestAnimationFrame(()=>this.draw());}
 draw(){
  this.frame=0;const blend=this.reduced?1:.18;
  this.yaw+=(this.targetYaw-this.yaw)*blend;this.pitch+=(this.targetPitch-this.pitch)*blend;this.zoom+=(this.targetZoom-this.zoom)*blend;
  const rotatedCenter=rotateBrainPoint(this.center,this.yaw,this.pitch),focusAmount=Math.min(1,this.zoom-1);
  this.viewOffset=rotatedCenter.slice(0,2).map(value=>value*focusAmount);
  const rect=this.canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,2),width=Math.round(rect.width*ratio),height=Math.round(rect.height*ratio);
  if(!width||!height)return;
  if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
  const gl=this.gl;gl.viewport(0,0,width,height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.uniform1f(this.uniforms.uYaw,this.yaw);gl.uniform1f(this.uniforms.uPitch,this.pitch);gl.uniform1f(this.uniforms.uZoom,this.zoom);gl.uniform2fv(this.uniforms.uFocus,this.viewOffset);gl.uniform1f(this.uniforms.uAspect,rect.width/rect.height);
  gl.uniform3fv(this.uniforms.uLow,this.low);gl.uniform3fv(this.uniforms.uHigh,this.high);
  gl.uniform1f(this.uniforms.uTone,this.shading.tone);gl.uniform1f(this.uniforms.uAlpha,this.shading.alpha);gl.uniform1f(this.uniforms.uContext,this.shading.context);
  const cortex=this.meshes.filter(m=>m.kind==='cortex'),hippocampus=this.showHippocampus?this.meshes.filter(m=>m.kind==='hippocampus'):[];
  if(this.seeThrough){
   // Hidden anatomy and highlighted regions first, solid.
   hippocampus.forEach(m=>this.renderMesh(m,this.hippocampusColor(m)));
   cortex.forEach(m=>this.renderMesh(m,this.color,2));
   // Then the nearest cortical surface, blended once over everything behind it, so deeper
   // structures are washed out a little instead of shining through like glass. Blending
   // unsorted folded triangles would make a patchwork of opacity, hence the depth prepass.
   gl.colorMask(false,false,false,false);
   cortex.forEach(m=>this.renderMesh(m,this.color,1));
   gl.colorMask(true,true,true,true);gl.depthMask(false);gl.depthFunc(gl.EQUAL);gl.enable(gl.BLEND);
   cortex.forEach(m=>this.renderMesh(m,this.color,3));
   gl.depthMask(true);gl.depthFunc(gl.LESS);gl.disable(gl.BLEND);
  } else {
   hippocampus.forEach(m=>this.renderMesh(m,this.hippocampusColor(m)));
   cortex.forEach(m=>this.renderMesh(m,this.color));
  }
  this.updateOrientation();
  if(Math.abs(this.targetYaw-this.yaw)+Math.abs(this.targetPitch-this.pitch)+Math.abs(this.targetZoom-this.zoom)>.002)this.schedule();
 }
}
