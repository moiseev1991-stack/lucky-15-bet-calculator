# -*- coding: utf-8 -*-
"""Stamp every HTML page with a version comment. Idempotent."""
import os, re, glob, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SITE_VERSION = '2026.06.22'
BUILD_DATE = '2026-06-22'
BUILD_NOTE = 'SEO content rebuild — 38 articles, full JSON-LD, 2 new guides'

STAMP = (
    f'<!-- BetCalc UK · v{SITE_VERSION} · build {BUILD_DATE} · {BUILD_NOTE} -->'
)
META_GENERATOR = f'<meta name="generator" content="BetCalc UK v{SITE_VERSION}">'

ROOT = os.path.dirname(os.path.abspath(__file__))

def stamp_file(path):
    with open(path, encoding='utf-8') as f:
        page = f.read()
    # Remove any prior stamp of the same shape
    page = re.sub(r'\n?<!-- BetCalc UK · v[^>]*-->', '', page)
    page = re.sub(r'\n?\s*<meta name="generator" content="BetCalc UK v[^"]*">', '', page)
    # Insert top-level HTML comment right after <!DOCTYPE html>
    page = re.sub(
        r'(<!DOCTYPE html>)',
        r'\1\n' + STAMP,
        page, count=1)
    # Insert <meta name="generator"> right after <meta charset>
    page = re.sub(
        r'(<meta charset="UTF-8">)',
        r'\1\n  ' + META_GENERATOR,
        page, count=1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(page)

def main():
    paths = []
    for pattern in ['*.html', 'calculators/*.html', 'guides/*.html', 'gate/*.html']:
        for p in glob.glob(os.path.join(ROOT, pattern)):
            paths.append(p)
    for p in sorted(paths):
        stamp_file(p)
        print(f'  ✓ {os.path.relpath(p, ROOT)}')
    print(f'\nStamped {len(paths)} files with v{SITE_VERSION}')

if __name__ == '__main__':
    main()
