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

const getParameterSubType = (parameterId, configParameters) => {
  return configParameters?.[parameterId]?.subType;
};

export const ConfigUtils = {
  addTranslationLabels,
  buildExtendedVarType,
  getConversionMethod,
  getParameterSubType,
};
