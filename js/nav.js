/**
 * BetCalc UK — Shared Navigation
 * Injects header nav (with calculator dropdown) into #site-nav on every page.
 * Dropdown is click-to-open, click-outside-to-close. No hover trigger.
 */
(function () {
  'use strict';

  // Path prefix: '' for root pages, '../' for one-level-deep pages
  var depth = (window.location.pathname.match(/\//g) || []).length;
  var root  = depth >= 2 ? '../' : '';

  // ── Calculator groups for dropdown ─────────────────────────────────────────
  var CALC_GROUPS = [
    {
      label: 'Popular',
      items: [
        { label: 'Lucky 15',    href: 'calculators/lucky-15.html' },
        { label: 'Yankee',      href: 'calculators/yankee.html' },
        { label: 'Accumulator', href: 'calculators/accumulator.html' },
        { label: 'Trixie',      href: 'calculators/trixie.html' },
        { label: 'Patent',      href: 'calculators/patent.html' },
      ],
    },
    {
      label: 'Basic',
      items: [
        { label: 'Single',   href: 'calculators/single.html' },
        { label: 'Each Way', href: 'calculators/each-way.html' },
        { label: 'Double',   href: 'calculators/double.html' },
        { label: 'Treble',   href: 'calculators/treble.html' },
        { label: 'Parlay',   href: 'calculators/parlay.html' },
      ],
    },
    {
      label: 'Full Cover',
      items: [
        { label: 'Canadian',     href: 'calculators/canadian.html' },
        { label: 'Super Yankee', href: 'calculators/super-yankee.html' },
        { label: 'Heinz',        href: 'calculators/heinz.html' },
        { label: 'Super Heinz',  href: 'calculators/super-heinz.html' },
        { label: 'Goliath',      href: 'calculators/goliath.html' },
        { label: 'Lucky 31',     href: 'calculators/lucky-31.html' },
        { label: 'Lucky 63',     href: 'calculators/lucky-63.html' },
        { label: 'Alphabet',     href: 'calculators/alphabet.html' },
      ],
    },
    {
      label: 'Flags & Exotics',
      items: [
        { label: 'Round Robin',         href: 'calculators/round-robin.html' },
        { label: 'Flag',                href: 'calculators/flag.html' },
        { label: 'Super Flag',          href: 'calculators/super-flag.html' },
        { label: 'Heinz Flag',          href: 'calculators/heinz-flag.html' },
        { label: 'Super Heinz Flag',    href: 'calculators/super-heinz-flag.html' },
        { label: 'Goliath Flag',        href: 'calculators/goliath-flag.html' },
        { label: 'Single Stakes About', href: 'calculators/single-stakes-about.html' },
        { label: 'Double Stakes About', href: 'calculators/double-stakes-about.html' },
      ],
    },
    {
      label: 'Union Jack',
      items: [
        { label: 'UJ Trebles',     href: 'calculators/union-jack-trebles.html' },
        { label: 'UJ Trixie',      href: 'calculators/union-jack-trixie.html' },
        { label: 'UJ Patent',      href: 'calculators/union-jack-patent.html' },
        { label: 'UJ Round Robin', href: 'calculators/union-jack-round-robin.html' },
      ],
    },
  ];

  function prefixed(href) { return root + href; }

  // ── Build dropdown panel ────────────────────────────────────────────────────
  function buildDropdown() {
    var cols = CALC_GROUPS.map(function (group) {
      var links = group.items.map(function (item) {
        return '<a href="' + prefixed(item.href) + '" class="nav-dd-link">' + item.label + '</a>';
      }).join('');
      return (
        '<div class="nav-dd-col">' +
          '<div class="nav-dd-group-label">' + group.label + '</div>' +
          links +
        '</div>'
      );
    }).join('');
    return (
      '<div class="nav-dropdown" id="calc-dropdown" role="menu" aria-label="Calculator types">' +
        '<div class="nav-dd-grid">' + cols + '</div>' +
      '</div>'
    );
  }

  // ── Build desktop nav ───────────────────────────────────────────────────────
  function buildNav() {
    var p = window.location.pathname;
    var homeActive  = (p === '/' || p.endsWith('/index.html') || p === '') ? ' class="active"' : '';
    var bookActive  = p.includes('bookmakers') ? ' class="active"' : '';
    var guideActive = p.includes('/guides/')   ? ' class="active"' : '';
    var aboutActive = p.includes('about')      ? ' class="active"' : '';
    var calcActive  = p.includes('/calculators/') ? ' active' : '';

    return (
      '<a' + homeActive + ' href="' + prefixed('index.html') + '">Home</a>' +
      '<div class="nav-calc-wrap">' +
        '<button type="button" class="nav-calc-btn' + calcActive + '" id="calc-dropdown-btn" aria-haspopup="true" aria-expanded="false">' +
          'Calculators ' +
          '<svg class="nav-chevron" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg>' +
        '</button>' +
        buildDropdown() +
      '</div>' +
      '<a' + bookActive  + ' href="' + prefixed('bookmakers.html') + '">Bookmakers</a>' +
      '<a' + guideActive + ' href="' + prefixed('guides/what-is-a-lucky-15.html') + '">Guides</a>' +
      '<a' + aboutActive + ' href="' + prefixed('about.html') + '">About</a>'
    );
  }

  // ── Build mobile nav ────────────────────────────────────────────────────────
  function buildMobileCalcAccordion() {
    return '<div class="mob-calc-accordion" id="mob-calc-accordion">' +
      CALC_GROUPS.map(function (group) {
        var links = group.items.map(function (item) {
          return '<a href="' + prefixed(item.href) + '" class="mob-calc-link">' + item.label + '</a>';
        }).join('');
        return (
          '<div class="mob-calc-group">' +
            '<button type="button" class="mob-calc-group-btn">' +
              group.label +
              '<svg class="nav-chevron" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg>' +
            '</button>' +
            '<div class="mob-calc-links">' + links + '</div>' +
          '</div>'
        );
      }).join('') +
    '</div>';
  }

  function buildMobileNav() {
    var p = window.location.pathname;
    var homeActive  = (p === '/' || p.endsWith('/index.html') || p === '') ? ' class="active"' : '';
    var bookActive  = p.includes('bookmakers') ? ' class="active"' : '';
    var guideActive = p.includes('/guides/')   ? ' class="active"' : '';
    var aboutActive = p.includes('about')      ? ' class="active"' : '';
    var calcActive  = p.includes('/calculators/') ? ' active' : '';

    return (
      '<a' + homeActive + ' href="' + prefixed('index.html') + '">Home</a>' +
      '<div class="mob-calc-section">' +
        '<button type="button" class="mob-calc-section-btn' + calcActive + '" id="mob-calc-section-btn" aria-expanded="false">' +
          'Calculators ' +
          '<svg class="nav-chevron" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg>' +
        '</button>' +
        buildMobileCalcAccordion() +
      '</div>' +
      '<a' + bookActive  + ' href="' + prefixed('bookmakers.html') + '">Bookmakers</a>' +
      '<a' + guideActive + ' href="' + prefixed('guides/what-is-a-lucky-15.html') + '">Guides</a>' +
      '<a' + aboutActive + ' href="' + prefixed('about.html') + '">About</a>'
    );
  }

  // ── Desktop dropdown: click-only ────────────────────────────────────────────
  function setupDesktop() {
    var btn = document.getElementById('calc-dropdown-btn');
    var dd  = document.getElementById('calc-dropdown');
    if (!btn || !dd) return;

    // Toggle on button click
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.classList.toggle('dd-open', isOpen);
    });

    // Close on any outside click
    document.addEventListener('click', function () {
      if (dd.classList.contains('open')) {
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('dd-open');
      }
    });

    // Keep clicks inside the dropdown from closing it
    dd.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    // Escape key closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dd.classList.contains('open')) {
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('dd-open');
        btn.focus();
      }
    });
  }

  // ── Mobile accordion ────────────────────────────────────────────────────────
  function setupMobile() {
    var sectionBtn = document.getElementById('mob-calc-section-btn');
    var accordion  = document.getElementById('mob-calc-accordion');
    if (!sectionBtn || !accordion) return;

    sectionBtn.addEventListener('click', function () {
      var isOpen = accordion.classList.toggle('open');
      sectionBtn.setAttribute('aria-expanded', String(isOpen));
    });

    accordion.querySelectorAll('.mob-calc-group-btn').forEach(function (gbtn) {
      gbtn.addEventListener('click', function () {
        var links = gbtn.nextElementSibling;
        if (!links) return;
        var isOpen = links.classList.toggle('open');
        gbtn.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  // ── Main init ───────────────────────────────────────────────────────────────
  function init() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;

    var isMobile = window.innerWidth <= 768;
    nav.innerHTML = isMobile ? buildMobileNav() : buildNav();

    // Hamburger
    var toggle = document.getElementById('nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        if (open) {
          nav.innerHTML = buildMobileNav();
          setupMobile();
        }
      });
    }

    if (isMobile) {
      setupMobile();
    } else {
      setupDesktop();
    }

    // Re-init on breakpoint cross
    var lastMobile = isMobile;
    window.addEventListener('resize', function () {
      var nowMobile = window.innerWidth <= 768;
      if (nowMobile !== lastMobile) {
        lastMobile = nowMobile;
        nav.classList.remove('open');
        nav.innerHTML = nowMobile ? buildMobileNav() : buildNav();
        if (nowMobile) { setupMobile(); } else { setupDesktop(); }
      }
    });
  }

  // ── Favicon ─────────────────────────────────────────────────────────────────
  function injectFavicon() {
    if (document.querySelector('link[rel~="icon"]')) return;
    var link = document.createElement('link');
    link.rel  = 'icon';
    link.type = 'image/svg+xml';
    link.href = root + 'favicon.svg';
    document.head.appendChild(link);
  }

  // ── Logo: calculator icon ────────────────────────────────────────────────────
  // A clean 36×36 calculator: rounded body, screen with £ result line, 2×3 button grid
  var LOGO_SVG = [
    '<rect x="3" y="1" width="30" height="34" rx="6"',
    '  fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>',
    /* Screen */
    '<rect x="6" y="4" width="24" height="11" rx="3" fill="rgba(255,255,255,0.16)"/>',
    /* Screen: two horizontal lines suggesting numbers */
    '<rect x="9" y="7" width="12" height="2.5" rx="1.2" fill="rgba(255,255,255,0.55)"/>',
    '<rect x="17" y="10.5" width="10" height="2.5" rx="1.2" fill="#f5a623" opacity=".9"/>',
    /* Separator */
    '<line x1="6" y1="18" x2="30" y2="18" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>',
    /* Buttons — 3 cols × 2 rows */
    /* Row 1  y=20 */
    '<rect x="6"  y="20" width="7" height="5.5" rx="2" fill="rgba(255,255,255,0.26)"/>',
    '<rect x="15" y="20" width="7" height="5.5" rx="2" fill="rgba(255,255,255,0.26)"/>',
    '<rect x="24" y="20" width="6" height="5.5" rx="2" fill="#f5a623"/>',
    /* Row 2  y=27.5 */
    '<rect x="6"  y="27.5" width="7" height="5.5" rx="2" fill="rgba(255,255,255,0.26)"/>',
    '<rect x="15" y="27.5" width="7" height="5.5" rx="2" fill="rgba(255,255,255,0.26)"/>',
    '<rect x="24" y="27.5" width="6" height="5.5" rx="2" fill="rgba(255,255,255,0.26)"/>',
  ].join('');

  function updateLogo() {
    var logoSvg = document.querySelector('.site-logo svg');
    if (!logoSvg) return;
    logoSvg.setAttribute('viewBox', '0 0 36 36');
    logoSvg.innerHTML = LOGO_SVG;
  }

  // ── Boot ─────────────────────────────────────────────────────────────────────
  function boot() {
    injectFavicon();
    init();
    updateLogo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
