// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_WORKSPACE } from '../../cypress/fixtures/stubbing/default';
import { USERS_EMAIL_LIST } from './users';

export const WORKSPACEDATA_WITHOUT_USERS = {
  ...DEFAULT_WORKSPACE,
};

export const WORKSPACEDATA_WITH_USERS = {
  ...WORKSPACEDATA_WITHOUT_USERS,
  users: [...USERS_EMAIL_LIST],
};
