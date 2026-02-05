// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_RUNNER_BASE_DATASET, DEFAULT_RUNNER_PARAMETER_DATASET } from './datasets';
import { DEFAULT_ORGANIZATION } from './organizations';
import { ETL_RUN_TEMPLATE, NO_PARAMETERS_RUN_TEMPLATE } from './runTemplates';
import { DEFAULT_SOLUTION } from './solutions';
import { USER_EXAMPLE } from './users';
import { DEFAULT_WORKSPACE } from './workspaces';

export const DEFAULT_SIMULATION_RUNNER = {
  id: 'r-stubbedrnr00',
  name: 'Cypress - Stubbed runner 0',
  createInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  updateInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  solutionId: DEFAULT_SOLUTION.id,
  runTemplateId: NO_PARAMETERS_RUN_TEMPLATE.id,
  organizationId: DEFAULT_ORGANIZATION.id,
  workspaceId: DEFAULT_WORKSPACE.id,
  datasets: {
    bases: [DEFAULT_RUNNER_BASE_DATASET.id],
    parameter: DEFAULT_RUNNER_PARAMETER_DATASET.id,
    parameters: [],
  },
  parametersValues: [],
  lastRunInfo: { lastRunId: null, lastRunStatus: 'NotStarted' },
  validationStatus: 'Draft',
  security: { default: ROLES.RUNNER.ADMIN, accessControlList: [] },
  description: null,
  tags: null,
  parentId: null,
  rootId: null,
  solutionName: DEFAULT_SOLUTION.name,
  runTemplateName: NO_PARAMETERS_RUN_TEMPLATE.name,
  additionalData: { webapp: { ownerName: USER_EXAMPLE.name } },
  runSizing: null,
};

export const DEFAULT_ETL_RUNNER = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-stubbedetlrnr99',
  name: 'Cypress - Stubbed ETL runner 0',
  runTemplateId: ETL_RUN_TEMPLATE.id,
  runTemplateName: ETL_RUN_TEMPLATE.name,
};

export const DEFAULT_RUNNERS = [
  DEFAULT_ETL_RUNNER,
  DEFAULT_SIMULATION_RUNNER,
  { ...DEFAULT_SIMULATION_RUNNER, id: 'r-stubbedscnr01', name: 'Test Cypress - Stubbed scenario 1' },
  { ...DEFAULT_SIMULATION_RUNNER, id: 'r-stubbedscnr02', name: 'Test Cypress - Stubbed scenario 2' },
  { ...DEFAULT_SIMULATION_RUNNER, id: 'r-stubbedscnr03', name: 'Test Cypress - Stubbed scenario 3' },
  { ...DEFAULT_SIMULATION_RUNNER, id: 'r-stubbedscnr04', name: 'Test Cypress - Stubbed scenario 4' },
  { ...DEFAULT_SIMULATION_RUNNER, id: 'r-stubbedscnr05', name: 'Test Cypress - Stubbed scenario 5' },
];
