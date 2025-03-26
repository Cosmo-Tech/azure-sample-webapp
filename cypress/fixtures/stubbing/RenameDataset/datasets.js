// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { WORKSPACE } from '../DatasetManager/workspaces';
import { DEFAULT_DATASET } from '../default';

export const NON_EDITABLE_DATASET = {
  ...DEFAULT_DATASET,
  main: true,
  id: 'd-noneditable',
  name: 'non editable dataset',
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
  linkedWorkspaceIdList: [WORKSPACE.id],
  security: { default: 'viewer', accessControlList: [] },
};

export const EDITABLE_DATASET = {
  ...DEFAULT_DATASET,
  main: true,
  id: 'd-editable',
  name: 'editable dataset',
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
  linkedWorkspaceIdList: [WORKSPACE.id],
  security: { default: 'editor', accessControlList: [] },
};
