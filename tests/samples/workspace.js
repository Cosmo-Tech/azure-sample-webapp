// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { USERS_EMAIL_LIST } from './users';
import { WORKSPACE_EXAMPLE } from '../../cypress/fixtures/stubbing/default';

export const WORKSPACEDATA_WITHOUT_USERS = {
  ...WORKSPACE_EXAMPLE,
};

export const WORKSPACEDATA_WITH_USERS = {
  ...WORKSPACEDATA_WITHOUT_USERS,
  users: [...USERS_EMAIL_LIST],
};
