// const {i18n} = require('./next-i18next.config.js');

const withTM = require('next-transpile-modules')(['scalable-majority-judgment']);

const remoteImage = process.env.IMGPUSH_URL
  ? process.env.IMGPUSH_URL.split('/')[-1]
  : 'imgpush.mieuxvoter.fr';

module.exports = withTM({
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: remoteImage,
        pathname: '**',
      },
    ],
  },
});
