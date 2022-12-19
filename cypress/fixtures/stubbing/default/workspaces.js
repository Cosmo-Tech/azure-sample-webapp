// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ROLES } from '../../../commons/constants/generic/TestConstants';

export const WORKSPACE_EXAMPLE = {
  key: 'DemoBrewery',
  name: 'Stubbed Demo Brewery Workspace',
  solution: {
    solutionId: 'SOL-stubbedbrwy',
    runTemplateFilter: ['1', '2', '3'],
    defaultRunTemplateDataset: null,
  },
  id: 'W-stbbdbrwry',
  description: 'Stubbed workspace for Brewery Demo',
  version: null,
  tags: null,
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  users: null,
  webApp: { url: null, iframes: null, options: {} },
  sendInputToDataWarehouse: true,
  useDedicatedEventHubNamespace: true,
  sendScenarioMetadataToEventHub: true,
  security: { default: ROLES.SCENARIO.ADMIN, accessControlList: [] },
};

export const DEFAULT_WORKSPACE = WORKSPACE_EXAMPLE;
export const DEFAULT_WORKSPACES_LIST = [DEFAULT_WORKSPACE];

export const EXTENTED_WORKSPACES_LIST = [];
for (let i = 0; i < 5; ++i) {
  EXTENTED_WORKSPACES_LIST.push({
    ...DEFAULT_WORKSPACE,
    key: `StubbedWorkspace${i}`,
    name: `Sample Stubbed Workspace ${i}`,
    id: `W-splstbbdws${i}`,
    description: `Stubbed workspace ${i} for test`,
  });
}
