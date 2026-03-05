/**
 * BetCalc UK — Micro-interactions & Hero Infographic
 */
(function () {
  'use strict';

  // ── Result value pop animation ──────────────────────────────────────────────
  function watchResultValues() {
    if (!window.MutationObserver) return;
    ['result-outlay', 'result-return', 'result-profit'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      new MutationObserver(function () {
        el.classList.remove('result-pop');
        void el.offsetWidth;
        el.classList.add('result-pop');
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  // ── Staggered entrance for bet-type grid ────────────────────────────────────
  function animateBetTypeLinks() {
    var links = document.querySelectorAll('.bet-type-link');
    if (!links.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    links.forEach(function (link, i) {
      link.style.opacity = '0';
      link.style.transform = 'translateY(10px)';
      setTimeout(function () {
        link.style.transition = 'opacity .3s ease, transform .3s ease, all .18s ease, border-left-color .18s ease';
        link.style.opacity = '';
        link.style.transform = '';
      }, 30 * i);
    });
  }

  // ── Stat box count-up ───────────────────────────────────────────────────────
  function animateStatBoxes() {
    var boxes = document.querySelectorAll('.stat-box .stat-val');
    if (!boxes.length || !window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.textContent, 10);
        if (isNaN(target) || target <= 1) return;
        var duration = 600, startTime = null;
        (function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min((ts - startTime) / duration, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.5 });
    boxes.forEach(function (b) { io.observe(b); });
  }

  // ── Hero infographic ────────────────────────────────────────────────────────
  var CALC_SVG = [
    '<svg class="hero-calc-svg" viewBox="0 0 148 192" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    /* Outer body */
    '<rect x="2" y="2" width="144" height="188" rx="14"',
    '  fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>',
    /* Screen area */
    '<rect x="10" y="10" width="128" height="52" rx="9" fill="rgba(0,0,0,0.22)"/>',
    /* Screen: label line */
    '<rect x="16" y="18" width="52" height="5" rx="2.5" fill="rgba(255,255,255,0.18)"/>',
    /* Screen: odds chip */
    '<rect x="16" y="30" width="38" height="14" rx="4" fill="rgba(255,255,255,0.12)"/>',
    '<rect x="19" y="34" width="10" height="3" rx="1.5" fill="rgba(255,255,255,0.55)"/>',
    '<rect x="19" y="38.5" width="7" height="3" rx="1.5" fill="rgba(255,255,255,0.35)"/>',
    /* Screen: result highlight */
    '<rect x="66" y="30" width="66" height="14" rx="4" fill="rgba(245,166,35,0.42)"/>',
    '<rect x="70" y="34" width="38" height="6" rx="3" fill="rgba(245,166,35,0.65)"/>',
    /* Screen separator */
    '<line x1="10" y1="70" x2="138" y2="70" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>',
    /* Buttons: 3 cols × 4 rows */
    /* col x: 10, 57, 104 (width 37 each, gap 10) */
    /* row y: 76, 103, 130, 157  (height 21, gap 6) */
    /* Row 1 */
    '<rect x="10"  y="76" width="37" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    '<rect x="57"  y="76" width="37" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    '<rect x="104" y="76" width="34" height="21" rx="5.5" fill="rgba(245,166,35,0.58)"/>',
    /* Row 2 */
    '<rect x="10"  y="103" width="37" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    '<rect x="57"  y="103" width="37" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    '<rect x="104" y="103" width="34" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    /* Row 3 */
    '<rect x="10"  y="130" width="37" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    '<rect x="57"  y="130" width="37" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    '<rect x="104" y="130" width="34" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    /* Row 4: wide 0 + accent = */
    '<rect x="10"  y="157" width="84" height="21" rx="5.5" fill="rgba(255,255,255,0.13)"/>',
    '<rect x="104" y="157" width="34" height="21" rx="5.5" fill="rgba(46,125,50,0.55)"/>',
    /* Bottom bar */
    '<rect x="10" y="182" width="128" height="5" rx="2.5" fill="rgba(255,255,255,0.07)"/>',
    '</svg>',
  ].join('');

  // Sport SVG icons — 8 major UK betting sports
  var SPORT_ICONS = [
    { label: 'Horse Racing', svg:
      '<svg viewBox="0 0 28 28" fill="none"><path d="M19 6c2-1 3 1 2 3l-2 2-4 1-3 2-2 4-1 5H7l1-6 4-4-1-4 2-2 3-1z" fill="rgba(255,255,255,.7)"/><circle cx="21" cy="6" r="1.8" fill="rgba(255,255,255,.7)"/><line x1="8" y1="23" x2="8" y2="27" stroke="rgba(255,255,255,.45)" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="23" x2="11" y2="27" stroke="rgba(255,255,255,.45)" stroke-width="1.5" stroke-linecap="round"/></svg>'
    },
    { label: 'Football', svg:
      '<svg viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.45)" stroke-width="1.2"/><polygon points="14,5 17,10 23,10 19,14 21,20 14,17 7,20 9,14 5,10 11,10" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.4)" stroke-width=".7"/></svg>'
    },
    { label: 'Tennis', svg:
      '<svg viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" fill="rgba(200,230,80,.1)" stroke="rgba(200,230,80,.7)" stroke-width="1.2"/><path d="M7 9 Q11 14 7 19" stroke="rgba(255,255,255,.5)" stroke-width="1.3" fill="none"/><path d="M21 9 Q17 14 21 19" stroke="rgba(255,255,255,.5)" stroke-width="1.3" fill="none"/></svg>'
    },
    { label: 'Golf', svg:
      '<svg viewBox="0 0 28 28" fill="none"><line x1="13" y1="4" x2="13" y2="23" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-linecap="round"/><path d="M13 8 L21 11.5 L13 15 Z" fill="rgba(245,166,35,.75)"/><circle cx="13" cy="25" r="2.5" fill="rgba(255,255,255,.6)"/></svg>'
    },
    { label: 'Cricket', svg:
      '<svg viewBox="0 0 28 28" fill="none"><path d="M7 22 L16 7" stroke="rgba(255,255,255,.65)" stroke-width="3.5" stroke-linecap="round"/><path d="M14 9 L19 5" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/><circle cx="21" cy="20" r="4" fill="rgba(200,50,50,.35)" stroke="rgba(255,255,255,.55)" stroke-width="1"/><path d="M19 18 Q21 20 19 22" stroke="rgba(255,255,255,.4)" stroke-width=".8" fill="none"/><path d="M23 18 Q21 20 23 22" stroke="rgba(255,255,255,.4)" stroke-width=".8" fill="none"/></svg>'
    },
    { label: 'Greyhounds', svg:
      '<svg viewBox="0 0 28 28" fill="none"><path d="M3 18 C5 15 8 14 11 15 L15 13 L19 11 L23 10 L24 12 L20 13 L16 16 L15 20 L13 20 L14 17 L10 18 L8 21 L5 21 Z" fill="rgba(255,255,255,.68)"/><circle cx="24" cy="10" r="1.8" fill="rgba(255,255,255,.68)"/></svg>'
    },
    { label: 'Basketball', svg:
      '<svg viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" fill="rgba(220,110,40,.12)" stroke="rgba(220,110,40,.75)" stroke-width="1.2"/><line x1="3" y1="14" x2="25" y2="14" stroke="rgba(255,255,255,.4)" stroke-width="1"/><path d="M14 3 Q20 8 20 14 Q20 20 14 25" stroke="rgba(255,255,255,.4)" stroke-width="1" fill="none"/><path d="M14 3 Q8 8 8 14 Q8 20 14 25" stroke="rgba(255,255,255,.4)" stroke-width="1" fill="none"/></svg>'
    },
    { label: 'Rugby', svg:
      '<svg viewBox="0 0 28 28" fill="none"><ellipse cx="14" cy="14" rx="9" ry="5.5" transform="rotate(-25 14 14)" fill="rgba(100,160,80,.18)" stroke="rgba(255,255,255,.6)" stroke-width="1.2"/><line x1="10" y1="11" x2="18" y2="17" stroke="rgba(255,255,255,.4)" stroke-width=".9"/><line x1="8" y1="14.5" x2="16" y2="20.5" stroke="rgba(255,255,255,.3)" stroke-width=".8"/></svg>'
    },
  ];

  function buildHeroVisual() {
    var badges = [
      { val: '30+',  label: 'Bet Types',  cls: 'hero-float-badge--1' },
      { val: 'Live', label: 'Real-Time',  cls: 'hero-float-badge--2' },
      { val: 'Free', label: 'No Sign-Up', cls: 'hero-float-badge--3' },
    ].map(function (b) {
      return (
        '<div class="hero-float-badge ' + b.cls + '">' +
          '<strong>' + b.val + '</strong>' +
          '<span>' + b.label + '</span>' +
        '</div>'
      );
    }).join('');

    var sportCards = SPORT_ICONS.map(function (s) {
      return (
        '<div class="hero-sport-card">' +
          s.svg +
          '<span>' + s.label + '</span>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="hero-sports-panel">' +
        '<div class="hero-sports-panel-label">Bet on any sport</div>' +
        '<div class="hero-sport-cards">' + sportCards + '</div>' +
      '</div>' +
      badges
    );
  }

  function buildHeroStatChips() {
    var chips = [
      { icon: '🐎', text: 'Horse Racing', accent: true },
      { icon: '⚽', text: 'Football' },
      { icon: '🎾', text: 'Tennis & Golf' },
      { icon: '🐕', text: 'Greyhounds & More' },
    ];
    return chips.map(function (c) {
      return (
        '<div class="hero-stat-chip' + (c.accent ? ' hero-stat-chip-accent' : '') + '">' +
          '<span class="hero-stat-chip-icon">' + c.icon + '</span>' +
          c.text +
        '</div>'
      );
    }).join('');
  }

  function enhanceHero() {
    var hero = document.querySelector('.page-hero');
    if (!hero || hero.classList.contains('hero-enhanced')) return;

    // Gather existing children
    var children = Array.prototype.slice.call(hero.childNodes);

    // Wrap them in .hero-text
    var textDiv = document.createElement('div');
    textDiv.className = 'hero-text';
    children.forEach(function (node) { textDiv.appendChild(node); });

    // Append stats row inside hero-text
    var statsRow = document.createElement('div');
    statsRow.className = 'hero-stats-row';
    statsRow.innerHTML = buildHeroStatChips();
    textDiv.appendChild(statsRow);

    // Create visual panel
    var visual = document.createElement('div');
    visual.className = 'hero-visual';
    visual.setAttribute('aria-hidden', 'true');
    visual.innerHTML = buildHeroVisual();

    // Create layout wrapper
    var layout = document.createElement('div');
    layout.className = 'hero-layout';
    layout.appendChild(textDiv);
    layout.appendChild(visual);

    hero.appendChild(layout);
    hero.classList.add('hero-enhanced');
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  function init() {
    enhanceHero();
    watchResultValues();
    setTimeout(function () {
      animateBetTypeLinks();
      animateStatBoxes();
    }, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
