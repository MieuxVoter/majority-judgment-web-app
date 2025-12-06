/** @type {import('next').NextConfig} */
const nextConfig = {
  // Native replacement for next-transpile-modules
  transpilePackages: ['scalable-majority-judgment'],

  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'fr',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.IMGPUSH_URL
          ? process.env.IMGPUSH_URL.split('/').pop()
          : 'imgpush.mieuxvoter.fr',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
