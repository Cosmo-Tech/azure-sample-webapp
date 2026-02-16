// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_WORKSPACE } from '../default';

export const WORKSPACE_WITHOUT_DASHBOARDS = {
  ...DEFAULT_WORKSPACE,
  id: 'w-stbwrknodsh',
  key: 'breweryNoDashboards',
  additionalData: { webapp: null },
};

export const WORKSPACE_LIST_WITHOUT_DASHBOARDS = [WORKSPACE_WITHOUT_DASHBOARDS];
