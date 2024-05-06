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
  main: true,
  id: 'D-stbdataset1',
  name: 'Dataset A',
  description: 'main dataset A from local file',
  tags: ['dataset', 'A'],
};
const FILE_DATASET_MAIN_B = {
  ...EDITABLE_DATASET,
  main: true,
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

const DATASET_AMSTERDAM = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset3',
  main: true,
  name: 'Dataset Amsterdam',
  tags: ['size-m', 'random'],
};

const DATASET_BARCELONA = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset4',
  main: true,
  name: 'Dataset Barcelona',
  tags: ['size-l', 'random'],
};

const DATASET_CAMBRIDGE = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset5',
  main: true,
  name: 'Dataset Cambridge',
  tags: ['size-xl', 'random'],
};

const DATASET_DUSSELDORF = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset6',
  main: true,
  name: 'Dataset Dusseldorf',
  tags: ['size-2xl'],
};

const DATASET_EDINBURGH = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset7',
  main: true,
  name: 'Dataset Edinburgh',
  tags: ['size-3xl', 'random'],
};

const DATASET_ADT = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset8',
  main: true,
  name: 'Dataset ADT',
  sourceType: 'ADT',
  source: { location: 'adt/url' },
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
};

const DATASET_AZURE_STORAGE = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset9',
  main: true,
  name: 'Dataset Azure Storage',
  sourceType: 'AzureStorage',
  source: { location: 'azureStorageLocation', name: 'containerName', path: 'azure/storage/path' },
  ingestionStatus: 'SUCCESS',
  twincacheStatus: 'FULL',
};

const DATASET_FROM_SCRATCH = {
  ...EDITABLE_DATASET,
  id: 'D-stbdataset10',
  main: true,
  name: 'Dataset From Scratch',
  sourceType: 'None',
  source: {},
  ingestionStatus: 'NONE',
};

export const DATASETS = [FILE_DATASET_MAIN_A, FILE_DATASET_MAIN_B, FILE_DATASET_NON_MAIN];

export const DATASETS_TO_FILTER = [
  DATASET_AMSTERDAM,
  DATASET_BARCELONA,
  DATASET_CAMBRIDGE,
  DATASET_DUSSELDORF,
  DATASET_EDINBURGH,
];

export const DATASETS_TO_REFRESH = [DATASET_ADT, DATASET_AZURE_STORAGE, DATASET_FROM_SCRATCH];

DATASETS.forEach((dataset) => WORKSPACE.linkedDatasetIdList.push(dataset.id));
DATASETS_TO_FILTER.forEach((dataset) => WORKSPACE.linkedDatasetIdList.push(dataset.id));
DATASETS_TO_REFRESH.forEach((dataset) => WORKSPACE.linkedDatasetIdList.push(dataset.id));
