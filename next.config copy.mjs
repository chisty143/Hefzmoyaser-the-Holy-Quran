import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/hefz/quran/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  navigateFallback: '/offline.html',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // ✅ لحل تحذير ملفات JSON الكبيرة
  disable: process.env.NODE_ENV === 'development', // لا يعمل PWA في dev لتجنب المشاكل

  runtimeCaching: [
    {
      urlPattern: /^\/$/, // الصفحة الرئيسية
      handler: 'NetworkFirst',
      options: {
        cacheName: 'start-page',
        expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^\/hafs$/, // صفحة المصحف
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hafs-page',
        expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\/data\/.*\.json$/, // بيانات JSON
      handler: 'CacheFirst',
      options: {
        cacheName: 'quran-json',
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/ik\.imagekit\.io\/hefz\/quran\//, // صور المصحف
      handler: 'CacheFirst',
      options: {
        cacheName: 'quran-images',
        expiration: { maxEntries: 700, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
})(nextConfig);
