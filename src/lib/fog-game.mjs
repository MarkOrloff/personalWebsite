// The social-conformity opening game: red and blue gambles, sometimes fogged over so the
// numbers can't be read while the colors still can. Two other players always pick first.
// On clear rounds they pick the slightly worse gamble, so following them has a visible cost.
export const fogRounds = [
  { foggy: false, red: { p: .3, a: 9 }, blue: { p: .7, a: 5 }, peers: 'red', redLeft: true },
  { foggy: true, red: { p: .5, a: 6 }, blue: { p: .4, a: 8 }, peers: 'blue', redLeft: false },
  { foggy: false, red: { p: .8, a: 4 }, blue: { p: .4, a: 7 }, peers: 'blue', redLeft: true },
  { foggy: true, red: { p: .6, a: 5 }, blue: { p: .2, a: 14 }, peers: 'red', redLeft: true },
  { foggy: false, red: { p: .25, a: 12 }, blue: { p: .6, a: 6 }, peers: 'red', redLeft: false },
  { foggy: true, red: { p: .7, a: 4 }, blue: { p: .35, a: 9 }, peers: 'blue', redLeft: false },
];
export const fogColor = (round, side) => (side === 0) === round.redLeft ? 'red' : 'blue';
export const expectedValue = option => option.p * option.a;

// How often the visitor went with the other players, split by clear and foggy rounds.
export function fogGameSummary(answers) {
  const count = foggy => fogRounds.reduce((sum, round, i) => sum + (round.foggy === foggy && answers[i] === round.peers ? 1 : 0), 0);
  const total = foggy => fogRounds.filter(round => round.foggy === foggy).length;
  return { clear: count(false), clearTotal: total(false), foggy: count(true), foggyTotal: total(true) };
}
