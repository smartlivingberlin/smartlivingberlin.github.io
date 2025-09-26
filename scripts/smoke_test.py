import sys, pathlib, re, json
p = pathlib.Path("index.html")
html = p.read_text(encoding="utf-8") if p.exists() else ""
ok = True
def chk(cond, label):
    global ok
    print(("✅ " if cond else "❌ ") + label)
    ok &= cond

chk(p.exists(), "index.html vorhanden")
chk(("crowdfunding" in html and ("sections/crowdfunding.html" in html or "crowdfundingList" in html)), "Crowdfunding eingebunden")
chk(("investors" in html and ("sections/investors.html" in html or "investorsList" in html)), "Investoren eingebunden")
# Chart nur 1x
chart_refs = len(re.findall(r'chart(\.umd)?\.min\.js', html, flags=re.I))
chk(chart_refs == 1, "Chart.js genau 1× eingebunden")
sys.exit(0 if ok else 1)
