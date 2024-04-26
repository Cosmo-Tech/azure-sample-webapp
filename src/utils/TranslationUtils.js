// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { i18next, I18N_NAMESPACE } from '../services/config/i18next';

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

const getDatasetCategoryKpiNameTranslationKey = (categoryId, kpiId) => {
  return `dataset.categories.${categoryId}.kpis.${kpiId}.name`;
};

const getDatasetGraphIndicatorNameTranslationKey = (graphIndicatorId) => {
  return `dataset.graphIndicators.${graphIndicatorId}.name`;
};

const _addResourcesToi18next = (resources) => {
  const langs = Object.keys(resources);
  langs.forEach((lang) => i18next.addResources(lang, I18N_NAMESPACE, resources[lang]));
  i18next.reloadResources(langs);
};

const addTranslationOfDatasetManagerLabels = (datasetManager) => {
  const resources = {};
  const _addResource = (lang, key, value) => {
    if (resources[lang] == null) resources[lang] = {};
    resources[lang][key] = value;
  };

  for (const indicator of datasetManager?.graphIndicators ?? []) {
    if (indicator.id == null) continue;
    for (const lang in indicator.name) {
      const key = getDatasetGraphIndicatorNameTranslationKey(indicator.id);
      _addResource(lang, key, indicator.name[lang]);
    }
  }

  for (const category of datasetManager?.categories ?? []) {
    if (category.id == null) {
      console.warn(`Found category without id in dataset manager configuration`);
      continue;
    }
    for (const lang in category.name) {
      const key = getDatasetCategoryNameTranslationKey(category.id);
      _addResource(lang, key, category.name[lang]);
    }
    for (const lang in category.description) {
      const key = getDatasetCategoryDescriptionTranslationKey(category.id);
      _addResource(lang, key, category.description[lang]);
    }
    for (const kpi of category?.kpis ?? []) {
      if (kpi.id == null) {
        console.warn(`Found KPI without id in category "${category.id}"`);
        continue;
      }
      for (const lang in kpi.name) {
        const key = getDatasetCategoryKpiNameTranslationKey(category.id, kpi.id);
        _addResource(lang, key, kpi.name[lang]);
      }
    }
  }

  for (const datasource of datasetManager?.datasourceParameterHelpers ?? []) {
    const sourceType = datasource.id;
    for (const parameter of datasource?.parameters ?? []) {
      const parameterId = parameter.id;
      for (const lang in parameter?.tooltipText) {
        const key = getParameterTooltipTranslationKey(`${sourceType}.${parameterId}`); // Using "idForTranslationKey"
        _addResource(lang, key, parameter.tooltipText[lang]);
      }
    }
  }

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

const addTranslationParametersLabels = (parameters) => {
  const resources = {};
  const _addResource = (lang, key, value) => {
    if (resources[lang] == null) resources[lang] = {};
    resources[lang][key] = value;
  };

  for (const parameter of parameters) {
    for (const lang in parameter.labels) {
      const key = getParameterTranslationKey(parameter.id);
      _addResource(lang, key, parameter.labels[lang]);
    }

    for (const lang in parameter?.options?.tooltipText) {
      const key = getParameterTooltipTranslationKey(parameter.id);
      _addResource(lang, key, parameter.options.tooltipText[lang]);
    }

    for (const enumValue of parameter?.options?.enumValues ?? []) {
      if (typeof enumValue.value === 'object') {
        for (const lang in enumValue.value) {
          const key = getParameterEnumValueTranslationKey(parameter.id, enumValue.key);
          _addResource(lang, key, enumValue.value[lang]);
        }
      }

      for (const lang in enumValue.tooltipText) {
        const key = getParameterEnumValueTooltipTranslationKey(parameter.id, enumValue.key);
        _addResource(lang, key, enumValue.tooltipText[lang]);
      }
    }
  }

  _addResourcesToi18next(resources);
};

const addTranslationRunTemplateLabels = (runTemplates) => {
  const resources = {};
  runTemplates.forEach((runTemplate) => {
    for (const lang in runTemplate.labels) {
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
