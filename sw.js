// // Teqpadi Service Worker v1.0
// const CACHE = "teqpadi-v1";
// const STATIC = [
//   "/",
//   //   "/index.html",
//   "/manifest.json",
//   "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap",
//   "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
//   "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
// ];

// self.addEventListener("install", (e) => {
//   e.waitUntil(
//     caches
//       .open(CACHE)
//       .then((c) => c.addAll(STATIC))
//       .then(() => self.skipWaiting()),
//   );
// });

// self.addEventListener("activate", (e) => {
//   e.waitUntil(
//     caches
//       .keys()
//       .then((keys) =>
//         Promise.all(
//           keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
//         ),
//       )
//       .then(() => self.clients.claim()),
//   );
// });

// self.addEventListener("fetch", (e) => {
//   // Only handle GET requests
//   if (e.request.method !== "GET") return;
//   // Skip chrome-extension and non-http(s)
//   if (!e.request.url.startsWith("http")) return;

//   e.respondWith(
//     caches.match(e.request).then((cached) => {
//       if (cached) return cached;
//       return fetch(e.request)
//         .then((res) => {
//           // Cache valid responses
//           if (!res || res.status !== 200 || res.type === "opaque") return res;
//           const clone = res.clone();
//           caches.open(CACHE).then((c) => c.put(e.request, clone));
//           return res;
//         })
//         .catch(() => {
//           // Offline fallback for navigation
//           if (e.request.mode === "navigate") return caches.match("/index.html");
//         });
//     }),
//   );
// });
