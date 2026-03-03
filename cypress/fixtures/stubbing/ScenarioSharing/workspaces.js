// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_WORKSPACE, USERS_LIST } from '../default';

export const WORKSPACE_NO_USERS = {
  ...DEFAULT_WORKSPACE,
  key: 'DemoBreweryNoUsers',
  security: {
    default: 'none',
    accessControlList: [],
  },
};

const usersAccess = [
  { id: USERS_LIST[0].email, role: ROLES.RUNNER.ADMIN },
  { id: USERS_LIST[1].email, role: ROLES.RUNNER.VIEWER },
  { id: USERS_LIST[2].email, role: ROLES.RUNNER.VIEWER },
  { id: USERS_LIST[3].email, role: ROLES.RUNNER.VIEWER },
];
export const WORKSPACE_WITH_USERS_LIST = {
  ...DEFAULT_WORKSPACE,
  key: 'DemoBreweryWithUsers',
  security: {
    default: 'none',
    accessControlList: usersAccess,
  },
};
