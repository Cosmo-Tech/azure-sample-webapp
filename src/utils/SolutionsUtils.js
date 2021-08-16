// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const _findParametersGroupParametersById = (solution, groupId) => {
  return solution.parameterGroups.find(group => group.id === groupId)?.parameters;
};

const _getRunTemplateParameters = (solution, runTemplate) => {
  if (!runTemplate.parameterGroups) {
    return [];
  }
  let parameters = [];
  for (const parameterGroupId of runTemplate.parameterGroups) {
    const newParameters = _findParametersGroupParametersById(solution, parameterGroupId);
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

export const addRunTemplatesParametersIdsDict = (solution) => {
  solution.runTemplatesParametersIdsDict = _getRunTemplatesParametersIdsDict(solution);
  return solution;
};
