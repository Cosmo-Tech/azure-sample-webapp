// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { FILE_DATASET_PART_ID_VARTYPE, DB_DATASET_PART_ID_VARTYPE } from '../services/config/ApiConstants';
import { ArrayDictUtils } from './ArrayDictUtils';

const isDatasetPartVarType = (varType) => [FILE_DATASET_PART_ID_VARTYPE, DB_DATASET_PART_ID_VARTYPE].includes(varType);
const isDBParameter = (parameter) => parameter?.varType === DB_DATASET_PART_ID_VARTYPE;
const isFileParameter = (parameter) => parameter?.varType === FILE_DATASET_PART_ID_VARTYPE;

const buildExtendedVarType = (varType, extension) => {
  if (varType) {
    if (extension) {
      return varType + '-' + extension;
    }
    return varType;
  }
  return undefined;
};

function getConversionMethod(param, functionArray) {
  if (param == null) {
    console.warn('Null or undefined object provided in the list of parameters');
    return undefined;
  }

  const varType = param?.varType;
  const subType = getParameterAttribute(param, 'subType');
  if (functionArray) {
    const extendedVarType = buildExtendedVarType(varType, subType);
    if (extendedVarType in functionArray) {
      return functionArray[extendedVarType];
    } else if (varType in functionArray) {
      return functionArray[varType];
    }
  }
  console.warn(
    `Parameter "${param.id}": no conversion function (to/from string) defined for varType "${varType} or subType ` +
      `${subType} in ${functionArray}"`
  );
  return undefined;
}

const _checkDeprecatedKeysInParameterConfig = (parameter) => {
  const keysToCheck = [
    'columns',
    'dataCy',
    'dateFormat',
    'defaultFileTypeFilter',
    'enumValues',
    'hasHeader',
    'subType',
  ];
  keysToCheck.forEach((keyToCheck) => {
    if (parameter?.[keyToCheck] !== undefined) {
      if (keyToCheck === 'dataCy') {
        console.warn(
          'The "parameter.dataCy" key in the scenario parameters configuration is now deprecated, "data-cy" ' +
            'metadata are now automatically generated based on the factory type and the parameter id.'
        );
      } else {
        console.warn(
          `The "parameter.${keyToCheck}" key in the scenario parameters configuration is now deprecated. Please ` +
            `use "parameter.additionalData.${keyToCheck}" key instead.`
        );
      }
    }
  });
};

const getParameterAttribute = (parameter, attributeName) => {
  const knownAttributesNames = [
    'canChangeRowsNumber',
    'columns',
    'dateFormat',
    'defaultFileTypeFilter',
    'description',
    'dynamicValues',
    'dynamicEnumValues',
    'enumValues',
    'hasHeader',
    'hidden',
    'maxLength',
    'minLength',
    'runTemplateFilter',
    'shouldRenameFileOnUpload',
    'subType',
    'tooltipText',
    'validation',
  ];
  if (!knownAttributesNames.includes(attributeName)) {
    console.warn(`The attribute "${attributeName}" is not a known attribute in the scenario parameters configuration.`);
    return undefined;
  }

  return parameter?.additionalData?.[attributeName];
};

const getParametersGroupAttribute = (parametersGroup, attributeName) => {
  const knownAttributesNames = ['authorizedRoles', 'hideParameterGroupIfNoPermission', 'hidden'];
  if (!knownAttributesNames.includes(attributeName)) {
    console.warn(
      `The attribute "${attributeName}" is not a known attribute in the scenario parameters groups configuration.`
    );
    return undefined;
  }

  return parametersGroup?.additionalData?.[attributeName];
};

const _checkDeprecatedKeysInParametersGroupConfig = (parametersGroup) => {
  const keysToCheck = ['authorizedRoles', 'hideParameterGroupIfNoPermission'];
  keysToCheck.forEach((keyToCheck) => {
    if (parametersGroup?.[keyToCheck] !== undefined) {
      console.warn(
        `The "parametersGroup.${keyToCheck}" key in the scenario parameters group configuration is now deprecated. ` +
          `Please use "parametersGroup.additionalData.${keyToCheck}" key instead.`
      );
    }
  });
};

const checkDeprecatedKeysInConfig = (config) => {
  config.parameters && config.parameters.forEach((parameter) => _checkDeprecatedKeysInParameterConfig(parameter));
  config.parameterGroups &&
    config.parameterGroups.forEach((parametersGroup) => _checkDeprecatedKeysInParametersGroupConfig(parametersGroup));
};

const patchSolution = (originalSolution, overridingSolution) => {
  if (originalSolution == null || overridingSolution == null) return;
  const keysToMerge = ['parameters', 'parameterGroups', 'runTemplates'];

  const validKeys = ['id', ...keysToMerge];
  Object.keys(overridingSolution).forEach((keyInSolutionpatch) => {
    if (validKeys.includes(keyInSolutionpatch) === false)
      console.warn(`Invalid key "${keyInSolutionpatch}" in solution override. Valid keys are: ${validKeys.join(',')}`);
  });

  keysToMerge.forEach(
    (keyToMerge) =>
      (originalSolution[keyToMerge] = ArrayDictUtils.mergeArraysByElementsIds(
        originalSolution[keyToMerge],
        overridingSolution[keyToMerge]
      ))
  );
};

const isInstanceViewConfigValid = (instanceView) => {
  if (instanceView?.dataSource == null) return false;

  const dataSourceType = instanceView.dataSource.type;
  const validTypes = ['azure_function', 'twingraph_dataset'];
  if (!validTypes.includes(dataSourceType)) {
    console.warn(
      `Invalid value "${dataSourceType}" for additionalData.webapp.instanceView.dataSource.type. ` +
        `Valid values are: ${validTypes.join(', ')}`
    );
    return false;
  }
  if (dataSourceType === 'twingraph_dataset') return true;
  if (instanceView.dataSource.functionUrl == null) {
    console.warn('Missing data for "additionalData.webapp.instanceView.dataSource.functionUrl" in workspace');
    return false;
  }
  if (instanceView.dataSource.functionKey == null) {
    console.warn('Missing data for "additionalData.webapp.instanceView.dataSource.functionKey" in workspace');
    return false;
  }
  return true;
};

const isDatasetManagerEnabledInWorkspace = (workspace) => {
  const datasetManagerConfig = workspace?.additionalData?.webapp?.datasetManager;
  if (datasetManagerConfig == null) return false;
  return true;
};

const isResultsDisplayEnabledInWorkspace = (workspace) => {
  const reportsConfig = workspace?.additionalData?.webapp?.charts;
  return reportsConfig != null;
};

const checkUnknownKeysInConfig = (schema, data) => {
  try {
    schema.parse(data);
  } catch (e) {
    e.issues
      .filter((issue) => issue.code === 'unrecognized_keys')
      .forEach((issue) => {
        const issueKeys = issue?.keys.join(', ');
        if (issue.path.length === 0) {
          if (data?.id?.toLowerCase().startsWith('w')) {
            console.warn(
              `Your workspace configuration contains unknown keys: '${issueKeys}', please check your configuration`
            );
          } else {
            console.warn(
              `Your solution contains unknown keys: '${issue.keys.join(', ')}', please check your configuration`
            );
          }
        } else {
          if (issue.path.includes('parameters')) {
            const parameterId = data?.parameters[issue?.path[1]]?.id;
            console.warn(
              `Parameter with id '${parameterId}' contains unknown keys: '${issueKeys}', please check your solution`
            );
          }
          if (issue.path.includes('parameterGroups')) {
            const parameterGroupId = data?.parameterGroups[issue?.path[1]]?.id;
            console.warn(
              `Parameter group with id '${parameterGroupId}' contains
              unknown keys: '${issueKeys}', please check your solution`
            );
          }
          if (issue.path.includes('runTemplates')) {
            const parameterGroupId = data?.runTemplates[issue?.path[1]]?.id;
            console.warn(
              `Run template with id '${parameterGroupId}' contains
              unknown keys: '${issueKeys}', please check your solution`
            );
          }
          if (issue.path.includes('solution')) {
            console.warn(
              `Solution section of your workspace configuration contains
              unknown keys: '${issueKeys}', please check your configuration`
            );
          }
          if (issue.path.includes('webapp')) {
            if (issue.path.includes('charts')) {
              console.warn(
                `Charts section of your workspace configuration contains
                unknown keys: '${issueKeys}', please check your configuration`
              );
            } else if (issue.path.includes('instanceView')) {
              console.warn(
                `Instance view section of your workspace configuration contains
                unknown keys: '${issueKeys}', please check your configuration`
              );
            } else {
              console.warn(
                `additionalData.webapp section of your workspace configuration contains
                unknown keys: '${issueKeys}', please check your configuration`
              );
            }
          }
        }
      });
  }
};

export const ConfigUtils = {
  isDatasetPartVarType,
  isDBParameter,
  isFileParameter,
  buildExtendedVarType,
  getConversionMethod,
  checkDeprecatedKeysInConfig,
  getParameterAttribute,
  getParametersGroupAttribute,
  patchSolution,
  isInstanceViewConfigValid,
  isDatasetManagerEnabledInWorkspace,
  isResultsDisplayEnabledInWorkspace,
  checkUnknownKeysInConfig,
};
