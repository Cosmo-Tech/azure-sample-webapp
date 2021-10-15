// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { TranslationUtils } from './TranslationUtils';

const _getRunTemplateParameters = (groupsOfParameters, runTemplateParametersGroupsIds) => {
  if (!runTemplateParametersGroupsIds) {
    return [];
  }
  const parameters = [];
  for (const parametersGroupId of runTemplateParametersGroupsIds) {
    const newParameters = groupsOfParameters[parametersGroupId].parameters || [];
    for (const newParameter of newParameters) {
      if (parameters.indexOf(newParameter) === -1) {
        parameters.push(newParameter);
      }
    }
  }
  return parameters;
};

const _getParametersGroupsFromSolution = (solution) => {
  const parametersGroups = {};
  for (const group of solution.parameterGroups || []) {
    parametersGroups[group.id] = group;
  }
  return parametersGroups;
};

const _getParametersGroupsFromConfig = (config) => {
  return config?.parametersGroups;
};

const _getGroupsOfParameters = (solution, config) => {
  let parametersGroups = _getParametersGroupsFromSolution(solution);
  parametersGroups = {
    ...parametersGroups,
    // Let config overwrite parameters groups defined in solution description
    ..._getParametersGroupsFromConfig(config)
  };
  return parametersGroups;
};

const _getRunTemplatesParametersIdsDict = (solution, config) => {
  const groupsOfParameters = _getGroupsOfParameters(solution, config);
  const runTemplatesParametersIdsDict = {};
  for (const runTemplate of solution.runTemplates || []) {
    runTemplatesParametersIdsDict[runTemplate.id] = _getRunTemplateParameters(
      groupsOfParameters, runTemplate.parameterGroups);
  }
  // Let config overwrite run templates groups defined in solution description
  for (const runTemplateId in config?.runTemplates || {}) {
    runTemplatesParametersIdsDict[runTemplateId] = _getRunTemplateParameters(
      groupsOfParameters, config.runTemplates[runTemplateId].parameterGroups);
  }
  return runTemplatesParametersIdsDict;
};

const addRunTemplatesParametersIdsDict = (solution, config) => {
  if (!solution) {
    return;
  }
  solution.runTemplatesParametersIdsDict = _getRunTemplatesParametersIdsDict(solution, config);
};

const _addTranslationParametersGroupsLabels = (solution) => {
  const parametersGroups = solution?.parameterGroups || [];
  TranslationUtils.addTranslationParametersGroupsLabels(parametersGroups);
};

const _addTranslationParametersLabels = (solution) => {
  const parameters = solution?.parameters || [];
  TranslationUtils.addTranslationParametersLabels(parameters);
};

const addTranslationLabels = (solution) => {
  _addTranslationParametersGroupsLabels(solution);
  _addTranslationParametersLabels(solution);
};

export const SolutionsUtils = {
  addRunTemplatesParametersIdsDict,
  addTranslationLabels
};
