# Generate all calculator pages
# Run from the project root: .\generate-calc-pages.ps1

$pages = @(
  @{ key="single"; file="single.html"; title="Single Bet Calculator UK — Work Out Your Winnings | BetCalc UK"; metaDesc="Free single bet calculator. Enter your odds and stake to instantly calculate your total return and profit. Supports fractional, decimal and American odds."; h1="Single Bet Calculator"; intro="The simplest form of sports betting — one selection, one stake, one potential payout. Use our free single bet calculator to instantly work out your return and profit for any stake and odds."; what="<p>A <strong>single bet</strong> is a wager on one selection to win (or place, if each-way). There is only 1 bet, meaning your outlay equals your stake. If your selection wins, your return is: <strong>Stake × Decimal Odds</strong>.</p>"; formula="Return = Stake x Decimal Odds`nProfit = Return - Stake`n`nExample: £10 @ 3/1 (4.0 decimal)`nReturn = £10 x 4.0 = £40`nProfit = £40 - £10 = £30"; selections=1; bets=1; betType="single" },
  @{ key="each-way"; file="each-way.html"; title="Each Way Bet Calculator UK — Win & Place Returns | BetCalc UK"; metaDesc="Calculate each way bet returns instantly. Works for horse racing, golf and football. Supports 1/4 and 1/5 place terms."; h1="Each Way Bet Calculator"; intro="An each-way bet is two bets in one — a win bet and a place bet. Our calculator works out both parts instantly, including different place terms."; what="<p>An <strong>each-way (EW) bet</strong> consists of two equal stakes: one on the selection to win at full odds, and one on it to place at a fraction of the win odds (commonly 1/4 or 1/5).</p>"; formula="Win Return = Stake x Decimal Odds`nPlace Return = Stake x (1 + (Odds-1) x Place Fraction)"; selections=1; bets=2; betType="each-way" },
  @{ key="double"; file="double.html"; title="Double Bet Calculator — Work Out Your Double Returns | BetCalc UK"; metaDesc="Free double bet calculator. Both selections must win. Supports each-way and Rule 4."; h1="Double Bet Calculator"; intro="A double combines 2 selections — both must win. The winnings from the first roll over as the stake on the second, creating multiplied returns."; what="<p>A <strong>double</strong> is 1 bet on 2 selections. Both must win. Return = Stake × Odds_1 × Odds_2.</p>"; formula="Return = Stake x Odds_1 x Odds_2`nExample: £5 @ 2/1 and 3/1`nReturn = £5 x 3.0 x 4.0 = £60"; selections=2; bets=1; betType="double" },
  @{ key="treble"; file="treble.html"; title="Treble Bet Calculator — Calculate Your 3-Fold Returns | BetCalc UK"; metaDesc="Free treble bet calculator. All 3 must win. Instant return and profit calculation."; h1="Treble Bet Calculator"; intro="A treble links 3 selections — all three must win. Returns accumulate through each leg creating a powerful multiplier."; what="<p>A <strong>treble</strong> is 1 bet on 3 selections. All three must win. Return = Stake × Odds_1 × Odds_2 × Odds_3.</p>"; formula="Return = Stake x Odds_1 x Odds_2 x Odds_3`nExample: £5 @ 2/1, 3/1, Evens`nReturn = £5 x 3 x 4 x 2 = £120"; selections=3; bets=1; betType="treble" },
  @{ key="accumulator"; file="accumulator.html"; title="Accumulator Bet Calculator — Acca Returns | BetCalc UK"; metaDesc="Free accumulator calculator. 4 to 20 selections, all must win. Void legs, each-way and Rule 4 supported."; h1="Accumulator Bet Calculator"; intro="The UK's most popular multiple bet. All selections must win but the potential returns are huge. Handles 4 to 20 selections."; what="<p>An <strong>accumulator</strong> is 1 bet on 4+ selections, all of which must win. Each winner's return rolls over to the next leg.</p>"; formula="Return = Stake x (Odds_1 x Odds_2 x ... x Odds_n)"; selections=4; bets=1; betType="accumulator" },
  @{ key="trixie"; file="trixie.html"; title="Trixie Bet Calculator — 3 Selections, 4 Bets | BetCalc UK"; metaDesc="Free Trixie calculator. 3 doubles + 1 treble = 4 bets. Just 2 winners for a return."; h1="Trixie Bet Calculator"; intro="A Trixie is a full-cover bet on 3 selections: 3 doubles and 1 treble. Just 2 winners gives a return."; what="<p>A <strong>Trixie</strong> contains: <strong>3 doubles</strong> and <strong>1 treble</strong> — 4 bets. You need 2+ winners.</p>"; formula="Bets: (1,2), (1,3), (2,3), (1,2,3) = 4 bets`n£1 Trixie costs £4"; selections=3; bets=4; betType="trixie" },
  @{ key="patent"; file="patent.html"; title="Patent Bet Calculator — 3 Selections, 7 Bets | BetCalc UK"; metaDesc="Free Patent calculator. 3 singles, 3 doubles, 1 treble = 7 bets. One winner gives a return."; h1="Patent Bet Calculator"; intro="A Patent includes 3 singles, 3 doubles and 1 treble across 3 selections. Just one winner produces a return."; what="<p>A <strong>Patent</strong>: <strong>3 singles</strong>, <strong>3 doubles</strong>, <strong>1 treble</strong> — 7 bets. One winner = a return.</p>"; formula="Bets: (1),(2),(3),(1,2),(1,3),(2,3),(1,2,3) = 7 bets`n£1 Patent costs £7"; selections=3; bets=7; betType="patent" },
  @{ key="yankee"; file="yankee.html"; title="Yankee Bet Calculator — 4 Selections, 11 Bets | BetCalc UK"; metaDesc="Free Yankee calculator. 6 doubles, 4 trebles, 1 four-fold = 11 bets. 2 winners gives a return."; h1="Yankee Bet Calculator"; intro="One of the UK's most popular horse racing bets. 4 selections, 11 bets covering doubles through to a four-fold."; what="<p>A <strong>Yankee</strong>: <strong>6 doubles</strong>, <strong>4 trebles</strong>, <strong>1 four-fold</strong> — 11 bets. Need 2+ winners.</p>"; formula="Bets = C(4,2)+C(4,3)+C(4,4) = 6+4+1 = 11`n£1 Yankee costs £11"; selections=4; bets=11; betType="yankee" },
  @{ key="canadian"; file="canadian.html"; title="Canadian Bet Calculator — 5 Selections, 26 Bets | BetCalc UK"; metaDesc="Free Canadian (Super Yankee) calculator. 26 bets across 5 selections. 2 winners gives a return."; h1="Canadian Bet Calculator (Super Yankee)"; intro="A Canadian — also known as Super Yankee — covers 5 selections with 26 bets from doubles to a five-fold."; what="<p>A <strong>Canadian</strong>: <strong>10 doubles</strong>, <strong>10 trebles</strong>, <strong>5 four-folds</strong>, <strong>1 five-fold</strong> — 26 bets.</p>"; formula="Bets = C(5,2)+C(5,3)+C(5,4)+C(5,5) = 26`n£1 Canadian costs £26"; selections=5; bets=26; betType="canadian" },
  @{ key="super-yankee"; file="super-yankee.html"; title="Super Yankee Bet Calculator — 5 Selections, 26 Bets | BetCalc UK"; metaDesc="Free Super Yankee (Canadian) calculator. 26 bets, 5 selections. Same as Canadian."; h1="Super Yankee Bet Calculator"; intro="A Super Yankee is identical to a Canadian — 26 bets covering all combinations of 5 selections from doubles to five-fold."; what="<p>The <strong>Super Yankee</strong> and <strong>Canadian</strong> are two names for the same bet: 26 bets across 5 selections.</p>"; formula="Bets = 26 (same as Canadian)`n£1 Super Yankee costs £26"; selections=5; bets=26; betType="super-yankee" },
  @{ key="heinz"; file="heinz.html"; title="Heinz Bet Calculator — 6 Selections, 57 Bets | BetCalc UK"; metaDesc="Free Heinz calculator. Named after the 57 varieties. 6 selections, 57 bets."; h1="Heinz Bet Calculator"; intro="Named after the '57 varieties', the Heinz covers 6 selections with 57 bets from doubles to a six-fold."; what="<p>A <strong>Heinz</strong>: <strong>15 doubles</strong>, <strong>20 trebles</strong>, <strong>15 four-folds</strong>, <strong>6 five-folds</strong>, <strong>1 six-fold</strong> — 57 bets.</p>"; formula="Bets = C(6,2)+...+C(6,6) = 57`n£1 Heinz costs £57"; selections=6; bets=57; betType="heinz" },
  @{ key="super-heinz"; file="super-heinz.html"; title="Super Heinz Bet Calculator — 7 Selections, 120 Bets | BetCalc UK"; metaDesc="Free Super Heinz calculator. 120 bets across 7 selections, doubles to seven-fold."; h1="Super Heinz Bet Calculator"; intro="The Super Heinz covers 7 selections with 120 bets — the largest standard full-cover bet without singles."; what="<p>A <strong>Super Heinz</strong>: <strong>21 doubles</strong>, <strong>35 trebles</strong>, <strong>35 four-folds</strong>, <strong>21 five-folds</strong>, <strong>7 six-folds</strong>, <strong>1 seven-fold</strong> — 120 bets.</p>"; formula="Bets = C(7,2)+...+C(7,7) = 120`n£1 Super Heinz costs £120"; selections=7; bets=120; betType="super-heinz" },
  @{ key="goliath"; file="goliath.html"; title="Goliath Bet Calculator — 8 Selections, 247 Bets | BetCalc UK"; metaDesc="Free Goliath calculator. The largest standard bet — 247 bets across 8 selections."; h1="Goliath Bet Calculator"; intro="The Goliath is the largest standard full-cover bet — 247 bets across 8 selections from doubles to an eight-fold."; what="<p>A <strong>Goliath</strong>: <strong>28 doubles</strong>, <strong>56 trebles</strong>, <strong>70 four-folds</strong>, <strong>56 five-folds</strong>, <strong>28 six-folds</strong>, <strong>8 seven-folds</strong>, <strong>1 eight-fold</strong> — 247 bets.</p>"; formula="Bets = C(8,2)+...+C(8,8) = 247`n£1 Goliath costs £247"; selections=8; bets=247; betType="goliath" },
  @{ key="lucky-15"; file="lucky-15.html"; title="Lucky 15 Bet Calculator UK — Work Out Your Winnings | BetCalc UK"; metaDesc="Free Lucky 15 calculator. 4 singles, 6 doubles, 4 trebles, 1 four-fold = 15 bets. Each-way, Rule 4 and bookmaker bonuses supported."; h1="Lucky 15 Bet Calculator"; intro="The Lucky 15 is one of the most popular bets in UK horse racing — 4 selections, 15 bets, and just 1 winner needed for a return. Our calculator handles each-way terms and bookmaker bonuses instantly."; what="<p>A <strong>Lucky 15</strong>: <strong>4 singles</strong>, <strong>6 doubles</strong>, <strong>4 trebles</strong>, <strong>1 four-fold</strong> — 15 bets across 4 selections. Just one winner returns a profit. Many bookmakers offer Lucky 15 bonuses: double odds on one winner, or 10% bonus on all four winners.</p>"; formula="Bets = C(4,1)+C(4,2)+C(4,3)+C(4,4) = 4+6+4+1 = 15`n£1 Lucky 15 total outlay = £15`n£0.50 Lucky 15 total outlay = £7.50"; selections=4; bets=15; betType="lucky-15" },
  @{ key="lucky-31"; file="lucky-31.html"; title="Lucky 31 Bet Calculator — 5 Selections, 31 Bets | BetCalc UK"; metaDesc="Free Lucky 31 calculator. 5 singles, 10 doubles, 10 trebles, 5 four-folds, 1 five-fold = 31 bets."; h1="Lucky 31 Bet Calculator"; intro="The Lucky 31 covers 5 selections with 31 bets — full coverage from singles to five-fold. One winner gives a return."; what="<p>A <strong>Lucky 31</strong>: <strong>5 singles</strong>, <strong>10 doubles</strong>, <strong>10 trebles</strong>, <strong>5 four-folds</strong>, <strong>1 five-fold</strong> — 31 bets.</p>"; formula="Bets = C(5,1)+...+C(5,5) = 5+10+10+5+1 = 31`n£1 Lucky 31 costs £31"; selections=5; bets=31; betType="lucky-31" },
  @{ key="lucky-63"; file="lucky-63.html"; title="Lucky 63 Bet Calculator — 6 Selections, 63 Bets | BetCalc UK"; metaDesc="Free Lucky 63 calculator. 6 singles to 1 six-fold = 63 bets. Full each-way support."; h1="Lucky 63 Bet Calculator"; intro="The Lucky 63 covers 6 selections with 63 bets. Popular for Saturday racing, it gives maximum coverage across six events."; what="<p>A <strong>Lucky 63</strong>: <strong>6 singles</strong>, <strong>15 doubles</strong>, <strong>20 trebles</strong>, <strong>15 four-folds</strong>, <strong>6 five-folds</strong>, <strong>1 six-fold</strong> — 63 bets.</p>"; formula="Bets = C(6,1)+...+C(6,6) = 6+15+20+15+6+1 = 63`n£1 Lucky 63 costs £63"; selections=6; bets=63; betType="lucky-63" },
  @{ key="alphabet"; file="alphabet.html"; title="Alphabet Bet Calculator — 6 Selections, 26 Bets | BetCalc UK"; metaDesc="Free Alphabet bet calculator. 2 Patents, 1 Yankee, 1 six-fold = 26 bets across 6 selections."; h1="Alphabet Bet Calculator"; intro="The Alphabet is a unique 26-bet combination: two Patents on selections 1-2-3 and 4-5-6, a Yankee on 2-3-4-5, plus a six-fold."; what="<p>An <strong>Alphabet</strong>: Patent(1,2,3) + Patent(4,5,6) + Yankee(2,3,4,5) + 1 six-fold = 26 bets.</p>"; formula="Patent(1,2,3)=7 + Patent(4,5,6)=7 + Yankee=11 + sixfold=1 = 26 bets"; selections=6; bets=26; betType="alphabet" },
  @{ key="single-stakes-about"; file="single-stakes-about.html"; title="Single Stakes About (SSA) Calculator — Up & Down Bet | BetCalc UK"; metaDesc="Free Single Stakes About calculator. Also called Up-and-Down. 2 selections, 2 bets."; h1="Single Stakes About (Up & Down) Bet Calculator"; intro="The SSA is a 2-bet wager where winnings from selection A roll to selection B, and vice versa."; what="<p>A <strong>Single Stakes About</strong>: Bet 1 stakes on A, if A wins the return goes on B. Bet 2 stakes on B, if B wins the return goes on A. 2 bets total.</p>"; formula="If A wins: return from A placed on B`nIf B wins: return from B placed on A"; selections=2; bets=2; betType="single-stakes-about" },
  @{ key="double-stakes-about"; file="double-stakes-about.html"; title="Double Stakes About (DSA) Calculator | BetCalc UK"; metaDesc="Free Double Stakes About calculator. Like SSA but double stake. 2 selections, 2 bets."; h1="Double Stakes About (DSA) Bet Calculator"; intro="The DSA works like a Single Stakes About but with double the stake investment on each direction."; what="<p>A <strong>Double Stakes About</strong> is an SSA with doubled stake on each direction — amplifying compound returns when both selections win.</p>"; formula="DSA = 2 x SSA stake on each direction`n2 bets total"; selections=2; bets=2; betType="double-stakes-about" },
  @{ key="round-robin"; file="round-robin.html"; title="Round Robin Bet Calculator — 3 Selections, 10 Bets | BetCalc UK"; metaDesc="Free Round Robin calculator. 3 doubles, 1 treble, 3 SSA pairs = 10 bets."; h1="Round Robin Bet Calculator"; intro="A Round Robin covers 3 selections with 10 bets: 3 doubles, 1 treble, and 3 SSA (Up-and-Down) pairs."; what="<p>A <strong>Round Robin</strong>: <strong>3 doubles</strong>, <strong>1 treble</strong>, <strong>3 SSA pairs</strong> — 10 bets total.</p>"; formula="3 doubles + 1 treble + 3 SSA pairs = 10 bets`n£1 Round Robin costs £10"; selections=3; bets=10; betType="round-robin" },
  @{ key="flag"; file="flag.html"; title="Flag Bet Calculator — 4 Selections, 23 Bets | BetCalc UK"; metaDesc="Free Flag bet calculator. 6 doubles, 4 trebles, 1 four-fold, 6 SSA pairs = 23 bets."; h1="Flag Bet Calculator"; intro="A Flag covers 4 selections with 23 bets — Yankee combinations plus 6 SSA pairs for extra return potential."; what="<p>A <strong>Flag</strong>: <strong>6 doubles</strong>, <strong>4 trebles</strong>, <strong>1 four-fold</strong>, <strong>6 SSA pairs</strong> — 23 bets.</p>"; formula="6+4+1 (Yankee) + 6 SSA pairs = 23 bets`n£1 Flag costs £23"; selections=4; bets=23; betType="flag" },
  @{ key="super-flag"; file="super-flag.html"; title="Super Flag Bet Calculator — 5 Selections, 46 Bets | BetCalc UK"; metaDesc="Free Super Flag calculator. Canadian bets plus SSA pairs = 46 bets."; h1="Super Flag Bet Calculator"; intro="A Super Flag extends the Canadian with SSA pairs across 5 selections — 46 bets total."; what="<p>A <strong>Super Flag</strong>: Canadian (26 bets) + 10 SSA pairs (20 bets) — wait... actually 10+10+5+1 + 10×2 = 46 bets total.</p>"; formula="Canadian(26) + 10 SSA pairs = 46 bets`n£1 Super Flag costs £46"; selections=5; bets=46; betType="super-flag" },
  @{ key="heinz-flag"; file="heinz-flag.html"; title="Heinz Flag Bet Calculator — 6 Selections, 87 Bets | BetCalc UK"; metaDesc="Free Heinz Flag calculator. Heinz plus SSA pairs = 87 bets across 6 selections."; h1="Heinz Flag Bet Calculator"; intro="A Heinz Flag extends the Heinz with SSA pairs — 87 bets across 6 selections."; what="<p>A <strong>Heinz Flag</strong>: Heinz (57 bets) + 15 SSA pairs (30 bets) = 87 bets.</p>"; formula="Heinz(57) + 15 SSA pairs(30) = 87 bets`n£1 Heinz Flag costs £87"; selections=6; bets=87; betType="heinz-flag" },
  @{ key="super-heinz-flag"; file="super-heinz-flag.html"; title="Super Heinz Flag Calculator — 7 Selections, 162 Bets | BetCalc UK"; metaDesc="Free Super Heinz Flag calculator. 162 bets across 7 selections."; h1="Super Heinz Flag Bet Calculator"; intro="The Super Heinz Flag extends the Super Heinz with SSA pairs — 162 bets across 7 selections."; what="<p>A <strong>Super Heinz Flag</strong>: Super Heinz (120) + 21 SSA pairs (42) = 162 bets.</p>"; formula="Super Heinz(120) + 21 SSA pairs(42) = 162 bets`n£1 Super Heinz Flag costs £162"; selections=7; bets=162; betType="super-heinz-flag" },
  @{ key="goliath-flag"; file="goliath-flag.html"; title="Goliath Flag Bet Calculator — 8 Selections, 303 Bets | BetCalc UK"; metaDesc="Free Goliath Flag calculator. 303 bets — the largest flag bet. 8 selections."; h1="Goliath Flag Bet Calculator"; intro="The Goliath Flag is the largest standard flag bet — 303 bets across 8 selections."; what="<p>A <strong>Goliath Flag</strong>: Goliath (247) + 28 SSA pairs (56) = 303 bets.</p>"; formula="Goliath(247) + 28 SSA pairs(56) = 303 bets`n£1 Goliath Flag costs £303"; selections=8; bets=303; betType="goliath-flag" },
  @{ key="union-jack-trebles"; file="union-jack-trebles.html"; title="Union Jack Trebles Calculator — 9 Selections, 8 Bets | BetCalc UK"; metaDesc="Free Union Jack Trebles calculator. 8 trebles from a 3x3 grid pattern."; h1="Union Jack Trebles Bet Calculator"; intro="The Union Jack Trebles uses a 3×3 grid of 9 selections to form 8 trebles along the rows, columns and diagonals."; what="<p>A <strong>Union Jack Trebles</strong>: 8 trebles along the rows, columns and diagonals of a 3×3 grid of 9 selections.</p>"; formula="Grid: 1|2|3 / 4|5|6 / 7|8|9`nRows:(1,2,3)(4,5,6)(7,8,9) Cols:(1,4,7)...`nDiagonals:(1,5,9)(3,5,7) = 8 trebles"; selections=9; bets=8; betType="union-jack-trebles" },
  @{ key="union-jack-trixie"; file="union-jack-trixie.html"; title="Union Jack Trixie Calculator — 9 Selections, 32 Bets | BetCalc UK"; metaDesc="Free Union Jack Trixie calculator. 8 trebles + 24 doubles = 32 bets."; h1="Union Jack Trixie Bet Calculator"; intro="The Union Jack Trixie adds all unique doubles from the 8 treble lines — 32 bets total for returns with 2+ winners."; what="<p>A <strong>Union Jack Trixie</strong>: 8 trebles + 24 doubles = 32 bets.</p>"; formula="8 trebles + 24 doubles = 32 bets`n£1 Union Jack Trixie costs £32"; selections=9; bets=32; betType="union-jack-trixie" },
  @{ key="union-jack-patent"; file="union-jack-patent.html"; title="Union Jack Patent Calculator — 9 Selections, 56 Bets | BetCalc UK"; metaDesc="Free Union Jack Patent calculator. 8 trebles, 24 doubles, 24 singles = 56 bets."; h1="Union Jack Patent Bet Calculator"; intro="The Union Jack Patent adds singles to the doubles and trebles — 56 bets with a return from just one winner."; what="<p>A <strong>Union Jack Patent</strong>: 8 trebles + 24 doubles + 24 singles = 56 bets.</p>"; formula="8 trebles + 24 doubles + 24 singles = 56 bets`n£1 Union Jack Patent costs £56"; selections=9; bets=56; betType="union-jack-patent" },
  @{ key="union-jack-round-robin"; file="union-jack-round-robin.html"; title="Union Jack Round Robin Calculator — 9 Selections, 80 Bets | BetCalc UK"; metaDesc="Free Union Jack Round Robin calculator. 8 trebles, 24 doubles and SSA pairs = 80 bets."; h1="Union Jack Round Robin Bet Calculator"; intro="The Union Jack Round Robin adds SSA pairs to the doubles and trebles from the Union Jack grid — 80 bets total."; what="<p>A <strong>Union Jack Round Robin</strong>: 8 trebles + 24 doubles + 24 SSA pairs (48 bets) = 80 bets.</p>"; formula="8 trebles + 24 doubles + 24 SSA pairs = 80 bets`n£1 Union Jack Round Robin costs £80"; selections=9; bets=80; betType="union-jack-round-robin" },
  @{ key="parlay"; file="parlay.html"; title="Parlay Bet Calculator — Multi-Selection Returns | BetCalc UK"; metaDesc="Free Parlay calculator. The American accumulator — all selections must win. Supports 2 to 20 legs."; h1="Parlay Bet Calculator"; intro="A Parlay is the American term for an accumulator — all selections must win for a return. Massive potential returns from small stakes."; what="<p>A <strong>Parlay</strong> is mathematically identical to an accumulator. All selections must win, with each winner's return rolling to the next leg.</p>"; formula="Return = Stake x (Odds_1 x Odds_2 x ... x Odds_n)`nSame as an Accumulator"; selections=4; bets=1; betType="parlay" }
)

function Get-FaqHtml($faqs) {
  # Some pages don't pass explicit faqs, provide generic
  return ""
}

function Get-CalcPageHtml($p) {
  $betType = $p.betType
  $parentPath = "../"
  $pageFaqs = ""
  
  return @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$($p.title)</title>
  <meta name="description" content="$($p.metaDesc)">
  <meta name="robots" content="index, follow">
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="page-wrapper" data-bet-type="$betType">

  <!-- Header -->
  <header class="site-header">
    <div class="header-inner">
      <a href="/" class="site-logo" aria-label="BetCalc UK home">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect width="32" height="32" rx="6" fill="rgba(255,255,255,0.15)"/>
          <path d="M7 16L13 22L25 10" stroke="#f5a623" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">Bet<span>Calc</span> UK</span>
      </a>
      <button class="hamburger" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
      <nav class="site-nav" id="site-nav">
        <a href="/">Calculator</a>
        <a href="../bookmakers.html">Bookmakers</a>
        <a href="../guides/what-is-a-lucky-15.html">Guides</a>
        <a href="../about.html">About</a>
      </nav>
    </div>
  </header>

  <!-- Hero -->
  <section class="page-hero">
    <h1>$($p.h1)</h1>
    <p>$($p.intro)</p>
  </section>

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/#calculators">Calculators</a></li>
        <li>$($p.h1)</li>
      </ol>
    </div>
  </nav>

  <main>
    <div class="container page-content">

      <!-- Calculator -->
      <div class="card calc-card" id="calculator" aria-label="$($p.h1)">
        <div class="card-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
          </svg>
          $($p.h1)
        </div>
        <div class="card-body" id="calc-form">

          <div class="calc-form-row">
            <div class="form-group">
              <label class="form-label" for="bet-type-select">Bet Type</label>
              <select class="form-select" id="bet-type-select" aria-label="Bet type"></select>
            </div>
            <div class="form-group">
              <label class="form-label" for="each-way-select">Each Way?</label>
              <select class="form-select" id="each-way-select">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          <div class="calc-form-row">
            <div class="form-group">
              <label class="form-label">Odds Format</label>
              <div class="odds-format-tabs" id="odds-format-tabs" role="group" aria-label="Odds format">
                <button type="button" data-format="fractional" class="active">Fractional</button>
                <button type="button" data-format="decimal">Decimal</button>
                <button type="button" data-format="american">American</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="rule4-toggle">Show Rule 4?</label>
              <select class="form-select" id="rule4-toggle">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          <div id="num-selections-wrap" class="form-group mb-16" style="display:none; max-width:200px">
            <label class="form-label" for="num-selections">Number of Selections</label>
            <input type="number" class="form-input" id="num-selections" min="2" max="20" value="4">
          </div>

          <div class="selections-header" aria-hidden="true">
            <span>#</span><span>Outcome</span><span>Odds</span><span class="rule4-col">Rule 4</span>
          </div>

          <div id="selections-container" role="list" aria-label="Selections"></div>

          <div class="stake-section">
            <div class="bet-count-row">
              <span>Total bets: <strong id="bet-count">$($p.bets)</strong></span>
              <span id="ew-badge" class="ew-badge" style="display:none">Each Way x2</span>
            </div>
            <div class="stake-row">
              <div class="form-group" style="width:160px">
                <label class="form-label" for="stake-type-select">Stake Type</label>
                <select class="form-select" id="stake-type-select">
                  <option value="per-bet">Stake Per Bet</option>
                  <option value="total">Total Stake</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label class="form-label" for="stake-input">Stake (£)</label>
                <div class="stake-input-wrap">
                  <span class="stake-prefix">£</span>
                  <input type="number" class="form-input" id="stake-input" min="0.01" step="0.01" placeholder="0.00" aria-label="Stake amount">
                </div>
              </div>
            </div>
          </div>

          <details class="bonuses-section">
            <summary style="cursor:pointer; font-weight:600; font-size:.9rem; color:var(--primary); margin-bottom:12px; list-style:none;">
              &#9658; Bookmaker Bonuses (Optional)
            </summary>
            <div class="bonuses-grid">
              <div class="form-group">
                <label class="form-label" for="one-winner-consolation">One Winner Consolation</label>
                <select class="form-select" id="one-winner-consolation">
                  <option value="none">None</option>
                  <option value="double">Double Odds</option>
                  <option value="treble">Treble Odds</option>
                  <option value="quadruple">Quadruple Odds</option>
                  <option value="quintuple">Quintuple Odds</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="all-winners-bonus">All Winners Bonus (%)</label>
                <input type="number" class="form-input" id="all-winners-bonus" min="0" max="200" step="1" placeholder="e.g. 10">
              </div>
            </div>
          </details>

          <div class="results-panel" role="region" aria-live="polite" aria-label="Results">
            <div class="results-grid">
              <div class="result-item">
                <div class="result-label">Total Outlay</div>
                <div class="result-value" id="result-outlay">-</div>
              </div>
              <div class="result-item">
                <div class="result-label">Total Return</div>
                <div class="result-value" id="result-return">-</div>
              </div>
              <div class="result-item">
                <div class="result-label">Total Profit</div>
                <div class="result-value" id="result-profit">-</div>
              </div>
            </div>
          </div>

          <div class="mt-16 d-flex justify-between align-center flex-wrap gap-8">
            <button type="button" class="btn btn-outline btn-sm" id="reset-btn">&#8635; Reset Calculator</button>
            <span class="text-sm text-muted">18+ | Bet Responsibly | <a href="https://www.begambleaware.org" target="_blank" rel="noopener">BeGambleAware.org</a></span>
          </div>
        </div>
      </div>

      <!-- What is section -->
      <section class="content-section section-block">
        <h2>What is a $($p.h1)?</h2>
        $($p.what)
        <div class="formula-box"><pre>$($p.formula)</pre></div>
        <div class="highlight-stats">
          <div class="stat-box">
            <div class="stat-val">$($p.selections)</div>
            <div class="stat-label">Selections</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">$($p.bets)</div>
            <div class="stat-label">Total Bets</div>
          </div>
        </div>
      </section>

      <!-- Bookmakers -->
      <section class="bookmakers-section section-block" aria-label="Top bookmakers">
        <h2>Best Bookmakers for $($p.h1) Bets</h2>
        <p class="section-intro">Compare welcome offers from UK's top bookmakers. New customers only. T&amp;Cs apply. 18+</p>
        <div class="bookmakers-grid" id="bookmakers-grid"></div>
      </section>

      <!-- More calculators -->
      <section class="content-section section-block">
        <h2>More Bet Type Calculators</h2>
        <div class="bet-types-grid">
          <a href="lucky-15.html" class="bet-type-link">Lucky 15 <span class="bet-count">15 bets</span></a>
          <a href="lucky-31.html" class="bet-type-link">Lucky 31 <span class="bet-count">31 bets</span></a>
          <a href="lucky-63.html" class="bet-type-link">Lucky 63 <span class="bet-count">63 bets</span></a>
          <a href="yankee.html" class="bet-type-link">Yankee <span class="bet-count">11 bets</span></a>
          <a href="accumulator.html" class="bet-type-link">Accumulator <span class="bet-count">1 bet</span></a>
          <a href="patent.html" class="bet-type-link">Patent <span class="bet-count">7 bets</span></a>
          <a href="trixie.html" class="bet-type-link">Trixie <span class="bet-count">4 bets</span></a>
          <a href="each-way.html" class="bet-type-link">Each Way <span class="bet-count">2 bets</span></a>
          <a href="/" class="bet-type-link" style="grid-column:span 2">View All Calculators &rarr;</a>
        </div>
      </section>

    </div>
  </main>

  <!-- Footer -->
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="responsible-gambling">
        <strong>Gamble Responsibly.</strong> 18+ only. If you feel gambling is becoming a problem, please visit
        <a href="https://www.begambleaware.org" target="_blank" rel="noopener">BeGambleAware.org</a> or call <strong>0808 8020 133</strong>.
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 BetCalc UK. All rights reserved.</span>
        <span><a href="../about.html">About</a> &bull; <a href="../about.html#privacy">Privacy</a> &bull; <a href="../about.html#terms">Terms</a></span>
      </div>
    </div>
  </footer>

  <script src="../js/odds-utils.js"></script>
  <script src="../js/calculator-engine.js"></script>
  <script src="../js/calculator-ui.js"></script>
  <script>
    const BOOKMAKERS = [
      { id:'bet365', name:'bet365', rating:5, offer:'Bet £10 Get £30 in Free Bets', lucky15:'Standard Lucky 15 terms', link:'../gate/', terms:'New customers. T&C apply. 18+' },
      { id:'betfred', name:'Betfred', rating:5, offer:'£30 Free Bets + Bonuses', lucky15:'<strong>Double odds</strong> on 1 winner, <strong>10% bonus</strong> all winners', link:'../gate/', terms:'New customers only. T&C apply. 18+' },
      { id:'paddypower', name:'Paddy Power', rating:4, offer:'Bet £20 Get £20 Free', lucky15:'<strong>Treble odds</strong> on a single winner', link:'../gate/', terms:'New customers. T&C apply. 18+' },
      { id:'coral', name:'Coral', rating:4, offer:'Bet £5 Get £20', lucky15:'<strong>Double odds</strong> on 1 winner, <strong>10% bonus</strong> all winners', link:'../gate/', terms:'New customers. T&C apply. 18+' },
    ];
    function renderStars(n) { return '&#9733;'.repeat(n) + '&#9734;'.repeat(5-n); }
    function renderBookmakers() {
      const grid = document.getElementById('bookmakers-grid');
      if (!grid) return;
      grid.innerHTML = BOOKMAKERS.map(b => `
        <div class="bookie-card">
          <div class="bookie-header">
            <div class="bookie-logo">${b.name}</div>
            <div><div class="bookie-name">${b.name}</div><div class="bookie-rating">${renderStars(b.rating)}</div></div>
          </div>
          <div class="bookie-offer">${b.offer}</div>
          <div class="bookie-lucky15-bonus"><strong>Lucky 15 Bonus:</strong> ${b.lucky15}</div>
          <div class="bookie-footer">
            <span class="bookie-terms">${b.terms}</span>
            <a href="${b.link}" class="btn btn-accent btn-sm" rel="nofollow noopener" target="_blank">Claim Offer</a>
          </div>
        </div>`).join('');
    }
    renderBookmakers();
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = btn.classList.contains('open');
        document.querySelectorAll('.faq-question').forEach(b => { b.classList.remove('open'); b.setAttribute('aria-expanded','false'); b.nextElementSibling.classList.remove('open'); });
        if (!isOpen) { btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); btn.nextElementSibling.classList.add('open'); }
      });
    });
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('site-nav');
    if (toggle && nav) { toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); }); }
  </script>
</body>
</html>
"@
}

# Generate all pages
foreach ($p in $pages) {
  $html = Get-CalcPageHtml $p
  $outPath = Join-Path $PSScriptRoot "calculators\$($p.file)"
  [System.IO.File]::WriteAllText($outPath, $html, [System.Text.Encoding]::UTF8)
  Write-Host "Generated: calculators\$($p.file)"
}

Write-Host "`nAll $($pages.Count) calculator pages generated successfully!"
