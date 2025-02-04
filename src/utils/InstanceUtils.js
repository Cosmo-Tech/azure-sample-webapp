// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const mergeArrays = (array1, array2) => Array.from(new Set(array1.concat(array2)));

const _mergeGraphItemAttributesConfigurationForElementType = (instanceViewConfig, twingraphItemsKeys, elementType) => {
  const keys = twingraphItemsKeys?.[elementType] ?? {};
  const config = instanceViewConfig?.dataContent?.[elementType] ?? {};
  Object.entries(config).forEach(([entityType, entityOptions]) => {
    if (entityOptions.attributesOrder != null && Array.isArray(entityOptions.attributesOrder))
      keys[entityType] = mergeArrays(entityOptions.attributesOrder, keys[entityType]);
  });
  return keys;
};

const mergeGraphItemAttributesConfiguration = (instanceViewConfig, twingraphItemsKeys) => {
  return {
    nodes: _mergeGraphItemAttributesConfigurationForElementType(instanceViewConfig, twingraphItemsKeys, 'nodes'),
    edges: _mergeGraphItemAttributesConfigurationForElementType(instanceViewConfig, twingraphItemsKeys, 'edges'),
  };
};

export const InstanceUtils = {
  mergeGraphItemAttributesConfiguration,
};
