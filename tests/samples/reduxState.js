// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_APPLICATION } from './application';
import { USER_AUTH_ADMIN } from './auth';
import { DEFAULT_DATASETS_LIST_DATA } from './datasets';
import { DEFAULT_ORGANIZATION_DATA } from './organizations';
import { SCENARIODATA_WITH_USERS, DEFAULT_SCENARIOS_LIST_DATA } from './scenarios';
import { DEFAULT_SOLUTION_DATA } from './solution';
import { WORKSPACEDATA_WITH_USERS } from './workspace';

export const DEFAULT_REDUX_STATE = {
  application: DEFAULT_APPLICATION,
  auth: USER_AUTH_ADMIN,
  organization: {
    current: {
      data: DEFAULT_ORGANIZATION_DATA,
    },
  },
  solution: {
    current: {
      data: DEFAULT_SOLUTION_DATA,
    },
  },
  workspace: {
    current: {
      data: WORKSPACEDATA_WITH_USERS,
    },
  },
  scenario: {
    current: {
      data: SCENARIODATA_WITH_USERS,
    },
    list: {
      data: DEFAULT_SCENARIOS_LIST_DATA,
    },
  },
  dataset: {
    list: {
      data: DEFAULT_DATASETS_LIST_DATA,
    },
  },
};
