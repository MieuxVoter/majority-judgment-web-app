module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === "development",
  i18n: {
    defaultLocale: "fr",
    locales: ["en", "fr", "de", "es", "ru"],
  },
  ns: ["resource", "common", "error"],
  fallbackNS: ["common", "error"],
  defaultNS: "resource",
  defaultValue: "__STRING_NOT_TRANSLATED__",
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",

  reloadOnPrerender: process.env.NODE_ENV === "development",
};
