// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  DEFAULT_APPLICATION,
  DEFAULT_ORGANIZATION_DATA,
  DEFAULT_SCENARIOS_LIST_DATA,
  DEFAULT_SOLUTION_DATA,
  DEFAULT_DATASETS_LIST_DATA,
  SCENARIODATA_WITH_USERS,
  WORKSPACEDATA_WITH_USERS,
  USER_AUTH_ADMIN,
} from '.';

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
