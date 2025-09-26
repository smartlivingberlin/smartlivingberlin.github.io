import sys, pathlib
p = pathlib.Path("index.html")
html = p.read_text(encoding="utf-8") if p.exists() else ""
ok = True
def chk(label, cond):
    global ok
    print(("✅" if cond else "❌"), label)
    ok &= cond

chk("index.html vorhanden", p.exists())
chk("Crowdfunding eingebunden", 'id="crowdfunding"' in html or 'crowdfunding.js' in html)
chk("Investoren eingebunden", 'id="investors"' in html or 'investors.js' in html)
chk("SEO: OpenGraph vorhanden", 'og:title' in html)
chk("Chart.js nur einmal geladen", html.count('chart.umd.min.js') == 1)

sys.exit(0 if ok else 1)
