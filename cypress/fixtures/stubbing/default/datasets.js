// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_ORGANIZATION } from './organizations';
import { USER_EXAMPLE } from './users';
import { DEFAULT_WORKSPACE, DEFAULT_WORKSPACE_DATASET_ID } from './workspaces';

export const DEFAULT_DATASET = {
  additionalData: { webapp: { ownerName: USER_EXAMPLE.name } },
  createInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  description: 'Default stubbed dataset',
  id: 'd-stbdefault',
  name: 'Default stubbed dataset',
  organizationId: DEFAULT_ORGANIZATION.id,
  parts: [],
  security: { default: ROLES.RUNNER.ADMIN, accessControlList: [] },
  tags: [],
  updateInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  workspaceId: DEFAULT_WORKSPACE.id,
};

export const MAIN_DATASET = {
  ...DEFAULT_DATASET,
  id: 'd-stbdMainDataset',
  additionalData: {
    webapp: { ownerName: USER_EXAMPLE.name, visible: { datasetManager: true, scenarioCreation: true } },
  },
};

export const DEFAULT_RUNNER_BASE_DATASET = {
  ...DEFAULT_DATASET,
  id: 'd-stbdBaseDataset',
  name: 'Runner base dataset',
};
export const DEFAULT_RUNNER_PARAMETER_DATASET = {
  ...DEFAULT_DATASET,
  id: 'd-stbdParameterDataset',
  name: 'Runner parameter dataset',
};

export const DEFAULT_WORKSPACE_DATASET = {
  ...DEFAULT_DATASET,
  id: DEFAULT_WORKSPACE_DATASET_ID,
  name: 'Workspace dataset',
  description: 'Dataset attached to the workspace to set default values of dataset part parameters',
};

export const DEFAULT_DATASETS = [DEFAULT_DATASET, MAIN_DATASET, DEFAULT_RUNNER_BASE_DATASET];
