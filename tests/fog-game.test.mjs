import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fogRounds,fogColor,expectedValue,fogGameSummary} from '../src/lib/fog-game.mjs';

test('half the rounds are fogged, and on clear rounds the other players pick the worse gamble',()=>{
 assert.equal(fogRounds.filter(r=>r.foggy).length,fogRounds.length/2);
 for(const round of fogRounds.filter(r=>!r.foggy)){
  const other=round.peers==='red'?'blue':'red';
  assert.ok(expectedValue(round[round.peers])<expectedValue(round[other]));
 }
 for(const round of fogRounds)assert.notEqual(fogColor(round,0),fogColor(round,1));
});
test('the summary counts following separately for clear and foggy rounds',()=>{
 const follow=fogRounds.map(r=>r.peers),ignore=fogRounds.map(r=>r.peers==='red'?'blue':'red');
 assert.deepEqual(fogGameSummary(follow),{clear:3,clearTotal:3,foggy:3,foggyTotal:3});
 assert.deepEqual(fogGameSummary(ignore),{clear:0,clearTotal:3,foggy:0,foggyTotal:3});
 assert.deepEqual(fogGameSummary(fogRounds.map(r=>r.foggy?r.peers:(r.peers==='red'?'blue':'red'))),{clear:0,clearTotal:3,foggy:3,foggyTotal:3});
});
