import json,glob,re,os,sys,html
def load_json(fp):
  try: 
    with open(fp,'r',encoding='utf-8') as f: return json.load(f)
  except: return []
docs=[]
# Crowdfunding
for it in (load_json('data/crowdfunding.json') or []):
  docs.append({"type":"crowdfunding","title":it.get("title",""),"text":(it.get("description","") or "")})
# Investoren
for it in (load_json('data/investors.json') or []):
  docs.append({"type":"investor","title":it.get("name",""),"text":" ".join([it.get("focus",""),it.get("ticket_size",""),it.get("website","")])})
# Services/Projects/Events
def add_geo(fp,typ,name_key):
  for it in (load_json(fp) or []):
    title = it.get(name_key) or it.get("title","") or it.get("name","")
    text = " ".join([it.get("category",""), it.get("region",""), it.get("status",""), it.get("date",""), it.get("desc","")])
    docs.append({"type":typ,"title":title,"text":text})
add_geo('data/services.json','service','name')
add_geo('data/projects.json','project','title')
add_geo('data/events.json','event','title')
# FAQ/Law minimal aus index.html herausziehen (falls vorhanden)
try:
  html_s = open('index.html','r',encoding='utf-8').read()
  for m in re.findall(r'<details[^>]*>\s*<summary[^>]*><strong>(.*?)</strong></summary>\s*<p[^>]*>(.*?)</p>', html_s, re.S|re.I):
    docs.append({"type":"faq","title":html.unescape(m[0]),"text":html.unescape(re.sub('<[^<]+?>',' ',m[1]))})
except: pass

os.makedirs('data',exist_ok=True)
with open('data/search_index.json','w',encoding='utf-8') as f:
  json.dump(docs,f,ensure_ascii=False,indent=2)
print(f"Index gebaut: {len(docs)} Dokumente")
