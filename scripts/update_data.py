#!/usr/bin/env python3
"""
Fetches news and listings from configured RSS feeds and writes them to
the `data/news.json` and `data/listings.json` files.  This script is
used by the GitHub Actions workflow in `.github/workflows/update-news.yml`.

You can customise `NEWS_FEEDS` and `LISTING_FEEDS` below with your
preferred sources.  It uses the `feedparser` library to parse RSS
feeds and writes only basic fields: title, link and date.
"""

import json
import pathlib
import feedparser
from datetime import datetime

DATA_DIR = pathlib.Path(__file__).resolve().parents[1] / 'data'

# Example RSS feeds; replace with real estate and energy news feeds
NEWS_FEEDS = [
    'https://example.com/feed/news.xml',
    'https://example.com/feed/energy.xml'
]

LISTING_FEEDS = [
    # Example feed for property listings; replace with your data source or remove if unused
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
            'title': entry.get('title', '').strip(),
            'link': entry.get('link', '').strip(),
            'date': date or datetime.utcnow().strftime('%Y-%m-%d'),
            'source': entry.get('source', {}).get('title', '') if entry.get('source') else ''
        })
    return items

def update_news():
    all_items = []
    for feed_url in NEWS_FEEDS:
        parsed = fetch_feed(feed_url)
        if parsed.entries:
            all_items.extend(parse_entries(parsed.entries, limit=5))
    # Sort by date descending
    all_items.sort(key=lambda x: x['date'], reverse=True)
    (DATA_DIR / 'news.json').write_text(json.dumps(all_items, indent=2, ensure_ascii=False))

def update_listings():
    # Placeholder: implement parsing for property listing feeds if available
    # For now, keep existing file unchanged
    pass

if __name__ == '__main__':
    update_news()
    update_listings()
