import os, re, json, pathlib, sys

SRC_DIR = "themen"
OUTS = [
  ("en/themen", "en", "Auto-translation (beta) — original (DE)"),
  ("ru/themen", "ru", "Автоперевод (бета) — оригинал (DE)")
]

# kleines, erweiterbares Wörterbuch
MAP = {
  "en": {
    "Zurück": "Back",
    "Zur\u00fcck": "Back",
    "Projekt einreichen": "Submit a project",
    "Alle Einreichungen": "All submissions",
    "Bieterverfahren (Light)": "Auction (Light)",
    "Gebot abgeben": "Place bid",
    "Alle Gebote ansehen": "View all bids",
    "Zwangsversteigerung (ZVG) – Schnellüberblick": "Foreclosure (ZVG) – Quick Guide",
    "Was ist ZVG? Wo finde ich Termine? Welche Schritte beachten?": "What is ZVG? Where to find dates? Which steps to consider?",
    "Keine Rechtsberatung. Bitte offizielle Quellen und ggf. fachkundigen Rat nutzen.": "No legal advice. Please consult official sources and professionals.",
    "PNG exportieren": "Export PNG",
    "Canvas leeren": "Clear canvas",
    "Demo-Plan laden": "Load demo plan",
    "Interaktiv": "Interactive",
    "Öffnen": "Open"
  },
  "ru": {
    "Zurück": "Назад",
    "Zur\u00fcck": "Назад",
    "Projekt einreichen": "Отправить проект",
    "Alle Einreichungen": "Все заявки",
    "Bieterverfahren (Light)": "Аукцион (лайт)",
    "Gebot abgeben": "Сделать ставку",
    "Alle Gebote ansehen": "Все ставки",
    "Zwangsversteigerung (ZVG) – Schnellüberblick": "Принудительные торги (ZVG) — кратко",
    "Was ist ZVG? Wo finde ich Termine? Welche Schritte beachten?": "Что такое ZVG? Где найти даты? На что обратить внимание?",
    "Keine Rechtsberatung. Bitte offizielle Quellen und ggf. fachkundigen Rat nutzen.": "Это не юридическая консультация. Пользуйтесь официальными источниками и советом специалистов.",
    "PNG exportieren": "Экспорт PNG",
    "Canvas leeren": "Очистить холст",
    "Demo-Plan laden": "Загрузить демо-план",
    "Interaktiv": "Интерактив",
    "Öffnen": "Открыть"
  }
}

def tr(lang, html):
    # lang-Attribut setzen
    html = re.sub(r'<html[^>]*lang="[^"]+"', f'<html lang="{lang}"', html, flags=re.I)
    # häufige Texte grob ersetzen
    for de, tr in MAP.get(lang, {}).items():
        html = html.replace(de, tr)
    # „Zurück“-Link: ?lang=xx anhängen (falls zurück zur Startseite führt)
    html = re.sub(r'href="\.\./index\.html"', f'href="../index.html?lang={lang}"', html)
    # Hinweis-Banner einfügen (unter <body ...>)
    banner = {
      "en": '<div class="alert alert-warning py-2 my-2 small">Auto-translation (beta) — <a href="../index.html">original (DE)</a></div>',
      "ru": '<div class="alert alert-warning py-2 my-2 small">Автоперевод (бета) — <a href="../index.html">оригинал (DE)</a></div>'
    }[lang]
    html = re.sub(r'(<body[^>]*>)', r'\1' + banner, html, count=1, flags=re.I)
    return html

def main():
    files = [f for f in sorted(os.listdir(SRC_DIR)) if f.endswith(".html")]
    if not files:
        print("[HINWEIS] Keine Dateien in 'themen/'.")
        return
    for out_dir, lang, _tip in OUTS:
        pathlib.Path(out_dir).mkdir(parents=True, exist_ok=True)
        for f in files:
            src = os.path.join(SRC_DIR, f)
            with open(src, "r", encoding="utf-8") as fh:
                html = fh.read()
            out_html = tr(lang, html)
            dst = os.path.join(out_dir, f)
            with open(dst, "w", encoding="utf-8") as fh:
                fh.write(out_html)
        print(f"[OK] {len(files)} Seiten -> {out_dir} (lang={lang})")
    print("[TIPP] Sprachlinks: /en/themen/... und /ru/themen/...")

if __name__ == "__main__":
    main()
