import i18n from "i18next";
import XHR from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    fallbackLng: "en",
    debug: true,
    saveMissing: true, // send not translated keys to endpoint
    defaultValue: "__STRING_NOT_TRANSLATED__",
    react: { useSuspense: false },
    keySeparator: ">",
    nsSeparator: "|",
    backend: {
      loadPath: "/locale/i18n/{{lng}}/resource.json"
      // path to post missing resources
    },

    interpolation: {
      escapeValue: false // not needed for react!!
    }

    // react i18next special options (optional)
    // override if needed - omit if ok with defaults
    /*
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true,
    }
    */
  });

export default i18n;
