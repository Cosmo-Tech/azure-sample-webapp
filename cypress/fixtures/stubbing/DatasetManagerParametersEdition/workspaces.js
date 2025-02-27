// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_WORKSPACE } from '../default';

export const WORKSPACE = {
  ...DEFAULT_WORKSPACE,
  security: {
    default: ROLES.RUNNER.ADMIN,
    accessControlList: [],
  },
  webApp: {
    options: {
      datasetManager: {
        subdatasourceFilter: [],
      },
    },
  },
};
