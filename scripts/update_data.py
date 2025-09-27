import json, time, datetime as dt
from urllib.request import urlopen
import xml.etree.ElementTree as ET

FEEDS = [
  "https://www.tagesschau.de/xml/rss2",                 # breit (de)
  "https://www.handwerk-magazin.de/rss.xml",            # Handwerk
  "https://www.heise.de/hintergrund/rss/immobilien.atom" # Beispiel
]

def parse_rss(url, limit=20):
  try:
    raw = urlopen(url, timeout=15).read()
    try:
      root = ET.fromstring(raw)
    except:
      return []
    items=[]
    for item in root.iterfind('.//item'):
      title = (item.findtext('title') or '').strip()
      link  = (item.findtext('link')  or '').strip()
      date  = (item.findtext('{http://purl.org/dc/elements/1.1/}date') or item.findtext('pubDate') or '').strip()
      items.append({"title":title, "link":link, "date":date or dt.datetime.utcnow().isoformat()})
    return items[:limit]
  except Exception:
    return []

all_items=[]
for f in FEEDS:
  all_items.extend(parse_rss(f, 20))

def norm_date(s):
  try: return dt.datetime(*rfc822_parsedate(s)[:6]).isoformat()
  except: 
    try: return dt.datetime.fromisoformat(s).isoformat()
    except: return dt.datetime.utcnow().isoformat()

try:
  # simple RFC822 parser fallback
  from email.utils import parsedate as rfc822_parsedate
except:
  def rfc822_parsedate(_): return time.gmtime()

# normalize date & sort
for x in all_items:
  x["date"] = norm_date(x.get("date",""))

all_items = [x for x in all_items if x.get("title") and x.get("link")]
all_items.sort(key=lambda x: x["date"], reverse=True)
all_items = all_items[:60]

with open('data/news.json','w',encoding='utf-8') as f:
  json.dump(all_items, f, ensure_ascii=False, indent=2)

# Top-5 HTML
top5 = all_items[:5]
html = "<ol class='mb-0'>" + "".join([f"<li><a target='_blank' rel='noopener' href='{x['link']}'>{x['title']}</a></li>" for x in top5]) + "</ol>"
with open('partials/top5.html','w',encoding='utf-8') as f: f.write(html)
print(f"Updated news.json ({len(all_items)}) & partials/top5.html")
