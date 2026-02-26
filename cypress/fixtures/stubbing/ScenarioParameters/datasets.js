// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_RUNNER_BASE_DATASET } from '../default';

const DATASET_WITH_DB_PART = {
  ...DEFAULT_RUNNER_BASE_DATASET,
  security: { default: 'admin', accessControlList: [] },
  parts: [
    {
      id: 'dp-customers',
      name: 'customers',
      type: 'DB',
      organizationId: DEFAULT_RUNNER_BASE_DATASET.organizationId,
      workspaceId: DEFAULT_RUNNER_BASE_DATASET.workspaceId,
      datasetId: DEFAULT_RUNNER_BASE_DATASET.id,
    },
  ],
};

export const DATASETS = [DATASET_WITH_DB_PART];
