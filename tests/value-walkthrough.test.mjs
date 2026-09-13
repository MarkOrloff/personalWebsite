import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ValueSession, examplePreferences } from '../src/lib/value-walkthrough.mjs';
import { unseenPair, predictChoice } from '../src/lib/value-calibration.mjs';

test('five answers remain ordered and survive every illustrative scene without changing their fit', () => {
  const s = new ValueSession();
  for (const choice of [0,1,0,0,1]) assert.ok(s.choose(choice));
  assert.equal(s.choose(0), false);
  assert.equal(s.scene, 'game'); // Completing the quiz does not advance the story.
  const fit = {...s.fit}, answers = structuredClone(s.answers);
  s.enter('place-a'); assert.deepEqual(s.pair, answers[0].question.options);
  s.enter('review');
  for (let i=0;i<5;i++) {
    assert.deepEqual(s.review, answers[i]);
    assert.equal(s.advance(1), i<4);
  }
  s.enter('new'); assert.deepEqual(s.pair, unseenPair);
  for (const view of ['reliable','adventurous','personal','brain']) {
    s.enter(view); assert.deepEqual(s.fit, fit); assert.deepEqual(s.answers, answers);
  }
  s.restore(new URLSearchParams('alpha=1.8&rho=1.8&choice=3'));
  assert.deepEqual(s.fit, fit); assert.deepEqual(s.answers, answers);
  s.enter('game'); assert.ok(s.advance(-1)); assert.equal(s.answers.length,4);
  assert.ok(s.choose(1)); assert.deepEqual(s.fit,fit);
});
test('a partial game remains an estimate while a skipped or shared map never becomes a personal result',()=>{
  const partial = new ValueSession(); partial.choose(1); const fit={...partial.fit};
  partial.enter('personal'); assert.deepEqual(partial.fit,fit); assert.equal(partial.origin,'answers');
  const skipped = new ValueSession(()=>.5); skipped.enter('personal'); assert.equal(skipped.origin,'example');
  assert.equal(skipped.answers.length,0); assert.ok(skipped.fit.alpha>=.35&&skipped.fit.alpha<=1.8);
  const shared = new ValueSession(); shared.restore(new URLSearchParams('alpha=0.55&rho=1.35')); shared.enter('personal');
  assert.equal(shared.origin,'shared'); assert.deepEqual(shared.fit,examplePreferences.adventurous);
  shared.choose(0); assert.equal(shared.answers.length,0); // Only the game takes answers.
  const invalid = new ValueSession(()=>.5); invalid.restore(new URLSearchParams('alpha=NaN&rho=99&choice=Infinity')); invalid.enter('review');
  assert.equal(invalid.origin,'example'); assert.equal(invalid.reviewIndex,0);
});
test('the two example maps favor opposite sides of the same new tradeoff',()=>{
  assert.equal(predictChoice(unseenPair,examplePreferences.reliable.alpha,examplePreferences.reliable.rho),1);
  assert.equal(predictChoice(unseenPair,examplePreferences.adventurous.alpha,examplePreferences.adventurous.rho),0);
});
