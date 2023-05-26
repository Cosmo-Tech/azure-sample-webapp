// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ArrayDictUtils } from './ArrayDictUtils';

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
    'connectorId',
    'dataCy',
    'dateFormat',
    'defaultFileTypeFilter',
    'description',
    'enumValues',
    'hasHeader',
    'subType',
  ];
  keysToCheck.forEach((keyToCheck) => {
    if (parameter[keyToCheck] !== undefined) {
      if (keyToCheck === 'dataCy') {
        console.warn(
          'The "parameter.dataCy" key in the scenario parameters configuration is now deprecated, "data-cy" ' +
            'metadata are now automatically generated based on the factory type and the parameter id.'
        );
      } else {
        console.warn(
          `The "parameter.${keyToCheck}" key in the scenario parameters configuration is now deprecated. Please ` +
            `use "parameter.options.${keyToCheck}" key instead.`
        );
      }
    }
  });
};

const getParameterAttribute = (parameter, attributeName) => {
  const knownAttributesNames = [
    'columns',
    'connectorId',
    'dateFormat',
    'defaultFileTypeFilter',
    'description',
    'enumValues',
    'hasHeader',
    'hidden',
    'subType',
    'canChangeRowsNumber',
  ];
  if (!knownAttributesNames.includes(attributeName)) {
    console.warn(`The attribute "${attributeName}" is not a known attribute in the scenario parameters configuration.`);
    return undefined;
  }

  // DEPRECATED: support for previous configuration path parameter.[attributeName] is deprecated and will be dropped in
  // a future version
  return parameter?.options?.[attributeName] ?? parameter?.[attributeName];
};

const getParametersGroupAttribute = (parametersGroup, attributeName) => {
  const knownAttributesNames = ['authorizedRoles', 'hideParameterGroupIfNoPermission', 'hidden'];
  if (!knownAttributesNames.includes(attributeName)) {
    console.warn(
      `The attribute "${attributeName}" is not a known attribute in the scenario parameters groups configuration.`
    );
    return undefined;
  }

  // DEPRECATED: support for previous configuration path parametersGroup.[attributeName] is deprecated and will be
  // dropped in a future version
  return parametersGroup?.options?.[attributeName] ?? parametersGroup?.[attributeName];
};

const _checkDeprecatedKeysInParametersGroupConfig = (parametersGroup) => {
  const keysToCheck = ['authorizedRoles', 'hideParameterGroupIfNoPermission'];
  keysToCheck.forEach((keyToCheck) => {
    if (parametersGroup[keyToCheck] !== undefined) {
      console.warn(
        `The "parametersGroup.${keyToCheck}" key in the scenario parameters group configuration is now deprecated. ` +
          `Please use "parametersGroup.options.${keyToCheck}" key instead.`
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
  if (instanceView.dataSource.functionUrl == null) {
    console.warn('Missing data for "webApp.options.instanceView.dataSource.functionUrl" in workspace');
    return false;
  }
  if (instanceView.dataSource.functionKey == null) {
    console.warn('Missing data for "webApp.options.instanceView.dataSource.functionKey" in workspace');
    return false;
  }
  return true;
};

export const ConfigUtils = {
  buildExtendedVarType,
  getConversionMethod,
  checkDeprecatedKeysInConfig,
  getParameterAttribute,
  getParametersGroupAttribute,
  patchSolution,
  isInstanceViewConfigValid,
};
