import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {peerLayout} from '../src/lib/paper-plots.mjs';
import {initialStrengths,chooseReplay,replaySequences,sequenceEdges,reinforceSequence,nodeClarity,ReplayActivity,replayLearningRate,replayFade,fadedStrength,expectedStrengths,replayEdges} from '../src/lib/replay-demo.mjs';
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
test('a replayed chain strengthens its direct endpoint comparison while unrelated links fade slightly',()=>{
 for(const sequence of replaySequences){
  let state=initialStrengths();const edges=sequenceEdges(sequence);
  assert.equal(new Set(edges).size,3);
  for(let i=0;i<100;i++){
   const next=reinforceSequence(state,sequence);
   next.forEach((value,j)=>{
    assert.ok(value<=1&&value>=fadedStrength);
    assert.equal(value,edges.includes(j)?state[j]+replayLearningRate*(1-state[j]):fadedStrength+(state[j]-fadedStrength)*(1-replayFade));
   });
   state=next;
   for(let node=0;node<4;node++)assert.ok(nodeClarity(state,node)>=0&&nodeClarity(state,node)<=1);
  }
 }
 const original=initialStrengths(),after=reinforceSequence(original,[0,1,2]);
 assert.ok(after[1]>original[1],'a–c is strengthened by an a–b–c replay');
 for(const j of [2,4,5])assert.ok(after[j]<original[j]&&after[j]>fadedStrength,'connections to d fade slightly but stay visible');
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

test('side-by-side strategy maps show what each strategy says it does',()=>{
 const maps=Object.fromEntries(['broad','reward','uncertain','bridge'].map(p=>[p,expectedStrengths(p)]));
 const order=s=>s.map((_,i)=>i).sort((a,b)=>s[b]-s[a]);
 const spread=s=>Math.max(...s)-Math.min(...s), mean=(s,edges)=>edges.reduce((sum,i)=>sum+s[i],0)/edges.length;
 // favor rewarding: c's three links are the strongest
 assert.ok(order(maps.reward).slice(0,3).every(i=>replayEdges[i].includes(2)));
 // connect the dimensions: links between places that trade off food and service end up stronger, a–d strongest
 const bridge=[0,2,5],other=[1,3,4];
 assert.ok(mean(maps.bridge,bridge)>mean(maps.bridge,other));assert.equal(order(maps.bridge)[0],2);
 // favor uncertain: the flattest map
 for(const p of ['broad','reward','bridge'])assert.ok(spread(maps.uncertain)<spread(maps[p]),p);
 // sample broadly: the opening a → b → c keeps its head start
 assert.deepEqual(order(maps.broad).slice(0,3).sort(),[0,1,3]);
});
