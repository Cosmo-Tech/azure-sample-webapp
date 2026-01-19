// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_DATASET } from '../default';

const TWINGRAPH_DATASET = {
  ...DEFAULT_DATASET,
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
  linkedWorkspaceIdList: ['W-stbbdbrwry'],
  security: { default: 'admin', accessControlList: [] },
  parts: [
    {
      id: 'dp-customers',
      name: 'customers',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwry',
      datasetId: 'D-stbdefault',
    },
  ],
};

export const TWINGRAPH_DATASET_LIST = [TWINGRAPH_DATASET];
