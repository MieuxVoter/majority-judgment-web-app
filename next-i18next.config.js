module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'fr',
    locales: ['en', 'fr'],
  },
  ns: ['resource'],
  defaultNS: 'resource',
  defaultValue: '__STRING_NOT_TRANSLATED__',
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development',

  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  // strictMode: true,
  // serializeConfig: false,
  // react: { useSuspense: false }
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
