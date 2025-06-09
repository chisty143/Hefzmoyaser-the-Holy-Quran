import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},

  // إعدادات الصور (تم إزالة remotePatterns لأنها لم تعد ضرورية)
  images: {
    unoptimized: true, // تعطيل تحسين الصور (اختياري حسب الحاجة)
  },

  // إعدادات الـ headers
  async headers() {
    return [
      {
        source: "/data/:path*", // بيانات JSON
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // تخزين لمدة سنة
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public", // مجلد الخدمة العامل
  register: true,
  skipWaiting: true,
  navigateFallback: null, // مؤقتًا لحل مشكلة offline.html
  // navigateFallback: '/offline.html',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB لملفات JSON

  disable: process.env.NODE_ENV !== "production",

  runtimeCaching: [
    {
      urlPattern: /\/offline\.html/,
      handler: "CacheFirst",
      options: {
        cacheName: "offline-page",
        expiration: { maxEntries: 1 },
      },
    },
    {
      urlPattern: /\/_next\/.*(manifest|client-reference|loadable)\.(js|json)$/,
      handler: "NetworkOnly",
    },
    {
      urlPattern: /^\/$/, // الصفحة الرئيسية
      handler: "NetworkFirst",
      options: {
        cacheName: "start-page",
        expiration: { maxEntries: 1, maxAgeSeconds: 604800 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^\/hafs$/, // صفحة المصحف
      handler: "NetworkFirst",
      options: {
        cacheName: "hafs-page",
        expiration: { maxEntries: 1, maxAgeSeconds: 604800 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\/data\/.*\.json$/, // بيانات المصحف
      handler: "CacheFirst",
      options: {
        cacheName: "quran-json",
        expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\/images\/quran\/.*\.(png|jpg|jpeg|webp|gif|svg)$/, // الصور المحلية
      handler: "CacheFirst",
      options: {
        cacheName: "local-quran-images",
        expiration: { maxEntries: 700, maxAgeSeconds: 2592000 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\/images\/quran2\/.*\.(png|jpg|jpeg|webp|gif|svg)$/, // الصور المحلية
      handler: "CacheFirst",
      options: {
        cacheName: "local-quran-images",
        expiration: { maxEntries: 700, maxAgeSeconds: 2592000 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],

  buildExcludes: [
    /(build-manifest|app-build-manifest|react-loadable-manifest|middleware-manifest|client-reference-manifest)\.(js|json)$/,
    /chunks\/.*\.js$/,
  ],

  additionalManifestEntries: [],
  exclude: [/.*-manifest\.(js|json)$/],
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  dontCacheBustURLsMatching: /^\/_next\//,
  ignoreURLParametersMatching: [/.*/],
  modifyURLPrefix: {
    "/_next": "/_next",
  },
  manifestTransforms: [
    (manifestEntries) => ({
      manifest: manifestEntries.filter(
        (entry) =>
          !entry.url.includes("build-manifest") &&
          !entry.url.includes("app-build-manifest")
      ),
      warnings: [],
    }),
  ],
})(nextConfig);
