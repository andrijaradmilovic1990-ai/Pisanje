const CACHE='pisalnica-v4';
const ASSETS=['/Pisanje/','/Pisanje/index.html','/Pisanje/manifest.json','/Pisanje/icon-192.png','/Pisanje/icon-512.png','/Pisanje/icon-maskable.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(cached=>{
    const net=fetch(e.request).then(res=>{
      if(res&&res.status===200&&res.type==='basic'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
      return res;
    }).catch(()=>cached);
    return cached||net;
  }));
});
