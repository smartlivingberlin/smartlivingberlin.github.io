import json, pathlib, datetime
p = pathlib.Path("data/news.json")
data = json.loads(p.read_text(encoding="utf-8"))
# 1) Nach Datum sortieren (neueste zuerst)
data.sort(key=lambda x: x.get("date",""), reverse=True)
# 2) Optional: Älteste am Ende abschneiden, z. B. nur 40 Einträge halten
data = data[:40]
# 3) Kleines „freshness“-Feld setzen (heutiges Datum für die ersten 5)
today = datetime.datetime.utcnow().replace(microsecond=0).isoformat()+"Z"
for i, item in enumerate(data[:5]):
    item["refreshed"] = today
p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print("rotate_news.py: data/news.json aktualisiert.")
