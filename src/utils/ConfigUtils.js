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

export const ConfigUtils = {
  addTranslationLabels
};
