import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, initialPosterior, nextQuestion, updatePosterior, estimatePreferences, replayAnswers, unseenPair, subjectiveValue } from '../src/lib/value-calibration.mjs';
import { valueCoordinates } from '../src/lib/paper-plots.mjs';

test('all five-choice branches adapt, remain finite, and reserve the new options',()=>{
  const keys=new Set(unseenPair.map(o=>`${o.p}:${o.a}`));
  for(const q of questions){
    const [a,b]=q.options;assert.ok((a.p-b.p)*(a.a-b.a)<0,'every pair must involve a tradeoff');
    assert.ok(q.options.every(o=>!keys.has(`${o.p}:${o.a}`)),'neither new option may appear during estimation');
  }
  const initial=initialPosterior(),first=nextQuestion(initial);
  assert.notEqual(nextQuestion(updatePosterior(initial,first,0),[first.id]).id,nextQuestion(updatePosterior(initial,first,1),[first.id]).id);
  const fits=new Set();
  for(let branch=0;branch<32;branch++){
    let weights=initialPosterior(),answers=[];
    for(let step=0;step<5;step++){
      const question=nextQuestion(weights,answers.map(a=>a.question.id)),choice=(branch>>step)&1;
      answers.push({question,choice});weights=updatePosterior(weights,question,choice);
    }
    assert.equal(new Set(answers.map(a=>a.question.id)).size,5);
    assert.ok(weights.every(w=>Number.isFinite(w)&&w>0));
    assert.ok(Math.abs(weights.reduce((a,b)=>a+b,0)-1)<1e-10);
    assert.deepEqual(replayAnswers(answers),weights,'undo/replay preserves the estimate');
    const {alpha,rho}=estimatePreferences(weights);fits.add(`${alpha}:${rho}`);
    for(const value of [alpha,rho])assert.ok(value>=.35&&value<=1.8);
    for(const o of unseenPair){const c=valueCoordinates(o.p,o.a,alpha,rho);assert.ok(c.x>=0&&c.x<=1&&c.y>=0&&c.y<=1);}
    assert.ok(Math.max(...weights)<.1,'five answers retain many possible maps');
  }
  assert.ok(fits.size>16,'answers should produce meaningfully different sketches');
});
test('value predictions use the fitted functions, not a previously chosen option',()=>{
  assert.equal(subjectiveValue({p:.5,a:8},1,1),.4);
  const {alpha,rho}=estimatePreferences(initialPosterior());
  assert.notEqual(subjectiveValue(unseenPair[0],alpha,rho),subjectiveValue(unseenPair[1],alpha,rho));
});
