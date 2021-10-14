// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_VAR_TYPES_FROM_STRING_FUNCTIONS } from './generic/ConversionFromString';
import { CUSTOM_VAR_TYPES_FROM_STRING_FUNCTIONS } from './custom/ConversionFromString';

export const VAR_TYPES_FROM_STRING_FUNCTIONS = {
  ...GENERIC_VAR_TYPES_FROM_STRING_FUNCTIONS,
  ...CUSTOM_VAR_TYPES_FROM_STRING_FUNCTIONS
};
