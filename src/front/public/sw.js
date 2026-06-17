if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + ".js", i).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, c) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[n]) return;
    let t = {};
    const r = (e) => a(e, n),
      o = { module: { uri: n }, exports: t, require: r };
    s[n] = Promise.all(i.map((e) => o[e] || r(e))).then((e) => (c(...e), t));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/7rcGDPFZ0JVXIhMf9_oQK/_buildManifest.js",
          revision: "28504fac2db45b62ded8d18a519440ba",
        },
        {
          url: "/_next/static/7rcGDPFZ0JVXIhMf9_oQK/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1029-37984d6688df2d77.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/105-bcf79f4f632a849f.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/121-8a5cb56c9715333d.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/2420-99b2d93eb952cc6e.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/2559-9b18dcaf4a0b13b0.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/2631-0d77aae45f571ca9.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/2721-887e18978a626e83.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/472.a3826d29d6854395.js",
          revision: "a3826d29d6854395",
        },
        {
          url: "/_next/static/chunks/4bd1b696-3ff14b70c5839875.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/6033-2b301441eb454d53.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/6125-448fa1a9d8dfdec4.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/6766-6eb6f8d97d94e7ca.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/6874-ac722c0ace73786c.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/729-175c30c632988b74.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/7919-220a4720f7ac03ea.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/8243-22861f1e9110439c.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/8262-234062322400b96f.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/8543-871850a9d9ec0a76.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/8848-73afb2f9e5a8345f.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/909-7faf398bd13ed6d7.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/9341.48099055d616fd0a.js",
          revision: "48099055d616fd0a",
        },
        {
          url: "/_next/static/chunks/9845-7cc5051f32d5f5d9.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/9999-c46f18c8bacf1c17.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/9b0008ae-6adfdac40181ba7a.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-2052a70eef24f6bb.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/abonnements/page-899ea358d1367e11.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/annonces/page-a34179bb61eddd87.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/contrats/page-68c11f7bef653445.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/dashboard/page-6ec181b472b99eeb.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/layout-a0be41f337f38906.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/locataires/page-cbcd887e7706554e.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/locations/page-ae9bf274110fdbdc.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/maintenances/page-a34f7abaad2e41aa.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/mes-biens/page-4aa2244bf5a50dcb.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/messagerie/page-df5422691d2977b2.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/notifications/page-cbc4e613d31bf841.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/admin/rapports/page-0582e7caa0f1829e.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/auth/forgot-password/page-9f1c2e9a5d3636f5.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-ea9940987a8013fe.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-ea2ac218a549dd94.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-b13412091e2757b8.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/layout-c93ffb82623661df.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/app/subscriptions/page-0b2c50cd8c637583.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/framework-dcd2c1f5d9432bec.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/main-255a88a6ba8d177a.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/main-app-ceb9d8e4cb4f881c.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/pages/_app-c5edea036b2e1360.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/pages/_error-a0194b07e927b492.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-ae89bcce8b40da65.js",
          revision: "7rcGDPFZ0JVXIhMf9_oQK",
        },
        {
          url: "/_next/static/css/bf115df156754a32.css",
          revision: "bf115df156754a32",
        },
        {
          url: "/_next/static/css/fa7872d034a08987.css",
          revision: "fa7872d034a08987",
        },
        {
          url: "/_next/static/media/4473ecc91f70f139-s.p.woff",
          revision: "78e6fc13ea317b55ab0bd6dc4849c110",
        },
        {
          url: "/_next/static/media/463dafcda517f24f-s.p.woff",
          revision: "cbeb6d2d96eaa268b4b5beb0b46d9632",
        },
        {
          url: "/_next/static/media/Montserrat-Bold.4979f6a6.ttf",
          revision: "4979f6a6",
        },
        {
          url: "/_next/static/media/Montserrat-Regular.4142f4fc.ttf",
          revision: "4142f4fc",
        },
        {
          url: "/_next/static/media/Montserrat-SemiBold.016e1014.ttf",
          revision: "016e1014",
        },
        {
          url: "/_next/static/media/Vector.b58e3131.svg",
          revision: "1311bdee1eb555f94a3561c31ed7756f",
        },
        {
          url: "/_next/static/media/amico.f144043e.svg",
          revision: "7e635023fa5e670a1cb3b828fc00aceb",
        },
        {
          url: "/_next/static/media/cash.06c40cce.png",
          revision: "d32aad9facce51fd705cbc02a1aeb292",
        },
        {
          url: "/_next/static/media/mastercard.cf60ef11.svg",
          revision: "c0db23e95d6c71388000f00e68aa5cc6",
        },
        {
          url: "/_next/static/media/mtn.18e8e189.svg",
          revision: "e4ffafb7bfb546e60d4c79961cabb9d6",
        },
        {
          url: "/_next/static/media/orange.af0b665d.svg",
          revision: "60604f93546e0f6ad89586f2e2acf306",
        },
        {
          url: "/_next/static/media/pana.9713e22f.svg",
          revision: "70e33ee78ca7f27cd457218b0f927abb",
        },
        {
          url: "/_next/static/media/pdf-file.41e88615.svg",
          revision: "5faed0d220e9f7678dbb3dec6564fced",
        },
        {
          url: "/_next/static/media/pdf.worker.min.7ec0be7b.mjs",
          revision: "7ec0be7b",
        },
        {
          url: "/_next/static/media/pdf.worker.min.e7025282.mjs",
          revision: "e7025282",
        },
        {
          url: "/_next/static/media/png-file.4ee27384.svg",
          revision: "73a3d0196e26a0ff2afcb581a45f2f89",
        },
        {
          url: "/_next/static/media/visa.3b60bdd9.svg",
          revision: "cb15c8dafff9ef868904e8208a6a8af1",
        },
        { url: "/file.svg", revision: "a43652a972f8f8ea24f2e1ccfad4bd06" },
        { url: "/globe.svg", revision: "b4a8f1f092f23ef043aa22c3af374684" },
        {
          url: "/logo-white.png",
          revision: "133fe44f828d201f54610c1975b858f3",
        },
        { url: "/logo.png", revision: "a159116b591887b9f44e6ff967f03405" },
        { url: "/logo.png", revision: "8e2a926a0ae9179f5698d7fca198d433" },
        { url: "/logo512.jpg", revision: "8bace6e87dabb15e2d244ef4ba04e389" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/static/avatar-default.webp",
          revision: "ff2a75be2203bfe08799eac0353614f8",
        },
        {
          url: "/static/chat-start.svg",
          revision: "1f8a8143ec11a457d29a96037de7cdfb",
        },
        {
          url: "/static/files.svg",
          revision: "c4e4a367dd93f109ab06a2b05634cd6f",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "8672a3d25a3a996997af064b4351466c" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
