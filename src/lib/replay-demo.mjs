import { copy } from "./site-copy.mjs";
// An explanatory simulation, not a model fit or a reconstruction of recorded
// replay. Only the assumed selection rule changes across the four conditions.
export const replayEdges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
// Each sequence revisits two relationships and can prepare a direct comparison
// between its endpoints. The middle item is distinct from both endpoints.
export const replaySequences = replayEdges.flatMap(([a,c]) =>
  [0,1,2,3].filter(b=>b!==a&&b!==c).map(b=>[a,b,c])
);
export function sequenceEdges([a,b,c]) {
  const edge=(from,to)=>replayEdges.findIndex(pair=>pair.includes(from)&&pair.includes(to));
  return [edge(a,b),edge(b,c),edge(a,c)];
}
export const initialStrengths = () => [.12,.08,.18,.10,.07,.14];
export const replayPolicies = {
  broad: {label:copy("ui.replay-demo.sample-broadly"), description:copy("replay.broad.description")},
  reward: {label:copy("ui.replay-demo.favor-rewarding-options"), description:copy("replay.reward.description")},
  uncertain: {label:copy("ui.replay-demo.favor-uncertain-links"), description:copy("replay.uncertain.description")},
  bridge: {label:copy("ui.replay-demo.connect-the-dimensions"), description:copy("replay.bridge.description")},
};
export function chooseReplay(strengths, policy, random = Math.random) {
  const weights = replaySequences.map(sequence => {
    const edge=sequenceEdges(sequence)[2], [a,,c]=sequence;
    return policy==='reward' ? (a===2||c===2?5:1) : policy==='uncertain' ? (1-strengths[edge])**3+.01 : policy==='bridge' ? ([0,2,5].includes(edge)?5:1) : 1;
  });
  let target = random()*weights.reduce((a,b)=>a+b,0);
  for(let i=0;i<weights.length;i++){target-=weights[i];if(target<0)return i;}
  return weights.length-1;
}
export function reinforce(strengths, edge) {
  return strengths.map((value,i)=>i===edge?value+.24*(1-value):value);
}
export function reinforceSequence(strengths, sequence) {
  return sequenceEdges(sequence).reduce((state,edge)=>reinforce(state,edge),strengths);
}
export function nodeClarity(strengths,node) {
  const linked=strengths.filter((_,i)=>replayEdges[i].includes(node));
  return linked.reduce((sum,value)=>sum+value,0)/linked.length;
}

// The animation and reduced-motion version follow the same small state machine.
// The first completed sequence always pauses so its inferred shortcut can be read.
export class ReplayActivity {
  constructor(){this.reset();}
  reset(){
    this.strengths=initialStrengths();this.replays=0;this.phase=0;
    this.sequence=null;this.remaining=0;this.checkpoint=false;this.practiceCounts=Array(6).fill(0);
  }
  start(count=12){this.checkpoint=false;if(!this.remaining)this.remaining=count;}
  advance(policy='broad',random=Math.random){
    if(!this.remaining||this.checkpoint)return false;
    if(this.phase===0||this.phase===3){
      this.sequence=this.replays===0?[0,1,2]:replaySequences[chooseReplay(this.strengths,policy,random)];
      this.phase=1;
    } else if(this.phase===1){this.phase=2;}
    else {
      this.phase=3;this.strengths=reinforceSequence(this.strengths,this.sequence);
      for(const edge of sequenceEdges(this.sequence))this.practiceCounts[edge]++;
      this.replays++;this.remaining--;this.checkpoint=this.replays===1;
    }
    return this.remaining>0&&!this.checkpoint;
  }
  visibleStrengths(){
    if(!this.sequence||this.phase===3)return this.strengths;
    return sequenceEdges(this.sequence).slice(0,this.phase).reduce((state,edge)=>reinforce(state,edge),this.strengths);
  }
}
