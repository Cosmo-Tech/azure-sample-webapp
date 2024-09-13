// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_DATASET } from '../default';

const TWINGRAPH_DATASET = {
  ...DEFAULT_DATASET,
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
  linkedWorkspaceIdList: ['W-stbbdbrwry'],
  security: { default: 'admin', accessControlList: [] },
};

export const TWINGRAPH_DATASET_LIST = [TWINGRAPH_DATASET];
