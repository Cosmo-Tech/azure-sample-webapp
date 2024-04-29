// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_ORGANIZATION } from '../default';

export const ORGANIZATION_WITH_DEFAULT_ROLE_USER = {
  ...DEFAULT_ORGANIZATION,
  security: { default: 'user', accessControlList: [] },
};

export const ORGANIZATION_WITH_DEFAULT_ROLE_VIEWER = {
  ...DEFAULT_ORGANIZATION,
  security: { default: 'viewer', accessControlList: [] },
};
