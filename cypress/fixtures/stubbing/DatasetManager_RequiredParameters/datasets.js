// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_RUNNER_BASE_DATASET } from '../default';

export const REQUIRED_PARAMETERS_PARENT_DATASET = {
  ...DEFAULT_RUNNER_BASE_DATASET,
  id: 'd-requiredParametersParent',
  name: 'Required parameters parent dataset',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  parts: [
    {
      id: 'dp-requiredParametersCustomers',
      name: 'customers',
      type: 'DB',
      organizationId: DEFAULT_RUNNER_BASE_DATASET.organizationId,
      workspaceId: DEFAULT_RUNNER_BASE_DATASET.workspaceId,
      datasetId: 'd-requiredParametersParent',
    },
  ],
};
