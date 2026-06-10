// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_RUNNER_PARAMETER_DATASET,
  DEFAULT_WORKSPACE_DATASET,
  DEFAULT_DATASET,
} from '../default';

const EDITABLE_DATASET = {
  ...DEFAULT_DATASET,
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
  security: { default: 'admin', accessControlList: [] },
};

const FILE_DATASET_MAIN_A = {
  ...EDITABLE_DATASET,
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  id: 'D-stbdataset1',
  name: 'Dataset A',
  description: 'main dataset A from local file',
  tags: ['dataset', 'A'],
  parts: [
    {
      id: 'dp-customers',
      name: 'customers',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset1',
    },
    {
      id: 'dp-entities',
      name: 'entities',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset1',
    },
    {
      id: 'dp-relationships',
      name: 'relationships',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset1',
    },
    {
      id: 'dp-transport_KPI',
      name: 'KPI',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset1',
    },
    {
      id: 'dp-transports_attributes',
      name: 'transports_attributes',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset1',
    },
    {
      id: 'dp-productionOperation_KPI',
      name: 'productionOperation_KPI',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset1',
    },
  ],
};

const FILE_DATASET_MAIN_B = {
  ...EDITABLE_DATASET,
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  id: 'D-stbdataset2',
  name: 'Dataset B',
  description: 'main dataset B from local file',
  tags: ['dataset', 'B'],
  parts: [
    {
      id: 'dp-customersB',
      name: 'customers',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset2',
    },
    {
      id: 'dp-entitiesB',
      name: 'entities',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset2',
    },
    {
      id: 'dp-relationshipsB',
      name: 'relationships',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset2',
    },
    {
      id: 'dp-transport_KPIB',
      name: 'KPI',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset2',
    },
    {
      id: 'dp-transports_attributesB',
      name: 'transports_attributes',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset2',
    },
    {
      id: 'dp-productionOperation_KPIB',
      name: 'productionOperation_KPI',
      type: 'DB',
      organizationId: 'O-stbdorgztn',
      workspaceId: 'W-stbbdbrwryWithDM',
      datasetId: 'D-stbdataset2',
    },
  ],
};

const FILE_DATASET_NON_MAIN = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset0',
  name: 'Hidden dataset',
  description: 'hidden dataset',
};

const ETL_DATASET = {
  ...EDITABLE_DATASET,
  additionalData: {
    webapp: {
      visible: {
        datasetManager: true,
        scenarioCreation: true,
      },
      sourceType: 'ETL',
      runnerId: 'r-stbdrnr1',
    },
  },
  id: 'D-stbdataset13',
  parentId: 'D-stbdataset2',
  name: 'Dataset ETL',
  description: 'ETL dataset',

  source: {
    location: 'W-stbbdbrwry',
    name: 'r-stbdrnr1',
    path: null,
    jobId: 'run-stbrun1',
  },
  tags: ['dataset', 'ETL'],
};

const SUBDATASET = {
  ...EDITABLE_DATASET,
  additionalData: {
    webapp: {
      sourceType: 'Subdataset run template with static filter',
      runnerId: 'r-stbdrnr1',
      visible: {
        datasetManager: true,
        scenarioCreation: true,
      },
    },
  },
  id: 'D-stbdataset14',
  name: 'Subdataset',
  description: 'ETL dataset',
  sourceType: 'ETL',
  source: {
    location: 'W-stbbdbrwry',
    name: 'r-stbdrnr2',
    path: null,
    jobId: 'run-stbrun2',
  },
  tags: ['dataset', 'ETL'],
};

const DATASET_AMSTERDAM = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset3',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset Amsterdam',
  tags: ['size-m', 'random'],
};

const DATASET_BARCELONA = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset4',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset Barcelona',
  tags: ['size-l', 'random'],
};

const DATASET_CAMBRIDGE = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset5',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset Cambridge',
  tags: ['size-xl', 'random'],
};

const DATASET_DUSSELDORF = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset6',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset Dusseldorf',
  tags: ['size-2xl'],
};

const DATASET_EDINBURGH = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset7',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset Edinburgh',
  tags: ['size-3xl', 'random'],
};

const DATASET_ETL_FOR_REFRESH = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset9',
  additionalData: {
    webapp: {
      visible: { datasetManager: true, scenarioCreation: true },
      runnerId: 'r-stbdrnr1',
      sourceType: 'ETL',
    },
  },
  name: 'Dataset ETL for Refresh',
  sourceType: 'ETL',
  source: {
    location: 'W-stbbdbrwry',
    name: 'r-stbdrnr1',
    path: null,
    jobId: 'run-stbrun1',
  },
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
};

const DATASET_FROM_SCRATCH = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset10',
  additionalData: {
    webapp: {
      visible: { datasetManager: true, scenarioCreation: true },
      runnerId: 'r-stbdrnr1',
      sourceType: 'None',
    },
  },
  name: 'Dataset From Scratch',
  source: {},
  ingestionStatus: 'NONE',
};

export const DATASETS = [
  FILE_DATASET_MAIN_A,
  FILE_DATASET_MAIN_B,
  FILE_DATASET_NON_MAIN,
  ETL_DATASET,
  SUBDATASET,
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_RUNNER_PARAMETER_DATASET,
  DEFAULT_WORKSPACE_DATASET,
];

export const DATASETS_TO_FILTER = [
  DATASET_AMSTERDAM,
  DATASET_BARCELONA,
  DATASET_CAMBRIDGE,
  DATASET_DUSSELDORF,
  DATASET_EDINBURGH,
];

export const DATASETS_TO_REFRESH = [DATASET_ETL_FOR_REFRESH, DATASET_FROM_SCRATCH];
