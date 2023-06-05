// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { TranslationUtils } from './TranslationUtils';
import { ApiUtils } from './ApiUtils';
import { ArrayDictUtils } from './ArrayDictUtils';
import { ConfigUtils } from './ConfigUtils';
import { SOLUTIONS } from '../config/overrides/Solutions.js';

const _getRunTemplateParametersIds = (groupsOfParameters, runTemplateParametersGroupsIds) => {
  let parameters = [];
  for (const parametersGroupId of runTemplateParametersGroupsIds ?? []) {
    if (!groupsOfParameters[parametersGroupId]) {
      console.warn(
        `Parameters group "${parametersGroupId}" is referenced in the solution run templates ` +
          'but it is not defined in the solution parameters groups'
      );
      continue;
    }
    const newParameters = groupsOfParameters[parametersGroupId]?.parameters ?? [];
    parameters = parameters.concat(newParameters.filter((newParameter) => !parameters.includes(newParameter)));
  }
  return parameters;
};

const _createRunTemplatesParametersIdsDict = (solution) => {
  const solutionParametersGroups = ArrayDictUtils.reshapeConfigArrayToDictById(solution.parameterGroups);
  const runTemplatesParametersIdsDict = {};
  solution?.runTemplates?.forEach((runTemplate) => {
    runTemplatesParametersIdsDict[runTemplate.id] = _getRunTemplateParametersIds(
      solutionParametersGroups,
      runTemplate.parameterGroups
    );
  });
  return runTemplatesParametersIdsDict;
};

const addRunTemplatesParametersIdsDict = (solution) => {
  if (!solution) return;
  solution.runTemplatesParametersIdsDict = _createRunTemplatesParametersIdsDict(solution);
};

const addTranslationLabels = (solution) => {
  TranslationUtils.addTranslationParametersGroupsLabels(solution?.parameterGroups ?? []);
  TranslationUtils.addTranslationParametersLabels(solution?.parameters ?? []);
};

const castMinMaxDefaultValuesInSolution = (solution) => {
  solution?.parameters?.forEach((parameter) => ApiUtils.formatParameterMinMaxDefaultValuesFromString(parameter));
};

const patchSolutionIfLocalConfigExists = async (originalSolution) => {
  if (SOLUTIONS.length > 0) console.log('Solutions content overridden by configuration file');
  const overridingSolution = SOLUTIONS.find((solution) => solution.id === originalSolution.id);
  ConfigUtils.patchSolution(originalSolution, overridingSolution);
};

const fixNotCompatibleValuesInSolution = (solution) => {
  solution.parameters.forEach((parameter) => {
    if (parameter.varType === '%DATASETID%' && parameter.options?.subType === 'TABLE')
      if (parameter.options?.enableAddRow)
        parameter.options.columns.forEach((column) => {
          if (column.type.includes('nonEditable')) {
            console.warn(
              "parameter.options.enableAddRow can't be true if some columns is nonEditable, please fix it the solution"
            );
            parameter.options.enableAddRow = false;
          }
        });
  });
};

export const SolutionsUtils = {
  addRunTemplatesParametersIdsDict,
  addTranslationLabels,
  castMinMaxDefaultValuesInSolution,
  patchSolutionIfLocalConfigExists,
  fixNotCompatibleValuesInSolution,
};
