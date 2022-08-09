// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import { LANGUAGES, FALLBACK_LANGUAGE } from '../../config/Languages';

const I18N_NAMESPACE = 'translation';

const langDetectorOptions = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'locale',
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  checkWhitelist: true,
};

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: Object.keys(LANGUAGES),
    detection: langDetectorOptions,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export { i18next, I18N_NAMESPACE };
