// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SOLUTIONS } from '../config/overrides/Solutions.js';
import { DATASET_SOURCES } from '../services/config/ApiConstants';
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

const addStaticTranslationLabels = () => {
  if (typeof addStaticTranslationLabels.initialized !== 'undefined') return;
  addStaticTranslationLabels.initialized = true;
  DATASET_SOURCES.forEach((dataSource) => {
    dataSource.parameters.forEach((parameter) => (parameter.idForTranslationKey = `${dataSource.id}.${parameter.id}`));
  });

  TranslationUtils.addTranslationRunTemplateLabels(DATASET_SOURCES);
  TranslationUtils.addTranslationParametersLabels(
    DATASET_SOURCES.flatMap((dataSource) =>
      dataSource?.parameters.map((parameter) => ({ ...parameter, id: parameter.idForTranslationKey ?? parameter.id }))
    )
  );
};

const addTranslationLabels = (solution) => {
  addStaticTranslationLabels();
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
    if (parameter.varType === 'enum') {
      const dynamicSourceConfig = parameter.options?.dynamicEnumValues;
      if (dynamicSourceConfig == null) return;

      let removeFromConfig = false;
      if (dynamicSourceConfig.type !== 'cypher') {
        console.error(
          `Enum parameter ${parameter.id} has unknown type "${dynamicSourceConfig.type}" for dynamicEnumValues. ` +
            'Currently, the only supported option is "cypher".'
        );
        removeFromConfig = true;
      }
      if (dynamicSourceConfig.query == null) {
        console.error(`Enum parameter ${parameter.id} has no query defined in dynamicEnumValues.`);
        removeFromConfig = true;
      }
      if (dynamicSourceConfig.resultKey == null) {
        console.error(`Enum parameter ${parameter.id} has no resultKey defined in dynamicEnumValues.`);
        removeFromConfig = true;
      }

      if (removeFromConfig) {
        delete parameter.options.dynamicEnumValues;
        console.warn(
          `Dynamic values have been disabled for parameter ${parameter.id}, static values from the configuration (or ` +
            ' an empty list) will be shown.'
        );
      }
    } else if (
      parameter.varType === '%DATASETID%' &&
      parameter.options?.subType === 'TABLE' &&
      parameter.options?.canChangeRowsNumber
    ) {
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

const isDataSource = (runTemplate) => runTemplate?.tags?.includes('datasource');
const isSubDataSource = (runTemplate) => runTemplate?.tags?.includes('subdatasource');

// Replace dot characters from run template ids to prevent undesired nested items when using theses id as field paths
// with React Hook Form (see https://github.com/react-hook-form/react-hook-form/issues/676)
const DOT_REPLACEMENT_PATTERN = '__DOT__';
const escapeRunTemplateId = (runTemplateId) => runTemplateId.replace(/\./g, DOT_REPLACEMENT_PATTERN);

export const SolutionsUtils = {
  addRunTemplatesParametersIdsDict,
  addTranslationLabels,
  castMinMaxDefaultValuesInSolution,
  escapeRunTemplateId,
  patchSolutionIfLocalConfigExists,
  checkParametersValidationConstraintsInSolution,
  patchIncompatibleValuesInSolution,
  forgeRunnerParameters,
  isDataSource,
  isSubDataSource,
};
