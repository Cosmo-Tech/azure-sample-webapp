// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import ConfigService from '../../services/ConfigService';

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
    fallbackLng: ConfigService.getParameterValue('FALLBACK_LANGUAGE'),
    supportedLngs: Object.keys(ConfigService.getParameterValue('LANGUAGES')),
    detection: langDetectorOptions,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export { i18next, I18N_NAMESPACE };
