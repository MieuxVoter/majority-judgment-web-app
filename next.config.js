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
  sassOptions: {
    // The the binary compiler is much faster and respects silence options better
    implementation: 'sass-embedded',
    // Silence warnings from dependencies (like Bootstrap)
    quietDeps: true,
    // Silence specific deprecations that are unavoidable in Bootstrap 5
    silenceDeprecations: [
	    'import',
	    'global-builtin',
	    'color-functions',
	    'legacy-js-api'
    ],
  },
};

module.exports = nextConfig;
