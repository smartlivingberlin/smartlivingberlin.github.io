import os,time,html,sys
base=sys.argv[1].rstrip('/')+'/'
urls=[]
for root,_,files in os.walk('.'):
  if '/.' in root or 'node_modules' in root or 'snapshots' in root: continue
  for f in files:
    if not f.endswith('.html'): continue
    p=os.path.join(root,f).replace('\\','/')
    if p.startswith('./'): p=p[2:]
    m=os.path.getmtime(os.path.join(root,f))
    urls.append((base+p, time.strftime('%Y-%m-%d', time.gmtime(m))))
urls.sort()
xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u,d in urls:
  xml+=['  <url>', f'    <loc>{html.escape(u)}</loc>', f'    <lastmod>{d}</lastmod>', '    <changefreq>weekly</changefreq>', '    <priority>0.7</priority>', '  </url>']
xml.append('</urlset>')
open('sitemap.xml','w',encoding='utf-8').write('\n'.join(xml))
print(f"OK: sitemap.xml mit {len(urls)} URLs")
