// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SOLUTIONS } from '../config/overrides/Solutions.js';
import { ApiUtils } from './ApiUtils';
import { ArrayDictUtils } from './ArrayDictUtils';
import { ConfigUtils } from './ConfigUtils';
import { ParameterConstraintsUtils } from './ParameterConstraintsUtils';
import { TranslationUtils } from './TranslationUtils';

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
  try {
    TranslationUtils.addTranslationParametersGroupsLabels(solution?.parameterGroups ?? []);
    TranslationUtils.addTranslationParametersLabels(solution?.parameters ?? []);
    TranslationUtils.addTranslationRunTemplateLabels(solution?.runTemplates ?? []);
  } catch (error) {
    console.warn(`An error occurred when loading labels from solution "${solution.name}" (id "${solution.id}")`);
    console.error(error);
  }
};

const castMinMaxDefaultValuesInSolution = (solution) => {
  solution?.parameters?.forEach((parameter) => ApiUtils.formatParameterMinMaxDefaultValuesFromString(parameter));
};

const patchSolutionIfLocalConfigExists = async (originalSolution) => {
  if (SOLUTIONS.length > 0) console.log('Solutions content overridden by configuration file');
  const overridingSolution = SOLUTIONS.find((solution) => solution.id === originalSolution.id);
  ConfigUtils.patchSolution(originalSolution, overridingSolution);
};

const checkParametersValidationConstraintsInSolution = (data) => {
  const parametersWithConstraint = data?.parameters?.filter((parameter) => parameter?.options?.validation);
  parametersWithConstraint?.forEach((parameter) => {
    const constraint = ParameterConstraintsUtils.getParameterValidationConstraint(
      parameter.options.validation,
      parameter.varType,
      data.parameters
    );
    if (constraint === null) {
      console.warn(
        `Constraint "${parameter.options.validation}" cannot be applied to parameter
        with id "${parameter.id}", please check your solution configuration file`
      );
      delete data.parameters.find((param) => param.id === parameter.id)?.options?.validation;
    }
  });
};

const _getNonEditableColumn = (columns) => {
  for (const column of columns) {
    if (column?.type?.includes('nonEditable')) return column;
    if (Array.isArray(column.children) && column.children.length > 0) {
      const nonEditableColumn = _getNonEditableColumn(column.children);
      if (nonEditableColumn != null) return nonEditableColumn;
    }
  }
};

const patchIncompatibleValuesInSolution = (solution) => {
  solution.parameters = solution.parameters?.filter((parameter) => parameter != null);
  solution.parameterGroups = solution.parameterGroups?.filter((group) => group != null);
  solution.runTemplates = solution.runTemplates?.filter((runTemplate) => runTemplate != null);

  solution.parameters?.forEach((parameter) => {
    if (parameter.varType === '%DATASETID%' && parameter.options?.subType === 'TABLE')
      if (parameter.options?.canChangeRowsNumber) {
        const nonEditableColumn = _getNonEditableColumn(parameter.options.columns);
        if (nonEditableColumn != null) {
          console.warn(
            `parameter.options.canChangeRowsNumber can't be true on ${parameter.id} ` +
              `if column ${nonEditableColumn.field} is nonEditable, please fix it in the solution`
          );
          parameter.options.canChangeRowsNumber = false;
        }
      }
  });
};

const forgeRunnerParameters = (solution, formValues) => {
  if (formValues == null) return [];

  return Object.entries(formValues).map(([key, value]) => {
    const solutionParameter = solution?.parameters?.find((param) => param.id === key);
    const parameter = {
      parameterId: key,
      varType: solutionParameter?.varType,
      value,
    };
    if (solutionParameter?.varType === '%DATASETID%') parameter.connectorId = solutionParameter?.options?.connectorId;
    return parameter;
  });
};

export const SolutionsUtils = {
  addRunTemplatesParametersIdsDict,
  addTranslationLabels,
  castMinMaxDefaultValuesInSolution,
  patchSolutionIfLocalConfigExists,
  checkParametersValidationConstraintsInSolution,
  patchIncompatibleValuesInSolution,
  forgeRunnerParameters,
};
