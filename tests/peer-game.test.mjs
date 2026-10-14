import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gamblePairs,gameRounds,soloRounds,gambleKind,peerGameSummary} from '../src/lib/peer-game.mjs';

test('every pair is a safer narrow spread against a riskier wide one with a similar average',()=>{
 for(const {safe,risky} of gamblePairs){
  assert.ok(risky[1]-risky[0]>safe[1]-safe[0]);
  assert.ok(Math.abs((risky[0]+risky[1])/2-(safe[0]+safe[1])/2)<=1);
 }
});
test('each pair appears once alone and once with peers, half safe and half risky',()=>{
 const solo=gameRounds.slice(0,soloRounds),social=gameRounds.slice(soloRounds);
 assert.deepEqual(solo.map(r=>r.pair).sort(),[0,1,2,3]);assert.deepEqual(social.map(r=>r.pair).sort(),[0,1,2,3]);
 assert.equal(social.filter(r=>r.peers==='safe').length,2);assert.equal(social.filter(r=>r.peers==='risky').length,2);
 assert.ok(solo.every(r=>r.peers===null));
});
test('the summary counts switches toward the peers by direction',()=>{
 const pick=(kinds)=>kinds;
 assert.deepEqual(peerGameSummary(pick(['risky','risky','risky','risky','safe','risky','safe','risky'])),{towardSafe:2,towardRisky:0,toward:2,away:0});
 assert.deepEqual(peerGameSummary(pick(['safe','safe','safe','safe','safe','risky','safe','risky'])),{towardSafe:0,towardRisky:2,toward:2,away:0});
 assert.deepEqual(peerGameSummary(pick(['safe','safe','safe','safe','risky','safe','safe','safe'])),{towardSafe:0,towardRisky:0,toward:0,away:1});
 assert.equal(gambleKind({safeLeft:true},0),'safe');assert.equal(gambleKind({safeLeft:false},0),'risky');
});
