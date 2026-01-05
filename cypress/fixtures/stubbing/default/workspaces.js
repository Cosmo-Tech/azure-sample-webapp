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
    { table: 'StockProbe', column: 'SimulationRun', values: 'lastRunId' },
    { table: 'Bar', column: 'simulationrun', values: 'lastRunId' },
    { table: 'contains_Customer', column: 'simulationrun', values: 'lastRunId' },
    { table: 'arc_to_Customer', column: 'simulationrun', values: 'lastRunId' },
    { table: 'parameters', column: 'simulationrun', values: 'lastRunId' },
    { table: 'CustomerSatisfactionProbe', column: 'SimulationRun', values: 'lastRunId' },
  ],
  pageName: { en: 'ReportSection', fr: 'ReportSection' },
};

export const WORKSPACE_EXAMPLE = {
  key: 'DemoBrewery',
  name: 'Stubbed Demo Brewery Workspace',
  solution: {
    solutionId: 'SOL-stubbedbrwy',
  },
  id: 'W-stbbdbrwry',
  description: 'Stubbed workspace for Brewery Demo',
  version: null,
  tags: null,
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  users: null,
  additionalData: {
    webapp: {
      solution: {
        runTemplateFilter: ['sim_brewery_parameters', 'sim_no_parameters', 'sim_mock_parameters'],
        defaultRunTemplateDataset: {
          sim_brewery_parameters: 'd-kjg7drjjm48p',
          sim_no_parameters: 'd-8q7mwq1q17v7',
          sim_mock_parameters: 'd-63mkreqmqg0',
        },
      },
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
  security: { default: ROLES.RUNNER.ADMIN, accessControlList: [] },
  linkedDatasetIdList: DEFAULT_DATASETS_LIST.map((dataset) => dataset.id),
};

export const DEFAULT_WORKSPACE = WORKSPACE_EXAMPLE;
export const DEFAULT_WORKSPACES_LIST = [DEFAULT_WORKSPACE];

const workspaceCopy = JSON.parse(JSON.stringify(DEFAULT_WORKSPACE));
workspaceCopy.additionalData.webapp.instanceView = {
  dataSource: {
    type: 'twingraph_dataset',
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
