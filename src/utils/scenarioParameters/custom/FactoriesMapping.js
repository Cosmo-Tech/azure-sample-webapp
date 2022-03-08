// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ADTConnectedIntegerInputFactory } from '../factories/ADTConnectedFactories/ADTConnectedIntegerInputFactory';

// You can define here the input components factories mapping for the custom varTypes of your solution
// See ../generic/FactoriesMapping.js for some examples
export const CUSTOM_VAR_TYPES_FACTORIES_MAPPING = {
  // myVarType: myInputFactory
  'int-ADT-connected': ADTConnectedIntegerInputFactory,
};
