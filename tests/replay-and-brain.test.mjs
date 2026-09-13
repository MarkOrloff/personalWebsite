import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {peerLayout} from '../src/lib/paper-plots.mjs';
import {initialStrengths,chooseReplay,replaySequences,sequenceEdges,reinforceSequence,nodeClarity,ReplayActivity} from '../src/lib/replay-demo.mjs';
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
test('a replayed chain strengthens its direct endpoint comparison and no unrelated links',()=>{
 for(const sequence of replaySequences){
  let state=initialStrengths();const edges=sequenceEdges(sequence);
  assert.equal(new Set(edges).size,3);
  for(let i=0;i<100;i++){
   const next=reinforceSequence(state,sequence);
   next.forEach((value,j)=>{
    assert.ok(value>=state[j]&&value<=1);
    assert.equal(value,edges.includes(j)?state[j]+.24*(1-state[j]):state[j]);
   });
   state=next;
   for(let node=0;node<4;node++)assert.ok(nodeClarity(state,node)>=0&&nodeClarity(state,node)<=1);
  }
 }
 const original=initialStrengths(),after=reinforceSequence(original,[0,1,2]);
 assert.ok(after[1]>original[1],'a–c is strengthened by an a–b–c replay');
 assert.deepEqual([after[2],after[4],after[5]],[original[2],original[4],original[5]],'connections to d are untouched');
});
test('replay priorities select sequences by their endpoint comparison',()=>{
 function frequencies(policy,strengths=initialStrengths()){
  const counts=Array(12).fill(0);
  for(let i=0;i<2400;i++)counts[chooseReplay(strengths,policy,()=> (i+.5)/2400)]++;
  return counts;
 }
 assert.deepEqual(frequencies('broad'),Array(12).fill(200));
 const reward=frequencies('reward');assert.ok(reward[2]>reward[0]*4.9);
 const uncertain=frequencies('uncertain',[.05,.9,.9,.9,.9,.9]);assert.ok(uncertain[0]+uncertain[1]>2000);
 const bridge=frequencies('bridge');assert.ok(bridge[0]>bridge[2]*4.9);assert.ok(bridge[10]>bridge[8]*4.9);
});
test('the first replay pauses on the inferred shortcut and resuming completes exactly twelve sequences',()=>{
 const activity=new ReplayActivity(),initial=initialStrengths();activity.start();
 assert.equal(activity.advance(),true);assert.equal(activity.phase,1);
 assert.deepEqual(activity.strengths,initial);assert.ok(activity.visibleStrengths()[0]>initial[0]);
 assert.equal(activity.visibleStrengths()[1],initial[1]);
 assert.equal(activity.advance(),true);assert.equal(activity.phase,2);
 assert.ok(activity.visibleStrengths()[3]>initial[3]);assert.equal(activity.visibleStrengths()[1],initial[1]);
 assert.equal(activity.advance(),false);assert.equal(activity.phase,3);
 assert.equal(activity.replays,1);assert.equal(activity.remaining,11);assert.equal(activity.checkpoint,true);
 assert.deepEqual(activity.practiceCounts,[1,1,0,1,0,0]);
 const paused=JSON.stringify(activity);assert.equal(activity.advance(),false);assert.equal(JSON.stringify(activity),paused);
 activity.start();let phases=0;
 do{phases++;}while(activity.advance('broad',()=>.4));
 assert.equal(phases,33);assert.equal(activity.replays,12);assert.equal(activity.remaining,0);
 assert.equal(activity.practiceCounts.reduce((sum,n)=>sum+n,0),36);
 activity.reset();assert.deepEqual(activity.strengths,initial);assert.deepEqual(activity.practiceCounts,Array(6).fill(0));
 assert.equal(activity.sequence,null);assert.equal(activity.replays,0);
});
test('a paused partial sequence resumes without selecting a new route or duplicating an event',()=>{
 const activity=new ReplayActivity();activity.start(1);activity.advance();
 const sequence=activity.sequence;activity.start();activity.advance();
 assert.equal(activity.sequence,sequence);assert.equal(activity.phase,2);assert.equal(activity.replays,0);
 activity.advance();assert.equal(activity.replays,1);assert.equal(activity.remaining,0);
});
