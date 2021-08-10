// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import { LANGUAGES, FALLBACK_LANGUAGE } from '../../config/AppConfiguration';

const langDetectorOptions = {
  // order and from where user language should be detected
  order: ['cookie', 'localStorage', 'navigator'],

  // keys or params to lookup language from
  lookupCookie: 'locale',
  lookupLocalStorage: 'locale',

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // only detect languages that are in the whitelist
  checkWhitelist: true
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
// connect with React
  .use(initReactI18next)
// for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: FALLBACK_LANGUAGE,
    whitelist: Object.keys(LANGUAGES),
    detection: langDetectorOptions,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;
