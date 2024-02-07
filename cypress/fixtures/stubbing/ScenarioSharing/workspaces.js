// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { WORKSPACE_EXAMPLE, USERS_LIST } from '../default';

export const WORKSPACE_NO_USERS = {
  ...WORKSPACE_EXAMPLE,
  key: 'DemoBreweryNoUsers',
  security: {
    default: 'none',
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
  key: 'DemoBreweryWithUsers',
  security: {
    default: 'none',
    accessControlList: usersAccess,
  },
};
