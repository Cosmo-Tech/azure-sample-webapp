
// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getFormattedOptionsList = (optionsList, nodesList, depth, separator, maxCharLength) => {
  for (const node of nodesList) {
    const option = { ...node };
    option.fullName = node.name;
    const subStringLenght = maxCharLength / 2;
    (maxCharLength === -1 || node.name.length <= maxCharLength)
      ? option.optionLabel = node.name
      : option.optionLabel = node.name.substring(0, subStringLenght) + separator + node.name.substring(node.name.length - subStringLenght);
    option.depth = depth;
    optionsList.push(option);
    if (node.children.length > 0) {
      getFormattedOptionsList(optionsList, node.children, depth + 1, separator, maxCharLength);
    }
  }
};
