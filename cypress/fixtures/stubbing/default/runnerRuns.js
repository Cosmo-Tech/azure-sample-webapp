// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_ORGANIZATION } from './organizations';
import { USER_EXAMPLE } from './users';
import { DEFAULT_WORKSPACE } from './workspaces';

export const DEFAULT_RUNNER_RUN = {
  id: 'run-stbdrnrrun01',
  computeSize: null,
  containers: null,
  createInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  csmSimulationRun: 'run-90r9j4k503jen',
  datasetList: [],
  generateName: 'run-90r9j4k503jen-',
  nodeLabel: 'basicpool',
  organizationId: DEFAULT_ORGANIZATION.id,
  parametersValues: [],
  runTemplateId: 'standalone',
  runnerId: 'r-stubbedscnr01',
  solutionId: 'sol-414m4e1q72em8',
  state: 'Successful',
  workflowId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  workflowName: 'run-xxxxxxxxxxxxx-xxxxx',
  workspaceId: DEFAULT_WORKSPACE.id,
  workspaceKey: null,
};

export const DEFAULT_RUNNER_RUNS = [DEFAULT_RUNNER_RUN];
