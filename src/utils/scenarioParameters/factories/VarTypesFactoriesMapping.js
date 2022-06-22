// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_VAR_TYPES_FACTORIES_MAPPING } from '../generic/FactoriesMapping';
import { CUSTOM_VAR_TYPES_FACTORIES_MAPPING } from '../custom/FactoriesMapping';

export const VAR_TYPES_FACTORIES_MAPPING = {
  ...GENERIC_VAR_TYPES_FACTORIES_MAPPING,
  ...CUSTOM_VAR_TYPES_FACTORIES_MAPPING,
};
