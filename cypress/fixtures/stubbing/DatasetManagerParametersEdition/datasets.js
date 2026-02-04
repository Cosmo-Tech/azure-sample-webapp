// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_DATASET, DEFAULT_RUNNER_BASE_DATASET, DEFAULT_RUNNER_PARAMETER_DATASET } from '../default';

const EDITABLE_DATASET = {
  ...DEFAULT_DATASET,
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
  security: { default: 'none', accessControlList: [{ id: 'dev.sample.webapp@example.com', role: 'admin' }] },
};

const DATASET_PART_1 = {
  ...EDITABLE_DATASET,
  id: 'D-stbdparams1',
  name: 'Parameters Dataset Reference',
  description: 'Reference dataset for parameters edition testing',
  tags: ['parameters', 'test', 'dataset_part'],
  connector: {
    name: 'Azure Storage Connector',
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/D-stbdparams1/reference.zip',
    },
  },
};

const MAIN_DATASET_A = {
  ...EDITABLE_DATASET,
  id: 'D-stbdparams2',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Parameters Dataset A',
  description: 'Dataset for parameters edition testing A',
  tags: ['parameters', 'test'],
  sourceType: 'File',
};

const MAIN_DATASET_B = {
  ...EDITABLE_DATASET,
  id: 'D-stbdparams3',
  additionalData: {
    webapp: {
      visible: { datasetManager: true, scenarioCreation: true },
      sourceType: 'File',
    },
  },
  name: 'Parameters Dataset B',
  description: 'Dataset for parameters edition testing B',
  tags: ['parameters', 'test'],
  parts: [
    {
      id: 'dp-customers',
      name: 'customers',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDMParams',
      datasetId: 'D-stbdparams3',
    },
  ],
};

const MAIN_DATASET_C = {
  ...EDITABLE_DATASET,
  id: 'D-stbdparams4',
  additionalData: {
    webapp: {
      visible: { datasetManager: true, scenarioCreation: true },
      sourceType: 'ETL',
      runnerId: 'r-stbdparams1',
      parentId: 'D-stbdparams3',
    },
  },
  name: 'Parameters Dataset C',
  description: 'Dataset for parameters edition testing C with ETL',
  tags: ['parameters', 'test', 'etl'],
  parts: [
    {
      id: 'dp-customers',
      name: 'customers',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDMParams',
      datasetId: 'D-stbdparams4',
    },
  ],
  source: {
    location: 'W-stbbdbrwry',
    name: 'r-stbdparams1',
    path: null,
    jobId: 'run-stbrun1',
  },
};

const MAIN_DATASET_D = {
  ...EDITABLE_DATASET,
  id: 'D-stbdparams5',
  additionalData: {
    webapp: { visible: { datasetManager: true, scenarioCreation: true }, sourceType: 'ETL', runnerId: 'r-stbdparams2' },
  },
  name: 'Parameters Dataset D',
  description: 'Dataset for parameters edition testing D with ETL',
  tags: ['parameters', 'test', 'etl'],
  sourceType: 'ETL',
  source: {
    location: 'W-stbbdbrwry',
    name: 'r-stbdparams2',
    path: null,
    jobId: 'run-stbrun2',
  },
};

const MAIN_DATASET_E = {
  ...EDITABLE_DATASET,
  id: 'D-stbdparams7',
  additionalData: {
    webapp: { visible: { datasetManager: true, scenarioCreation: true }, sourceType: 'ETL', runnerId: 'r-stbdparams3' },
  },
  name: 'Parameters Dataset E',
  description: 'Dataset for parameters edition testing D with ETL',
  tags: ['parameters', 'test', 'etl'],
  sourceType: 'ETL',
  source: {
    location: 'W-stbbdbrwry',
    name: 'r-stbdparams3',
    path: null,
    jobId: 'run-stbrun3',
  },
};

const DATASET_PART_2 = {
  ...EDITABLE_DATASET,
  id: 'D-stbdparams6',
  name: 'Parameters Dataset Reference',
  description: 'Reference dataset for parameters edition testing',
  tags: ['parameters', 'test', 'dataset_part'],
  connector: {
    name: 'Azure Storage Connector',
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/D-stbdparams1/reference_two.zip',
    },
  },
};

export const DATASETS = [
  DATASET_PART_1,
  MAIN_DATASET_A,
  MAIN_DATASET_B,
  MAIN_DATASET_C,
  MAIN_DATASET_D,
  DATASET_PART_2,
  MAIN_DATASET_E,
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_RUNNER_PARAMETER_DATASET,
];
