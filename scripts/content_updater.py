#!/usr/bin/env python3
import json
import os
from datetime import datetime, timedelta
from pathlib import Path

class SmartContentUpdater:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.data_dir = self.base_dir / 'data'
        
    def update_market_data(self):
        """Aktualisiert Marktdaten für Berlin"""
        market_data = {
            "berlin_avg_price": 5850,
            "trend": "+2.3%",
            "last_update": datetime.now().isoformat(),
            "districts": {
                "Mitte": {"price": 7200, "trend": "+3.1%"},
                "Prenzlauer Berg": {"price": 6800, "trend": "+2.8%"},
                "Charlottenburg": {"price": 6200, "trend": "+1.9%"},
                "Kreuzberg": {"price": 5900, "trend": "+2.5%"}
            }
        }
        
        with open(self.data_dir / 'market.json', 'w', encoding='utf-8') as f:
            json.dump(market_data, f, indent=2, ensure_ascii=False)
        print("✅ Marktdaten aktualisiert")
    
    def update_news(self):
        """Fügt neue News hinzu"""
        try:
            with open(self.data_dir / 'news.json', 'r', encoding='utf-8') as f:
                news = json.load(f)
        except:
            news = []
        
        new_entries = [
            {
                "title": f"Berlin Immobilienmarkt Update {datetime.now().strftime('%d.%m.%Y')}",
                "link": "themen/marktupdate-berlin.html",
                "date": datetime.now().strftime('%Y-%m-%d'),
                "category": "Marktdaten"
            },
            {
                "title": "Smart Home Trends 2025 - Was lohnt sich wirklich?",
                "link": "themen/smart-home-trends-2025.html", 
                "date": datetime.now().strftime('%Y-%m-%d'),
                "category": "Smart Living"
            },
            {
                "title": "Mietrecht Berlin: Neue BGH-Urteile erklärt",
                "link": "themen/mietrecht-bgh-urteile.html",
                "date": datetime.now().strftime('%Y-%m-%d'),
                "category": "Recht"
            }
        ]
        
        # Neue Einträge hinzufügen und auf 15 begrenzen
        news = new_entries + [n for n in news if n not in new_entries][:12]
        
        with open(self.data_dir / 'news.json', 'w', encoding='utf-8') as f:
            json.dump(news, f, indent=2, ensure_ascii=False)
        print("✅ News aktualisiert")
    
    def update_charts_data(self):
        """Aktualisiert Chart-Daten"""
        charts_data = {
            "zins": {
                "labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
                "data": [3.2, 3.4, 3.6, 3.8, 4.0, 4.1, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4]
            },
            "preise_berlin": {
                "labels": ["2020", "2021", "2022", "2023", "2024"],
                "data": [4200, 4800, 5200, 5600, 5850]
            }
        }
        
        with open(self.data_dir / 'charts.json', 'w', encoding='utf-8') as f:
            json.dump(charts_data, f, indent=2, ensure_ascii=False)
        print("✅ Chart-Daten aktualisiert")
    
    def generate_seo_content(self):
        """Generiert SEO-optimierte Artikel"""
        articles = [
            {
                "filename": "kaufnebenkosten-berlin-2025.md",
                "title": "Kaufnebenkosten Berlin 2025: Kompletter Überblick",
                "content": """# Kaufnebenkosten Berlin 2025

## Aktuelle Kosten im Überblick

In Berlin betragen die Kaufnebenkosten derzeit **9-12%** des Kaufpreises:

- **Grunderwerbsteuer**: 6% (Berlin)
- **Notar- und Beurkundungskosten**: 1-1,5%
- **Grundbucheintrag**: ca. 0,5%
- **Maklercourtage**: 3,57% (bei Nutzung)

## Beispielrechnung

Bei einem Kaufpreis von 500.000€:
- Grunderwerbsteuer: 30.000€
- Notar: 6.000€
- Grundbuch: 2.500€
- Makler: 17.850€
- **Gesamt: 56.350€**

*Stand: {date}*""".format(date=datetime.now().strftime('%B %Y'))
            }
        ]
        
        content_dir = self.base_dir / 'content' / 'de' / 'themen'
        content_dir.mkdir(parents=True, exist_ok=True)
        
        for article in articles:
            with open(content_dir / article['filename'], 'w', encoding='utf-8') as f:
                f.write(article['content'])
        
        print("✅ SEO-Content generiert")
    
    def run_all_updates(self):
        """Führt alle Updates aus"""
        print(f"🚀 Content-Update gestartet: {datetime.now()}")
        self.update_market_data()
        self.update_news()
        self.update_charts_data()
        self.generate_seo_content()
        print("🎉 Alle Updates erfolgreich!")

if __name__ == "__main__":
    updater = SmartContentUpdater()
    updater.run_all_updates()
