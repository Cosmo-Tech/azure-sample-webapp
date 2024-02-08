// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_DATASETS_LIST } from './datasets';

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
      // Note: "datasetManager" and "instanceView" intentionally left undefined
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
  linkedDatasetIdList: DEFAULT_DATASETS_LIST.map((dataset) => dataset.id),
};

export const DEFAULT_WORKSPACE = WORKSPACE_EXAMPLE;
export const DEFAULT_WORKSPACES_LIST = [DEFAULT_WORKSPACE];

const workspaceCopy = JSON.parse(JSON.stringify(DEFAULT_WORKSPACE));
workspaceCopy.webApp.options.instanceView = {
  dataSource: {
    type: 'adt',
    functionUrl: 'dummy_function_url',
    functionKey: 'dummy_function_key',
  },
  dataContent: {},
};
export const WORKSPACE_WITH_INSTANCE_VIEW = workspaceCopy;

export const EXTENDED_WORKSPACES_LIST = [];
for (let i = 0; i < 5; ++i) {
  EXTENDED_WORKSPACES_LIST.push({
    ...WORKSPACE_WITH_INSTANCE_VIEW,
    key: `StubbedWorkspace${i}`,
    name: `Sample Stubbed Workspace ${i}`,
    id: `W-splstbbdws${i}`,
    description: `Stubbed workspace ${i} for test`,
  });
}
