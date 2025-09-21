import os, sys, time, html
base = sys.argv[1].rstrip('/') + '/'
urls = []
for root, _, files in os.walk('.'):
  for f in files:
    if not f.endswith('.html'): continue
    if any(x in root for x in ('/.git','/node_modules')): continue
    path = os.path.join(root,f).replace('\\','/')
    if path.startswith('./'): path = path[2:]
    lastmod = time.strftime('%Y-%m-%d', time.gmtime(os.path.getmtime(os.path.join(root,f))))
    urls.append((base+path,lastmod))
urls.sort()
xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u,m in urls:
  xml+=['  <url>',f'    <loc>{html.escape(u)}</loc>',f'    <lastmod>{m}</lastmod>','    <changefreq>weekly</changefreq>','    <priority>0.7</priority>','  </url>']
xml.append('</urlset>')
open('sitemap.xml','w',encoding='utf-8').write('\n'.join(xml))
print(f"OK: sitemap.xml mit {len(urls)} URLs")
