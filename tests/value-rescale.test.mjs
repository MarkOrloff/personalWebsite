import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offers, offerStages, stageRange, utility, fitAnswers, answersFrom, examplePreferences, MAX_CHOICES } from '../src/lib/rescale.mjs';
import { questions, savedAnswers, subjectiveValue } from '../src/lib/value-calibration.mjs';
import { ValueSession } from '../src/lib/value-walkthrough.mjs';

const close = (a, b, tolerance = .005) => assert.ok(Math.abs(a - b) < tolerance, `${a} vs ${b}`);
const offer = (p, a) => ({ p, a });

test('the example settings give the numbers the explainer text quotes', () => {
  close(offerStages(offer(.8, 3), examplePreferences).weight, .645);
  close(offerStages(offer(.3, 8), examplePreferences).weight, .330);
  close(offerStages(offer(.8, 3), examplePreferences).units, 2.408);
  close(offerStages(offer(.3, 8), examplePreferences).units, 5.278);
  // The same $2 gap counts for less at higher amounts.
  const u = a => utility(a, examplePreferences.rho);
  assert.ok(u(5) - u(3) > u(10) - u(8));
});

test('utility units are arbitrary: the map and every choice ignore them, the felt numbers do not', () => {
  for (const o of offers) {
    const one = offerStages(o, examplePreferences, 1), ten = offerStages(o, examplePreferences, 10);
    assert.deepEqual(one.map, ten.map);
    assert.equal(one.weight, ten.weight);
  }
  close(utility(10, .8, 10), 10);
  close(utility(10, .8, 1) / utility(5, .8, 1), utility(10, .8, 10) / utility(5, .8, 10), 1e-9);
  assert.notEqual(offerStages(offer(.8, 3), examplePreferences, 10).units.toFixed(2), '2.41');
});

test('decision weights have fixed ends, and the rescaled map spans the task range', () => {
  const ends = offerStages(offer(1, 10), { alpha: .4, rho: 1.6 });
  assert.equal(ends.weight, 1); close(ends.map.x, 1, 1e-9); close(ends.map.y, 1, 1e-9);
  const low = offerStages(offer(.1, 1), { alpha: .4, rho: 1.6 });
  close(low.map.x, 0, 1e-9); close(low.map.y, 0, 1e-9);
  assert.ok(low.weight > 0, 'the least likely offer keeps a nonzero weight before rescaling');
  assert.deepEqual(stageRange('map', examplePreferences), { x: 1, y: 1 });
  assert.equal(stageRange('felt', { alpha: 1, rho: 1.5 }).y, utility(10, 1.5));
  assert.equal(stageRange('felt', examplePreferences).y, 10);
});

test('saved choices round-trip, and more choices keep refining the fit', () => {
  const chooser = { alpha: .7, rho: .5 };
  let answers = [];
  assert.deepEqual(fitAnswers(answers).preferences, examplePreferences);
  for (let i = 0; i < 12; i++) {
    const { next } = fitAnswers(answers);
    const choice = subjectiveValue(next.options[0], chooser.alpha, chooser.rho) > subjectiveValue(next.options[1], chooser.alpha, chooser.rho) ? 0 : 1;
    answers.push({ question: next, choice });
  }
  assert.equal(new Set(answers.map(a => a.question.id)).size, 12, 'no question repeats');
  assert.deepEqual(answersFrom(savedAnswers(answers)), answers);
  assert.deepEqual(answersFrom([{ id: 'nope', choice: 0 }, { id: questions[0].id, choice: 2 }, ...savedAnswers(answers.slice(0, 1)), ...savedAnswers(answers.slice(0, 1))]), answers.slice(0, 1));
  assert.ok(fitAnswers(answers).preferences.rho < 1, 'a chooser with a strongly curved value function gets rho below 1');
  assert.ok(MAX_CHOICES >= 20 && MAX_CHOICES <= questions.length);
});

test('the walkthrough restores up to five saved choices', () => {
  const session = new ValueSession(() => .5);
  const saved = questions.slice(0, 7).map((q, i) => ({ id: q.id, choice: i % 2 }));
  assert.ok(session.load(saved));
  assert.equal(session.answers.length, 5);
  assert.equal(session.question, undefined);
  assert.ok(!new ValueSession(() => .5).load([]));
});

test('the explainer text quotes the example settings until the visitor chooses, then their own numbers', async () => {
  const { explainerTokens } = await import('../src/lib/rescale.mjs');
  const { copy } = await import('../src/lib/site-copy.mjs');
  const example = copy('value-rescale.utility.text', explainerTokens(examplePreferences, 0));
  assert.match(example, /\$2\.41/); assert.match(example, /1\.21 units \(3\.62 − 2\.41\)/); assert.match(example, /only 1\.03 units/);
  assert.match(copy('value-rescale.weights.text', explainerTokens(examplePreferences, 0)), /seems like 64\.5%/);
  const steep = copy('value-rescale.utility.text', explainerTokens({ alpha: .7, rho: 1.3 }, 4));
  assert.match(steep, /with your preferences/); assert.match(steep, /worth \*more\* \*to you\* higher up/); assert.match(steep, /feels like \$4\.17 \*to you\*\./);
  assert.doesNotMatch(example, /to you/);
  assert.match(copy('value-rescale.utility.text', explainerTokens({ alpha: 1, rho: 1 }, 2)), /about the same/);
});
