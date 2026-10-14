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
// How strongly each strategy favors each three-place sequence, given the current map.
export function replayWeights(strengths, policy) {
  return replaySequences.map(sequence => {
    const edge=sequenceEdges(sequence)[2], [a,,c]=sequence;
    return policy==='reward' ? (a===2||c===2?5:1) : policy==='uncertain' ? (1-strengths[edge])**3+.01 : policy==='bridge' ? ([0,2,5].includes(edge)?5:1) : 1;
  });
}
export function chooseReplay(strengths, policy, random = Math.random) {
  const weights = replayWeights(strengths, policy);
  let target = random()*weights.reduce((a,b)=>a+b,0);
  for(let i=0;i<weights.length;i++){target-=weights[i];if(target<0)return i;}
  return weights.length-1;
}
// A slow rate keeps links visibly different after a dozen replays instead of all saturating.
export const replayLearningRate = .14;
export function reinforce(strengths, edge) {
  return strengths.map((value,i)=>i===edge?value+replayLearningRate*(1-value):value);
}
// Thin, faint lines for new links; a curved scale spreads strong and weak links apart.
export const replayLinkWidth = strength => .5 + 10 * strength ** 1.8;
// Links a replay doesn't visit fade slightly toward a faint baseline, so what gets replayed
// keeps mattering instead of every link eventually reaching full strength.
export const replayFade = .06;
export const fadedStrength = .05;
export function reinforceSequence(strengths, sequence) {
  const edges=sequenceEdges(sequence);
  const faded=strengths.map((value,i)=>edges.includes(i)?value:fadedStrength+(value-fadedStrength)*(1-replayFade));
  return edges.reduce((state,edge)=>reinforce(state,edge),faded);
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

// The average map after the opening a → b → c and a break of replays: each step averages every
// possible replay by how likely the strategy is to pick it. Used to compare strategies side by side,
// so the comparison shows each strategy's tendency rather than one lucky or unlucky break.
export function expectedStrengths(policy, replays = 10) {
  let strengths = reinforceSequence(initialStrengths(), [0,1,2]);
  for (let step = 0; step < replays; step++) {
    const weights = replayWeights(strengths, policy), total = weights.reduce((sum, w) => sum + w, 0);
    const next = Array(strengths.length).fill(0);
    replaySequences.forEach((sequence, i) => reinforceSequence(strengths, sequence).forEach((value, edge) => { next[edge] += weights[i] / total * value; }));
    strengths = next;
  }
  return strengths;
}
