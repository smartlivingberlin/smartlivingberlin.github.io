#!/usr/bin/env python3
import requests
import os
from pathlib import Path

def download_image(url, filename):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"✅ {filename} heruntergeladen")
            return True
    except Exception as e:
        print(f"❌ Fehler bei {filename}: {e}")
    return False

# Unsplash-Bilder für Immobilien-Portal
images = {
    'hero-bg.jpg': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
    'smart-home.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'berlin-skyline.jpg': 'https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=800&q=80',
    'calculator.jpg': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
    'contract.jpg': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80',
    'house-keys.jpg': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80',
    'modern-apartment.jpg': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    'investment.jpg': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80'
}

base_dir = Path(__file__ ).parent.parent / 'assets' / 'images'
base_dir.mkdir(exist_ok=True)

for filename, url in images.items():
    filepath = base_dir / filename
    if not filepath.exists():
        download_image(url, filepath)

print("🎉 Alle Bilder heruntergeladen!")
