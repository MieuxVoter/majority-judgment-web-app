module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['en', 'fr'],
  },
  defaultNS: 'resource',
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
// const path = require('path')
// module.exports = {
//   i18n: {
//     defaultLocale: "fr",
//     locales: ["en", "fr"],
//   },
//   localePath: path.resolve('./public/locales'),
//   //    react: {
//   //      useSuspense: false,
//   //      wait: true
//   //    }
// };
