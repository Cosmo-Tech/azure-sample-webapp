// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

function addFormattedOption (dataObject, maxCharLength, separator, depth, formattedList) {
  const option = { ...dataObject };
  option.fullName = dataObject.name;
  const subStringLength = maxCharLength / 2;
  option.id = dataObject.id;
  (maxCharLength === -1 || dataObject.name.length <= maxCharLength)
    ? option.name = dataObject.name
    : option.name = dataObject.name.substring(0, subStringLength) + separator + dataObject.name.substring(dataObject.name.length - subStringLength);
  option.depth = depth;
  formattedList.push(option);
}

function findDepthValue (dataList, currentObject, depth) {
  if (currentObject !== undefined) {
    if (currentObject.parentId !== null) {
      const parent = dataList.find(element => element.id === currentObject.parentId);
      return findDepthValue(dataList, parent, depth + 1);
    }
  }
  return depth;
}

export const getFormattedOptionsList = (formattedList, dataList, depth, separator, maxCharLength) => {
  if (dataList !== undefined && dataList.length > 0) {
    for (const dataObject of dataList) {
      const depth = findDepthValue(dataList, dataObject, 0);
      addFormattedOption(dataObject, maxCharLength, separator, depth, formattedList);
    }
  }
};
