// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import merge from 'deepmerge';

// Merge 2 arrays of elements based on their ids. If two elements with the same id have the same property, the property
// value of the element in the merged array will be the property value from array2
const mergeArraysByElementsIds = (array1, array2) => {
  if (array1 == null) return array2 ?? [];
  if (array2 == null) return array1;

  array2.forEach((el2) => {
    const indexToPatch = array1.findIndex((el1) => el1?.id === el2?.id);
    if (el2 != null && indexToPatch !== -1) array1[indexToPatch] = merge(array1[indexToPatch], el2);
    else array1.push(el2);
  });

  return array1;
};

const reshapeConfigArrayToDictById = (elementsArray) => {
  const elementsDict = {};
  (elementsArray ?? []).forEach((element) => (elementsDict[element.id] = element));
  return elementsDict;
};

const reshapeDictToArrayById = (elementsDict) => {
  const elementsArray = [];
  Object.entries(elementsDict ?? {}).forEach(([elementId, element]) => {
    element.id = elementId;
    elementsArray.push(element);
  });
  return elementsArray;
};

const removeUndefinedValuesFromDict = (values) => {
  if (!values) return;
  Object.keys(values).forEach((field) => {
    if (values[field] === undefined) delete values[field];
    else if (typeof values[field] === 'object') {
      removeUndefinedValuesFromDict(values[field]);
    }
  });
};

export const ArrayDictUtils = {
  mergeArraysByElementsIds,
  removeUndefinedValuesFromDict,
  reshapeConfigArrayToDictById,
  reshapeDictToArrayById,
};
