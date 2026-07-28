# -*- coding: utf-8 -*-
"""
Build content pipeline: takes articles from text/ + xlsx meta and injects into HTML pages.

Inputs:
  text/статья {slug}_gb_en_london_*.md-ish
  lucky15-betcalc_resurs_TZ.xlsx  (Title_Desc_H1 sheet)

Outputs:
  Updated index.html, bookmakers.html, calculators/*.html, guides/*.html
  New guides/what-is-a-patent.html, guides/what-is-a-trixie.html
  llms.txt
  Updated sitemap.xml
"""
import os, re, glob, json, sys, io, html
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT = os.path.dirname(os.path.abspath(__file__))
TEXT_DIR = os.path.join(ROOT, 'text')
GUIDES_DIR = os.path.join(ROOT, 'guides')
CALCS_DIR = os.path.join(ROOT, 'calculators')

# ---------- 1. Article slug → target URL mapping ----------
SLUG_TO_TARGET = {
    'lucky-15-calculator':              ('index.html', 'calculator'),
    'lucky-31-calculator':              ('calculators/lucky-31.html', 'calculator'),
    'lucky-63-calculator':              ('calculators/lucky-63.html', 'calculator'),
    'yankee-calculator':                ('calculators/yankee.html', 'calculator'),
    'trixie-calculator':                ('calculators/trixie.html', 'calculator'),
    'patent-calculator':                ('calculators/patent.html', 'calculator'),
    'each-way-calculator':              ('calculators/each-way.html', 'calculator'),
    'accumulator-calculator':           ('calculators/accumulator.html', 'calculator'),
    'round-robin-calculator':           ('calculators/round-robin.html', 'calculator'),
    'heinz-calculator':                 ('calculators/heinz.html', 'calculator'),
    'super-heinz-calculator':           ('calculators/super-heinz.html', 'calculator'),
    'goliath-calculator':               ('calculators/goliath.html', 'calculator'),
    'canadian-bet-calculator':          ('calculators/canadian.html', 'calculator'),
    'super-yankee-calculator':          ('calculators/super-yankee.html', 'calculator'),
    'single-bet-calculator':            ('calculators/single.html', 'calculator'),
    'double-bet-calculator':            ('calculators/double.html', 'calculator'),
    'treble-calculator':                ('calculators/treble.html', 'calculator'),
    'alphabet-bet-calculator':          ('calculators/alphabet.html', 'calculator'),
    'flag-bet-calculator':              ('calculators/flag.html', 'calculator'),
    'super-flag-calculator':            ('calculators/super-flag.html', 'calculator'),
    'heinz-flag-calculator':            ('calculators/heinz-flag.html', 'calculator'),
    'super-heinz-flag-calculator':      ('calculators/super-heinz-flag.html', 'calculator'),
    'goliath-flag-calculator':          ('calculators/goliath-flag.html', 'calculator'),
    'union-jack-calculator':            ('calculators/union-jack-trebles.html', 'calculator'),
    'union-jack-trixie-calculator':     ('calculators/union-jack-trixie.html', 'calculator'),
    'union-jack-patent-calculator':     ('calculators/union-jack-patent.html', 'calculator'),
    'union-jack-round-robin-calculator':('calculators/union-jack-round-robin.html', 'calculator'),
    'single-stakes-about-calculator':   ('calculators/single-stakes-about.html', 'calculator'),
    'double-stakes-about-calculator':   ('calculators/double-stakes-about.html', 'calculator'),
    'parlay-calculator':                ('calculators/parlay.html', 'calculator'),
    'what-is-a-lucky-15':               ('guides/what-is-a-lucky-15.html', 'guide'),
    'what-is-a-yankee-bet':             ('guides/what-is-a-yankee.html', 'guide'),
    'what-is-an-accumulator':           ('guides/what-is-an-accumulator.html', 'guide'),
    'each-way-betting-explained':       ('guides/each-way-betting-explained.html', 'guide'),
    'rule-4-calculator':                ('guides/rule-4-deductions.html', 'guide'),
    'what-is-a-patent-bet':             ('guides/what-is-a-patent.html', 'guide-new'),
    'what-is-a-trixie-bet':             ('guides/what-is-a-trixie.html', 'guide-new'),
    'best-betting-bookmakers-uk':       ('bookmakers.html', 'bookmakers'),
}

# ---------- 2. xlsx meta (Title/Desc/H1) ----------
XLSX_META = {
    '/': ('Lucky 15 Bet Calculator — Free & Accurate UK Tool 2026',
          'Free Lucky 15 bet calculator for UK horse racing. Each-way, Rule 4 and bookmaker bonuses. Instant, accurate returns in fractional, decimal or American odds.',
          'Lucky 15 Bet Calculator — Free UK Horse Racing Tool'),
    '/calculators/lucky-31.html': ('Lucky 31 Calculator — Work Out Your Returns (Free)',
          'Free Lucky 31 calculator for 5 selections (31 bets). Calculate each-way returns, Rule 4 and bonuses instantly. UK horse racing 2026.',
          'Lucky 31 Calculator — Returns for 5 Selections'),
    '/calculators/lucky-63.html': ('Lucky 63 Calculator — Free UK Returns Tool 2026',
          'Free Lucky 63 calculator for 6 selections (63 bets). Work out each-way returns, Rule 4 deductions and bonuses in seconds.',
          'Lucky 63 Calculator — Returns for 6 Selections'),
    '/calculators/yankee.html': ('Yankee Bet Calculator — Free UK Tool (11 Bets)',
          'Free Yankee calculator: 4 selections, 11 bets. Calculate each-way returns, Rule 4 and accumulator payouts instantly for UK racing.',
          'Yankee Calculator — 4 Selections, 11 Bets'),
    '/calculators/trixie.html': ('Trixie Calculator — Free Bet Returns Tool 2026',
          'Free Trixie calculator: 3 selections, 4 bets (3 doubles + 1 treble). Work out each-way returns and Rule 4 deductions instantly.',
          'Trixie Calculator — 3 Selections, 4 Bets'),
    '/calculators/patent.html': ('Patent Calculator — Free UK Bet Returns Tool',
          'Free Patent calculator: 3 selections, 7 bets. Calculate singles, doubles, treble and each-way returns with Rule 4 instantly.',
          'Patent Calculator — 3 Selections, 7 Bets'),
    '/calculators/each-way.html': ('Each Way Calculator — Free EW Returns Tool 2026',
          'Free each-way calculator for UK horse racing. Work out win and place returns at 1/4 or 1/5 odds instantly. Accurate EW payouts.',
          'Each Way Calculator — Win & Place Returns'),
    '/calculators/accumulator.html': ('Accumulator Calculator — Free Acca Returns Tool',
          'Free accumulator (acca) calculator for 4+ selections. Calculate multi returns, each-way and bonuses instantly for UK betting.',
          'Accumulator Calculator — Acca Returns Tool'),
    '/calculators/round-robin.html': ('Round Robin Calculator — Free UK Tool (10 Bets)',
          'Free Round Robin calculator: 3 selections, 10 bets with SSA. Work out each-way returns and Rule 4 deductions instantly.',
          'Round Robin Calculator — 3 Selections, 10 Bets'),
    '/calculators/heinz.html': ('Heinz Calculator — Free UK Returns Tool (57 Bets)',
          'Free Heinz calculator: 6 selections, 57 bets. Calculate each-way returns, Rule 4 and bonuses for UK horse racing instantly.',
          'Heinz Calculator — 6 Selections, 57 Bets'),
    '/calculators/super-heinz.html': ('Super Heinz Calculator — Free Tool (120 Bets)',
          'Free Super Heinz calculator: 7 selections, 120 bets. Work out each-way returns and Rule 4 deductions in seconds.',
          'Super Heinz Calculator — 7 Selections, 120 Bets'),
    '/calculators/goliath.html': ('Goliath Calculator — Free UK Tool (247 Bets)',
          'Free Goliath calculator: 8 selections, 247 bets. Calculate each-way returns, Rule 4 and bonuses instantly for UK racing.',
          'Goliath Calculator — 8 Selections, 247 Bets'),
    '/calculators/canadian.html': ('Canadian Bet Calculator — Free Tool (26 Bets)',
          'Free Canadian (Super Yankee) calculator: 5 selections, 26 bets. Work out each-way returns and Rule 4 instantly.',
          'Canadian Calculator — 5 Selections, 26 Bets'),
    '/guides/what-is-a-lucky-15.html': ('What Is a Lucky 15 Bet? Full Guide & Examples 2026',
          'What is a Lucky 15 bet? 4 selections, 15 bets explained with payout examples, each-way, bonuses and strategy. Complete UK guide.',
          'What Is a Lucky 15 Bet? Complete Guide'),
    '/guides/what-is-a-yankee.html': ('What Is a Yankee Bet? Full Guide & Examples 2026',
          'What is a Yankee bet? 4 selections, 11 bets explained with worked payout examples, each-way and strategy tips. UK guide.',
          'What Is a Yankee Bet? Full Explanation'),
    '/bookmakers.html': ('Best UK Bookmakers for Lucky 15 Bets 2026',
          'Compare the best UK bookmakers for Lucky 15 bets. Consolation bonuses, double odds offers (Betfred, Coral) and welcome deals 2026.',
          'Best UK Bookmakers for Lucky 15 Bonuses'),
}

# ---------- 3. William Hill sanitization (articles were generated for WH; site is neutral) ----------
SANITIZE_PATTERNS = [
    (r"William Hill provides this calculator", "Our free tool provides this calculator"),
    (r"William Hill's calculator", "Our calculator"),
    (r"William Hill's mobile platform", "most UK bookmakers' mobile platforms"),
    (r"William Hill's platform", "the bookmaker's platform"),
    (r"through William Hill's", "through your chosen bookmaker's"),
    (r"William Hill provides", "Most UK bookmakers provide"),
    (r"William Hill offers Lucky 15 betting", "Lucky 15 betting works"),
    (r"William Hill supports these markets", "our calculator covers these markets"),
    (r"William Hill offers", "Most UK bookmakers offer"),
    (r"William Hill supports", "Most UK bookmakers support"),
    (r"William Hill applies standard", "UK bookmakers apply standard"),
    (r"William Hill applies", "UK bookmakers apply"),
    (r"William Hill typically offers", "UK bookmakers typically offer"),
    (r"William Hill remains", "The major UK bookmakers remain"),
    (r"William Hill maintains", "UK bookmakers maintain"),
    (r"William Hill's standard", "the standard UK bookmaker"),
    (r"William Hill follows", "UK bookmakers follow"),
    (r"Players searching for a [a-z 0-9-]+ promo code or [a-z 0-9-]+ no deposit bonus should verify current promotional terms directly through William Hill's platform",
     "Promo codes, no-deposit bonuses, welcome bonuses and free spins vary by bookmaker"),
    (r"Similarly, those seeking a [a-z 0-9-]+ welcome bonus or [a-z 0-9-]+ free spins will find availability depends on active offers at the time of account registration or deposit\.",
     "Always verify current promotional terms on the bookmaker's own platform before depositing."),
    (r"\bthe William Hill\b", "your chosen UK bookmaker's"),
    (r"\bWilliam Hill\b", "your chosen UK bookmaker"),
    # Pluralisation fix-ups after the replacement turned a singular brand into a plural
    (r"Most UK bookmakers provide its", "Most UK bookmakers provide their"),
    (r"Most UK bookmakers offer its", "Most UK bookmakers offer their"),
    (r"Most UK bookmakers offers", "Most UK bookmakers offer"),
    (r"Most UK bookmakers provides", "Most UK bookmakers provide"),
    (r"Most UK bookmakers supports", "Most UK bookmakers support"),
    (r"Most UK bookmakers applies", "Most UK bookmakers apply"),
    (r"UK bookmakers applies", "UK bookmakers apply"),
    (r"Most UK bookmakers remains", "The major UK bookmakers remain"),
    (r"UK bookmakers maintains", "UK bookmakers maintain"),
    (r"the your chosen UK bookmaker", "your chosen UK bookmaker"),
    (r"Can I use the your chosen UK bookmaker", "Can I use a UK bookmaker"),
    (r"BetCalc UK calculator", "Our calculator"),
    (r"BetCalc UK provides", "Our calculator provides"),
    (r"\bBetCalc UK supports\b", "our calculator covers"),
    (r"\bBetCalc UK supporting\b", "our calculator covering"),
    # Capitalize "our" / "most" if it landed at sentence start due to the replacement
    (r"(^|[.!?]\s+|>\s*)our calculator", r"\1Our calculator"),
    (r"(^|[.!?]\s+|>\s*)our free tool", r"\1Our free tool"),
    (r"(^|[.!?]\s+|>\s*)most UK bookmakers", r"\1Most UK bookmakers"),
    (r"(^|[.!?]\s+|>\s*)through your chosen bookmaker's", r"\1Through your chosen bookmaker's"),
    # Drop the awkward "Most UK bookmakers" if it appeared mid-sentence followed by another verb shape
    (r"\bMost UK bookmakers offer Most UK bookmakers", "Most UK bookmakers"),
]
def sanitize(text):
    for pat, repl in SANITIZE_PATTERNS:
        text = re.sub(pat, repl, text)
    return text

# ---------- 4. Article parser ----------
def parse_article(path):
    with open(path, encoding='utf-8') as f:
        raw = f.read()
    lines = raw.splitlines()
    title = desc = h1 = ''
    body_start = 0
    for i, ln in enumerate(lines):
        s = ln.strip()
        if s.startswith('**Title:**'):
            title = s[len('**Title:**'):].strip()
        elif s.startswith('**Description:**'):
            desc = s[len('**Description:**'):].strip()
        elif s.startswith('# '):
            h1 = s[2:].strip()
            body_start = i + 1
            break
    body = '\n'.join(lines[body_start:])
    return {
        'title': sanitize(title),
        'description': sanitize(desc),
        'h1': sanitize(h1),
        'body_md': sanitize(body),
    }

# ---------- 5. Markdown → HTML ----------
def md_inline(text):
    """Inline markdown: **bold**, [text](url), `code`, escape HTML."""
    # First escape, then re-introduce allowed inline patterns
    text = html.escape(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    return text

def md_to_html(md):
    """Convert article markdown body to HTML. Returns (html_str, faq_items list of dicts)."""
    lines = md.splitlines()
    out = []
    faq_items = []
    in_faq = False
    current_q = None
    current_a_lines = []

    def flush_faq():
        nonlocal current_q, current_a_lines
        if current_q is not None:
            faq_items.append({
                'q': current_q,
                'a': ' '.join(l.strip() for l in current_a_lines if l.strip()),
            })
        current_q = None
        current_a_lines = []

    i = 0
    while i < len(lines):
        ln = lines[i]
        s = ln.strip()

        # H2
        if s.startswith('## '):
            heading = s[3:].strip()
            if re.search(r'\b(frequently asked questions|faqs?)\b', heading, re.I):
                in_faq = True
                i += 1
                continue
            in_faq = False
            flush_faq()
            out.append(f'<h2>{md_inline(heading)}</h2>')
            i += 1
            continue

        # H3 — in FAQ section, treat as question
        if s.startswith('### '):
            q = s[4:].strip()
            if in_faq:
                flush_faq()
                current_q = q
                current_a_lines = []
            else:
                out.append(f'<h3>{md_inline(q)}</h3>')
            i += 1
            continue

        # Table (pipe-style with separator on next line)
        if '|' in s and i + 1 < len(lines) and re.match(r'^\s*\|?[\s\-:|]+\|[\s\-:|]+', lines[i+1]):
            # Collect table rows
            header = [c.strip() for c in s.strip().strip('|').split('|')]
            i += 2  # skip header + separator
            rows = []
            while i < len(lines) and '|' in lines[i]:
                row = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                rows.append(row)
                i += 1
            if in_faq and current_q is not None:
                # Tables inside FAQ answers: append as text representation
                tbl_html = ['<div class="table-wrap" style="overflow-x:auto"><table class="bet-def-table"><thead><tr>']
                for h in header: tbl_html.append(f'<th>{md_inline(h)}</th>')
                tbl_html.append('</tr></thead><tbody>')
                for row in rows:
                    tbl_html.append('<tr>')
                    for c in row: tbl_html.append(f'<td>{md_inline(c)}</td>')
                    tbl_html.append('</tr>')
                tbl_html.append('</tbody></table></div>')
                current_a_lines.append(''.join(tbl_html))
            else:
                out.append('<div class="table-wrap" style="overflow-x:auto"><table class="bet-def-table"><thead><tr>')
                for h in header: out.append(f'<th>{md_inline(h)}</th>')
                out.append('</tr></thead><tbody>')
                for row in rows:
                    out.append('<tr>')
                    for c in row: out.append(f'<td>{md_inline(c)}</td>')
                    out.append('</tr>')
                out.append('</tbody></table></div>')
            continue

        # Numbered/bulleted list
        if re.match(r'^\d+\.\s+', s) or re.match(r'^[-*]\s+', s):
            ordered = bool(re.match(r'^\d+\.\s+', s))
            items = []
            while i < len(lines):
                t = lines[i].strip()
                m = re.match(r'^(?:\d+\.\s+|[-*]\s+)(.*)$', t)
                if not m: break
                items.append(m.group(1))
                i += 1
            tag = 'ol' if ordered else 'ul'
            li_html = ''.join(f'<li>{md_inline(it)}</li>' for it in items)
            block = f'<{tag} class="steps-list">{li_html}</{tag}>' if ordered else f'<{tag}>{li_html}</{tag}>'
            if in_faq and current_q is not None:
                current_a_lines.append(block)
            else:
                out.append(block)
            continue

        # Standalone bold pseudo-heading: **text** alone on a line (no other content)
        m = re.match(r'^\*\*([^*]+)\*\*\s*$', s)
        if m and not in_faq:
            out.append(f'<h4>{md_inline(m.group(1))}</h4>')
            i += 1
            continue
        if m and in_faq and current_q is not None:
            current_a_lines.append(f'<strong>{md_inline(m.group(1))}</strong>')
            i += 1
            continue

        # Blank line
        if not s:
            i += 1
            continue

        # Paragraph
        if in_faq and current_q is not None:
            current_a_lines.append(ln)
        else:
            out.append(f'<p>{md_inline(s)}</p>')
        i += 1

    flush_faq()
    return '\n'.join(out), faq_items

def render_faq_html(faq_items):
    if not faq_items: return ''
    parts = ['<section class="content-section section-block">',
             '<h2>Frequently Asked Questions</h2>',
             '<div class="faq-list">']
    for item in faq_items:
        parts.append('<div class="faq-item">')
        parts.append(f'<button class="faq-question" aria-expanded="false">{md_inline(item["q"])}<span class="faq-icon" aria-hidden="true">+</span></button>')
        parts.append(f'<div class="faq-answer"><p>{item["a"]}</p></div>')
        parts.append('</div>')
    parts.append('</div></section>')
    return '\n'.join(parts)

def render_faq_jsonld(faq_items):
    if not faq_items: return ''
    main = []
    for item in faq_items:
        # Strip HTML from answer for schema (plain text)
        ans = re.sub(r'<[^>]+>', '', item['a'])
        ans = html.unescape(ans).strip()
        main.append({
            "@type": "Question",
            "name": html.unescape(item['q']),
            "acceptedAnswer": {"@type": "Answer", "text": ans},
        })
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": main}
    return '<script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, indent=2) + '\n</script>'

# ---------- 6. Locate text files ----------
def find_article_files():
    """Return dict slug -> file_path."""
    out = {}
    for p in glob.glob(os.path.join(TEXT_DIR, '*')):
        name = os.path.basename(p)
        if not name.startswith('статья'): continue
        # Format: статья {slug}_gb_en_london_DATE
        m = re.match(r'^статья\s+(.+?)_gb_en_london_', name)
        if not m: continue
        slug = m.group(1)
        out[slug] = p
    return out

# ---------- 7. Apply meta to HTML head ----------
def apply_meta(html_text, title, description, h1, hero_intro):
    html_text = re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)}</title>', html_text, count=1, flags=re.S)
    html_text = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{html.escape(description, quote=True)}">',
        html_text, count=1)
    # h1 inside .page-hero
    html_text = re.sub(
        r'(<section class="page-hero">\s*<h1>).*?(</h1>\s*<p>).*?(</p>)',
        lambda m: f'{m.group(1)}{html.escape(h1)}{m.group(2)}{html.escape(hero_intro)}{m.group(3)}',
        html_text, count=1, flags=re.S)
    return html_text

def first_paragraph(body_md):
    """Return first non-empty paragraph of body, plain text, max 320 chars."""
    for ln in body_md.splitlines():
        s = ln.strip()
        if s and not s.startswith('#') and not s.startswith('**'):
            # Strip inline markdown
            s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
            return s[:320]
    return ''

# ---------- 8. Calculator page injection ----------
def inject_calculator_page(filepath, art, slug, target_url):
    with open(filepath, encoding='utf-8') as f:
        page = f.read()
    meta = XLSX_META.get(target_url)
    if meta:
        title, desc, h1 = meta
    else:
        title = art['title'] + ' | BetCalc UK' if 'BetCalc UK' not in art['title'] else art['title']
        desc = art['description']
        h1 = art['h1']
    hero_p = first_paragraph(art['body_md'])
    page = apply_meta(page, title, desc, h1, hero_p)

    body_html, faq_items = md_to_html(art['body_md'])
    faq_section = render_faq_html(faq_items)
    faq_jsonld = render_faq_jsonld(faq_items)

    # Build the new content section that replaces the old "What is a X Bet Calculator?" block
    new_content_section = f'''<!-- BEGIN-ARTICLE-INJECT -->
<section class="content-section section-block article-body">
{body_html}
</section>
{faq_section}
<!-- END-ARTICLE-INJECT -->'''

    # Idempotent: remove ALL content-section blocks between calc-card and bookmakers-section
    # (handles first-run "small What is X" + re-run already-injected article-body + FAQ)
    page = re.sub(
        r'(?:<!-- BEGIN-ARTICLE-INJECT -->.*?<!-- END-ARTICLE-INJECT -->\s*)|'
        r'(?:<section class="content-section section-block(?:\s+article-body)?">.*?</section>\s*(?=<section class="(?:content-section|bookmakers-section)))',
        '', page, flags=re.S)
    # Now insert fresh content right before bookmakers-section
    page = re.sub(
        r'(?=<section class="bookmakers-section)',
        new_content_section + '\n\n      ',
        page, count=1)

    # Inject FAQ JSON-LD before </body>
    if faq_jsonld:
        # Remove any prior FAQPage script we may have injected
        page = re.sub(
            r'<!-- FAQPage-JSONLD-INJECT -->.*?<!-- /FAQPage-JSONLD-INJECT -->',
            '', page, flags=re.S)
        marker = f'<!-- FAQPage-JSONLD-INJECT -->\n{faq_jsonld}\n<!-- /FAQPage-JSONLD-INJECT -->'
        page = page.replace('</body>', f'{marker}\n</body>', 1)

    # Inject WebApplication + BreadcrumbList JSON-LD
    bet_name = h1.replace(' | BetCalc UK', '')
    wa_data = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": bet_name,
        "url": f"https://lucky-15-bet-calculator.uk{target_url if target_url.startswith('/') else '/' + target_url}",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript enabled",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"},
        "publisher": {"@type": "Organization", "name": "BetCalc UK", "url": "https://lucky-15-bet-calculator.uk"},
    }
    bc_data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://lucky-15-bet-calculator.uk/"},
            {"@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://lucky-15-bet-calculator.uk/#calculators"},
            {"@type": "ListItem", "position": 3, "name": bet_name},
        ],
    }
    wa_jsonld = '<script type="application/ld+json">\n' + json.dumps(wa_data, ensure_ascii=False, indent=2) + '\n</script>'
    bc_jsonld = '<script type="application/ld+json">\n' + json.dumps(bc_data, ensure_ascii=False, indent=2) + '\n</script>'
    page = re.sub(r'<!-- App-JSONLD-INJECT -->.*?<!-- /App-JSONLD-INJECT -->', '', page, flags=re.S)
    marker = f'<!-- App-JSONLD-INJECT -->\n{wa_jsonld}\n{bc_jsonld}\n<!-- /App-JSONLD-INJECT -->'
    page = page.replace('</body>', f'{marker}\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(page)

# ---------- 9. Guide page injection ----------
def inject_guide_page(filepath, art, slug, target_url, is_new=False):
    if is_new:
        # Create from template based on what-is-a-yankee.html structure
        write_new_guide(filepath, art, target_url)
        return
    with open(filepath, encoding='utf-8') as f:
        page = f.read()
    meta = XLSX_META.get(target_url)
    if meta:
        title, desc, h1 = meta
    else:
        title = art['title']
        desc = art['description']
        h1 = art['h1']
    hero_p = first_paragraph(art['body_md'])
    page = apply_meta(page, title, desc, h1, hero_p)

    body_html, faq_items = md_to_html(art['body_md'])
    faq_section = render_faq_html(faq_items)
    faq_jsonld = render_faq_jsonld(faq_items)

    # Replace the <article>...</article> contents inside the two-col-layout
    # If page uses two-col-layout/article, replace inside. Otherwise wrap.
    article_inner = f'<section class="section-block article-body">\n{body_html}\n</section>\n{faq_section}'

    if '<article>' in page:
        page = re.sub(
            r'(<article>).*?(</article>)',
            lambda m: m.group(1) + '\n' + article_inner + '\n' + m.group(2),
            page, count=1, flags=re.S)
    else:
        # Replace main container content
        page = re.sub(
            r'(<main>\s*<div class="container page-content">\s*).*?(\s*</div>\s*</main>)',
            lambda m: m.group(1) + '<article class="guide-article">' + article_inner + '</article>' + m.group(2),
            page, count=1, flags=re.S)

    # JSON-LD: Article + FAQPage + BreadcrumbList
    art_data = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": h1,
        "description": desc,
        "url": f"https://lucky-15-bet-calculator.uk{target_url if target_url.startswith('/') else '/' + target_url}",
        "datePublished": "2026-06-22",
        "dateModified": "2026-06-22",
        "author": {"@type": "Organization", "name": "BetCalc UK"},
        "publisher": {"@type": "Organization", "name": "BetCalc UK", "url": "https://lucky-15-bet-calculator.uk"},
    }
    bc_data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://lucky-15-bet-calculator.uk/"},
            {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://lucky-15-bet-calculator.uk/guides/what-is-a-lucky-15.html"},
            {"@type": "ListItem", "position": 3, "name": h1},
        ],
    }
    art_jsonld = '<script type="application/ld+json">\n' + json.dumps(art_data, ensure_ascii=False, indent=2) + '\n</script>'
    bc_jsonld = '<script type="application/ld+json">\n' + json.dumps(bc_data, ensure_ascii=False, indent=2) + '\n</script>'

    page = re.sub(r'<!-- Guide-JSONLD-INJECT -->.*?<!-- /Guide-JSONLD-INJECT -->', '', page, flags=re.S)
    marker = f'<!-- Guide-JSONLD-INJECT -->\n{art_jsonld}\n{bc_jsonld}\n{faq_jsonld}\n<!-- /Guide-JSONLD-INJECT -->'
    page = page.replace('</body>', f'{marker}\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(page)

GUIDE_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="google-site-verification" content="iN1uH_ZlnVdyoQkXidwhLAjMkLbgJ0zlh_-F4Urtm_c" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="robots" content="index, follow">
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body class="page-wrapper">
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
      <nav class="site-nav" id="site-nav"></nav>
    </div>
  </header>

  <section class="page-hero">
    <h1>{h1}</h1>
    <p>{hero_p}</p>
  </section>

  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="what-is-a-lucky-15.html">Guides</a></li>
        <li>{h1}</li>
      </ol>
    </div>
  </nav>

  <main>
    <div class="container page-content">
      <div class="two-col-layout">
        <article>
{article_inner}
          <div class="inline-cta">
            <h3>Try Our Free {bet_name} Calculator</h3>
            <p>Work out your potential returns instantly with our free calculator.</p>
            <a href="{cta_href}" class="btn btn-accent btn-lg">Open {bet_name} Calculator</a>
          </div>
        </article>

        <aside class="calc-sidebar">
          <div class="card">
            <div class="card-header">Quick Calculator</div>
            <div class="card-body" style="padding:12px">
              <a href="{cta_href}" class="btn btn-primary btn-full">{bet_name} Calculator</a>
              <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px">
                <a href="/" class="btn btn-outline btn-sm btn-full">Lucky 15 Calculator</a>
                <a href="/" class="btn btn-outline btn-sm btn-full">All Calculators</a>
              </div>
            </div>
          </div>
          <div class="card mt-16">
            <div class="card-header">Related Guides</div>
            <div class="card-body" style="padding:12px">
              <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px">
                <li><a href="what-is-a-lucky-15.html">What is a Lucky 15?</a></li>
                <li><a href="what-is-a-yankee.html">What is a Yankee?</a></li>
                <li><a href="what-is-an-accumulator.html">What is an Accumulator?</a></li>
                <li><a href="each-way-betting-explained.html">Each Way Betting</a></li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="responsible-gambling">
        <strong>Gamble Responsibly.</strong> 18+ only.
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 BetCalc UK. All rights reserved.</span>
      </div>
    </div>
  </footer>

  <script>
    document.querySelectorAll('.faq-question').forEach(btn => {{
      btn.addEventListener('click', () => {{
        const isOpen = btn.classList.contains('open');
        document.querySelectorAll('.faq-question').forEach(b => {{ b.classList.remove('open'); b.setAttribute('aria-expanded','false'); if(b.nextElementSibling) b.nextElementSibling.classList.remove('open'); }});
        if (!isOpen) {{ btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); if(btn.nextElementSibling) btn.nextElementSibling.classList.add('open'); }}
      }});
    }});
    const t = document.getElementById('nav-toggle'), n = document.getElementById('site-nav');
    if (t && n) t.addEventListener('click', () => {{ const o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o); }});
  </script>
  <script src="../js/nav.js?v=2"></script>
  <script src="../js/animations.js"></script>
{jsonld_block}
</body>
</html>
'''

def write_new_guide(filepath, art, target_url):
    title = art['title']
    desc = art['description']
    h1 = art['h1']
    hero_p = first_paragraph(art['body_md'])
    body_html, faq_items = md_to_html(art['body_md'])
    faq_section = render_faq_html(faq_items)
    faq_jsonld = render_faq_jsonld(faq_items)

    # Map guide slug → calculator href
    cta_map = {
        '/guides/what-is-a-patent.html': ('Patent', '../calculators/patent.html'),
        '/guides/what-is-a-trixie.html': ('Trixie', '../calculators/trixie.html'),
    }
    bet_name, cta_href = cta_map.get(target_url, ('Lucky 15', '/'))

    article_inner = f'          <section class="section-block article-body">\n{body_html}\n</section>\n{faq_section}'

    art_data = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": h1,
        "description": desc,
        "url": f"https://lucky-15-bet-calculator.uk{target_url}",
        "datePublished": "2026-06-22",
        "dateModified": "2026-06-22",
        "author": {"@type": "Organization", "name": "BetCalc UK"},
        "publisher": {"@type": "Organization", "name": "BetCalc UK", "url": "https://lucky-15-bet-calculator.uk"},
    }
    bc_data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://lucky-15-bet-calculator.uk/"},
            {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://lucky-15-bet-calculator.uk/guides/what-is-a-lucky-15.html"},
            {"@type": "ListItem", "position": 3, "name": h1},
        ],
    }
    art_jsonld = '<script type="application/ld+json">\n' + json.dumps(art_data, ensure_ascii=False, indent=2) + '\n</script>'
    bc_jsonld = '<script type="application/ld+json">\n' + json.dumps(bc_data, ensure_ascii=False, indent=2) + '\n</script>'
    jsonld_block = f'  <!-- Guide-JSONLD-INJECT -->\n{art_jsonld}\n{bc_jsonld}\n{faq_jsonld}\n  <!-- /Guide-JSONLD-INJECT -->'

    rendered = GUIDE_TEMPLATE.format(
        title=html.escape(title),
        desc=html.escape(desc, quote=True),
        h1=html.escape(h1),
        hero_p=html.escape(hero_p),
        bet_name=html.escape(bet_name),
        cta_href=cta_href,
        article_inner=article_inner,
        jsonld_block=jsonld_block,
    )
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(rendered)

# ---------- 10. Homepage injection ----------
def inject_homepage(filepath, art):
    with open(filepath, encoding='utf-8') as f:
        page = f.read()
    title, desc, h1 = XLSX_META['/']
    hero_p = first_paragraph(art['body_md'])
    page = apply_meta(page, title, desc, h1, hero_p)

    body_html, faq_items = md_to_html(art['body_md'])

    # Merge article FAQ with existing FAQ items already in page (existing FAQ stays + we replace FAQ JSON-LD with merged)
    # Replace the existing site-default FAQ <section> with new merged set
    new_faq_section = render_faq_html(faq_items)
    faq_jsonld = render_faq_jsonld(faq_items)

    # Replace homepage's FAQ section (the content-section that contains "Frequently Asked Questions")
    page = re.sub(
        r'<!-- FAQ -->\s*<section class="content-section section-block">\s*<h2>Frequently Asked Questions</h2>.*?</section>',
        '<!-- FAQ -->\n      ' + new_faq_section,
        page, count=1, flags=re.S)

    # Insert article body as a new content section right after the "How to Use" section
    article_section = f'''<!-- BEGIN-HOMEPAGE-ARTICLE -->
      <section class="content-section section-block article-body">
{body_html}
      </section>
      <!-- END-HOMEPAGE-ARTICLE -->

      '''
    # Idempotent: strip prior injections (marked or unmarked)
    page = re.sub(r'<!-- BEGIN-HOMEPAGE-ARTICLE -->.*?<!-- END-HOMEPAGE-ARTICLE -->\s*', '', page, flags=re.S)
    page = re.sub(r'<!-- Article content -->\s*', '', page)
    page = re.sub(r'\s*<section class="content-section section-block article-body">.*?</section>\s*', '\n      ', page, flags=re.S)
    # Insert before "<!-- Bet Types Grid -->"
    page = page.replace('<!-- Bet Types Grid -->', article_section + '<!-- Bet Types Grid -->', 1)

    # Replace existing FAQPage JSON-LD at end with merged
    # Find and replace the last <script type="application/ld+json"> block that is FAQPage
    page = re.sub(
        r'<script type="application/ld+json">\s*\{\s*"@context":\s*"https://schema\.org",\s*"@type":\s*"FAQPage".*?</script>',
        faq_jsonld, page, count=1, flags=re.S)

    # Add WebApplication + Organization JSON-LD
    wa_data = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Lucky 15 Bet Calculator",
        "url": "https://lucky-15-bet-calculator.uk/",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript enabled",
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "GBP"},
        "publisher": {"@type": "Organization", "name": "BetCalc UK", "url": "https://lucky-15-bet-calculator.uk"},
    }
    org_data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BetCalc UK",
        "url": "https://lucky-15-bet-calculator.uk",
        "logo": "https://lucky-15-bet-calculator.uk/favicon.svg",
        "description": "Free bet calculator for UK punters covering 30+ bet types including Lucky 15, Yankee, Heinz and accumulators.",
    }
    wa_jsonld = '<script type="application/ld+json">\n' + json.dumps(wa_data, ensure_ascii=False, indent=2) + '\n</script>'
    org_jsonld = '<script type="application/ld+json">\n' + json.dumps(org_data, ensure_ascii=False, indent=2) + '\n</script>'

    page = re.sub(r'<!-- Home-JSONLD-INJECT -->.*?<!-- /Home-JSONLD-INJECT -->', '', page, flags=re.S)
    marker = f'<!-- Home-JSONLD-INJECT -->\n{wa_jsonld}\n{org_jsonld}\n<!-- /Home-JSONLD-INJECT -->'
    page = page.replace('</body>', f'{marker}\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(page)

# ---------- 11. Bookmakers page injection ----------
def inject_bookmakers(filepath, art):
    with open(filepath, encoding='utf-8') as f:
        page = f.read()
    title, desc, h1 = XLSX_META['/bookmakers.html']
    hero_p = first_paragraph(art['body_md'])
    page = apply_meta(page, title, desc, h1, hero_p)

    body_html, faq_items = md_to_html(art['body_md'])
    faq_section = render_faq_html(faq_items)
    faq_jsonld = render_faq_jsonld(faq_items)

    # Insert article body + FAQ before the footer
    article_section = f'''
      <!-- Article content -->
      <section class="content-section section-block article-body">
{body_html}
      </section>
      {faq_section}

'''
    # Find an insertion point: before the closing main wrapper. Look for "</main>"
    if '<!-- Bookmakers-Article-INJECT -->' in page:
        page = re.sub(r'<!-- Bookmakers-Article-INJECT -->.*?<!-- /Bookmakers-Article-INJECT -->',
                      f'<!-- Bookmakers-Article-INJECT -->{article_section}<!-- /Bookmakers-Article-INJECT -->',
                      page, flags=re.S)
    else:
        page = page.replace('</main>',
                            f'<!-- Bookmakers-Article-INJECT -->{article_section}<!-- /Bookmakers-Article-INJECT -->\n  </main>', 1)

    page = re.sub(r'<!-- Bookmakers-JSONLD-INJECT -->.*?<!-- /Bookmakers-JSONLD-INJECT -->', '', page, flags=re.S)
    marker = f'<!-- Bookmakers-JSONLD-INJECT -->\n{faq_jsonld}\n<!-- /Bookmakers-JSONLD-INJECT -->'
    page = page.replace('</body>', f'{marker}\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(page)

# ---------- 12. Main ----------
def main():
    articles = find_article_files()
    print(f'Found {len(articles)} article files')

    processed = []
    for slug, (rel_target, kind) in SLUG_TO_TARGET.items():
        if slug not in articles:
            print(f'  ⚠ MISSING article for slug: {slug}')
            continue
        art = parse_article(articles[slug])
        full_path = os.path.join(ROOT, rel_target.replace('/', os.sep))
        target_url = '/' + rel_target if rel_target != 'index.html' else '/'
        if kind == 'calculator':
            inject_calculator_page(full_path, art, slug, target_url)
        elif kind == 'guide':
            inject_guide_page(full_path, art, slug, target_url, is_new=False)
        elif kind == 'guide-new':
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            inject_guide_page(full_path, art, slug, target_url, is_new=True)
        elif kind == 'bookmakers':
            inject_bookmakers(full_path, art)
        # index handled below
        processed.append(rel_target)
        print(f'  ✓ {rel_target}')

    # Homepage uses lucky-15-calculator article
    if 'lucky-15-calculator' in articles:
        art = parse_article(articles['lucky-15-calculator'])
        inject_homepage(os.path.join(ROOT, 'index.html'), art)
        print('  ✓ index.html (homepage)')

    # Write llms.txt
    llms_path = os.path.join(ROOT, 'llms.txt')
    llms_content = """# BetCalc UK — Free Bet Calculators

> BetCalc UK is a free, client-side bet calculator for UK punters. It computes exact returns for 30+ bet types including Lucky 15, Yankee, Heinz, Patent, Trixie, Accumulator, and Each-Way. All calculations run in the browser with no signup required.

## About
- Site: https://lucky-15-bet-calculator.uk/
- Purpose: Free betting calculators + educational guides for UK horse racing and sports betting
- Audience: UK punters (18+)

## Calculator pages
- [Lucky 15 Bet Calculator](https://lucky-15-bet-calculator.uk/) — 4 selections, 15 bets (4 singles, 6 doubles, 4 trebles, 1 four-fold); 1 winner returns
- [Lucky 31 Calculator](https://lucky-15-bet-calculator.uk/calculators/lucky-31.html) — 5 selections, 31 bets
- [Lucky 63 Calculator](https://lucky-15-bet-calculator.uk/calculators/lucky-63.html) — 6 selections, 63 bets
- [Yankee Calculator](https://lucky-15-bet-calculator.uk/calculators/yankee.html) — 4 selections, 11 bets; 2 winners needed
- [Trixie Calculator](https://lucky-15-bet-calculator.uk/calculators/trixie.html) — 3 selections, 4 bets
- [Patent Calculator](https://lucky-15-bet-calculator.uk/calculators/patent.html) — 3 selections, 7 bets
- [Each Way Calculator](https://lucky-15-bet-calculator.uk/calculators/each-way.html) — win + place returns
- [Accumulator Calculator](https://lucky-15-bet-calculator.uk/calculators/accumulator.html) — 4+ selections, 1 bet
- [Heinz Calculator](https://lucky-15-bet-calculator.uk/calculators/heinz.html) — 6 selections, 57 bets
- [Super Heinz Calculator](https://lucky-15-bet-calculator.uk/calculators/super-heinz.html) — 7 selections, 120 bets
- [Goliath Calculator](https://lucky-15-bet-calculator.uk/calculators/goliath.html) — 8 selections, 247 bets
- [Canadian (Super Yankee) Calculator](https://lucky-15-bet-calculator.uk/calculators/canadian.html) — 5 selections, 26 bets
- [Round Robin Calculator](https://lucky-15-bet-calculator.uk/calculators/round-robin.html) — 3 selections, 10 bets with SSA
- [Single / Double / Treble / Parlay Calculators](https://lucky-15-bet-calculator.uk/) — basic multiples
- [Flag, Super Flag, Heinz Flag, Goliath Flag](https://lucky-15-bet-calculator.uk/calculators/flag.html) — full-cover bets with single stakes
- [Union Jack Trebles / Trixie / Patent / Round Robin](https://lucky-15-bet-calculator.uk/calculators/union-jack-trebles.html) — 3×3 grid bets

## Guide pages
- [What Is a Lucky 15 Bet?](https://lucky-15-bet-calculator.uk/guides/what-is-a-lucky-15.html) — full guide with payout examples
- [What Is a Yankee Bet?](https://lucky-15-bet-calculator.uk/guides/what-is-a-yankee.html) — 4 selections, 11 bets explained
- [What Is an Accumulator?](https://lucky-15-bet-calculator.uk/guides/what-is-an-accumulator.html) — multi-selection bets explained
- [What Is a Patent Bet?](https://lucky-15-bet-calculator.uk/guides/what-is-a-patent.html) — 3 selections, 7 bets
- [What Is a Trixie Bet?](https://lucky-15-bet-calculator.uk/guides/what-is-a-trixie.html) — 3 selections, 4 bets
- [Each Way Betting Explained](https://lucky-15-bet-calculator.uk/guides/each-way-betting-explained.html) — win + place mechanics
- [Rule 4 Deductions](https://lucky-15-bet-calculator.uk/guides/rule-4-deductions.html) — non-runner deductions

## Reference
- [Best UK Bookmakers for Lucky 15 Bets](https://lucky-15-bet-calculator.uk/bookmakers.html)
- [About BetCalc UK](https://lucky-15-bet-calculator.uk/about.html)

## Key definitions
- Lucky 15: 15 bets across 4 selections (4 singles, 6 doubles, 4 trebles, 1 four-fold). One winner returns.
- Yankee: 11 bets across 4 selections (6 doubles, 4 trebles, 1 four-fold). Two winners needed.
- Trixie: 4 bets across 3 selections (3 doubles, 1 treble). Two winners needed.
- Patent: 7 bets across 3 selections (3 singles, 3 doubles, 1 treble). One winner returns.
- Each-way: doubles the bet count (one win + one place portion at fractional odds).
- Rule 4: deduction (5p–75p per £1 of winnings) when a horse is withdrawn after bets are placed.
"""
    with open(llms_path, 'w', encoding='utf-8') as f:
        f.write(llms_content)
    print('  ✓ llms.txt')

    print(f'\nDone. Processed {len(processed)} pages.')

if __name__ == '__main__':
    main()
