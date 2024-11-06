// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { initReactI18next } from 'react-i18next';
import merge from 'deepmerge';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import ConfigService from '../ConfigService';
import { LANGUAGES, FALLBACK_LANGUAGE } from './Languages';

const I18N_NAMESPACE = 'merged';
const I18N_TRANSLATION_NAMESPACE = 'translation';
const I18N_CUSTOM_NAMESPACE = 'custom';

const langDetectorOptions = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'locale',
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  checkWhitelist: true,
};

const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
i18next
  .use(HttpApi)
  .use(LanguageDetector)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    ns: [I18N_TRANSLATION_NAMESPACE, I18N_CUSTOM_NAMESPACE],
    preload: Object.keys(LANGUAGES),
    supportedLngs: Object.keys(LANGUAGES),
    fallbackLng: FALLBACK_LANGUAGE,
    detection: langDetectorOptions,
    backend: {
      loadPath: `${publicUrl}/locales/{{lng}}/{{ns}}.json`,
    },
  });

i18next.on('initialized', function () {
  i18next.setDefaultNamespace(I18N_NAMESPACE);
});

i18next.on('languageChanged', function (lng) {
  const translationBundle = i18next.getResourceBundle(lng, I18N_TRANSLATION_NAMESPACE);
  const customBundle = i18next.hasResourceBundle(lng, I18N_CUSTOM_NAMESPACE)
    ? i18next.getResourceBundle(lng, I18N_CUSTOM_NAMESPACE)
    : {};
  const merged = merge(translationBundle, customBundle);

  i18next.addResourceBundle(lng, I18N_NAMESPACE, merged, true, true);
});

export { i18next, I18N_NAMESPACE };
