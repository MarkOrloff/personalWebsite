import {copy} from '../lib/site-copy.mjs';
// These are anatomical orientation aids. The linked studies contain the measured results.
const words = (id:string) => ({
 name:copy(`explorer.${id}.name`), short:copy(`explorer.${id}.short`),
 question:copy(`explorer.${id}.question`), text:copy(`explorer.${id}.text`),
 legend:copy(`explorer.${id}.legend`),
});
// yaw/pitch describe the left-half camera; the right half uses the mirror image. With both halves
// showing, `both` sets the camera instead. `midline` regions line the inner face of each half, where
// the halves meet. The surface is always see-through (src/scripts/brain-explorer.ts).
// Listed front to back, by where each region's center sits along the front-back axis.
export const favoriteRegions=[
 {id:'mpfc',...words('mpfc'),color:'#a98bf5',yaw:0,pitch:.06,midline:true,both:{yaw:-Math.PI/2,pitch:.15},studies:[
  {title:copy('subjective-value.title'),href:'/publications/subjective-value'},
  {title:copy('smell-and-space.title'),href:'/publications/smell-and-space'},
 ]},
 {id:'vmpfc',...words('vmpfc'),color:'#ff6b6b',yaw:0,pitch:.06,midline:true,both:{yaw:-Math.PI/2,pitch:.15},studies:[
  {title:copy('safer-peers.title'),href:'/publications/safer-peers'},
  {title:copy('subjective-value.title'),href:'/publications/subjective-value'},
 ]},
 {id:'acc',...words('acc'),color:'#d6c481',yaw:0,pitch:.06,midline:true,both:{yaw:-Math.PI/2,pitch:.15},studies:[
  {title:copy('social-conformity.page.title'),href:'/publications/social-conformity'},
 ]},
 {id:'insula',...words('insula'),color:'#6ea8fe',yaw:Math.PI,pitch:.06,midline:false,both:{yaw:Math.PI,pitch:.06},studies:[
  {title:copy('social-conformity.page.title'),href:'/publications/social-conformity'},
 ]},
 {id:'ec',...words('ec'),color:'#77c9b0',yaw:-.15,pitch:-.25,midline:false,both:{yaw:-Math.PI/2,pitch:-.75},studies:[
  {title:copy('subjective-value.title'),href:'/publications/subjective-value'},
  {title:copy('smell-and-space.title'),href:'/publications/smell-and-space'},
 ]},
 {id:'hc',...words('hc'),color:'#e5b96b',yaw:0,pitch:.06,midline:false,both:{yaw:-Math.PI/2,pitch:.15},studies:[
  {title:copy('maps-at-rest.title'),href:'/publications/maps-at-rest'},
 ]},
];
