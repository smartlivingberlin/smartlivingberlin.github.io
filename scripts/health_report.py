import os, re, time, html, json, subprocess, shlex

def read(path):
    try:
        with open(path,'r',encoding='utf-8',errors='ignore') as f: return f.read()
    except: return ''

def file_size_kb(p):
    try: return os.path.getsize(p)/1024.0
    except: return 0.0

pages=[]
for root,_,files in os.walk('.'):
    if '/.' in root or 'node_modules' in root or 'snapshots' in root: continue
    for f in files:
        if f.endswith('.html'):
            p=os.path.join(root,f).replace('\\','/')
            pages.append(p)

meta=[]
big_assets=[]
missing_alt=[]
blocking_js=[]
ext_links=set()
int_missing=set()
img_count=0
iframe_count=0

for p in sorted(pages):
    t=read(p)
    # Bilder
    for m in re.finditer(r'<img\b[^>]*>', t, re.I):
        img_count+=1
        tag=m.group(0)
        if not re.search(r'\balt\s*=\s*"', tag, re.I):
            missing_alt.append((p, tag[:80]+'...'))
    # iframes
    iframe_count += len(re.findall(r'<iframe\b', t, re.I))
    # blockierende Skripte (ohne defer/async)
    for m in re.finditer(r'<script\b[^>]*src="([^"]+)"[^>]*>', t, re.I):
        tag=m.group(0)
        if not re.search(r'\bdefer\b|\basync\b', tag, re.I):
            blocking_js.append((p, tag[:120]+'...'))
    # Links
    for m in re.finditer(r'href="([^"]+)"', t, re.I):
        url=m.group(1)
        if url.startswith('http'):
            ext_links.add(url)
        else:
            url=url.split('#')[0]
            if url and url.endswith('.html') and not os.path.exists(url):
                int_missing.add((p,url))

# große Dateien (>300 KB) innerhalb des Repos listen
for root,_,files in os.walk('.'):
    if '/.' in root or 'node_modules' in root or 'snapshots' in root: continue
    for f in files:
        p=os.path.join(root,f).replace('\\','/')
        sz=file_size_kb(p)
        if sz>300: big_assets.append((p, round(sz)))

# externe Links – Stichprobe HEAD
def http_head(u):
    try:
        out=subprocess.check_output(shlex.split(f'curl -Is --max-time 5 "{u}" | head -n1'), stderr=subprocess.STDOUT)
        return out.decode('utf-8','ignore').strip()
    except subprocess.CalledProcessError as e:
        return e.output.decode('utf-8','ignore').splitlines()[0] if e.output else 'ERR'

ext_probe=[]
for u in sorted(list(ext_links))[:12]:
    ext_probe.append((u, http_head(u)))

# Report HTML ausgeben
ts=time.strftime('%Y-%m-%d %H:%M:%S')
rows = lambda lst: '\n'.join([f"<tr><td>{html.escape(a)}</td><td>{html.escape(str(b))}</td></tr>" for a,b in lst])

report=f"""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Health/Performance Report – {ts}</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head><body class="container py-4">
<h1 class="mb-3">Health/Performance Report</h1>
<p class="text-muted">Stand: {ts}</p>

<h4>Zusammenfassung</h4>
<ul>
  <li>HTML-Seiten: <strong>{len(pages)}</strong></li>
  <li>Bilder (img): <strong>{img_count}</strong>, iFrames: <strong>{iframe_count}</strong></li>
  <li>Bilder ohne <code>alt</code>: <strong>{len(missing_alt)}</strong></li>
  <li>Blockierende Script-Tags (ohne defer/async): <strong>{len(blocking_js)}</strong></li>
  <li>Interne Links mit fehlender Datei: <strong>{len(int_missing)}</strong></li>
  <li>Große Dateien &gt;300 KB: <strong>{len(big_assets)}</strong></li>
</ul>

<h4 class="mt-4">Bilder ohne alt</h4>
<table class="table table-sm table-striped"><thead><tr><th>Datei</th><th>Tag</th></tr></thead><tbody>
{rows(missing_alt)}
</tbody></table>

<h4 class="mt-4">Blockierende Skripte</h4>
<table class="table table-sm table-striped"><thead><tr><th>Datei</th><th>Script</th></tr></thead><tbody>
{rows(blocking_js)}
</tbody></table>

<h4 class="mt-4">Interne Links ohne Ziel</h4>
<table class="table table-sm table-striped"><thead><tr><th>Seite</th><th>Link-Ziel</th></tr></thead><tbody>
{rows(int_missing)}
</tbody></table>

<h4 class="mt-4">Große Dateien (&gt; 300 KB)</h4>
<table class="table table-sm table-striped"><thead><tr><th>Datei</th><th>KB</th></tr></thead><tbody>
{rows(big_assets)}
</tbody></table>

<h4 class="mt-4">Externe Links (Stichprobe)</h4>
<table class="table table-sm table-striped"><thead><tr><th>URL</th><th>HEAD</th></tr></thead><tbody>
{rows(ext_probe)}
</tbody></table>

<p class="mt-5"><a class="btn btn-primary" href="../index.html">&larr; Zurück zur Startseite</a></p>
</body></html>"""
name=f"reports/health-{time.strftime('%Y%m%d-%H%M%S')}.html"
open(name,'w',encoding='utf-8').write(report)
open('reports/latest.html','w',encoding='utf-8').write(report)
print(name)
