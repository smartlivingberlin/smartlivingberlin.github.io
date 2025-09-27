import json,glob,re,html

docs=[]

def load(fp):
  try:
    with open(fp,'r',encoding='utf-8') as f: return json.load(f)
  except: return []

for it in load('data/crowdfunding.json'):
  docs.append({"type":"crowdfunding","title":it.get("title",""),"text":it.get("description","")})
for it in load('data/investors.json'):
  docs.append({"type":"investor","title":it.get("name",""),"text":" ".join([it.get("focus",""),it.get("ticket_size",""),it.get("website","")])})
for it in load('data/services.json'):
  docs.append({"type":"service","title":it.get("name","Service"),"text":" ".join([it.get("category",""),it.get("region","")])})
for it in load('data/projects.json'):
  docs.append({"type":"project","title":it.get("title","Projekt"),"text":" ".join([it.get("status",""),it.get("category","")])})
for it in load('data/events.json'):
  docs.append({"type":"event","title":it.get("title","Event"),"text":" ".join([it.get("date",""),it.get("category","")])})

# einfache FAQ aus Datei
for it in load('data/faq.json'):
  docs.append({"type":"faq","title":it.get("q",""),"text":it.get("a","")})

with open('data/search_index.json','w',encoding='utf-8') as f:
  json.dump(docs,f,ensure_ascii=False,indent=2)
print("Index gebaut:", len(docs))
