// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ROLES } from '../../../commons/constants/generic/TestConstants';

const defaultPowerBIReport = {
  title: { en: 'Scenario dashboard', fr: 'Rapport du scénario' },
  reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
  settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
  staticFilters: [{ table: 'Bar', column: 'Bar', values: ['MyBar', 'MyBar2'] }],
  dynamicFilters: [
    { table: 'StockProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
    { table: 'Bar', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'contains_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'arc_to_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'parameters', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'CustomerSatisfactionProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
  ],
  pageName: { en: 'ReportSection', fr: 'ReportSection' },
};

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
  webApp: {
    url: null,
    iframes: null,
    options: {
      charts: {
        workspaceId: '290de699-9026-42c0-8c83-e4e87c3f22dd',
        logInWithUserCredentials: false,
        scenarioViewIframeDisplayRatio: 1580 / 350,
        dashboardsViewIframeDisplayRatio: 1280 / 795,
        dashboardsView: [defaultPowerBIReport],
        scenarioView: [defaultPowerBIReport],
      },
    },
  },
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
