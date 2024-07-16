// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { WORKSPACE_EXAMPLE } from '../default';

export const WORKSPACE_WITHOUT_DASHBOARDS = {
  ...WORKSPACE_EXAMPLE,
  id: 'w-stbwrknodsh',
  key: 'breweryNoDashboards',
  webApp: {
    url: null,
    iframes: null,
    options: null,
  },
};

export const WORKSPACE_LIST_WITHOUT_DASHBOARDS = [WORKSPACE_EXAMPLE, WORKSPACE_WITHOUT_DASHBOARDS];
