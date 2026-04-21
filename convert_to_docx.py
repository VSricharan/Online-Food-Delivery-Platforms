#!/usr/bin/env python3
"""
MD → Print-Ready HTML converter
Open the output HTML in Chrome → Ctrl+P → Save as PDF
"""

import re, os

INPUT_MD    = "FULL_PROJECT_REPORT.md"
OUTPUT_HTML = "FINAL_PROJECT_REPORT.html"

# ─── HTML shell with print-ready CSS ────────────────────────────────────────
HTML_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Cloud-Integrated Predictive Analytics System — B.Tech Project Report</title>
<style>
/* ── Google Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');

/* ── Reset & Base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  line-height: 1.5;
  color: #000;
  background: #fff;
  text-align: justify;
}

/* ── Page layout (screen) ── */
.page-wrap {
  max-width: 210mm;
  margin: 0 auto;
  padding: 25mm 25mm 25mm 30mm; /* top right bottom left(binding) */
}

/* ── Page breaks ── */
.chapter-break { page-break-before: always; }
.avoid-break   { page-break-inside: avoid; }

/* ── Front-matter section ── */
.title-page {
  text-align: center;
  page-break-after: always;
  padding-top: 40mm;
}
.title-page h1 {
  font-size: 20pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6pt;
}
.title-page .subtitle {
  font-size: 14pt;
  font-style: italic;
  margin: 16pt 0 8pt;
}
.title-page .degree {
  font-size: 15pt;
  font-weight: bold;
  text-transform: uppercase;
  margin: 4pt 0;
}
.title-page .name {
  font-size: 15pt;
  font-weight: bold;
  margin: 6pt 0 3pt;
}
.title-page .roll {
  font-size: 12pt;
  margin-bottom: 20pt;
}
.title-page .guide {
  font-size: 13pt;
  font-weight: bold;
  margin: 4pt 0 2pt;
}
.title-page .desig { font-size: 11pt; }
.title-page .dept  {
  font-size: 12pt;
  font-weight: bold;
  margin-top: 28pt;
  text-transform: uppercase;
}
.title-page .inst {
  font-size: 14pt;
  font-weight: bold;
  margin: 4pt 0;
}
.title-page .year { font-size: 12pt; }
.title-page hr {
  border: none;
  border-top: 2px solid #1B2A4A;
  margin: 10pt 0;
}

/* ── Section headings ── */
h1.chapter {
  font-size: 16pt;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 36pt 0 18pt;
  color: #1B2A4A;
}
h2 {
  font-size: 14pt;
  font-weight: bold;
  text-align: left;
  margin: 24pt 0 10pt;
  color: #1B2A4A;
}
h3 {
  font-size: 13pt;
  font-weight: bold;
  text-align: left;
  margin: 16pt 0 8pt;
  color: #2C3E50;
}
h4 {
  font-size: 12pt;
  font-weight: bold;
  font-style: italic;
  text-align: left;
  margin: 12pt 0 6pt;
  color: #2C3E50;
}

/* ── Paragraphs ── */
p {
  margin: 0 0 8pt;
  text-align: justify;
  text-indent: 0;
}
p + p { margin-top: 4pt; }

/* ── Lists ── */
ul, ol {
  margin: 6pt 0 10pt 28pt;
}
ul li, ol li {
  margin-bottom: 4pt;
  text-align: justify;
}
ul { list-style-type: disc; }
ul ul { list-style-type: circle; margin-top: 3pt; }

/* ── Tables ── */
.tbl-wrap {
  width: 100%;
  margin: 12pt 0 16pt;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10pt;
  margin: 0 auto;
}
thead th {
  background-color: #1B2A4A;
  color: #fff;
  padding: 6pt 8pt;
  text-align: center;
  font-weight: bold;
  border: 1px solid #1B2A4A;
}
tbody td {
  padding: 5pt 8pt;
  border: 1px solid #bbb;
  text-align: center;
  vertical-align: middle;
}
tbody tr:nth-child(even) td { background-color: #F0F2F5; }
tbody tr:hover td { background-color: #e8ecf0; }

/* ── Table / Figure captions ── */
.caption {
  font-size: 11pt;
  font-style: italic;
  font-weight: bold;
  text-align: center;
  margin: 6pt 0 4pt;
  color: #333;
}

/* ── Code blocks ── */
pre {
  background: #F5F5F5;
  border-left: 3px solid #2C5F8A;
  font-family: "Courier New", Courier, monospace;
  font-size: 9pt;
  line-height: 1.4;
  padding: 8pt 12pt;
  margin: 8pt 0 12pt 20pt;
  white-space: pre-wrap;
  word-break: break-word;
  page-break-inside: avoid;
}
code {
  font-family: "Courier New", Courier, monospace;
  font-size: 10pt;
  background: #F0F0F0;
  padding: 1pt 3pt;
  border-radius: 2px;
}

/* ── Horizontal rule ── */
hr.section-rule {
  border: none;
  border-top: 1.5px solid #2C5F8A;
  margin: 20pt 0;
}

/* ── Block quotes ── */
blockquote {
  border-left: 3px solid #ccc;
  padding-left: 12pt;
  color: #555;
  margin: 8pt 0 8pt 16pt;
  font-style: italic;
}

/* ── Emphasis / Strong ── */
strong { font-weight: bold; }
em { font-style: italic; }

/* ── Page number placeholder ── */
.page-num {
  text-align: center;
  font-size: 10pt;
  color: #666;
  margin-top: 30pt;
}

/* ══════════════════════════════════════════
   PRINT STYLES
══════════════════════════════════════════ */
@page {
  size: A4;
  margin: 25mm 25mm 25mm 30mm;
}
@media print {
  body        { font-size: 12pt; color: #000; background: none; }
  .page-wrap  { max-width: none; margin: 0; padding: 0; }
  h1.chapter  { page-break-before: always; }
  pre         { page-break-inside: avoid; }
  table       { page-break-inside: avoid; }
  .tbl-wrap   { page-break-inside: avoid; }
  thead       { display: table-header-group; }
  a           { color: #000; text-decoration: none; }

  @page :first {
    margin: 30mm 25mm 25mm 30mm;
  }
}
</style>
</head>
<body>
<div class="page-wrap">
"""

HTML_FOOT = """
</div>
<script>
// Auto-hide screen scrollbar on print
window.addEventListener('beforeprint', () => {
  document.body.style.overflow = 'hidden';
});
window.addEventListener('afterprint', () => {
  document.body.style.overflow = '';
});
</script>
</body>
</html>"""


# ─── Inline markdown → HTML ─────────────────────────────────────────────────
def inline_md(text):
    """Convert ***bold-italic***, **bold**, *italic*, `code`, and links."""
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)          # strip links
    text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', text)
    text = re.sub(r'\*\*(.+?)\*\*',     r'<strong>\1</strong>',    text)
    text = re.sub(r'\*([^*]+?)\*',      r'<em>\1</em>',            text)
    text = re.sub(r'`([^`]+)`',         r'<code>\1</code>',        text)
    # special chars
    text = text.replace('←', '&larr;').replace('→', '&rarr;')
    text = text.replace('≥', '&ge;').replace('≤', '&le;')
    text = text.replace('≈', '&asymp;').replace('≠', '&ne;')
    text = text.replace('∑', '&sum;').replace('√', '&radic;')
    text = text.replace('σ', '&sigma;').replace('μ', '&mu;')
    text = text.replace('²', '&sup2;').replace('³', '&sup3;')
    text = text.replace('★', '&#9733;').replace('☆', '&#9734;')
    text = text.replace('₹', '&#8377;')
    return text


def parse_md_table(lines):
    rows = []
    for ln in lines:
        cells = [c.strip() for c in ln.strip().split('|')[1:-1]]
        if all(re.match(r'^[-:]+$', c) for c in cells):
            continue
        rows.append(cells)
    if len(rows) < 2:
        return None, None
    return rows[0], rows[1:]


def table_to_html(header, rows, caption=None):
    html = ['<div class="tbl-wrap avoid-break">']
    if caption:
        html.append(f'  <p class="caption">{inline_md(caption)}</p>')
    html.append('  <table>')
    html.append('    <thead><tr>')
    for h in header:
        html.append(f'      <th>{inline_md(h)}</th>')
    html.append('    </tr></thead>')
    html.append('    <tbody>')
    for row in rows:
        html.append('      <tr>')
        for ci in range(len(header)):
            cell = row[ci] if ci < len(row) else ''
            html.append(f'        <td>{inline_md(cell)}</td>')
        html.append('      </tr>')
    html.append('    </tbody>')
    html.append('  </table>')
    html.append('</div>')
    return '\n'.join(html)


def convert(input_path, output_path):
    print(f"Reading {input_path} ...")
    with open(input_path, 'r', encoding='utf-8') as f:
        raw = f.readlines()
    N = len(raw)

    out = [HTML_HEAD]
    i = 0
    in_code   = False
    code_buf  = []
    in_table  = False
    tbl_lines = []
    pending_caption = ""

    while i < N:
        line = raw[i]
        s = line.strip()

        # ── Horizontal rules ──────────────────────────────
        if s in ('---', '***', '────'):
            out.append('<hr class="section-rule"/>')
            i += 1; continue

        # ── Code fences ───────────────────────────────────
        if s.startswith('```') or s.startswith('````'):
            if in_code:
                code_text = '\n'.join(code_buf)
                code_escaped = (code_text
                    .replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'))
                out.append(f'<pre>{code_escaped}</pre>')
                code_buf = []; in_code = False
            else:
                in_code = True
            i += 1; continue
        if in_code:
            code_buf.append(line.rstrip())
            i += 1; continue

        # ── Tables ────────────────────────────────────────
        if s.startswith('|') and s.count('|') >= 3:
            if not in_table:
                in_table = True; tbl_lines = []
            tbl_lines.append(s)
            i += 1; continue
        elif in_table:
            hdr, rows = parse_md_table(tbl_lines)
            if hdr and rows:
                out.append(table_to_html(hdr, rows,
                    caption=pending_caption or None))
            tbl_lines = []; in_table = False; pending_caption = ""

        if not s:
            i += 1; continue

        # ── CHAPTER / APPENDIX ────────────────────────────
        if re.match(r'^#\s+(CHAPTER|APPENDIX)\b', s, re.I):
            title = s.lstrip('#').strip()
            out.append(
                f'<h1 class="chapter">{inline_md(title)}</h1>')
            i += 1; continue

        # ── H1 ────────────────────────────────────────────
        if s.startswith('# ') and not s.startswith('##'):
            title = s[2:].strip()
            out.append(
                f'<h1 class="chapter">{inline_md(title)}</h1>')
            i += 1; continue

        # ── H2 ────────────────────────────────────────────
        if s.startswith('## '):
            out.append(f'<h2>{inline_md(s[3:].strip())}</h2>')
            i += 1; continue

        # ── H3 ────────────────────────────────────────────
        if s.startswith('### '):
            out.append(f'<h3>{inline_md(s[4:].strip())}</h3>')
            i += 1; continue

        # ── H4 ────────────────────────────────────────────
        if s.startswith('#### '):
            out.append(f'<h4>{inline_md(s[5:].strip())}</h4>')
            i += 1; continue

        # ── Caption detection ─────────────────────────────
        if re.match(r'^\*?\*?(Table|Figure)\s+[ivxIVX\d]', s):
            pending_caption = re.sub(r'[*`]', '', s).strip()
            i += 1; continue

        # ── Bullet lists ──────────────────────────────────
        if s.startswith('- ') or (s.startswith('* ') and not s.startswith('**')):
            items = []
            indent_level = 1 if line.startswith('  ') else 0
            while i < N:
                cur = raw[i].strip()
                if not (cur.startswith('- ') or
                        (cur.startswith('* ') and not cur.startswith('**'))):
                    break
                items.append(re.sub(r'^[-*]\s+', '', cur))
                i += 1
            out.append('<ul>')
            for it in items:
                out.append(f'  <li>{inline_md(it)}</li>')
            out.append('</ul>')
            continue

        # ── Numbered lists ────────────────────────────────
        m = re.match(r'^(\d+)\.\s+(.*)', s)
        if m:
            items = []
            while i < N:
                cur = raw[i].strip()
                nm  = re.match(r'^\d+\.\s+(.*)', cur)
                if not nm:
                    break
                items.append(nm.group(1))
                i += 1
            out.append('<ol>')
            for it in items:
                out.append(f'  <li>{inline_md(it)}</li>')
            out.append('</ol>')
            continue

        # ── Italic-centred (italics-only line) ────────────
        if (s.startswith('*') and s.endswith('*')
                and not s.startswith('**')):
            out.append(
                f'<p style="text-align:center;font-style:italic;">'
                f'{inline_md(s[1:-1])}</p>')
            i += 1; continue

        # ── Normal paragraph (merge continuation lines) ───
        text = s
        j = i + 1
        while j < N:
            nxt = raw[j].strip()
            if (not nxt or nxt.startswith('#') or nxt.startswith('|')
                    or nxt.startswith('```') or nxt.startswith('- ')
                    or nxt.startswith('* ') or nxt == '---'
                    or re.match(r'^\d+\.\s', nxt)):
                break
            text += ' ' + nxt
            j += 1
        out.append(f'<p>{inline_md(text)}</p>')
        i = j
        continue

    # Flush
    if in_table and tbl_lines:
        hdr, rows = parse_md_table(tbl_lines)
        if hdr and rows:
            out.append(table_to_html(hdr, rows))
    if in_code and code_buf:
        code_text = '\n'.join(code_buf)
        code_escaped = (code_text
            .replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'))
        out.append(f'<pre>{code_escaped}</pre>')

    out.append(HTML_FOOT)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))

    sz = os.path.getsize(output_path) / 1024
    print()
    print("=" * 55)
    print(f"  ✅  {output_path} created ({sz:.0f} KB)")
    print("=" * 55)
    print()
    print("  TO SAVE AS PDF:")
    print("  1. Open FINAL_PROJECT_REPORT.html in Chrome")
    print("  2. Press Cmd+P  (or Ctrl+P on Windows)")
    print("  3. Set Destination → 'Save as PDF'")
    print("  4. Paper size → A4")
    print("  5. Margins → None  (CSS handles margins)")
    print("  6. ✅ Enable 'Background graphics'")
    print("  7. Click Save")
    print()


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    convert(INPUT_MD, OUTPUT_HTML)
