// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

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
  webApp: { url: null, iframes: null, options: null },
  sendInputToDataWarehouse: true,
  useDedicatedEventHubNamespace: true,
  sendScenarioMetadataToEventHub: true,
  security: { default: 'admin', accessControlList: [] },
};

export const DEFAULT_WORKSPACE = WORKSPACE_EXAMPLE;
export const DEFAULT_WORKSPACES_LIST = [DEFAULT_WORKSPACE];
