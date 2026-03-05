/**
 * Odds conversion utilities
 * Supports: Fractional, Decimal, American
 */

/**
 * Parse fractional odds string like "5/2" → { num: 5, den: 2 }
 */
function parseFractional(str) {
  if (!str) return null;
  const parts = String(str).split('/');
  if (parts.length !== 2) return null;
  const num = parseFloat(parts[0]);
  const den = parseFloat(parts[1]);
  if (isNaN(num) || isNaN(den) || den === 0) return null;
  return { num, den };
}

/**
 * Convert any odds format to decimal
 */
function toDecimal(value, format) {
  if (format === 'decimal') {
    const d = parseFloat(value);
    return isNaN(d) || d < 1 ? null : d;
  }

  if (format === 'fractional') {
    const frac = parseFractional(value);
    if (!frac) return null;
    return 1 + frac.num / frac.den;
  }

  if (format === 'american') {
    const a = parseFloat(value);
    if (isNaN(a)) return null;
    if (a > 0) return 1 + a / 100;
    if (a < 0) return 1 + 100 / Math.abs(a);
    return null;
  }

  return null;
}

/**
 * Convert decimal odds to fractional string (e.g. 3.5 → "5/2")
 */
function decimalToFractional(decimal) {
  if (!decimal || decimal <= 1) return '0/1';
  const profit = decimal - 1;

  // Find a reasonable fraction using GCD
  const precision = 1000;
  const num = Math.round(profit * precision);
  const den = precision;
  const g = gcd(num, den);
  return `${num / g}/${den / g}`;
}

/**
 * Convert decimal to American odds
 */
function decimalToAmerican(decimal) {
  if (!decimal || decimal <= 1) return '0';
  if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`;
  return `${Math.round(-100 / (decimal - 1))}`;
}

/**
 * Convert fractional odds to decimal display string
 */
function fractionalToDecimalStr(num, den) {
  if (!den || den === 0) return '';
  const dec = 1 + num / den;
  return dec.toFixed(2);
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

/**
 * Format a decimal number as currency
 */
function formatCurrency(amount, symbol = '£') {
  if (isNaN(amount) || amount === null || amount === undefined) return '-';
  return `${symbol}${Math.abs(amount).toFixed(2)}`;
}

/**
 * Format profit/loss with sign and colour class
 */
function formatProfit(amount) {
  if (isNaN(amount)) return { text: '-', cls: '' };
  if (amount > 0) return { text: `+£${amount.toFixed(2)}`, cls: 'profit-positive' };
  if (amount < 0) return { text: `-£${Math.abs(amount).toFixed(2)}`, cls: 'profit-negative' };
  return { text: '£0.00', cls: '' };
}

/**
 * Common fractional odds for quick selection
 */
const COMMON_FRACTIONAL_ODDS = [
  '1/10','1/8','1/6','1/5','2/9','1/4','2/7','3/10','1/3',
  '4/11','2/5','4/9','1/2','8/15','4/7','8/13','4/6','8/11',
  '4/5','5/6','10/11','1/1','11/10','6/5','5/4','11/8','7/5',
  '6/4','8/5','13/8','7/4','15/8','2/1','9/4','5/2','11/4',
  '3/1','100/30','7/2','4/1','9/2','5/1','6/1','7/1','8/1',
  '9/1','10/1','11/1','12/1','14/1','16/1','20/1','25/1',
  '33/1','40/1','50/1','66/1','100/1',
];
