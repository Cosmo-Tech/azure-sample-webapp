// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_ORGANIZATION } from './organizations';
import { DEFAULT_SOLUTION } from './solutions';
import { USER_EXAMPLE } from './users';

const defaultPowerBIReport = {
  title: { en: 'Scenario dashboard', fr: 'Rapport du scénario' },
  reportId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
  staticFilters: [{ table: 'Bar', column: 'Bar', values: ['MyBar', 'MyBar2'] }],
  dynamicFilters: [{ table: 'StockProbe', column: 'SimulationRun', values: 'lastRunId' }],
  pageName: { en: 'ReportSection', fr: 'ReportSection' },
};
export const DEFAULT_WORKSPACE_DATASET_ID = 'd-stbdWorkspaceDataset';
export const DEFAULT_WORKSPACE = {
  id: 'W-stbbdbrwry',
  organizationId: DEFAULT_ORGANIZATION.id,
  key: 'DemoBrewery',
  name: 'Stubbed Demo Brewery Workspace',
  createInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  updateInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  solution: {
    solutionId: DEFAULT_SOLUTION.id,
    datasetId: DEFAULT_WORKSPACE_DATASET_ID,
    defaultParameterValues: {},
  },
  security: { default: ROLES.RUNNER.ADMIN, accessControlList: [] },
  description: 'Stubbed workspace for Brewery Demo',
  version: null,
  tags: null,
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
        workspaceId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        logInWithUserCredentials: false,
        scenarioViewIframeDisplayRatio: 1580 / 350,
        dashboardsViewIframeDisplayRatio: 1280 / 795,
        dashboardsView: [defaultPowerBIReport],
        scenarioView: [defaultPowerBIReport],
      },
    },
  },
  datasetCopy: false,
};

export const DEFAULT_WORKSPACES = [DEFAULT_WORKSPACE];

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
