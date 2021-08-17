// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import i18next from '../services/config/i18next';

const I18N_NAMESPACE = 'translation';

const getParameterTranslationKey = (parameterId) => {
  return `solution.parameters.${parameterId}`;
};

const getParametersGroupTranslationKey = (groupId) => {
  return `solution.parametersGroups.${groupId}`;
};

const addTranslationParametersGroupsLabels = (parametersGroups) => {
  const resources = {};
  for (const parametersGroup of parametersGroups) {
    for (const lang in parametersGroup.labels) {
      resources[lang] = resources[lang] || {};
      const key = getParametersGroupTranslationKey(parametersGroup.id);
      const label = parametersGroup.labels[lang];
      resources[lang][key] = label;
    }
  }
  const langs = Object.keys(resources);
  for (const lang of langs) {
    i18next.addResources(lang, I18N_NAMESPACE, resources[lang]);
  }
  i18next.reloadResources(langs);
};

const addTranslationParametersLabels = (parameters) => {
  const resources = {};
  for (const parameter of parameters) {
    for (const lang in parameter.labels) {
      resources[lang] = resources[lang] || {};
      const key = getParameterTranslationKey(parameter.id);
      const label = parameter.labels[lang];
      resources[lang][key] = label;
    }
  }
  const langs = Object.keys(resources);
  for (const lang of langs) {
    i18next.addResources(lang, I18N_NAMESPACE, resources[lang]);
  }
  i18next.reloadResources(langs);
};

const changeLanguage = (language, i18next) => {
  switch (language) {
    case 'en':
      i18next.changeLanguage('en');
      break;
    case 'fr':
      i18next.changeLanguage('fr');
      break;
    default:
      i18next.changeLanguage('en');
      break;
  }
};

export const TranslationUtils = {
  addTranslationParametersGroupsLabels,
  addTranslationParametersLabels,
  changeLanguage,
  getParametersGroupTranslationKey,
  getParameterTranslationKey
};
