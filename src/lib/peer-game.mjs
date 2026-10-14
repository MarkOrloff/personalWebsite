// The safer-peers opening game: each pair is a coin flip with a narrow spread (safer) or a
// wide spread (riskier) and a similar average. Four rounds alone, then the same four pairs
// after seeing two other players choose: twice they play it safe, twice they take the risk.
export const gamblePairs = [
  { safe: [6, 8], risky: [1, 14] },
  { safe: [4, 6], risky: [0, 11] },
  { safe: [7, 9], risky: [2, 15] },
  { safe: [5, 7], risky: [1, 12] },
];
export const gameRounds = [
  { pair: 0, peers: null, safeLeft: true },
  { pair: 1, peers: null, safeLeft: false },
  { pair: 2, peers: null, safeLeft: false },
  { pair: 3, peers: null, safeLeft: true },
  { pair: 2, peers: 'safe', safeLeft: true },
  { pair: 3, peers: 'risky', safeLeft: false },
  { pair: 0, peers: 'safe', safeLeft: false },
  { pair: 1, peers: 'risky', safeLeft: true },
];
export const soloRounds = gameRounds.filter(round => !round.peers).length;

// Which gamble a click on the left (0) or right (1) card picks in a given round.
export const gambleKind = (round, side) => (side === 0) === round.safeLeft ? 'safe' : 'risky';

// Compare each social round with the visitor's own answer to the same pair alone.
export function peerGameSummary(answers) {
  const alone = new Map(gameRounds.slice(0, soloRounds).map((round, i) => [round.pair, answers[i]]));
  let towardSafe = 0, towardRisky = 0, away = 0;
  gameRounds.slice(soloRounds).forEach((round, i) => {
    const answer = answers[soloRounds + i];
    if (!answer) return;
    if (answer === round.peers && alone.get(round.pair) !== round.peers) round.peers === 'safe' ? towardSafe++ : towardRisky++;
    else if (answer !== round.peers && alone.get(round.pair) === round.peers) away++;
  });
  return { towardSafe, towardRisky, toward: towardSafe + towardRisky, away };
}
