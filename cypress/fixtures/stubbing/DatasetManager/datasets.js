// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_DATASET } from '../default';
import { WORKSPACE } from './workspaces';

const EDITABLE_DATASET = {
  ...DEFAULT_DATASET,
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
  linkedWorkspaceIdList: [WORKSPACE.id],
  security: { default: 'admin', accessControlList: [] },
};

const FILE_DATASET_MAIN_A = {
  ...EDITABLE_DATASET,
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  id: 'D-stbdataset1',
  name: 'Dataset A',
  description: 'main dataset A from local file',
  tags: ['dataset', 'A'],
};
const FILE_DATASET_MAIN_B = {
  ...EDITABLE_DATASET,
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  id: 'D-stbdataset2',
  name: 'Dataset B',
  description: 'main dataset B from local file',
  tags: ['dataset', 'B'],
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
    }
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
        scenarioCreation: true
      }
    }
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

const DATASET_AZURE_STORAGE = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset9',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset Azure Storage',
  sourceType: 'AzureStorage',
  source: { location: 'azureStorageLocation', name: 'containerName', path: 'azure/storage/path' },
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
};

const DATASET_FROM_SCRATCH = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset10',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset From Scratch',
  sourceType: 'None',
  source: {},
  ingestionStatus: 'NONE',
};

const DATASET_TWINGRAPH_A = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset11',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset with twingraph A',
  sourceType: 'Twincache',
  twincacheStatus: 'FULL',
};

const DATASET_TWINGRAPH_B = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset12',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  name: 'Dataset with twingraph B',
  sourceType: 'Twincache',
  twincacheStatus: 'FULL',
};

export const DATASETS = [FILE_DATASET_MAIN_A, FILE_DATASET_MAIN_B, FILE_DATASET_NON_MAIN, ETL_DATASET, SUBDATASET];

export const DATASETS_TO_FILTER = [
  DATASET_AMSTERDAM,
  DATASET_BARCELONA,
  DATASET_CAMBRIDGE,
  DATASET_DUSSELDORF,
  DATASET_EDINBURGH,
];

export const DATASETS_TO_REFRESH = [DATASET_AZURE_STORAGE, DATASET_FROM_SCRATCH];

export const DATASETS_TWINGRAPH = [DATASET_TWINGRAPH_A, DATASET_TWINGRAPH_B];

DATASETS.forEach((dataset) => WORKSPACE.linkedDatasetIdList.push(dataset.id));
DATASETS_TO_FILTER.forEach((dataset) => WORKSPACE.linkedDatasetIdList.push(dataset.id));
DATASETS_TO_REFRESH.forEach((dataset) => WORKSPACE.linkedDatasetIdList.push(dataset.id));
DATASETS_TWINGRAPH.forEach((dataset) => WORKSPACE.linkedDatasetIdList.push(dataset.id));
