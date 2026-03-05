/**
 * Bet Calculator Engine
 * Handles all 30+ bet types with full support for:
 * Each-Way, Rule 4, Dead Heat, Void/Non-Runner, Bookmaker Bonuses
 */

const BET_TYPES = {
  single:               { name: 'Single',               selections: 1,  bets: 1,   combinations: [[1]] },
  'each-way':           { name: 'Each Way',              selections: 1,  bets: 2,   combinations: [[1]], eachWayForced: true },
  double:               { name: 'Double',                selections: 2,  bets: 1,   combinations: [[2]] },
  treble:               { name: 'Treble',                selections: 3,  bets: 1,   combinations: [[3]] },
  accumulator:          { name: 'Accumulator',           selections: -1, bets: -1,  combinations: 'all' },
  trixie:               { name: 'Trixie',                selections: 3,  bets: 4,   combinations: [[2],[3]] },
  patent:               { name: 'Patent',                selections: 3,  bets: 7,   combinations: [[1],[2],[3]] },
  yankee:               { name: 'Yankee',                selections: 4,  bets: 11,  combinations: [[2],[3],[4]] },
  canadian:             { name: 'Canadian / Super Yankee', selections: 5, bets: 26, combinations: [[2],[3],[4],[5]] },
  'super-yankee':       { name: 'Super Yankee',          selections: 5,  bets: 26,  combinations: [[2],[3],[4],[5]] },
  heinz:                { name: 'Heinz',                 selections: 6,  bets: 57,  combinations: [[2],[3],[4],[5],[6]] },
  'super-heinz':        { name: 'Super Heinz',           selections: 7,  bets: 120, combinations: [[2],[3],[4],[5],[6],[7]] },
  goliath:              { name: 'Goliath',               selections: 8,  bets: 247, combinations: [[2],[3],[4],[5],[6],[7],[8]] },
  'lucky-15':           { name: 'Lucky 15',              selections: 4,  bets: 15,  combinations: [[1],[2],[3],[4]] },
  'lucky-31':           { name: 'Lucky 31',              selections: 5,  bets: 31,  combinations: [[1],[2],[3],[4],[5]] },
  'lucky-63':           { name: 'Lucky 63',              selections: 6,  bets: 63,  combinations: [[1],[2],[3],[4],[5],[6]] },
  alphabet:             { name: 'Alphabet',              selections: 6,  bets: 26,  combinations: 'alphabet' },
  'single-stakes-about':{ name: 'Single Stakes About',   selections: 2,  bets: 2,   combinations: 'ssa' },
  'double-stakes-about':{ name: 'Double Stakes About',   selections: 2,  bets: 2,   combinations: 'dsa' },
  'round-robin':        { name: 'Round Robin',           selections: 3,  bets: 10,  combinations: 'round-robin' },
  flag:                 { name: 'Flag',                  selections: 4,  bets: 23,  combinations: 'flag' },
  'super-flag':         { name: 'Super Flag',            selections: 5,  bets: 46,  combinations: 'super-flag' },
  'heinz-flag':         { name: 'Heinz Flag',            selections: 6,  bets: 87,  combinations: 'heinz-flag' },
  'super-heinz-flag':   { name: 'Super Heinz Flag',      selections: 7,  bets: 162, combinations: 'super-heinz-flag' },
  'goliath-flag':       { name: 'Goliath Flag',          selections: 8,  bets: 303, combinations: 'goliath-flag' },
  'union-jack-trebles': { name: 'Union Jack Trebles',    selections: 9,  bets: 8,   combinations: 'uj-trebles' },
  'union-jack-trixie':  { name: 'Union Jack Trixie',     selections: 9,  bets: 32,  combinations: 'uj-trixie' },
  'union-jack-patent':  { name: 'Union Jack Patent',     selections: 9,  bets: 56,  combinations: 'uj-patent' },
  'union-jack-round-robin': { name: 'Union Jack Round Robin', selections: 9, bets: 80, combinations: 'uj-round-robin' },
  parlay:               { name: 'Parlay',                selections: -1, bets: -1,  combinations: 'all' },
};

// Union Jack grid positions (3x3 grid numbered 1-9)
const UJ_TREBLES = [
  [0,1,2],[3,4,5],[6,7,8],  // rows
  [0,3,6],[1,4,7],[2,5,8],  // columns
  [0,4,8],[2,4,6]           // diagonals
];

function getCombinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo]);
  const withoutFirst = getCombinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

function getAllCombinations(n, sizes) {
  const indices = Array.from({ length: n }, (_, i) => i);
  let all = [];
  for (const size of sizes) {
    all = all.concat(getCombinations(indices, size));
  }
  return all;
}

// Generate SSA (Single Stakes About) bets
function getSSACombinations(n) {
  const combos = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) combos.push({ type: 'ssa', legs: [i, j] });
    }
  }
  return combos;
}

// Generate DSA (Double Stakes About) bets
function getDSACombinations(n) {
  const combos = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) combos.push({ type: 'dsa', legs: [i, j] });
    }
  }
  return combos;
}

/**
 * Convert fractional odds string to decimal
 */
function fractionalToDecimal(num, den) {
  return 1 + num / den;
}

/**
 * Apply Rule 4 deduction to decimal odds
 * rule4 is a value like 5, 10, 15... (pence in the pound)
 */
function applyRule4(decimalOdds, rule4) {
  if (!rule4 || rule4 === 0) return decimalOdds;
  const winnings = decimalOdds - 1;
  const deduction = rule4 / 100;
  return 1 + winnings * (1 - deduction);
}

/**
 * Calculate return for a single selection in a single bet leg
 * Returns { winReturn, placeReturn } multipliers (not including stake)
 */
function getSelectionMultiplier(selection, isEachWay) {
  const { outcome, decimalOdds, rule4, deadHeatRunners, placeTerms } = selection;

  let adjustedOdds = applyRule4(decimalOdds, rule4 || 0);

  if (outcome === 'void' || outcome === 'nr') {
    return { winMult: 1, placeMult: 1, isVoid: true };
  }

  if (outcome === 'lost') {
    return { winMult: 0, placeMult: 0, isVoid: false };
  }

  // Dead Heat factor
  const dhFactor = (deadHeatRunners && deadHeatRunners > 1) ? (1 / deadHeatRunners) : 1;

  if (outcome === 'won') {
    const winMult = adjustedOdds * dhFactor;
    let placeMult = 1;
    if (isEachWay) {
      const { fraction, places } = placeTerms || { fraction: 5, places: 4 };
      const placeOdds = 1 + (adjustedOdds - 1) * (fraction[0] / fraction[1]);
      placeMult = placeOdds * dhFactor;
    }
    return { winMult, placeMult, isVoid: false };
  }

  if (outcome === 'placed') {
    if (!isEachWay) return { winMult: 0, placeMult: 0, isVoid: false };
    const { fraction } = placeTerms || { fraction: [1, 5], places: 4 };
    const placeOdds = 1 + (adjustedOdds - 1) * (fraction[0] / fraction[1]);
    const placeMult = placeOdds * dhFactor;
    return { winMult: 0, placeMult, isVoid: false };
  }

  if (outcome === 'dead-heat') {
    const runners = deadHeatRunners || 2;
    const winMult = adjustedOdds / runners;
    let placeMult = 1;
    if (isEachWay) {
      const { fraction } = placeTerms || { fraction: [1, 5], places: 4 };
      const placeOdds = 1 + (adjustedOdds - 1) * (fraction[0] / fraction[1]);
      placeMult = placeOdds / runners;
    }
    return { winMult, placeMult, isVoid: false };
  }

  return { winMult: 0, placeMult: 0, isVoid: false };
}

/**
 * Calculate the return for a combination of selection indices
 * Returns { winReturn, placeReturn } for stakePerBet = 1
 */
function calcCombinationReturn(combo, selections, isEachWay) {
  let winMult = 1;
  let placeMult = 1;
  let hasLoss = false;
  let voidCount = 0;

  for (const idx of combo) {
    const sel = selections[idx];
    const { winMult: wm, placeMult: pm, isVoid } = getSelectionMultiplier(sel, isEachWay);

    if (isVoid) {
      voidCount++;
      continue;
    }

    if (wm === 0 && pm === 0) {
      hasLoss = true;
      break;
    }

    winMult *= wm;
    placeMult *= pm;
  }

  if (hasLoss) return { winReturn: 0, placeReturn: 0 };

  // If all selections are void, it's a push (return stake)
  if (voidCount === combo.length) return { winReturn: 1, placeReturn: 1 };

  return {
    winReturn: winMult,
    placeReturn: isEachWay ? placeMult : 0,
  };
}

/**
 * Get all bet combinations for a given bet type and number of selections
 */
function getBetCombinations(betTypeKey, numSelections) {
  const betType = BET_TYPES[betTypeKey];
  if (!betType) return [];

  const indices = Array.from({ length: numSelections }, (_, i) => i);

  if (betType.combinations === 'all') {
    // Accumulator / Parlay: single combo of all
    return [indices];
  }

  if (Array.isArray(betType.combinations)) {
    let all = [];
    for (const sizeArr of betType.combinations) {
      const size = sizeArr[0];
      all = all.concat(getCombinations(indices, size));
    }
    return all;
  }

  // Special bet types
  switch (betType.combinations) {
    case 'alphabet': return getAlphabetCombinations();
    case 'ssa': return getSSACombinationsSimple();
    case 'dsa': return getDSACombinationsSimple();
    case 'round-robin': return getRoundRobinCombinations(numSelections);
    case 'flag': return getFlagCombinations(numSelections);
    case 'super-flag': return getSuperFlagCombinations(numSelections);
    case 'heinz-flag': return getHeinzFlagCombinations(numSelections);
    case 'super-heinz-flag': return getSuperHeinzFlagCombinations(numSelections);
    case 'goliath-flag': return getGoliathFlagCombinations(numSelections);
    case 'uj-trebles': return getUJTreblesCombinations();
    case 'uj-trixie': return getUJTrixieCombinations();
    case 'uj-patent': return getUJPatentCombinations();
    case 'uj-round-robin': return getUJRoundRobinCombinations();
    default: return [];
  }
}

// SSA: each selection is staked on the other winning first
function getSSACombinationsSimple() {
  return [{ type: 'ssa', legs: [[0], [1]] }, { type: 'ssa', legs: [[1], [0]] }];
}

function getDSACombinationsSimple() {
  return [{ type: 'dsa', legs: [[0], [1]] }, { type: 'dsa', legs: [[1], [0]] }];
}

// Alphabet: 2 Patents (1-2-3 and 4-5-6) + 1 Yankee (2-3-4-5) + 1 sixfold
function getAlphabetCombinations() {
  const patent1 = getAllCombinations(3, [1, 2, 3]).map(c => c);
  const patent2 = getAllCombinations(3, [1, 2, 3]).map(c => c.map(i => i + 3));
  const yankee = getAllCombinations(4, [2, 3, 4]).map(c => c.map(i => i + 1));
  const sixfold = [[0, 1, 2, 3, 4, 5]];
  return [...patent1, ...patent2, ...yankee, ...sixfold];
}

// Round Robin: 3 doubles + 1 treble + 3 SSA pairs
function getRoundRobinCombinations(n) {
  const indices = [0, 1, 2];
  const doubles = getCombinations(indices, 2);
  const trebles = getCombinations(indices, 3);
  const ssaPairs = [
    { type: 'ssa', legs: [[0], [1]] }, { type: 'ssa', legs: [[1], [0]] },
    { type: 'ssa', legs: [[0], [2]] }, { type: 'ssa', legs: [[2], [0]] },
    { type: 'ssa', legs: [[1], [2]] }, { type: 'ssa', legs: [[2], [1]] },
  ];
  return [...doubles, ...trebles, ...ssaPairs];
}

// Flag: doubles + trebles + fourfold + SSA pairs
function getFlagCombinations(n) {
  const indices = [0, 1, 2, 3];
  const doubles = getCombinations(indices, 2);
  const trebles = getCombinations(indices, 3);
  const fourfolds = getCombinations(indices, 4);
  const ssaPairs = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i !== j) ssaPairs.push({ type: 'ssa', legs: [[i], [j]] });
    }
  }
  return [...doubles, ...trebles, ...fourfolds, ...ssaPairs];
}

function getSuperFlagCombinations(n) {
  const indices = [0, 1, 2, 3, 4];
  const doubles = getCombinations(indices, 2);
  const trebles = getCombinations(indices, 3);
  const fourfolds = getCombinations(indices, 4);
  const fivefolds = getCombinations(indices, 5);
  const ssaPairs = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i !== j) ssaPairs.push({ type: 'ssa', legs: [[i], [j]] });
    }
  }
  return [...doubles, ...trebles, ...fourfolds, ...fivefolds, ...ssaPairs];
}

function getHeinzFlagCombinations(n) {
  const indices = [0, 1, 2, 3, 4, 5];
  const combos = getAllCombinations(6, [2, 3, 4, 5, 6]);
  const ssaPairs = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (i !== j) ssaPairs.push({ type: 'ssa', legs: [[i], [j]] });
    }
  }
  return [...combos, ...ssaPairs];
}

function getSuperHeinzFlagCombinations(n) {
  const combos = getAllCombinations(7, [2, 3, 4, 5, 6, 7]);
  const ssaPairs = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (i !== j) ssaPairs.push({ type: 'ssa', legs: [[i], [j]] });
    }
  }
  return [...combos, ...ssaPairs];
}

function getGoliathFlagCombinations(n) {
  const combos = getAllCombinations(8, [2, 3, 4, 5, 6, 7, 8]);
  const ssaPairs = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i !== j) ssaPairs.push({ type: 'ssa', legs: [[i], [j]] });
    }
  }
  return [...combos, ...ssaPairs];
}

function getUJTreblesCombinations() {
  return UJ_TREBLES;
}

function getUJTrixieCombinations() {
  const trebles = UJ_TREBLES;
  const doubles = [];
  const seen = new Set();
  for (const treble of trebles) {
    const dbs = getCombinations(treble, 2);
    for (const d of dbs) {
      const key = d.slice().sort().join('-');
      if (!seen.has(key)) { seen.add(key); doubles.push(d); }
    }
  }
  return [...trebles, ...doubles];
}

function getUJPatentCombinations() {
  const trebles = UJ_TREBLES;
  const doubles = [];
  const singles = [];
  const seenD = new Set();
  const seenS = new Set();
  for (const treble of trebles) {
    for (const d of getCombinations(treble, 2)) {
      const key = d.slice().sort().join('-');
      if (!seenD.has(key)) { seenD.add(key); doubles.push(d); }
    }
    for (const s of treble) {
      if (!seenS.has(s)) { seenS.add(s); singles.push([s]); }
    }
  }
  return [...trebles, ...doubles, ...singles];
}

function getUJRoundRobinCombinations() {
  const trebles = UJ_TREBLES;
  const doubles = [];
  const ssaPairs = [];
  const seenD = new Set();
  const seenSSA = new Set();
  for (const treble of trebles) {
    for (const d of getCombinations(treble, 2)) {
      const key = d.slice().sort().join('-');
      if (!seenD.has(key)) { seenD.add(key); doubles.push(d); }
    }
    for (let i = 0; i < treble.length; i++) {
      for (let j = 0; j < treble.length; j++) {
        if (i !== j) {
          const key = `${treble[i]}-${treble[j]}`;
          if (!seenSSA.has(key)) {
            seenSSA.add(key);
            ssaPairs.push({ type: 'ssa', legs: [[treble[i]], [treble[j]]] });
          }
        }
      }
    }
  }
  return [...trebles, ...doubles, ...ssaPairs];
}

/**
 * Calculate SSA / DSA bet return
 * SSA: Bet A starts on selection i. If i wins, entire return is placed on j.
 * DSA: Like SSA but double stake on each direction.
 */
function calcSSAReturn(combo, selections, isEachWay, stakePerBet) {
  const [legA, legB] = combo.legs;
  const selA = selections[legA[0]];
  const selB = selections[legB[0]];

  const { winMult: wmA, isVoid: voidA } = getSelectionMultiplier(selA, isEachWay);
  const { winMult: wmB, isVoid: voidB } = getSelectionMultiplier(selB, isEachWay);

  if (voidA) {
    // A is void: SSA collapses to single on B
    return stakePerBet * wmB;
  }

  if (wmA === 0) {
    // A lost: no return
    return 0;
  }

  // A won: return from A goes to B
  const returnFromA = stakePerBet * wmA;
  if (voidB) return returnFromA;
  return returnFromA * wmB;
}

/**
 * Main calculation function
 */
function calculateBet(params) {
  const {
    betType,
    selections,
    stake,
    stakeType, // 'per-bet' or 'total'
    isEachWay,
    bonuses,   // { allWinnersBonus: 10, oneWinnerConsolation: 'double' }
  } = params;

  const betDef = BET_TYPES[betType];
  if (!betDef) return { totalOutlay: 0, totalReturn: 0, totalProfit: 0, bets: [] };

  const numSelections = selections.length;
  const combos = getBetCombinations(betType, numSelections);
  const numBets = countBets(combos, isEachWay);

  const stakePerBet = stakeType === 'total' ? stake / (numBets || 1) : stake;
  const totalOutlay = stakePerBet * numBets;

  let totalReturn = 0;
  const betResults = [];

  for (const combo of combos) {
    let winRet, placeRet;

    if (combo && combo.type === 'ssa') {
      const ret = calcSSAReturn(combo, selections, isEachWay, stakePerBet);
      winRet = ret;
      placeRet = 0;
    } else {
      const comboArr = Array.isArray(combo) ? combo : combo;
      const { winReturn, placeReturn } = calcCombinationReturn(comboArr, selections, isEachWay);
      winRet = winReturn * stakePerBet;
      placeRet = placeReturn * stakePerBet;
    }

    const betReturn = winRet + placeRet;
    betResults.push({ combo, winReturn: winRet, placeReturn: placeRet, total: betReturn });
    totalReturn += betReturn;
  }

  // Apply bookmaker bonuses
  if (bonuses) {
    totalReturn = applyBonuses(totalReturn, selections, bonuses, stakePerBet, isEachWay, betType);
  }

  return {
    totalOutlay: round2(totalOutlay),
    totalReturn: round2(totalReturn),
    totalProfit: round2(totalReturn - totalOutlay),
    numBets,
    stakePerBet: round2(stakePerBet),
    bets: betResults,
  };
}

function countBets(combos, isEachWay) {
  let count = 0;
  for (const c of combos) {
    if (c && c.type === 'ssa') count += 1;
    else count += 1;
  }
  return isEachWay ? count * 2 : count;
}

function applyBonuses(totalReturn, selections, bonuses, stakePerBet, isEachWay, betType) {
  const winners = selections.filter(s => s.outcome === 'won' || s.outcome === 'dead-heat').length;
  const losers = selections.filter(s => s.outcome === 'lost').length;

  // One Winner Consolation (Lucky bets only)
  if (bonuses.oneWinnerConsolation && winners === 1 && losers === selections.length - 1) {
    const winnerSel = selections.find(s => s.outcome === 'won' || s.outcome === 'dead-heat');
    if (winnerSel) {
      const mult = { 'double': 2, 'treble': 3, 'quadruple': 4, 'quintuple': 5 }[bonuses.oneWinnerConsolation] || 1;
      // bonus adds extra return on single win bet
      const baseSingleReturn = winnerSel.decimalOdds * stakePerBet;
      const bonusExtra = baseSingleReturn * (mult - 1);
      totalReturn += bonusExtra;
    }
  }

  // All Winners Bonus
  if (bonuses.allWinnersBonus && winners === selections.length && losers === 0) {
    const bonusPct = parseFloat(bonuses.allWinnersBonus) / 100;
    if (!isNaN(bonusPct) && bonusPct > 0) {
      totalReturn += totalReturn * bonusPct;
    }
  }

  return totalReturn;
}

function round2(num) {
  return Math.round(num * 100) / 100;
}

function getBetTypeName(key) {
  return BET_TYPES[key] ? BET_TYPES[key].name : key;
}

function getBetTypeSelections(key) {
  return BET_TYPES[key] ? BET_TYPES[key].selections : 1;
}

function getBetCount(betTypeKey, numSelections, isEachWay) {
  const combos = getBetCombinations(betTypeKey, numSelections);
  const base = countBets(combos, false);
  return isEachWay ? base * 2 : base;
}

// Export for use in other modules
if (typeof module !== 'undefined') {
  module.exports = { BET_TYPES, calculateBet, getBetCount, getBetTypeName, getBetTypeSelections, fractionalToDecimal };
}
