import {InitOptions} from "i18next";
// import all namespaces (for the default language, only)
import emailEn from "../public/locales/en/email.json";
import emailFr from "../public/locales/fr/email.json";
import resourceEn from "../public/locales/en/resource.json";
import resourceFr from "../public/locales/fr/resource.json";


export const defaultNS = "email";

export const resources = {
  en: {
    email: emailEn,
    resource: resourceEn,
  },
  fr: {
    email: emailFr,
    resource: resourceFr,
  },
} as const;


export const i18n: InitOptions = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === 'development',
  ns: ["resource", "email"],
  resources,
  defaultNS: defaultNS,
}
