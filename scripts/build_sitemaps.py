import json, pathlib, datetime, html
base="https://smartlivingberlin.github.io/"
def load(p):
  try: return json.loads(pathlib.Path(p).read_text(encoding="utf-8"))
  except: return []
def lines():
  now=datetime.date.today().isoformat()
  yield '<?xml version="1.0" encoding="UTF-8"?>'
  yield '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  # anchors as pseudo-pages
  sections=[
    ("news",  load("data/news.json"),       "news"),
    ("services", load("data/services.json"), "services"),
    ("events", load("data/events.json"),     "events"),
    ("projects", load("data/projects.json"), "projects"),
    ("crowdfunding", load("data/crowdfunding.json"), "crowdfunding"),
    ("investors", load("data/investors.json"), "investors"),
  ]
  for name, arr, anc in sections:
    # create synthetic URLs pointing to section anchors
    for i,_ in enumerate(arr):
      url=f"{base}#{anc}"
      yield f"  <url><loc>{html.escape(url)}</loc><lastmod>{now}</lastmod><priority>0.5</priority></url>"
  yield '</urlset>'
pathlib.Path("sitemap-sections.xml").write_text("\n".join(lines()), encoding="utf-8")
print("OK sitemap-sections.xml")
