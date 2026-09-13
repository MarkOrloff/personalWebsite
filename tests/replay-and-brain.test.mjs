import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {peerLayout} from '../src/lib/paper-plots.mjs';
import {initialStrengths,chooseReplay,reinforce,nodeClarity} from '../src/lib/replay-demo.mjs';
const brain=JSON.parse(readFileSync(new URL('../src/data/peer-brain.json',import.meta.url)));
const behavior=JSON.parse(readFileSync(new URL('../src/data/peer-influence.json',import.meta.url)));
test('PNAS brain subset retains participant identity, source means, sample counts and fixed axes',()=>{
 assert.equal(brain.participants.length,31);
 for(const p of brain.participants)assert.equal(behavior.participants.find(b=>b.id===p.id).group,p.group);
 for(const width of [240,320,520]){
  const safe=peerLayout(brain,width,'safe',true),risky=peerLayout(brain,width,'risky',true);
  assert.deepEqual(safe.means.map(g=>g.n),[15,16]);
  assert.ok(Math.abs(safe.means[0].mean-.25620958238857017)<1e-12);
  assert.ok(Math.abs(safe.means[1].mean+.2836302520397914)<1e-12);
  assert.deepEqual(safe.points.map(p=>p.x),risky.points.map(p=>p.x));
  assert.equal(safe.y(0),risky.y(0));
  for(const l of [safe,risky])for(const p of l.points){assert.ok(p.x>=l.left&&p.x<=l.right);assert.ok(p.y>=l.top&&p.y<=l.bottom);}
 }
});
test('replay changes only the selected connection and keeps strengths bounded',()=>{
 let state=initialStrengths();
 for(let i=0;i<200;i++){
  const edge=i%6,next=reinforce(state,edge);
  next.forEach((v,j)=>{assert.ok(v>=state[j]&&v<=1);if(j!==edge)assert.equal(v,state[j]);});
  state=next;
  for(let node=0;node<4;node++)assert.ok(nodeClarity(state,node)>=0&&nodeClarity(state,node)<=1);
 }
});
test('replay priorities change selection without changing the strengthening rule',()=>{
 // Integrate each categorical distribution with evenly spaced unit samples.
 function frequencies(policy,strengths=initialStrengths()){
  const counts=Array(6).fill(0);for(let i=0;i<1800;i++)counts[chooseReplay(strengths,policy,()=> (i+.5)/1800)]++;return counts;
 }
 assert.deepEqual(frequencies('broad'),[300,300,300,300,300,300]);
 const reward=frequencies('reward');assert.ok(reward[1]>reward[0]*4.9);assert.ok(reward[3]>reward[2]*4.9);
 const uncertain=frequencies('uncertain',[.05,.9,.9,.9,.9,.9]);assert.ok(uncertain[0]>1500);
 const bridge=frequencies('bridge');assert.ok(bridge[0]>bridge[1]*4.9);assert.ok(bridge[5]>bridge[4]*4.9);
});
