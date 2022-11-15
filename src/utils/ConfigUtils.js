// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { TranslationUtils } from './TranslationUtils';

const _reshapeConfigDictToArray = (elementsDict) => {
  const elementsArray = [];
  for (const elementId in elementsDict) {
    const element = elementsDict[elementId];
    element.id = elementId;
    elementsArray.push(element);
  }
  return elementsArray;
};

const _addTranslationParametersGroupsLabels = (config) => {
  const parametersGroupsDict = config?.parametersGroups || {};
  TranslationUtils.addTranslationParametersGroupsLabels(_reshapeConfigDictToArray(parametersGroupsDict));
};

const _addTranslationParametersLabels = (config) => {
  const parametersDict = config?.parameters || {};
  TranslationUtils.addTranslationParametersLabels(_reshapeConfigDictToArray(parametersDict));
};

export const addTranslationLabels = (config) => {
  _addTranslationParametersGroupsLabels(config);
  _addTranslationParametersLabels(config);
};

const buildExtendedVarType = (varType, extension) => {
  if (varType) {
    if (extension) {
      return varType + '-' + extension;
    }
    return varType;
  }
  return undefined;
};

function getConversionMethod(param, subType, functionArray) {
  const varType = param?.varType;
  if (functionArray) {
    const extendedVarType = ConfigUtils.buildExtendedVarType(varType, subType);
    if (extendedVarType in functionArray) {
      return functionArray[extendedVarType];
    } else if (varType in functionArray) {
      return functionArray[varType];
    }
  }
  console.warn(
    `No conversion function (to/from string) defined for varType "${varType} or subType ${subType} in ${functionArray}"`
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
    'subType',
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
  const knownAttributesNames = ['authorizedRoles', 'hideParameterGroupIfNoPermission'];
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

export const ConfigUtils = {
  addTranslationLabels,
  buildExtendedVarType,
  getConversionMethod,
  checkDeprecatedKeysInConfig,
  getParameterAttribute,
  getParametersGroupAttribute,
};
