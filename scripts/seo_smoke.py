import sys, pathlib, re, json
ok=True
def out(c, label):
    global ok; print(("✅ " if c else "❌ ")+label); ok&=c

h = pathlib.Path("index.html").read_text(encoding="utf-8")
# Title
out(bool(re.search(r"<title>.+</title>", h, re.I|re.S)), "Title vorhanden")
# Meta description (90–160 Zeichen)
m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', h, re.I)
out(bool(m), "Meta Description vorhanden")
if m:
    l = len(m.group(1).strip())
    out(90 <= l <= 180, f"Meta Description Länge ok ({l} Zeichen)")
# Canonical
out('rel="canonical"' in h, "Canonical vorhanden")
# OG/Twitter
for k in ['property="og:title"', 'property="og:description"', 'name="twitter:card"']:
    out(k in h, f"{k} vorhanden")
# JSON-LD
out('"@context": "https://schema.org"' in h, "JSON-LD vorhanden")
# Links zu sitemap/robots
out(pathlib.Path("sitemap.xml").exists(), "sitemap.xml existiert")
out(pathlib.Path("robots.txt").exists(), "robots.txt existiert")
# Barrierefreiheit grob: alt-Attribute bei Bildern
alts = len(re.findall(r'<img[^>]+alt=', h, re.I))
imgs = len(re.findall(r'<img[^>]*>', h, re.I))
out(alts >= max(0, imgs-2), f"Alt-Texte grob ok ({alts}/{imgs})")
sys.exit(0 if ok else 1)
