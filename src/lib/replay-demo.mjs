import { copy } from "./site-copy.mjs";
// An explanatory simulation, not a model fit or a reconstruction of recorded
// replay. Only the assumed selection rule changes across the four conditions.
export const replayEdges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
export const initialStrengths = () => [.12,.08,.18,.10,.07,.14];
export const replayPolicies = {
  broad: {label:copy("ui.replay-demo.sample-broadly"), description:copy("replay.broad.description")},
  reward: {label:copy("ui.replay-demo.favor-rewarding-options"), description:copy("replay.reward.description")},
  uncertain: {label:copy("ui.replay-demo.favor-uncertain-links"), description:copy("replay.uncertain.description")},
  bridge: {label:copy("ui.replay-demo.connect-the-dimensions"), description:copy("replay.bridge.description")},
};
export function chooseReplay(strengths, policy, random = Math.random) {
  const weights = replayEdges.map(([a,b],i) => policy==='reward' ? (a===2||b===2?5:1) : policy==='uncertain' ? (1-strengths[i])**3+.01 : policy==='bridge' ? ([0,2,5].includes(i)?5:1) : 1);
  let target = random()*weights.reduce((a,b)=>a+b,0);
  for(let i=0;i<weights.length;i++){target-=weights[i];if(target<0)return i;}
  return weights.length-1;
}
export function reinforce(strengths, edge) {
  return strengths.map((value,i)=>i===edge?value+.24*(1-value):value);
}
export function nodeClarity(strengths, node) {
  const linked=strengths.filter((_,i)=>replayEdges[i].includes(node));
  return linked.reduce((a,b)=>a+b,0)/linked.length;
}
