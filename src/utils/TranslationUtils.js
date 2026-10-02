// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { i18next, I18N_NAMESPACE } from '../services/config/i18next';
import { ConfigUtils } from './ConfigUtils';

const getParameterTranslationKey = (parameterId) => {
  return `solution.parameters.${parameterId}.name`;
};

const getParameterTooltipTranslationKey = (parameterId) => {
  return `solution.parameters.${parameterId}.tooltip`;
};

const getParameterEnumValueTranslationKey = (parameterId, valueKey) => {
  return `solution.parameters.${parameterId}.enum.value.${valueKey}.label`;
};

const getParameterEnumValueTooltipTranslationKey = (parameterId, valueKey) => {
  return `solution.parameters.${parameterId}.enum.value.${valueKey}.tooltip`;
};

const getParametersGroupTranslationKey = (groupId) => {
  return `solution.parametersGroups.${groupId}.name`;
};

const getRunTemplateTranslationKey = (runTemplateId) => {
  return `solution.runTemplate.${runTemplateId}.name`;
};

const getDatasetCategoryNameTranslationKey = (categoryId) => {
  return `dataset.categories.${categoryId}.name`;
};

const getDatasetCategoryDescriptionTranslationKey = (categoryId) => {
  return `dataset.categories.${categoryId}.description`;
};

const getDatasetCategoryKpiNameTranslationKey = (categoryId, kpi) => {
  return `dataset.categories.${categoryId}.queries.${kpi.queryId}.kpis.${kpi.id}.name`;
};

const getDatasetGraphIndicatorNameTranslationKey = (kpiCard) => {
  return `dataset.queries.${kpiCard.queryId}.kpiCards.${kpiCard.id}.name`;
};

const _addResourcesToi18next = (resources) => {
  const langs = Object.keys(resources);
  langs.forEach((lang) => i18next.addResources(lang, I18N_NAMESPACE, resources[lang]));
};

const _addLabels = (addResource, labels, key) => {
  for (const lang in labels) addResource(lang, key, labels[lang]);
};

const _addKpiCardsLabels = (addResource, kpiCards) => {
  for (const indicator of kpiCards ?? []) {
    if (indicator.id == null || indicator.queryId == null) continue;
    _addLabels(addResource, indicator.name, getDatasetGraphIndicatorNameTranslationKey(indicator));
  }
};

const _addCategoryKpisLabels = (addResource, category) => {
  for (const kpi of category.kpis ?? []) {
    if (kpi.id == null) {
      console.warn(`Found KPI without id in category "${category.id}"`);
      continue;
    }
    if (kpi.queryId == null) {
      console.warn(`Found KPI without queryId in category "${category.id}"`);
      continue;
    }
    _addLabels(addResource, kpi.name, getDatasetCategoryKpiNameTranslationKey(category.id, kpi));
  }
};

const _addCategoriesLabels = (addResource, categories) => {
  for (const category of categories ?? []) {
    if (category.id == null) {
      console.warn(`Found category without id in dataset manager configuration`);
      continue;
    }
    _addLabels(addResource, category.name, getDatasetCategoryNameTranslationKey(category.id));
    _addLabels(addResource, category.description, getDatasetCategoryDescriptionTranslationKey(category.id));
    _addCategoryKpisLabels(addResource, category);
  }
};

const _addDatasourceHelpersLabels = (addResource, helpers) => {
  for (const datasource of helpers ?? []) {
    for (const parameter of datasource.parameters ?? []) {
      const key = getParameterTooltipTranslationKey(`${datasource.id}.${parameter.id}`); // Using "idForTranslationKey"
      _addLabels(addResource, parameter.tooltipText, key);
    }
  }
};

const addTranslationOfDatasetManagerLabels = (datasetManager) => {
  const resources = {};
  const _addResource = (lang, key, value) => {
    if (resources[lang] == null) resources[lang] = {};
    resources[lang][key] = value;
  };

  _addKpiCardsLabels(_addResource, datasetManager?.kpiCards);
  _addCategoriesLabels(_addResource, datasetManager?.categories);
  _addDatasourceHelpersLabels(_addResource, datasetManager?.datasourceParameterHelpers);

  _addResourcesToi18next(resources);
};

const addTranslationParametersGroupsLabels = (parametersGroups) => {
  const resources = {};
  for (const parametersGroup of parametersGroups) {
    for (const lang in parametersGroup.labels) {
      resources[lang] = resources[lang] ?? {};
      const key = getParametersGroupTranslationKey(parametersGroup.id);
      resources[lang][key] = parametersGroup.labels[lang];
    }
  }

  _addResourcesToi18next(resources);
};

const _addEnumValuesLabels = (addResource, parameter) => {
  const enumValues = ConfigUtils.getParameterAttribute(parameter, 'enumValues') ?? [];
  for (const enumValue of enumValues) {
    if (typeof enumValue.value === 'object') {
      _addLabels(addResource, enumValue.value, getParameterEnumValueTranslationKey(parameter.id, enumValue.key));
    }
    const tooltipKey = getParameterEnumValueTooltipTranslationKey(parameter.id, enumValue.key);
    _addLabels(addResource, enumValue.tooltipText, tooltipKey);
  }
};

const addTranslationParametersLabels = (parameters) => {
  const resources = {};
  const _addResource = (lang, key, value) => {
    if (resources[lang] == null) resources[lang] = {};
    resources[lang][key] = value;
  };

  for (const parameter of parameters) {
    _addLabels(_addResource, parameter.labels, getParameterTranslationKey(parameter.id));
    const parameterTooltip = ConfigUtils.getParameterAttribute(parameter, 'tooltipText');
    _addLabels(_addResource, parameterTooltip, getParameterTooltipTranslationKey(parameter.id));
    _addEnumValuesLabels(_addResource, parameter);
  }

  _addResourcesToi18next(resources);
};

const addTranslationRunTemplateLabels = (runTemplates) => {
  const resources = {};
  runTemplates.forEach((runTemplate) => {
    for (const lang in runTemplate.labels ?? {}) {
      resources[lang] = resources[lang] ?? {};
      const key = getRunTemplateTranslationKey(runTemplate.id);
      resources[lang][key] = runTemplate.labels[lang];
    }
  });

  _addResourcesToi18next(resources);
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

const charactersToEscapeMapping = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};
const symbolsToDecodeMapping = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x2F;': '/',
};

const getStringWithEscapedCharacters = (data) => {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'/]/g, (s) => charactersToEscapeMapping[s]);
  }
};

const getStringWithUnescapedCharacters = (string) => {
  let unescapedString = string;
  Object.keys(symbolsToDecodeMapping).forEach((key) => {
    const regex = new RegExp(key, 'g');
    unescapedString = unescapedString.replace(regex, symbolsToDecodeMapping[key]);
  });
  return unescapedString;
};

export const TranslationUtils = {
  addTranslationOfDatasetManagerLabels,
  addTranslationParametersGroupsLabels,
  addTranslationParametersLabels,
  addTranslationRunTemplateLabels,
  changeLanguage,
  getParametersGroupTranslationKey,
  getParameterTranslationKey,
  getRunTemplateTranslationKey,
  getParameterTooltipTranslationKey,
  getParameterEnumValueTranslationKey,
  getParameterEnumValueTooltipTranslationKey,
  getDatasetCategoryNameTranslationKey,
  getDatasetCategoryDescriptionTranslationKey,
  getDatasetCategoryKpiNameTranslationKey,
  getDatasetGraphIndicatorNameTranslationKey,
  getStringWithEscapedCharacters,
  getStringWithUnescapedCharacters,
};
