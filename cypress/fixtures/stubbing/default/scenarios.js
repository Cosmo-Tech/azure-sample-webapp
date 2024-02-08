// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';

export const SCENARIO_EXAMPLE = {
  id: 's-stubbedscnr00',
  name: 'Test Cypress - Stubbed scenario 0',
  description: null,
  tags: null,
  parentId: null,
  ownerId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  rootId: null,
  solutionId: 'SOL-stubbedbrwy',
  runTemplateId: '3',
  workspaceId: 'W-stbbdbrwry',
  users: [],
  state: 'Created',
  creationDate: '2022-07-18T09:08:15.799925651Z',
  lastUpdate: '2022-07-18T15:04:56.300177203Z',
  ownerName: 'Dave Lauper',
  solutionName: 'Demo Brewery Solution',
  runTemplateName: 'Run template with mock basic types parameters',
  datasetList: ['D-4jwyQnmv7jx'],
  parametersValues: [],
  lastRun: null,
  parentLastRun: null,
  rootLastRun: null,
  validationStatus: 'Draft',
  security: { default: ROLES.SCENARIO.ADMIN, accessControlList: [] },
};

export const DEFAULT_SCENARIOS_LIST = [
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario 1',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr02',
    name: 'Test Cypress - Stubbed scenario 2',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr03',
    name: 'Test Cypress - Stubbed scenario 3',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr04',
    name: 'Test Cypress - Stubbed scenario 4',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr05',
    name: 'Test Cypress - Stubbed scenario 5',
  },
];
