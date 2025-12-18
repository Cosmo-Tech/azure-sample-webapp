// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';

export const SCENARIO_EXAMPLE = {
  id: 'r-stubbedscnr00',
  name: 'Test Cypress - Stubbed scenario 0',
  description: null,
  tags: null,
  parentId: null,
  ownerId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  rootId: null,
  solutionId: 'SOL-stubbedbrwy',
  runTemplateId: 'sim_mock_parameters',
  workspaceId: 'W-stbbdbrwry',
  users: [],
  state: 'Created',
  createInfo: { timestamp: 1658135295799, userId: 'dev.sample.webapp@example.com' },
  updateInfo: { timestamp: 1658156696300, userId: 'dev.sample.webapp@example.com' },
  ownerName: 'Dave Lauper',
  solutionName: 'Demo Brewery Solution',
  runTemplateName: 'Run template with mock basic types parameters',
  datasets: {
    bases: ['D-4jwyQnmv7jx'],
    parameter: 'D-mockedParameterDataset',
    parameters: null,
  },
  lastRunInfo: { lastRunId: null, lastRunStatus: 'NotStarted' },
  parametersValues: [],
  lastRun: null,
  parentLastRun: null,
  rootLastRun: null,
  validationStatus: 'Draft',
  security: { default: ROLES.RUNNER.ADMIN, accessControlList: [] },
};

export const DEFAULT_SCENARIOS_LIST = [
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario 1',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr02',
    name: 'Test Cypress - Stubbed scenario 2',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr03',
    name: 'Test Cypress - Stubbed scenario 3',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr04',
    name: 'Test Cypress - Stubbed scenario 4',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr05',
    name: 'Test Cypress - Stubbed scenario 5',
  },
];
