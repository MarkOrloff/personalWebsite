import { gambles, probabilityWeight, valuePairs } from './paper-plots.mjs';

// Website adaptation of ValueGridCode/task/getOfferValue.m and
// updatePosteriorParams.m: select a tradeoff by expected information gain,
// then multiply the prior by the choice likelihood. The lab routine estimated
// rho only. This small, regularized demonstration includes Prelec alpha too.
export const CHOICE_COUNT = 5;
export const unseenPair = valuePairs[1];
const levels = Array.from({length:30}, (_, i) => Number((.35 + i*.05).toFixed(2)));
export const preferenceGrid = levels.flatMap(alpha => levels.map(rho => ({alpha,rho})));
const key = o => `${o.p}:${o.a}`;
const heldOut = new Set(unseenPair.map(key));
const options = gambles.filter(o => o.p < 1 && !heldOut.has(key(o)));
// Thin the candidate pool deterministically for a small, fast browser demo.
// All offers remain within the study's probability and amount ranges.
export const questions = options.flatMap((a,i) => options.slice(i+1).filter(b =>
  (a.p-b.p)*(a.a-b.a)<0 && Math.abs(a.p-b.p)>=.2 && Math.abs(a.a-b.a)>=2
).map(b => ({id:`${key(a)}|${key(b)}`,options:[a,b]}))).filter((_,i)=>i%4===0).map((q,i)=>({...q,options:i%2?[...q.options].reverse():q.options}));
export const subjectiveValue = (o,alpha,rho) => probabilityWeight(o.p,alpha)*(o.a/10)**rho;
const logistic = value => 1/(1+Math.exp(-value));
// Fixed noise level is a demo assumption, not a fitted laboratory parameter.
const likelihoods = questions.map(q => Float64Array.from(preferenceGrid, ({alpha,rho}) =>
  logistic(8*(subjectiveValue(q.options[0],alpha,rho)-subjectiveValue(q.options[1],alpha,rho)))
));
const normalize = weights => {const sum=weights.reduce((a,b)=>a+b,0);return weights.map(w=>w/sum);};
export const initialPosterior = () => normalize(Float64Array.from(preferenceGrid, ({alpha,rho}) =>
  Math.exp(-.5*((Math.log(alpha)/.5)**2+(Math.log(rho)/.5)**2))/(alpha*rho)
));
export function updatePosterior(weights, question, choice) {
  const index=questions.findIndex(q=>q.id===question.id);
  if(index<0 || ![0,1].includes(choice)) throw new Error('Invalid demo choice');
  return normalize(weights.map((w,i)=>w*(choice===0?likelihoods[index][i]:1-likelihoods[index][i])));
}
const binaryEntropy = p => -p*Math.log2(p)-(1-p)*Math.log2(1-p);
export function nextQuestion(weights, used=[]) {
  let best, bestGain=-Infinity;
  for(let q=0;q<questions.length;q++) {
    if(used.includes(questions[q].id)) continue;
    const chance=likelihoods[q].reduce((sum,p,i)=>sum+weights[i]*p,0);
    const gain=binaryEntropy(chance)-likelihoods[q].reduce((sum,p,i)=>sum+weights[i]*binaryEntropy(p),0);
    if(gain>bestGain){bestGain=gain;best=questions[q];}
  }
  return best;
}
export function estimatePreferences(weights) {
  // Posterior means rounded to the slider's 0.05 step; no precise risk profile.
  const average = key => Math.round(weights.reduce((sum,w,i)=>sum+w*preferenceGrid[i][key],0)*20)/20;
  return {alpha:average('alpha'),rho:average('rho')};
}
export function replayAnswers(answers) {
  let weights=initialPosterior();
  for(const answer of answers) weights=updatePosterior(weights,answer.question,answer.choice);
  return weights;
}
export function predictChoice(options,alpha,rho) {
  const values=options.map(o=>subjectiveValue(o,alpha,rho));
  return Math.abs(values[0]-values[1])<.015 ? null : values[0]>values[1]?0:1;
}
