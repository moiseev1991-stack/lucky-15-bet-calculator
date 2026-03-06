/**
 * Page generation data for all 30 calculator pages.
 * Used by the generate script to produce static HTML.
 */
const CALC_PAGES = [
  {
    key: 'single', file: 'single.html',
    title: 'Single Bet Calculator UK — Work Out Your Winnings | BetCalc UK',
    metaDesc: 'Free single bet calculator. Enter your odds and stake to instantly calculate your total return and profit. Supports fractional, decimal and American odds.',
    h1: 'Single Bet Calculator',
    intro: 'The simplest form of sports betting — one selection, one stake, one potential payout. Use our free single bet calculator to instantly work out your return and profit for any stake and odds.',
    what: '<p>A <strong>single bet</strong> is a wager on one selection to win (or place, if each-way). There is only 1 bet, meaning your outlay equals your stake. If your selection wins, your return is: <strong>Stake × Decimal Odds</strong>.</p>',
    formula: 'Return = Stake × Decimal Odds\nProfit = Return − Stake\n\nExample: £10 @ 3/1 (4.0 decimal)\nReturn = £10 × 4.0 = £40\nProfit = £40 − £10 = £30',
    selections: 1, bets: 1,
    faqs: [
      { q: 'How do I calculate a single bet return?', a: 'Multiply your stake by the decimal odds. For example, £5 at 4/1 (5.0 decimal) returns £25 (£20 profit + £5 stake back).' },
      { q: 'What is an each-way single?', a: 'An each-way single is two bets: one on your selection to win, and one on it to place. It doubles your total outlay but gives you a return even if your selection finishes second or third.' },
      { q: 'Do single bets have Rule 4 deductions?', a: 'Yes, in horse racing. If a horse is withdrawn from the race after you place your bet, a Rule 4 deduction is applied to your winnings. Enable "Show Rule 4" in the calculator to factor this in.' },
    ]
  },
  {
    key: 'each-way', file: 'each-way.html',
    title: 'Each Way Bet Calculator UK — Win & Place Returns | BetCalc UK',
    metaDesc: 'Calculate each way bet returns instantly. Works for horse racing, golf and football. Supports 1/4, 1/5 place terms and 2–7 places paid.',
    h1: 'Each Way Bet Calculator',
    intro: "An each-way bet is two bets in one — a win bet and a place bet on the same selection. Our each-way calculator works out both parts of the bet instantly, including different place terms set by your bookmaker.",
    what: '<p>An <strong>each-way (EW) bet</strong> consists of two equal stakes: one on the selection to win at full odds, and one on it to place at a fraction of the win odds (commonly 1/4 or 1/5). The number of places paid depends on the event — typically 2 for a 5-runner race, 3 for 8+ runners, and 4 for 16+ runners (handicaps).</p>',
    formula: 'Win Return  = Stake × Decimal Odds\nPlace Return = Stake × (1 + (Decimal Odds − 1) × Place Fraction)\nTotal Return = Win Return + Place Return (if won)\n           = Place Return only (if placed)',
    selections: 1, bets: 2,
    faqs: [
      { q: 'How many places does an each-way bet pay?', a: 'It depends on the number of runners and the bookmaker. Standard terms: 2 places for 5-7 runners, 3 places for 8-15 runners, 4 places for 16+ runners (handicaps). Always check your bookmaker\'s specific terms.' },
      { q: 'What place fraction does each-way use?', a: 'The most common fractions are 1/4 (25%) and 1/5 (20%) of the win odds. Some bookmakers offer enhanced terms for big races.' },
      { q: 'Can I do an each-way accumulator?', a: 'Yes. An each-way accumulator doubles the number of bets. A 4-selection EW Accumulator is 2 bets — one win accumulator and one place accumulator.' },
    ]
  },
  {
    key: 'double', file: 'double.html',
    title: 'Double Bet Calculator — Work Out Your Double Returns | BetCalc UK',
    metaDesc: 'Free double bet calculator. Enter odds for 2 selections and your stake to see your total return and profit instantly. Each-way and Rule 4 supported.',
    h1: 'Double Bet Calculator',
    intro: 'A double bet combines 2 selections into a single wager — both must win for you to collect. The winnings from the first selection roll over as the stake on the second, creating a multiplied return.',
    what: '<p>A <strong>double</strong> is 1 bet on 2 selections. Both selections must win. The return from the first selection becomes the stake on the second. This multiplier effect means doubles can deliver impressive returns even at modest odds.</p>',
    formula: 'Return = Stake × Odds_1 × Odds_2\n\nExample: £5 @ 2/1 (3.0) and 3/1 (4.0)\nReturn = £5 × 3.0 × 4.0 = £60\nProfit = £60 − £5 = £55',
    selections: 2, bets: 1,
    faqs: [
      { q: 'How much does a £1 double cost?', a: 'A double is just 1 bet, so a £1 double costs exactly £1.' },
      { q: 'What if one selection is a non-runner in my double?', a: 'If one selection is void or a non-runner, the double reverts to a single on the remaining selection.' },
      { q: 'What is the minimum odds to make a double worthwhile?', a: 'Both selections need odds greater than evens (1/1) for the double to offer more value than two separate singles, though the risk is higher since both must win.' },
    ]
  },
  {
    key: 'treble', file: 'treble.html',
    title: 'Treble Bet Calculator — Calculate Your 3-Fold Returns | BetCalc UK',
    metaDesc: 'Free treble bet calculator. All 3 selections must win to collect. Enter your odds and stake for an instant return and profit calculation.',
    h1: 'Treble Bet Calculator',
    intro: 'A treble links 3 selections in one bet — all three must win. The winnings from selection 1 roll over to selection 2, then to selection 3, creating a powerful multiplier effect.',
    what: '<p>A <strong>treble</strong> is 1 bet on 3 selections. All three must win for a return. Like a double, the winnings accumulate through each leg. A treble is the minimum number of selections for a "full roll-up" bet that can return significant multiples of the original stake.</p>',
    formula: 'Return = Stake × Odds_1 × Odds_2 × Odds_3\n\nExample: £5 @ 2/1, 3/1, Evens (3.0 × 4.0 × 2.0)\nReturn = £5 × 3.0 × 4.0 × 2.0 = £120\nProfit = £120 − £5 = £115',
    selections: 3, bets: 1,
    faqs: [
      { q: 'What happens if one leg of my treble loses?', a: 'If any one selection loses, the entire treble loses. There is no partial return on a straight treble — this is why many punters prefer a Patent (which also includes singles and doubles).' },
      { q: 'What is the difference between a treble and a Trixie?', a: 'A Trixie covers the same 3 selections but also adds 3 doubles, giving you 4 bets total. A treble is just 1 bet and requires all 3 to win.' },
      { q: 'Can I do an each-way treble?', a: 'Yes. An each-way treble becomes 2 bets — one on all three to win, and one on all three to place. Both selections need to make it through all three legs.' },
    ]
  },
  {
    key: 'accumulator', file: 'accumulator.html',
    title: 'Accumulator Bet Calculator — Acca Returns | BetCalc UK',
    metaDesc: 'Free accumulator (acca) bet calculator. Calculate potential returns for 4 to 20 selections. Supports void legs, each-way and Rule 4 deductions.',
    h1: 'Accumulator Bet Calculator',
    intro: 'The accumulator — or "acca" — is the most popular multiple bet in the UK. All selections must win, but the potential returns can be huge. Our accumulator calculator handles 4 to 20 selections instantly.',
    what: '<p>An <strong>accumulator</strong> is 1 bet on 4 or more selections, all of which must win. Each winner\'s return rolls over to the next leg. With just 4 selections at 2/1 each, a £1 acca returns £81. The more legs, the bigger the potential payout — and the bigger the risk.</p>',
    formula: 'Return = Stake × (Odds_1 × Odds_2 × ... × Odds_n)\n\n4-fold example: £2 @ 2/1, 2/1, 3/1, 4/1\n= £2 × 3.0 × 3.0 × 4.0 × 5.0 = £360\nProfit = £360 − £2 = £358',
    selections: 4, bets: 1,
    faqs: [
      { q: 'How many selections can I have in an accumulator?', a: 'Technically unlimited, but most bookmakers cap accumulators at 20 legs. Our calculator supports up to 20 selections.' },
      { q: 'What happens if a match is postponed in my acca?', a: 'A postponed or cancelled match is treated as void. The selection is removed from the accumulator and the remaining legs continue as a shorter accumulator.' },
      { q: 'What is an accumulator bonus?', a: 'Many bookmakers offer an "acca boost" or accumulator bonus — extra winnings added on top of your return when all legs win. Common boosts range from 5% to 50% depending on the number of legs.' },
    ]
  },
  {
    key: 'trixie', file: 'trixie.html',
    title: 'Trixie Bet Calculator — 3 Selections, 4 Bets | BetCalc UK',
    metaDesc: 'Free Trixie bet calculator. 3 doubles + 1 treble = 4 bets. Enter odds and stake to calculate total return and profit with each-way support.',
    h1: 'Trixie Bet Calculator',
    intro: 'A Trixie is a full-cover bet on 3 selections consisting of 3 doubles and 1 treble — 4 bets in total. You only need 2 winners to get a return, unlike a straight treble which requires all 3.',
    what: '<p>A <strong>Trixie</strong> contains: <strong>3 doubles</strong> (selections 1-2, 1-3, 2-3) and <strong>1 treble</strong> (all 3 selections) — 4 bets total. You need a minimum of 2 winners to see a return. It\'s a popular choice for horse racing, offering coverage without the risk of a treble.</p>',
    formula: 'Bets: (1,2), (1,3), (2,3), (1,2,3)\nTotal Bets = 4\n\n£1 Trixie total outlay = £4',
    selections: 3, bets: 4,
    faqs: [
      { q: 'How many winners do I need in a Trixie?', a: 'You need at least 2 winners to get any return from a Trixie (from the doubles). With all 3 winning, all 4 bets pay out.' },
      { q: 'What is the difference between a Trixie and a Patent?', a: 'A Patent includes 3 singles in addition to the 3 doubles and 1 treble, giving 7 bets total. This means a single winner gives you a return in a Patent but not in a Trixie.' },
      { q: 'Is a Trixie each-way possible?', a: 'Yes. An each-way Trixie doubles the bets to 8 (4 win + 4 place), doubling the total outlay.' },
    ]
  },
  {
    key: 'patent', file: 'patent.html',
    title: 'Patent Bet Calculator — 3 Selections, 7 Bets | BetCalc UK',
    metaDesc: 'Free Patent bet calculator. 3 singles, 3 doubles, 1 treble = 7 bets. Just one winner gives a return. Each-way and Rule 4 supported.',
    h1: 'Patent Bet Calculator',
    intro: 'A Patent is a full-cover bet on 3 selections: 3 singles, 3 doubles, and 1 treble — 7 bets in total. Just one winner gets you a return, making it a popular and safer alternative to a Trixie.',
    what: '<p>A <strong>Patent</strong> consists of: <strong>3 singles</strong> (each selection individually), <strong>3 doubles</strong> (all pairs), and <strong>1 treble</strong> (all three) — 7 bets in total. A £1 Patent costs £7. Because singles are included, even just one winner produces a return.</p>',
    formula: 'Bets: (1),(2),(3),(1,2),(1,3),(2,3),(1,2,3)\nTotal Bets = 7\n\n£1 Patent total outlay = £7',
    selections: 3, bets: 7,
    faqs: [
      { q: 'Why choose a Patent over a Trixie?', a: 'A Patent includes singles, so just one winning selection returns something. A Trixie requires 2 winners. The trade-off is cost: a Patent is £7 vs £4 for a Trixie at the same unit stake.' },
      { q: 'How much does a £0.50 Patent cost?', a: 'A Patent contains 7 bets, so a 50p Patent costs 7 × £0.50 = £3.50.' },
      { q: 'What is an each-way Patent?', a: 'An each-way Patent is 14 bets (7 win + 7 place), doubling the total outlay.' },
    ]
  },
  {
    key: 'yankee', file: 'yankee.html',
    title: 'Yankee Bet Calculator — 4 Selections, 11 Bets | BetCalc UK',
    metaDesc: 'Free Yankee bet calculator. 6 doubles, 4 trebles, 1 four-fold = 11 bets. Calculate returns for any odds and stake instantly.',
    h1: 'Yankee Bet Calculator',
    intro: 'A Yankee is one of the most popular multiple bets in UK horse racing. It covers 4 selections with 11 bets: 6 doubles, 4 trebles, and 1 four-fold accumulator. You need just 2 winners for a return.',
    what: '<p>A <strong>Yankee</strong> covers all combinations from 2 to 4 selections: <strong>6 doubles</strong>, <strong>4 trebles</strong>, and <strong>1 four-fold</strong> — 11 bets in total. A £1 Yankee costs £11. You need a minimum of 2 winners to get a return. Compare this to a Lucky 15 which also includes 4 singles.</p>',
    formula: 'Bets = C(4,2) + C(4,3) + C(4,4)\n     = 6 + 4 + 1 = 11\n\n£1 Yankee total outlay = £11',
    selections: 4, bets: 11,
    faqs: [
      { q: 'How many winners do I need in a Yankee?', a: 'You need at least 2 winners to get a return from a Yankee (via the doubles). With all 4 winning, all 11 bets pay out.' },
      { q: 'What is the difference between a Yankee and a Lucky 15?', a: 'A Lucky 15 adds 4 singles to the 11 Yankee bets, giving 15 bets total. This means a single winner returns something in a Lucky 15 but not in a Yankee.' },
      { q: 'Is a Yankee a good bet?', a: 'A Yankee is popular because it provides good coverage across 4 selections without needing all 4 to win. However, it costs more than a straight accumulator (11 bets vs 1 bet).' },
    ]
  },
  {
    key: 'canadian', file: 'canadian.html',
    title: 'Canadian Bet Calculator — 5 Selections, 26 Bets | BetCalc UK',
    metaDesc: 'Free Canadian (Super Yankee) bet calculator. 10 doubles, 10 trebles, 5 four-folds, 1 five-fold = 26 bets. Calculate returns instantly.',
    h1: 'Canadian Bet Calculator (Super Yankee)',
    intro: 'A Canadian — also known as a Super Yankee — covers 5 selections with 26 bets: every combination of doubles through to a five-fold accumulator. You need just 2 winners for a return.',
    what: '<p>A <strong>Canadian</strong> (Super Yankee) covers 5 selections with: <strong>10 doubles</strong>, <strong>10 trebles</strong>, <strong>5 four-folds</strong>, and <strong>1 five-fold</strong> — 26 bets in total. A £1 Canadian costs £26. The Super Yankee is simply another name for the exact same bet.</p>',
    formula: 'Bets = C(5,2)+C(5,3)+C(5,4)+C(5,5)\n     = 10+10+5+1 = 26\n\n£1 Canadian total outlay = £26',
    selections: 5, bets: 26,
    faqs: [
      { q: 'What is the difference between a Canadian and a Super Yankee?', a: 'There is no difference — Canadian and Super Yankee are two names for exactly the same bet: 26 bets across 5 selections.' },
      { q: 'How many winners do I need for a Canadian?', a: 'A minimum of 2 winners is needed for any return, as the smallest bets are doubles.' },
      { q: 'How much does a £1 Canadian cost?', a: 'A Canadian consists of 26 bets, so a £1 Canadian costs £26 in total.' },
    ]
  },
  {
    key: 'super-yankee', file: 'super-yankee.html',
    title: 'Super Yankee Bet Calculator — 5 Selections, 26 Bets | BetCalc UK',
    metaDesc: 'Free Super Yankee (Canadian) bet calculator. Calculate returns for 26 bets across 5 selections including doubles, trebles, four-folds and five-fold.',
    h1: 'Super Yankee Bet Calculator',
    intro: 'A Super Yankee is the same as a Canadian bet — 26 bets covering all combinations of 5 selections from doubles to a five-fold accumulator. Just 2 winners gives you a return.',
    what: '<p>The <strong>Super Yankee</strong> and <strong>Canadian</strong> are two names for the same bet: 10 doubles, 10 trebles, 5 four-folds and 1 five-fold accumulator across 5 selections — 26 bets in total.</p>',
    formula: 'Bets = C(5,2)+C(5,3)+C(5,4)+C(5,5) = 26\n£1 Super Yankee total outlay = £26',
    selections: 5, bets: 26,
    faqs: [
      { q: 'Is a Super Yankee the same as a Canadian?', a: 'Yes, they are identical bets. Canadian is the more commonly used name in horse racing; Super Yankee is often used in football betting.' },
      { q: 'How many selections does a Super Yankee need?', a: 'A Super Yankee requires exactly 5 selections.' },
      { q: 'What is the minimum number of winners needed?', a: 'Two winners are required for any return from a Super Yankee, as the smallest component bets are doubles.' },
    ]
  },
  {
    key: 'heinz', file: 'heinz.html',
    title: 'Heinz Bet Calculator — 6 Selections, 57 Bets | BetCalc UK',
    metaDesc: 'Free Heinz bet calculator. Named after the "57 varieties", this covers 6 selections with 57 bets. Calculate your returns instantly.',
    h1: 'Heinz Bet Calculator',
    intro: 'The Heinz bet is named after the famous 57 varieties of Heinz products — because it consists of 57 bets across 6 selections: all combinations from doubles to a six-fold accumulator.',
    what: '<p>A <strong>Heinz</strong> covers 6 selections with: <strong>15 doubles</strong>, <strong>20 trebles</strong>, <strong>15 four-folds</strong>, <strong>6 five-folds</strong>, and <strong>1 six-fold</strong> — 57 bets in total. A £1 Heinz costs £57. You need at least 2 winners for any return.</p>',
    formula: 'Bets = C(6,2)+C(6,3)+C(6,4)+C(6,5)+C(6,6)\n     = 15+20+15+6+1 = 57',
    selections: 6, bets: 57,
    faqs: [
      { q: 'Why is it called a Heinz bet?', a: 'It is named after Heinz\'s famous marketing slogan "57 Varieties" — the bet has exactly 57 individual wagers across 6 selections.' },
      { q: 'How much does a £1 Heinz cost?', a: 'A Heinz has 57 bets, so a £1 Heinz costs £57 in total.' },
      { q: 'What is the difference between a Heinz and a Super Heinz?', a: 'A Super Heinz covers 7 selections with 120 bets. A Heinz covers 6 selections with 57 bets.' },
    ]
  },
  {
    key: 'super-heinz', file: 'super-heinz.html',
    title: 'Super Heinz Bet Calculator — 7 Selections, 120 Bets | BetCalc UK',
    metaDesc: 'Free Super Heinz bet calculator. 120 bets across 7 selections covering doubles to seven-fold accumulator. Instant return calculation.',
    h1: 'Super Heinz Bet Calculator',
    intro: 'A Super Heinz covers 7 selections with 120 bets — every combination from doubles through to a seven-fold accumulator. A massive full-cover bet most commonly used for horse racing Saturdays.',
    what: '<p>A <strong>Super Heinz</strong> consists of: <strong>21 doubles</strong>, <strong>35 trebles</strong>, <strong>35 four-folds</strong>, <strong>21 five-folds</strong>, <strong>7 six-folds</strong>, and <strong>1 seven-fold</strong> — 120 bets in total.</p>',
    formula: 'Bets = C(7,2)+C(7,3)+C(7,4)+C(7,5)+C(7,6)+C(7,7)\n     = 21+35+35+21+7+1 = 120',
    selections: 7, bets: 120,
    faqs: [
      { q: 'How much does a £1 Super Heinz cost?', a: 'A Super Heinz has 120 bets, so a £1 Super Heinz costs £120 in total.' },
      { q: 'How many winners do I need in a Super Heinz?', a: 'At least 2 winners are needed for any return, as doubles are the smallest bets included.' },
      { q: 'Is a Super Heinz a good bet for horse racing?', a: 'A Super Heinz provides excellent coverage across 7 selections but requires a significant outlay. It is most popular on big horse racing days when punters want coverage across a full card.' },
    ]
  },
  {
    key: 'goliath', file: 'goliath.html',
    title: 'Goliath Bet Calculator — 8 Selections, 247 Bets | BetCalc UK',
    metaDesc: 'Free Goliath bet calculator. The largest standard full-cover bet — 247 bets across 8 selections. Calculate returns for any stake and odds.',
    h1: 'Goliath Bet Calculator',
    intro: 'The Goliath is the largest standard full-cover bet available — 247 bets across 8 selections, covering every combination from doubles to the full eight-fold accumulator. Not for the faint-hearted!',
    what: '<p>A <strong>Goliath</strong> covers 8 selections with: <strong>28 doubles</strong>, <strong>56 trebles</strong>, <strong>70 four-folds</strong>, <strong>56 five-folds</strong>, <strong>28 six-folds</strong>, <strong>8 seven-folds</strong>, and <strong>1 eight-fold</strong> — 247 bets in total.</p>',
    formula: 'Bets = 28+56+70+56+28+8+1 = 247\n£1 Goliath total outlay = £247',
    selections: 8, bets: 247,
    faqs: [
      { q: 'How much does a 10p Goliath cost?', a: 'A Goliath has 247 bets, so at 10p per bet the total outlay is £24.70.' },
      { q: 'How many selections does a Goliath need?', a: 'A Goliath always requires exactly 8 selections.' },
      { q: 'When would you use a Goliath bet?', a: 'A Goliath is used when you have high confidence in 8 selections and want maximum coverage. It\'s popular on big horse racing festivals like Cheltenham and Ascot.' },
    ]
  },
  {
    key: 'lucky-31', file: 'lucky-31.html',
    title: 'Lucky 31 Bet Calculator — 5 Selections, 31 Bets | BetCalc UK',
    metaDesc: 'Free Lucky 31 bet calculator. 5 singles, 10 doubles, 10 trebles, 5 four-folds, 1 five-fold = 31 bets. Instant returns with bookmaker bonus support.',
    h1: 'Lucky 31 Bet Calculator',
    intro: 'The Lucky 31 covers 5 selections with 31 bets — every combination from singles to a five-fold accumulator. One winner gives you a return, and bookmaker bonuses can significantly boost your winnings.',
    what: '<p>A <strong>Lucky 31</strong> consists of: <strong>5 singles</strong>, <strong>10 doubles</strong>, <strong>10 trebles</strong>, <strong>5 four-folds</strong>, and <strong>1 five-fold</strong> — 31 bets in total. Like the Lucky 15, it\'s a full-cover bet meaning all combinations of all sizes are included.</p>',
    formula: 'Bets = C(5,1)+C(5,2)+C(5,3)+C(5,4)+C(5,5)\n     = 5+10+10+5+1 = 31\n\n£1 Lucky 31 total outlay = £31',
    selections: 5, bets: 31,
    faqs: [
      { q: 'How much does a £1 Lucky 31 cost?', a: 'A Lucky 31 has 31 bets, so a £1 Lucky 31 costs £31 total.' },
      { q: 'How many winners do I need in a Lucky 31?', a: 'Just one winner gives you a return from the singles. The more winners, the greater the return.' },
      { q: 'What is the difference between Lucky 31 and Lucky 63?', a: 'A Lucky 63 has 6 selections and 63 bets, whereas a Lucky 31 has 5 selections and 31 bets. Both are full-cover bets including singles.' },
    ]
  },
  {
    key: 'lucky-63', file: 'lucky-63.html',
    title: 'Lucky 63 Bet Calculator — 6 Selections, 63 Bets | BetCalc UK',
    metaDesc: 'Free Lucky 63 bet calculator. 6 singles, 15 doubles, 20 trebles, 15 four-folds, 6 five-folds, 1 six-fold = 63 bets. Full each-way and bonus support.',
    h1: 'Lucky 63 Bet Calculator',
    intro: 'The Lucky 63 is the big brother of the Lucky 15 and Lucky 31 — covering 6 selections with 63 bets. Popular for Saturday horse racing and football, it gives you maximum coverage across six events.',
    what: '<p>A <strong>Lucky 63</strong> consists of: <strong>6 singles</strong>, <strong>15 doubles</strong>, <strong>20 trebles</strong>, <strong>15 four-folds</strong>, <strong>6 five-folds</strong>, and <strong>1 six-fold</strong> — 63 bets in total. Just one winner returns a profit, and with 6 selections there are massive combinations for all winners.</p>',
    formula: 'Bets = C(6,1)+C(6,2)+C(6,3)+C(6,4)+C(6,5)+C(6,6)\n     = 6+15+20+15+6+1 = 63\n\n£1 Lucky 63 total outlay = £63',
    selections: 6, bets: 63,
    faqs: [
      { q: 'How much does a £1 Lucky 63 cost?', a: 'A Lucky 63 has 63 bets, so a £1 Lucky 63 costs £63 total.' },
      { q: 'Is a Lucky 63 worth it?', a: 'A Lucky 63 provides the widest coverage of any lucky bet type, making it ideal when you have 6 reasonably confident selections. The cost is high but the potential returns if multiple selections win are substantial.' },
      { q: 'What is the difference between Lucky 63 and Heinz?', a: 'Both cover 6 selections. A Heinz has 57 bets (doubles to six-fold only). A Lucky 63 has 63 bets — it adds 6 singles for extra coverage and the ability to return something with just one winner.' },
    ]
  },
  {
    key: 'alphabet', file: 'alphabet.html',
    title: 'Alphabet Bet Calculator — 6 Selections, 26 Bets | BetCalc UK',
    metaDesc: 'Free Alphabet bet calculator. An exotic 26-bet combination: 2 Patents, 1 Yankee and 1 six-fold. Calculate returns instantly.',
    h1: 'Alphabet Bet Calculator',
    intro: 'The Alphabet is a unique 26-bet combination across 6 selections: two separate Patents on selections 1-2-3 and 4-5-6, a Yankee on selections 2-3-4-5, and a six-fold accumulator on all six.',
    what: '<p>An <strong>Alphabet</strong> bet is structured as: <strong>Patent 1</strong> (selections 1,2,3: 7 bets), <strong>Patent 2</strong> (selections 4,5,6: 7 bets), <strong>Yankee</strong> (selections 2,3,4,5: 11 bets), and <strong>1 six-fold</strong> (all 6 selections) — 26 bets in total.</p>',
    formula: 'Patent(1,2,3) = 7 bets\nPatent(4,5,6) = 7 bets\nYankee(2,3,4,5) = 11 bets\nSix-fold(1-6) = 1 bet\nTotal = 26 bets',
    selections: 6, bets: 26,
    faqs: [
      { q: 'Why is it called an Alphabet bet?', a: 'The name refers to the pattern made when the bet structure is drawn on a grid — the lines connecting the selections resemble letters of the alphabet.' },
      { q: 'How many winners do I need in an Alphabet?', a: 'One winner from selections 1, 2, or 3 gives a return from the first Patent. One winner from selections 4, 5, or 6 gives a return from the second Patent.' },
      { q: 'Is the Alphabet bet popular?', a: 'The Alphabet is a relatively niche bet type, most popular with experienced horse racing punters who want a structured coverage pattern across 6 selections.' },
    ]
  },
  {
    key: 'single-stakes-about', file: 'single-stakes-about.html',
    title: 'Single Stakes About (SSA) Bet Calculator | BetCalc UK',
    metaDesc: 'Free Single Stakes About bet calculator. Also known as Up-and-Down. Calculate returns for this 2-selection, 2-bet wager instantly.',
    h1: 'Single Stakes About (Up & Down) Bet Calculator',
    intro: 'A Single Stakes About (SSA) — also called an Up-and-Down bet — is a clever 2-selection bet where the winnings from selection A are placed on selection B, and vice versa. It maximises returns when both selections win.',
    what: '<p>In a <strong>Single Stakes About</strong>: Bet 1 backs Selection A to win, and if it wins, the return is staked on Selection B. Bet 2 backs Selection B to win, and if it wins, the return is staked on Selection A. Both bets run simultaneously — 2 bets total.</p>',
    formula: 'If A wins: Return from A rolls to B\nIf B wins: Return from B rolls to A\nIf both win: Full compound return on both legs\nIf one loses: Only the losing direction loses',
    selections: 2, bets: 2,
    faqs: [
      { q: 'What is the difference between SSA and DSA?', a: 'In a Single Stakes About, a single stake is invested on each direction. In a Double Stakes About, double the stake is invested on each direction.' },
      { q: 'When is an SSA bet useful?', a: 'An SSA is useful when you fancy two selections but want to mitigate the risk of a straight double. If one selection wins and the other is placed (each-way), you still receive a return.' },
      { q: 'Is an SSA the same as a Round Robin?', a: 'No. A Round Robin includes 3 selections, 3 doubles, 1 treble, and 3 SSA pairs across the three possible pairings — 10 bets in total.' },
    ]
  },
  {
    key: 'double-stakes-about', file: 'double-stakes-about.html',
    title: 'Double Stakes About (DSA) Bet Calculator | BetCalc UK',
    metaDesc: 'Free Double Stakes About bet calculator. Like an SSA but with double the stake on each direction. 2 selections, 2 bets.',
    h1: 'Double Stakes About (DSA) Bet Calculator',
    intro: 'A Double Stakes About works like a Single Stakes About but with double the stake investment on each direction. It is a 2-bet wager on 2 selections where the winnings flow between selections.',
    what: '<p>A <strong>Double Stakes About (DSA)</strong> is similar to an SSA but each direction carries double the individual stake. This means if both selections win, the compound return is significantly larger than an SSA at the same unit stake.</p>',
    formula: 'DSA = 2 × SSA in each direction\nTotal bets = 2\n£1 DSA costs £2 (same as SSA)',
    selections: 2, bets: 2,
    faqs: [
      { q: 'How does a DSA differ from an SSA?', a: 'Both have 2 bets, but in a DSA, the effective stake on each direction is doubled, amplifying returns when both selections win.' },
      { q: 'What is the cost of a £1 DSA?', a: 'A DSA has 2 bets, so a £1 DSA costs £2 total.' },
    ]
  },
  {
    key: 'round-robin', file: 'round-robin.html',
    title: 'Round Robin Bet Calculator — 3 Selections, 10 Bets | BetCalc UK',
    metaDesc: 'Free Round Robin bet calculator. 3 doubles, 1 treble, 3 SSA pairs = 10 bets. Calculate returns for all outcomes instantly.',
    h1: 'Round Robin Bet Calculator',
    intro: 'A Round Robin covers 3 selections with 10 bets: 3 doubles, 1 treble, and 3 Single Stakes About (Up-and-Down) pairs — offering comprehensive coverage across all possible win combinations.',
    what: '<p>A <strong>Round Robin</strong> consists of: <strong>3 doubles</strong>, <strong>1 treble</strong>, and <strong>3 Single Stakes About pairs</strong> — 10 bets in total. The SSA pairs mean that even if only one selection wins, you still receive a return through the Up-and-Down structure.</p>',
    formula: 'Bets: 3 doubles + 1 treble + 3 SSA pairs\nTotal = 10 bets\n£1 Round Robin costs £10',
    selections: 3, bets: 10,
    faqs: [
      { q: 'What is the difference between a Round Robin and a Patent?', a: 'A Patent has 7 bets (3 singles + 3 doubles + 1 treble). A Round Robin has 10 bets (3 doubles + 1 treble + 3 SSA pairs). The Round Robin replaces singles with the more complex SSA structure.' },
      { q: 'How many winners do I need in a Round Robin?', a: 'One winner gives you a return via the SSA pairs. Two or more winners means doubles and potentially the treble also pay out.' },
    ]
  },
  {
    key: 'flag', file: 'flag.html',
    title: 'Flag Bet Calculator — 4 Selections, 23 Bets | BetCalc UK',
    metaDesc: 'Free Flag bet calculator. 6 doubles, 4 trebles, 1 four-fold, 6 SSA pairs = 23 bets. Calculate returns for this full-cover bet.',
    h1: 'Flag Bet Calculator',
    intro: 'A Flag bet covers 4 selections with 23 bets: 6 doubles, 4 trebles, 1 four-fold, and 6 Single Stakes About pairs. It offers the coverage of a Yankee with added SSA protection.',
    what: '<p>A <strong>Flag</strong> consists of: <strong>6 doubles</strong>, <strong>4 trebles</strong>, <strong>1 four-fold</strong>, and <strong>6 SSA pairs</strong> — 23 bets in total. It\'s essentially a Yankee (11 bets) plus 6 SSA pairs (12 bets) + 1... actually 23 total. Compare to a Yankee: the Flag\'s SSA pairs add extra return potential from the Up-and-Down structure.</p>',
    formula: 'Bets: 6 doubles + 4 trebles + 1 fourfold + 6 SSA pairs\nTotal = 23 bets\n£1 Flag costs £23',
    selections: 4, bets: 23,
    faqs: [
      { q: 'What is a Flag bet?', a: 'A Flag is a 4-selection bet combining the standard Yankee bets (doubles, trebles, fourfold) with 6 Single Stakes About pairs across all possible pairings of the 4 selections.' },
      { q: 'How does a Flag compare to a Yankee?', a: 'A Yankee has 11 bets. A Flag has 23 bets — it adds 12 extra bets through the SSA pairs, providing additional returns if selections win in different orders.' },
    ]
  },
  {
    key: 'super-flag', file: 'super-flag.html',
    title: 'Super Flag Bet Calculator — 5 Selections, 46 Bets | BetCalc UK',
    metaDesc: 'Free Super Flag bet calculator. Doubles, trebles, four-folds, five-fold and SSA pairs across 5 selections = 46 bets.',
    h1: 'Super Flag Bet Calculator',
    intro: 'A Super Flag extends the Flag bet to 5 selections: doubles, trebles, four-folds, a five-fold accumulator, and 10 SSA pairs — 46 bets in total.',
    what: '<p>A <strong>Super Flag</strong> covers 5 selections with: <strong>10 doubles</strong>, <strong>10 trebles</strong>, <strong>5 four-folds</strong>, <strong>1 five-fold</strong>, and <strong>10 SSA pairs</strong> — 46 bets in total.</p>',
    formula: 'Bets: 10+10+5+1 (Canadian) + 10 SSA pairs\nTotal = 46 bets\n£1 Super Flag costs £46',
    selections: 5, bets: 46,
    faqs: [
      { q: 'How many bets is a Super Flag?', a: 'A Super Flag consists of 46 individual bets across 5 selections.' },
      { q: 'What is the difference between a Super Flag and a Canadian?', a: 'A Canadian (Super Yankee) has 26 bets. A Super Flag has 46 bets — it adds 10 SSA pairs on top of the Canadian bets.' },
    ]
  },
  {
    key: 'heinz-flag', file: 'heinz-flag.html',
    title: 'Heinz Flag Bet Calculator — 6 Selections, 87 Bets | BetCalc UK',
    metaDesc: 'Free Heinz Flag bet calculator. All doubles to six-fold combinations plus SSA pairs across 6 selections = 87 bets total.',
    h1: 'Heinz Flag Bet Calculator',
    intro: 'A Heinz Flag extends the Heinz to include SSA pairs across all 6 selections, creating a comprehensive 87-bet wager.',
    what: '<p>A <strong>Heinz Flag</strong> combines the 57-bet Heinz with 15 SSA pairs (one for each pair from 6 selections) — wait, actually the correct count is: 15 doubles + 20 trebles + 15 four-folds + 6 five-folds + 1 six-fold + 15 SSA pairs = <strong>72 + 15 = 87 bets</strong>.</p>',
    formula: 'Heinz (57 bets) + 15 SSA pairs = 87 bets total\n£1 Heinz Flag costs £87',
    selections: 6, bets: 87,
    faqs: [
      { q: 'How many bets is a Heinz Flag?', a: 'A Heinz Flag has 87 bets: the 57 Heinz bets plus 30 SSA bets (15 pairs × 2 directions).' },
      { q: 'When is a Heinz Flag useful?', a: 'A Heinz Flag is useful for experienced punters placing 6 selections who want complete coverage including Up-and-Down pairs.' },
    ]
  },
  {
    key: 'super-heinz-flag', file: 'super-heinz-flag.html',
    title: 'Super Heinz Flag Bet Calculator — 7 Selections, 162 Bets | BetCalc UK',
    metaDesc: 'Free Super Heinz Flag bet calculator. 7 selections, 162 bets including all combinations plus SSA pairs.',
    h1: 'Super Heinz Flag Bet Calculator',
    intro: 'A Super Heinz Flag is the Super Heinz (120 bets) extended with SSA pairs across all 7 selections — resulting in 162 total bets.',
    what: '<p>A <strong>Super Heinz Flag</strong> combines: <strong>120 Super Heinz bets</strong> plus <strong>21 SSA pairs</strong> (× 2 directions = 42 additional bets) — 162 bets in total.</p>',
    formula: 'Super Heinz (120) + 21 SSA pairs (42 bets) = 162 bets\n£1 Super Heinz Flag costs £162',
    selections: 7, bets: 162,
    faqs: [
      { q: 'How many bets is a Super Heinz Flag?', a: 'A Super Heinz Flag has 162 bets across 7 selections.' },
    ]
  },
  {
    key: 'goliath-flag', file: 'goliath-flag.html',
    title: 'Goliath Flag Bet Calculator — 8 Selections, 303 Bets | BetCalc UK',
    metaDesc: 'Free Goliath Flag bet calculator. 8 selections, 303 bets — the Goliath plus all SSA pairs. Calculate returns instantly.',
    h1: 'Goliath Flag Bet Calculator',
    intro: 'The Goliath Flag is the largest standard flag bet — 303 bets across 8 selections. The 247-bet Goliath plus 28 SSA pairs (56 additional bets).',
    what: '<p>A <strong>Goliath Flag</strong> consists of: <strong>247 Goliath bets</strong> plus <strong>28 SSA pairs</strong> (56 additional bets) — 303 bets in total. This is one of the most expensive standard bet types available.</p>',
    formula: 'Goliath (247) + 28 SSA pairs (56 bets) = 303 bets\n£1 Goliath Flag costs £303',
    selections: 8, bets: 303,
    faqs: [
      { q: 'How much does a £1 Goliath Flag cost?', a: 'A Goliath Flag has 303 bets, so a £1 Goliath Flag costs £303 in total.' },
      { q: 'Is a Goliath Flag common?', a: 'The Goliath Flag is relatively rare due to its extreme cost, but it provides the maximum possible coverage across 8 selections.' },
    ]
  },
  {
    key: 'union-jack-trebles', file: 'union-jack-trebles.html',
    title: 'Union Jack Trebles Calculator — 9 Selections, 8 Bets | BetCalc UK',
    metaDesc: 'Free Union Jack Trebles bet calculator. 8 trebles arranged in a 3x3 grid pattern. Calculate returns for this unique bet type.',
    h1: 'Union Jack Trebles Bet Calculator',
    intro: 'The Union Jack Trebles uses a unique 3×3 grid of 9 selections to form 8 trebles along the grid\'s rows, columns and diagonals — the lines that form the Union Jack flag pattern.',
    what: '<p>A <strong>Union Jack Trebles</strong> bet places 9 selections in a 3×3 grid (numbered 1-9). The 8 trebles are taken along the 3 rows, 3 columns, and 2 diagonals of the grid — like the lines of the Union Jack flag.</p>',
    formula: 'Grid positions:\n1 | 2 | 3\n4 | 5 | 6\n7 | 8 | 9\n\nTrebles: rows(1,2,3)(4,5,6)(7,8,9)\nColumns: (1,4,7)(2,5,8)(3,6,9)\nDiagonals: (1,5,9)(3,5,7)\nTotal = 8 bets',
    selections: 9, bets: 8,
    faqs: [
      { q: 'Why is it called Union Jack Trebles?', a: 'The bet is named after the Union Jack flag. When the winning lines of the 3x3 grid are drawn, they form the pattern of the Union Jack.' },
      { q: 'How does the grid layout work?', a: 'You place 9 selections in positions 1-9 on a 3×3 grid. Trebles are formed from the 3 rows, 3 columns and 2 diagonals.' },
      { q: 'How many winners do I need?', a: 'To win any bet, you need all 3 selections in at least one winning line (row, column or diagonal) to all win.' },
    ]
  },
  {
    key: 'union-jack-trixie', file: 'union-jack-trixie.html',
    title: 'Union Jack Trixie Calculator — 9 Selections, 32 Bets | BetCalc UK',
    metaDesc: 'Free Union Jack Trixie bet calculator. 8 trebles plus 24 doubles from the Union Jack grid pattern = 32 bets.',
    h1: 'Union Jack Trixie Bet Calculator',
    intro: 'The Union Jack Trixie extends the Union Jack Trebles by adding all unique doubles from the 8 treble lines — giving 32 bets total and a return even with just 2 winners on the same line.',
    what: '<p>A <strong>Union Jack Trixie</strong> consists of the same <strong>8 trebles</strong> as Union Jack Trebles, plus <strong>24 doubles</strong> (from all pairs within those 8 trebles) — 32 bets in total.</p>',
    formula: '8 trebles + 24 doubles = 32 bets\n£1 Union Jack Trixie costs £32',
    selections: 9, bets: 32,
    faqs: [
      { q: 'How many bets is a Union Jack Trixie?', a: 'A Union Jack Trixie has 32 bets: 8 trebles and 24 doubles.' },
      { q: 'What is the minimum number of winners needed?', a: 'Two winners that share a line on the grid will return the double. At least 2 winners on the same line are needed for any return.' },
    ]
  },
  {
    key: 'union-jack-patent', file: 'union-jack-patent.html',
    title: 'Union Jack Patent Calculator — 9 Selections, 56 Bets | BetCalc UK',
    metaDesc: 'Free Union Jack Patent bet calculator. 8 trebles, 24 doubles, 24 singles = 56 bets. Full Union Jack grid coverage.',
    h1: 'Union Jack Patent Bet Calculator',
    intro: 'The Union Jack Patent is the most comprehensive Union Jack bet — adding singles to the doubles and trebles for full coverage. 56 bets across 9 selections placed in the Union Jack grid.',
    what: '<p>A <strong>Union Jack Patent</strong> includes: <strong>8 trebles</strong>, <strong>24 doubles</strong>, and <strong>24 singles</strong> — 56 bets in total. Each of the 9 grid positions appears in multiple lines, so singles are taken for each unique position appearing in the bet lines.</p>',
    formula: '8 trebles + 24 doubles + 24 singles = 56 bets\n£1 Union Jack Patent costs £56',
    selections: 9, bets: 56,
    faqs: [
      { q: 'How many bets is a Union Jack Patent?', a: 'A Union Jack Patent has 56 bets: 8 trebles, 24 doubles and 24 singles.' },
      { q: 'Can I get a return from just one winner?', a: 'Yes. With singles included, just one winning selection gives a return from that selection\'s singles.' },
    ]
  },
  {
    key: 'union-jack-round-robin', file: 'union-jack-round-robin.html',
    title: 'Union Jack Round Robin Calculator — 9 Selections, 80 Bets | BetCalc UK',
    metaDesc: 'Free Union Jack Round Robin bet calculator. 8 trebles, 24 doubles and 24 SSA pairs = 80 bets across a Union Jack grid.',
    h1: 'Union Jack Round Robin Bet Calculator',
    intro: 'The Union Jack Round Robin adds SSA (Up-and-Down) pairs to the Union Jack doubles and trebles, creating an 80-bet wager across the 9-selection grid.',
    what: '<p>A <strong>Union Jack Round Robin</strong> consists of: <strong>8 trebles</strong>, <strong>24 doubles</strong>, and <strong>24 SSA pairs</strong> (48 individual bets) — 80 bets in total.</p>',
    formula: '8 trebles + 24 doubles + 24 SSA pairs (48 bets)\nTotal = 80 bets\n£1 Union Jack Round Robin costs £80',
    selections: 9, bets: 80,
    faqs: [
      { q: 'How many bets is a Union Jack Round Robin?', a: 'A Union Jack Round Robin has 80 bets: 8 trebles, 24 doubles and 48 SSA bet directions (24 pairs).' },
    ]
  },
  {
    key: 'parlay', file: 'parlay.html',
    title: 'Parlay Bet Calculator — Multi-Selection Returns | BetCalc UK',
    metaDesc: 'Free Parlay bet calculator. A parlay is an accumulator by another name — all selections must win. Popular in American sports betting. Instant returns.',
    h1: 'Parlay Bet Calculator',
    intro: 'A Parlay is the American term for an accumulator — a single bet on multiple selections where all must win. The winnings from each selection roll over to the next, creating multiplied returns.',
    what: '<p>A <strong>Parlay</strong> is equivalent to a UK accumulator. All selections must win for a return. The term is most common in American sports betting, particularly for NFL, NBA and baseball.</p>',
    formula: 'Return = Stake × (Odds_1 × Odds_2 × ... × Odds_n)\n\nSame calculation as an Accumulator',
    selections: 4, bets: 1,
    faqs: [
      { q: 'What is the difference between a Parlay and an Accumulator?', a: 'There is no mathematical difference — they are the same type of bet. "Parlay" is the American term, "Accumulator" is the British term.' },
      { q: 'How many legs can a Parlay have?', a: 'Most bookmakers allow 2 to 20 legs on a parlay/accumulator.' },
      { q: 'What happens if a leg is voided in a Parlay?', a: 'A voided leg is removed and the parlay continues with the remaining legs, with adjusted potential returns.' },
    ]
  },
];
