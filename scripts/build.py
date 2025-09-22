import os, json, re, pathlib, shutil
from markdown import markdown
from jinja2 import Environment, FileSystemLoader

ROOT = pathlib.Path(".")
SITE = json.loads(open("config/site.json","r",encoding="utf-8").read())
env = Environment(loader=FileSystemLoader("templates"))

def read_md(fp):
    raw=open(fp,"r",encoding="utf-8").read()
    fm={}
    m=re.match(r'^---\n(.*?)\n---\n(.*)$', raw, re.S)
    body=raw
    if m:
        import yaml
        fm=yaml.safe_load(m.group(1)) or {}
        body=m.group(2)
    html=markdown(body, extensions=["extra"])
    title=fm.get("title","Thema")
    lead=fm.get("lead","")
    return title, lead, html

def basepath_for(lang):
    return "" if lang=="de" else f"{lang}/"

def switch_link(lang, slug, target_lang):
    if target_lang=="de":
        return f"/themen/{slug}.html"
    return f"/{target_lang}/themen/{slug}.html"

def render_thema(lang, slug, title, lead, html):
    basepath = basepath_for(lang)
    base_tpl = env.get_template("base.html")
    thema_tpl= env.get_template("thema.html")
    # simple related: linke drei andere DE-Seiten
    related = [{"title":"Mieten vs. Kaufen","url":f"/themen/mieten-kaufen.html"},
               {"title":"Zinsen & Finanzierung","url":f"/themen/zins-und-finanzierung.html"},
               {"title":"Grundriss: Tricks","url":f"/themen/grundriss-tricks.html"}]
    def switch_lang(tg):
        return switch_link(lang, slug, tg)
    content = thema_tpl.render(body=html, related=related, basepath=basepath)
    page = base_tpl.render(
        site=SITE, lang=lang, title=title, lead=lead, desc=lead,
        content=content, basepath=basepath, switch_lang=switch_lang
    )
    outdir = ROOT / ("themen" if lang=="de" else f"{lang}/themen")
    outdir.mkdir(parents=True, exist_ok=True)
    (outdir / f"{slug}.html").write_text(page, encoding="utf-8")

def slugify(name):
    x=name.lower()
    x=re.sub(r'[^a-z0-9\-]+','-',x)
    x=re.sub(r'-+','-',x).strip('-')
    return x

docs=[]
DE = ROOT/"content/de/themen"
for fp in sorted(DE.glob("*.md")):
    title, lead, html = read_md(fp)
    slug = fp.stem
    # render DE
    render_thema("de", slug, title, lead, html)
    # Platzhalter EN/RU (kopieren DE-Inhalt mit Hinweis)
    for lang in ["en","ru"]:
        ph_html = f'<div class="alert alert-warning">Auto-Entwurf. Bitte übersetzen: {title}</div>' + html
        render_thema(lang, slug, title, lead, ph_html)
    # fürs Such-Index (nur DE)
    txt=re.sub(r'<[^>]+>',' ',html); txt=re.sub(r'\s+',' ',txt).lower()
    docs.append({"title":title, "url":f"themen/{slug}.html", "text":txt[:6000]})

# Search-Index
(DATA:=ROOT/"data").mkdir(exist_ok=True, parents=True)
(DATA/"search-index.json").write_text(json.dumps({"docs":docs},ensure_ascii=False,indent=2), encoding="utf-8")
print(f"Built {len(docs)} DE pages + EN/RU placeholders and search index.")
