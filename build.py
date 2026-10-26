"""Build the installable web app (PWA) in ./pwa from index.html.

index.html is written as page content (no <html>/<head>) so it can also be
published as a Claude artifact. This script wraps it in a full document and
adds the manifest, icons and offline service worker.

Usage: python3 build.py
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "pwa"
src = (ROOT / "index.html").read_text(encoding="utf-8")

title = re.search(r"<title>(.*?)</title>", src).group(1)
body = re.sub(r"<title>.*?</title>\s*", "", src, count=1)
body = re.sub(r'<meta name="claude:viewport-fit-sides"[^>]*>\s*', "", body, count=1)

head = f"""<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="עבודה פנימית יומית לפי מודל הנפש של ספר התניא">
<meta name="theme-color" content="#0E1227">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="{title}">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
</head>
<body>
"""
sw_register = """
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
</script>
</body>
</html>
"""
OUT.mkdir(exist_ok=True)
(OUT / "index.html").write_text(head + body + sw_register, encoding="utf-8")

manifest = {
    "name": title,
    "short_name": title,
    "description": "עבודה פנימית יומית לפי מודל הנפש של ספר התניא",
    "lang": "he",
    "dir": "rtl",
    "start_url": "./",
    "scope": "./",
    "display": "standalone",
    "background_color": "#0E1227",
    "theme_color": "#0E1227",
    "icons": [
        {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ],
}
(OUT / "manifest.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

# Bump CACHE whenever the app changes so phones pick up the new version.
version = str(abs(hash(src)) % 10**8)
sw = f"""const CACHE = "mh-{version}";
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
self.addEventListener("install", e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); }});
self.addEventListener("activate", e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); }});
self.addEventListener("fetch", e => {{
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {{
      if (r.ok && new URL(e.request.url).origin === location.origin) {{ const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }}
      return r;
    }}).catch(() => caches.match(e.request).then(m => m || caches.match("index.html")))
  );
}});
"""
(OUT / "sw.js").write_text(sw, encoding="utf-8")
(OUT / ".nojekyll").write_text("", encoding="utf-8")
print("built", OUT)
