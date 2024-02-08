// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { CUSTOM_VAR_TYPES_COMPONENTS_MAPPING } from './custom/VarTypesComponentsMapping';
import { GENERIC_VAR_TYPES_COMPONENTS_MAPPING } from './generic/VarTypesComponentsMapping';

export const VAR_TYPES_COMPONENTS_MAPPING = {
  ...GENERIC_VAR_TYPES_COMPONENTS_MAPPING,
  ...CUSTOM_VAR_TYPES_COMPONENTS_MAPPING,
};
