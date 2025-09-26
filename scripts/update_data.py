#!/usr/bin/env python3
"""
Erweitertes RSS-Import-Skript.
Neben Immobilien- und Energie-News können hier weitere Themenfeeds hinterlegt werden.
NEWS_FEEDS enthält Quellen für allgemeine Immobilienmeldungen, Energie-News und Handwerker-Trends.
"""
import json
import pathlib
import feedparser
from datetime import datetime

DATA_DIR = pathlib.Path(__file__).resolve().parents[1] / 'data'

# RSS-Quellen (bitte nach Bedarf anpassen oder ergänzen)
NEWS_FEEDS = [
  "https://www.worldpropertyjournal.com/feeds/rss.xml",
  "https://realestate.einnews.com/rss",
  "https://www.connectcre.com/category/cre-market-news/feed/",
  "https://rss.feedspot.com/europe_real_estate.xml"
]

# Feed für Angebotslisten (hier Platzhalter – nur nutzen, wenn ein passender Feed vorhanden ist)
LISTING_FEEDS = [
  # Beispiel: "https://www.immobilienscout24.de/rss/listings.xml"
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
    # Nach Datum sortieren (neueste zuerst)
    all_items.sort(key=lambda x: x['date'], reverse=True)
    (DATA_DIR/'news.json').write_text(json.dumps(all_items, indent=2, ensure_ascii=False))

def update_listings():
    # Optional: Listings-Feeds verarbeiten
    for url in LISTING_FEEDS:
        pass

if __name__ == '__main__':
    update_news()
    update_listings()
