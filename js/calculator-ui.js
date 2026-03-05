/**
 * Bet Calculator UI Controller
 * Handles all DOM interactions, real-time recalculation, and state management
 */

(function () {
  'use strict';

  // ─── State ────────────────────────────────────────────────────────────────
  const state = {
    betType: 'lucky-15',
    isEachWay: false,
    oddsFormat: 'fractional',
    stakeType: 'per-bet',
    stake: '',
    showRule4: false,
    selections: [],
    bonuses: { allWinnersBonus: '', oneWinnerConsolation: 'none' },
    defaultBetType: null, // set by individual pages
  };

  // ─── Ordered bet type list for dropdown ───────────────────────────────────
  const BET_TYPE_ORDER = [
    'single','each-way','double','treble','accumulator',
    'trixie','patent','yankee','canadian','super-yankee',
    'heinz','super-heinz','goliath',
    'lucky-15','lucky-31','lucky-63',
    'alphabet','single-stakes-about','double-stakes-about','round-robin',
    'flag','super-flag','heinz-flag','super-heinz-flag','goliath-flag',
    'union-jack-trebles','union-jack-trixie','union-jack-patent','union-jack-round-robin',
    'parlay',
  ];

  const SELECTION_COUNTS = {
    single: 1, 'each-way': 1, double: 2, treble: 3, accumulator: 4,
    trixie: 3, patent: 3, yankee: 4, canadian: 5, 'super-yankee': 5,
    heinz: 6, 'super-heinz': 7, goliath: 8,
    'lucky-15': 4, 'lucky-31': 5, 'lucky-63': 6,
    alphabet: 6, 'single-stakes-about': 2, 'double-stakes-about': 2,
    'round-robin': 3, flag: 4, 'super-flag': 5,
    'heinz-flag': 6, 'super-heinz-flag': 7, 'goliath-flag': 8,
    'union-jack-trebles': 9, 'union-jack-trixie': 9, 'union-jack-patent': 9,
    'union-jack-round-robin': 9, parlay: 4,
  };

  const BET_NAMES = {
    single: 'Single', 'each-way': 'Each Way', double: 'Double', treble: 'Treble',
    accumulator: 'Accumulator', trixie: 'Trixie', patent: 'Patent', yankee: 'Yankee',
    canadian: 'Canadian', 'super-yankee': 'Super Yankee', heinz: 'Heinz',
    'super-heinz': 'Super Heinz', goliath: 'Goliath', 'lucky-15': 'Lucky 15',
    'lucky-31': 'Lucky 31', 'lucky-63': 'Lucky 63', alphabet: 'Alphabet',
    'single-stakes-about': 'Single Stakes About', 'double-stakes-about': 'Double Stakes About',
    'round-robin': 'Round Robin', flag: 'Flag', 'super-flag': 'Super Flag',
    'heinz-flag': 'Heinz Flag', 'super-heinz-flag': 'Super Heinz Flag',
    'goliath-flag': 'Goliath Flag', 'union-jack-trebles': 'Union Jack Trebles',
    'union-jack-trixie': 'Union Jack Trixie', 'union-jack-patent': 'Union Jack Patent',
    'union-jack-round-robin': 'Union Jack Round Robin', parlay: 'Parlay',
  };

  // Variable-selection types
  const VARIABLE_SELECTIONS = new Set(['accumulator', 'parlay']);

  // ─── DOM helpers ──────────────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }
  function $q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $qa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  // ─── Init ─────────────────────────────────────────────────────────────────
  function init() {
    if (!$('calc-form')) return; // not on a calculator page

    // Allow individual pages to set a default bet type
    const pageDefault = document.body.dataset.betType;
    if (pageDefault && BET_NAMES[pageDefault]) {
      state.betType = pageDefault;
      state.defaultBetType = pageDefault;
    }

    buildBetTypeDropdown();
    buildOddsFormatTabs();
    syncFormFromState();
    buildSelectionRows();
    bindEvents();
    recalculate();
  }

  // ─── Build dropdown ───────────────────────────────────────────────────────
  function buildBetTypeDropdown() {
    const sel = $('bet-type-select');
    if (!sel) return;
    sel.innerHTML = '';
    for (const key of BET_TYPE_ORDER) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = BET_NAMES[key];
      if (key === state.betType) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  function buildOddsFormatTabs() {
    const container = $('odds-format-tabs');
    if (!container) return;
    container.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.format === state.oddsFormat);
    });
  }

  // ─── Selections ───────────────────────────────────────────────────────────
  function getNumSelections() {
    if (VARIABLE_SELECTIONS.has(state.betType)) {
      const n = parseInt($('num-selections') ? $('num-selections').value : 4);
      return isNaN(n) ? 4 : Math.min(Math.max(n, 2), 20);
    }
    return SELECTION_COUNTS[state.betType] || 1;
  }

  function buildSelectionRows() {
    const n = getNumSelections();
    const container = $('selections-container');
    if (!container) return;

    // Show/hide the "number of selections" control
    const numSelWrap = $('num-selections-wrap');
    if (numSelWrap) numSelWrap.style.display = VARIABLE_SELECTIONS.has(state.betType) ? 'flex' : 'none';

    // Preserve existing selection data
    while (state.selections.length < n) {
      state.selections.push({ outcome: 'won', oddsNum: 2, oddsDen: 1, rule4: 0, deadHeatRunners: 2, placeTerms: { fraction: [1, 5], places: 4 }, decimalOdds: 3 });
    }
    state.selections = state.selections.slice(0, n);

    container.innerHTML = '';
    for (let i = 0; i < n; i++) {
      container.appendChild(buildSelectionRow(i));
    }
    updateRule4Visibility();
  }

  function buildSelectionRow(i) {
    const sel = state.selections[i];
    const row = document.createElement('div');
    row.className = 'selection-row';
    row.dataset.index = i;

    const oddsInput = buildOddsInput(i, sel);
    const outcomeHtml = buildOutcomeSelect(i, sel.outcome);
    const rule4Html = buildRule4Select(i, sel.rule4 || 0);
    const dhHtml = buildDeadHeatInput(i, sel.deadHeatRunners || 2);

    row.innerHTML = `
      <div class="sel-number">${i + 1}</div>
      <div class="sel-outcome">${outcomeHtml}</div>
      <div class="sel-odds">${oddsInput}</div>
      <div class="sel-rule4 rule4-col">${rule4Html}</div>
      <div class="sel-dh dh-col" style="display:none">${dhHtml}</div>
    `;
    return row;
  }

  function buildOutcomeSelect(i, value) {
    const options = [
      { v: 'won', l: 'Winner' },
      { v: 'placed', l: 'Placed' },
      { v: 'lost', l: 'Loser' },
      { v: 'dead-heat', l: 'Dead Heat' },
      { v: 'void', l: 'Void / N-R' },
    ];
    const opts = options.map(o =>
      `<option value="${o.v}"${o.v === value ? ' selected' : ''}>${o.l}</option>`
    ).join('');
    return `<select class="outcome-select form-select" data-index="${i}">${opts}</select>`;
  }

  function buildOddsInput(i, sel) {
    if (state.oddsFormat === 'fractional') {
      return `<div class="odds-fractional">
        <input type="number" class="odds-num form-input" data-index="${i}" value="${sel.oddsNum || 2}" min="1" step="1" aria-label="Odds numerator">
        <span class="odds-sep">/</span>
        <input type="number" class="odds-den form-input" data-index="${i}" value="${sel.oddsDen || 1}" min="1" step="1" aria-label="Odds denominator">
      </div>`;
    }
    if (state.oddsFormat === 'decimal') {
      const dec = sel.decimalOdds ? sel.decimalOdds.toFixed(2) : '3.00';
      return `<input type="number" class="odds-decimal form-input" data-index="${i}" value="${dec}" min="1.01" step="0.01" aria-label="Decimal odds">`;
    }
    if (state.oddsFormat === 'american') {
      const am = decimalToAmerican(sel.decimalOdds || 3);
      return `<input type="text" class="odds-american form-input" data-index="${i}" value="${am}" aria-label="American odds">`;
    }
    return '';
  }

  function buildRule4Select(i, value) {
    const steps = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90];
    const opts = steps.map(s =>
      `<option value="${s}"${s === value ? ' selected' : ''}>${s === 0 ? 'None' : s + 'p'}</option>`
    ).join('');
    return `<select class="rule4-select form-select" data-index="${i}">${opts}</select>`;
  }

  function buildDeadHeatInput(i, value) {
    return `<input type="number" class="dh-input form-input" data-index="${i}" value="${value}" min="2" max="20" step="1" aria-label="Dead heat runners">`;
  }

  function updateRule4Visibility() {
    $qa('.rule4-col').forEach(el => {
      el.style.display = state.showRule4 ? '' : 'none';
    });
  }

  function updateDeadHeatVisibility() {
    $qa('.selection-row').forEach(row => {
      const idx = parseInt(row.dataset.index);
      const sel = state.selections[idx];
      const dhCol = row.querySelector('.dh-col');
      if (dhCol) dhCol.style.display = sel && sel.outcome === 'dead-heat' ? '' : 'none';
    });
  }

  // ─── Events ───────────────────────────────────────────────────────────────
  function bindEvents() {
    // Bet type
    const betTypeSel = $('bet-type-select');
    if (betTypeSel) betTypeSel.addEventListener('change', e => {
      state.betType = e.target.value;
      buildSelectionRows();
      recalculate();
    });

    // Each way
    const ewSelect = $('each-way-select');
    if (ewSelect) ewSelect.addEventListener('change', e => {
      state.isEachWay = e.target.value === 'yes';
      updateEachWayUI();
      recalculate();
    });

    // Odds format tabs
    $qa('[data-format]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.oddsFormat = btn.dataset.format;
        $qa('[data-format]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        buildSelectionRows();
        recalculate();
      });
    });

    // Stake type
    const stakeTypeSel = $('stake-type-select');
    if (stakeTypeSel) stakeTypeSel.addEventListener('change', e => {
      state.stakeType = e.target.value;
      recalculate();
    });

    // Stake input
    const stakeInput = $('stake-input');
    if (stakeInput) stakeInput.addEventListener('input', e => {
      state.stake = e.target.value;
      recalculate();
    });

    // Rule 4 toggle
    const rule4Toggle = $('rule4-toggle');
    if (rule4Toggle) rule4Toggle.addEventListener('change', e => {
      state.showRule4 = e.target.value === 'yes';
      updateRule4Visibility();
      recalculate();
    });

    // Number of selections (for accumulator)
    const numSelInput = $('num-selections');
    if (numSelInput) numSelInput.addEventListener('change', e => {
      buildSelectionRows();
      recalculate();
    });

    // Bonus fields
    const awBonus = $('all-winners-bonus');
    if (awBonus) awBonus.addEventListener('input', e => {
      state.bonuses.allWinnersBonus = e.target.value;
      recalculate();
    });

    const owConsolation = $('one-winner-consolation');
    if (owConsolation) owConsolation.addEventListener('change', e => {
      state.bonuses.oneWinnerConsolation = e.target.value;
      recalculate();
    });

    // Delegated events on selections container
    const container = $('selections-container');
    if (container) {
      container.addEventListener('change', handleSelectionChange);
      container.addEventListener('input', handleSelectionChange);
    }

    // Reset button
    const resetBtn = $('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetCalculator);
  }

  function handleSelectionChange(e) {
    const target = e.target;
    const idx = parseInt(target.dataset.index);
    if (isNaN(idx)) return;

    const sel = state.selections[idx];
    if (!sel) return;

    if (target.classList.contains('outcome-select')) {
      sel.outcome = target.value;
      updateDeadHeatVisibility();
    } else if (target.classList.contains('odds-num')) {
      sel.oddsNum = parseFloat(target.value) || 1;
      sel.decimalOdds = 1 + sel.oddsNum / (sel.oddsDen || 1);
    } else if (target.classList.contains('odds-den')) {
      sel.oddsDen = parseFloat(target.value) || 1;
      sel.decimalOdds = 1 + (sel.oddsNum || 1) / sel.oddsDen;
    } else if (target.classList.contains('odds-decimal')) {
      sel.decimalOdds = parseFloat(target.value) || 1;
    } else if (target.classList.contains('odds-american')) {
      sel.decimalOdds = toDecimal(target.value, 'american') || 1;
    } else if (target.classList.contains('rule4-select')) {
      sel.rule4 = parseInt(target.value) || 0;
    } else if (target.classList.contains('dh-input')) {
      sel.deadHeatRunners = parseInt(target.value) || 2;
    }

    recalculate();
  }

  // ─── Sync form → state ────────────────────────────────────────────────────
  function syncFormFromState() {
    const betTypeSel = $('bet-type-select');
    if (betTypeSel) betTypeSel.value = state.betType;

    const ewSel = $('each-way-select');
    if (ewSel) ewSel.value = state.isEachWay ? 'yes' : 'no';

    updateEachWayUI();
  }

  function updateEachWayUI() {
    const ewInfo = $('ew-info');
    if (ewInfo) ewInfo.style.display = state.isEachWay ? '' : 'none';

    // Update header labels
    const ewBadge = $('ew-badge');
    if (ewBadge) ewBadge.style.display = state.isEachWay ? 'inline-flex' : 'none';
  }

  // ─── Recalculate ──────────────────────────────────────────────────────────
  function recalculate() {
    const stake = parseFloat(state.stake);

    // Update bet count display
    updateBetCountDisplay();

    if (!state.stake || isNaN(stake) || stake <= 0) {
      setResultDisplay(null, null, null);
      return;
    }

    const params = {
      betType: state.betType,
      selections: state.selections,
      stake,
      stakeType: state.stakeType,
      isEachWay: state.isEachWay,
      bonuses: state.bonuses,
    };

    try {
      const result = calculateBet(params);
      setResultDisplay(result.totalOutlay, result.totalReturn, result.totalProfit);
    } catch (err) {
      console.error('Calculation error:', err);
      setResultDisplay(null, null, null);
    }
  }

  function updateBetCountDisplay() {
    const betCountEl = $('bet-count');
    if (!betCountEl) return;
    try {
      const n = getNumSelections();
      const count = getBetCount(state.betType, n, state.isEachWay);
      betCountEl.textContent = count;
    } catch (e) {
      betCountEl.textContent = '-';
    }
  }

  function setResultDisplay(outlay, ret, profit) {
    const fmtOutlay = $('result-outlay');
    const fmtReturn = $('result-return');
    const fmtProfit = $('result-profit');

    if (fmtOutlay) fmtOutlay.textContent = outlay !== null ? `£${outlay.toFixed(2)}` : '-';
    if (fmtReturn) fmtReturn.textContent = ret !== null ? `£${ret.toFixed(2)}` : '-';

    if (fmtProfit) {
      if (profit !== null) {
        fmtProfit.textContent = (profit >= 0 ? '+' : '') + `£${profit.toFixed(2)}`;
        fmtProfit.className = 'result-value ' + (profit >= 0 ? 'profit-positive' : 'profit-negative');
      } else {
        fmtProfit.textContent = '-';
        fmtProfit.className = 'result-value';
      }
    }
  }

  // ─── Reset ────────────────────────────────────────────────────────────────
  function resetCalculator() {
    state.betType = state.defaultBetType || 'lucky-15';
    state.isEachWay = false;
    state.oddsFormat = 'fractional';
    state.stakeType = 'per-bet';
    state.stake = '';
    state.showRule4 = false;
    state.selections = [];
    state.bonuses = { allWinnersBonus: '', oneWinnerConsolation: 'none' };

    const stakeInput = $('stake-input');
    if (stakeInput) stakeInput.value = '';

    const ewSel = $('each-way-select');
    if (ewSel) ewSel.value = 'no';

    const rule4Toggle = $('rule4-toggle');
    if (rule4Toggle) rule4Toggle.value = 'no';

    const awBonus = $('all-winners-bonus');
    if (awBonus) awBonus.value = '';

    const owConsolation = $('one-winner-consolation');
    if (owConsolation) owConsolation.value = 'none';

    buildBetTypeDropdown();
    syncFormFromState();
    buildSelectionRows();
    setResultDisplay(null, null, null);
  }

  // ─── Bootstrap ────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
