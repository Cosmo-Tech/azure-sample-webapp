// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_VAR_TYPES_DEFAULT_VALUES } from './generic/DefaultValues';
import { CUSTOM_VAR_TYPES_DEFAULT_VALUES } from './custom/DefaultValues';

export const VAR_TYPES_DEFAULT_VALUES = {
  ...GENERIC_VAR_TYPES_DEFAULT_VALUES,
  ...CUSTOM_VAR_TYPES_DEFAULT_VALUES
};
