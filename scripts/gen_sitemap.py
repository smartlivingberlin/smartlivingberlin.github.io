import os, sys, time, html
base = (sys.argv[1] if len(sys.argv)>1 else "").rstrip('/') + '/'
out  = 'sitemap.xml'
urls = []
for root, _, files in os.walk('.'):
    for f in files:
        if not f.endswith('.html'): 
            continue
        if '/.' in root or '/.git' in root or 'node_modules' in root:
            continue
        path = os.path.join(root, f).replace('\\','/')
        if path.startswith('./'): path = path[2:]
        url  = (base+path) if base else path
        try: mtime = os.path.getmtime(os.path.join(root, f))
        except: mtime = time.time()
        lastmod = time.strftime('%Y-%m-%d', time.gmtime(mtime))
        urls.append((url, lastmod))
urls.sort()
xml = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for url, lastmod in urls:
    xml += [ '  <url>',
             f'    <loc>{html.escape(url)}</loc>',
             f'    <lastmod>{lastmod}</lastmod>',
             '    <changefreq>weekly</changefreq>',
             '    <priority>0.7</priority>',
             '  </url>' ]
xml.append('</urlset>')
with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(xml))
print(f"OK: {out} erzeugt ({len(urls)} URLs).")
