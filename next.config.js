// const {i18n} = require('./next-i18next.config.js');

const remoteImage = process.env.IMGPUSH_URL
  ? process.env.IMGPUSH_URL.split('/')[-1]
  : 'imgpush.mieuxvoter.fr';

module.exports = {
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
};
