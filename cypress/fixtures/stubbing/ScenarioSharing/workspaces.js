// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { WORKSPACE_EXAMPLE, USERS_LIST } from '../default';
import { ROLES } from '../../../commons/constants/generic/TestConstants';

export const WORKSPACE_NO_USERS_ = {
  ...WORKSPACE_EXAMPLE,
  id: 'W-stbbdbwry0',
  key: 'DemoBreweryNoUsers',
  security: {
    default: ROLES.SCENARIO.VIEWER,
    accessControlList: [],
  },
};

export const WORKSPACE_NO_USERS = {
  ...WORKSPACE_EXAMPLE,
  id: 'W-stbbdbwry0',
  key: 'DemoBreweryNoUsers',
  security: {
    default: ROLES.SCENARIO.VIEWER,
    accessControlList: [],
  },
};

const usersAccess = [
  { id: USERS_LIST[0].email, role: ROLES.SCENARIO.ADMIN },
  { id: USERS_LIST[1].email, role: ROLES.SCENARIO.VIEWER },
  { id: USERS_LIST[2].email, role: ROLES.SCENARIO.VIEWER },
  { id: USERS_LIST[3].email, role: ROLES.SCENARIO.VIEWER },
];
export const WORKSPACE_WITH_USERS_LIST = {
  ...WORKSPACE_EXAMPLE,
  id: 'W-stbbdbwsx1',
  key: 'DemoBreweryNoUsers',
  security: {
    default: ROLES.SCENARIO.VIEWER,
    accessControlList: usersAccess,
  },
};

export const WORKSPACES_LIST = [WORKSPACE_NO_USERS, WORKSPACE_WITH_USERS_LIST];
