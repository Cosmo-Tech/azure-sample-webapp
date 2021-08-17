// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { TranslationUtils } from './TranslationUtils';

const _findParametersGroupParametersById = (solution, groupId) => {
  return solution.parameterGroups.find(group => group.id === groupId)?.parameters;
};

const _getRunTemplateParameters = (solution, runTemplate) => {
  if (!runTemplate.parameterGroups) {
    return [];
  }
  let parameters = [];
  for (const parametersGroupId of runTemplate.parameterGroups) {
    const newParameters = _findParametersGroupParametersById(solution, parametersGroupId);
    if (newParameters) {
      parameters = parameters.concat(newParameters);
    }
  }
  return parameters;
};

const _getRunTemplatesParametersIdsDict = (solution) => {
  const runTemplatesParametersIdsDict = {};
  for (const runTemplate of solution.runTemplates) {
    runTemplatesParametersIdsDict[runTemplate.id] = _getRunTemplateParameters(solution, runTemplate);
  }
  return runTemplatesParametersIdsDict;
};

const addRunTemplatesParametersIdsDict = (solution) => {
  solution.runTemplatesParametersIdsDict = _getRunTemplatesParametersIdsDict(solution);
  return solution;
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
