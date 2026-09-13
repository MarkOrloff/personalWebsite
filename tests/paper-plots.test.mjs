import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { peerLayout, gambles, displayGambles, probabilityWeight, valueCoordinates, valueLayout, odorLayout, restLayout, restRoute } from '../src/lib/paper-plots.mjs';
const data=JSON.parse(readFileSync(new URL('../src/data/peer-influence.json',import.meta.url)));
test('the PNAS reader preserves the 78 published pairs and group summaries',()=>{
  assert.equal(data.participants.length,78);
  assert.deepEqual(data.groups.map(g=>g.n),[46,32]);
  for(const width of [240,320,520]){
    const safe=peerLayout(data,width,'safe'),risky=peerLayout(data,width,'risky');
    assert.deepEqual(safe.points.map(p=>p.id),risky.points.map(p=>p.id));
    assert.ok(Math.abs(safe.means[0].mean-.6641019319884421)<1e-12);
    assert.ok(Math.abs(risky.means[1].mean-.5192016248826206)<1e-12);
    for(const l of [safe,risky])for(const p of l.points){assert.ok(p.x>=l.left&&p.x<=l.right);assert.ok(p.y>=l.top&&p.y<=l.bottom);}
  }
});
test('subjective transforms preserve endpoints, identity, and option identities',()=>{
  assert.equal(gambles.length,88);
  assert.equal(displayGambles.length,100);
  assert.deepEqual(displayGambles[0],{id:"gamble-0",p:.1,a:1});
  assert.deepEqual(displayGambles.at(-1),{id:"gamble-99",p:1,a:10});
  assert.equal(new Set(gambles.map(p=>p.id)).size,88);
  for(const alpha of [.35,.7,1,1.8])for(const rho of [.35,.65,1,1.8]){
    assert.deepEqual(valueCoordinates(.1,1,alpha,rho),{x:0,y:0});
    assert.deepEqual(valueCoordinates(1,10,alpha,rho),{x:1,y:1});
    const coords=gambles.map(p=>valueCoordinates(p.p,p.a,alpha,rho));
    assert.ok(coords.every(p=>p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1));
  }
  assert.ok(probabilityWeight(.1,.7)>.1);
  assert.ok(probabilityWeight(.8,.7)<.8);
  const objective=valueLayout(520,'objective'),identity=valueLayout(520,'subjective',1,1),subjective=valueLayout(520,'subjective',.7,.65);
  assert.equal(objective.points.length,100);
  for (const p of objective.points) { assert.ok(p.x > objective.left && p.x < objective.right); assert.ok(p.y > objective.top && p.y < objective.bottom); }
  assert.deepEqual(objective.points,identity.points);
  assert.notEqual(objective.angle,subjective.angle);
  assert.deepEqual(objective.chosen.map(({p,a})=>({p,a})),subjective.chosen.map(({p,a})=>({p,a})));
});
test('conceptual maps preserve geometry across sensory cues and identity across rankings',()=>{
  for(const target of [0,1,2,3]){
    const visual=odorLayout(520,'landmarks',target),odor=odorLayout(520,'odors',target);
    assert.equal(visual.distance,odor.distance);
    assert.deepEqual(visual.points.map(({x,y})=>({x,y})),odor.points.map(({x,y})=>({x,y})));
  }
  const pieces=restLayout(520,'pieces'),map=restLayout(520,'map');
  const inference=restLayout(520,'inference',2);
  assert.equal(restRoute(inference,'memory').links,3);
  assert.equal(restRoute(inference,'map').links,1);
  assert.equal(restRoute(inference,'memory').path.split('L').at(-1),restRoute(inference,'map').path.split('L').at(-1));
  assert.deepEqual(pieces.points.map(p=>p.id),map.points.map(p=>p.id));
  for(let i=0;i<4;i++){assert.equal(map.points[i].x,map.points[i+4].x);assert.equal(map.points[i].y,map.points[i+4].y);}
});
