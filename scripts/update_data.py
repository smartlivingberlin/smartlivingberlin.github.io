#!/usr/bin/env python3
import json, pathlib, feedparser
from datetime import datetime
DATA_DIR = pathlib.Path(__file__).resolve().parents[1] / 'data'
NEWS_FEEDS = [
  'https://example.com/feed/news.xml',
  'https://example.com/feed/energy.xml'
]
def fetch_feed(url):
  return feedparser.parse(url)
def parse_entries(entries, limit=10):
  items = []
  for entry in entries[:limit]:
    date = None
    if entry.get('published_parsed'):
      date = datetime(*entry.published_parsed[:6]).strftime('%Y-%m-%d')
    items.append({
      'title': entry.get('title','').strip(),
      'link': entry.get('link','').strip(),
      'date': date or datetime.utcnow().strftime('%Y-%m-%d'),
      'source': entry.get('source',{}).get('title','') if entry.get('source') else ''
    })
  return items
def update_news():
  all_items = []
  for url in NEWS_FEEDS:
    parsed = fetch_feed(url)
    if parsed.entries:
      all_items.extend(parse_entries(parsed.entries, limit=5))
  all_items.sort(key=lambda x: x['date'], reverse=True)
  (DATA_DIR/'news.json').write_text(json.dumps(all_items, indent=2, ensure_ascii=False))
def update_listings():
  pass
if __name__ == '__main__':
  update_news()
  update_listings()
