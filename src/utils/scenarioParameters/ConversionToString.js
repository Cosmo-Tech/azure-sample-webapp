// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { CUSTOM_VAR_TYPES_TO_STRING_FUNCTIONS } from './custom/ConversionToString';
import { GENERIC_VAR_TYPES_TO_STRING_FUNCTIONS } from './generic/ConversionToString';

export const VAR_TYPES_TO_STRING_FUNCTIONS = {
  ...GENERIC_VAR_TYPES_TO_STRING_FUNCTIONS,
  ...CUSTOM_VAR_TYPES_TO_STRING_FUNCTIONS,
};
