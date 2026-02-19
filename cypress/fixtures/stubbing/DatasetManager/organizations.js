// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_ORGANIZATION } from '../default';

// FIXME: since v5, dataset creation no longer requires the CREATE_CHILDREN permission at the organization level
// (datasets are now children of a Workspace). The different organizations below should no longer be necessary in
// cypress tests
export const ORGANIZATION_WITH_DEFAULT_ROLE_USER = {
  ...DEFAULT_ORGANIZATION,
  security: { default: 'user', accessControlList: [] },
};

export const ORGANIZATION_WITH_DEFAULT_ROLE_VIEWER = {
  ...DEFAULT_ORGANIZATION,
  security: { default: 'viewer', accessControlList: [] },
};
