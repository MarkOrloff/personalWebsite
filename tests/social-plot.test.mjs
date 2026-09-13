import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { plotLayout, summary, fitLine } from '../src/lib/social-plot.mjs';
const data = JSON.parse(readFileSync(new URL('../src/data/social-conformity.json', import.meta.url)));

test('all 44 published participants and group sample sizes are retained', () => {
  assert.equal(data.participants.length, 44);
  assert.equal(new Set(data.participants.map(p => p.id)).size, 44);
  assert.deepEqual(data.groups.map(g => g.n), [28, 10, 6]);
  for (const group of data.groups) {
    const values = data.participants.filter(p => p.group === group.id).map(p => p.follow);
    assert.equal(values.length, group.n);
    assert.ok(values.every(v => Number.isFinite(v) && v >= 0 && v <= 1));
    const actual = summary(values);
    assert.ok(Math.abs(actual.mean - group.mean) < 1e-12);
    assert.ok(Math.abs(actual.sem - group.sem) < 1e-12);
  }
  // Values independently extracted from the archived MATLAB group arrays.
  assert.ok(Math.abs(data.groups[0].mean - .158055824516818) < 1e-12);
  assert.ok(Math.abs(data.groups[1].mean - .2964052636754816) < 1e-12);
  assert.ok(Math.abs(data.groups[2].mean - .3147147293742455) < 1e-12);
});

test('pairing of solo fit and following reproduces the published relationship', () => {
  const a = data.participants.map(p => p.follow), b = data.participants.map(p => p.soloNll);
  const am = summary(a).mean, bm = summary(b).mean;
  const cross = a.reduce((sum, v, i) => sum + (v - am) * (b[i] - bm), 0);
  const r = cross / Math.sqrt(a.reduce((sum, v) => sum + (v - am) ** 2, 0) * b.reduce((sum, v) => sum + (v - bm) ** 2, 0));
  assert.ok(Math.abs(r - .5226164884558214) < 1e-12);
});

test('switching views preserves every person, their y value, and honest axes', () => {
  for (const width of [240, 280, 320, 520, 736]) {
    const groups = plotLayout(data, width, 'groups');
    const relationship = plotLayout(data, width, 'relationship');
    assert.deepEqual(groups.yticks.map(t => t.value), [0, .5, 1]);
    assert.ok(relationship.xMax >= Math.max(...data.participants.map(p => p.soloNll)));
    for (let i = 0; i < 44; i++) {
      assert.equal(groups.points[i].id, relationship.points[i].id);
      assert.equal(groups.points[i].y, relationship.points[i].y);
      for (const layout of [groups, relationship]) {
        const p = layout.points[i];
        assert.ok(p.x >= layout.left && p.x <= layout.right);
        assert.ok(p.y >= layout.top && p.y <= layout.bottom);
      }
    }
    assert.equal(groups.points.length, 44);
  }
});

test('regression fit is bounded by observed values and passes through the sample means', () => {
  const [a,b] = fitLine(data.participants);
  const xs = data.participants.map(p => p.soloNll);
  assert.equal(a.x, Math.min(...xs));
  assert.equal(b.x, Math.max(...xs));
  const meanY = a.y + (summary(xs).mean-a.x)*(b.y-a.y)/(b.x-a.x);
  assert.ok(Math.abs(meanY-summary(data.participants.map(p => p.follow)).mean)<1e-12);
});
