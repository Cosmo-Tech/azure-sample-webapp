// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DEFAULT_DATASET } from '../default';

const FILE_DATASET_MAIN_A = {
  ...DEFAULT_DATASET,
  main: true,
  id: 'D-stbdataset1',
  name: 'Dataset A',
  description: 'main dataset A from local file',
};
const FILE_DATASET_MAIN_B = {
  ...DEFAULT_DATASET,
  main: true,
  id: 'D-stbdataset2',
  name: 'Dataset B',
  description: 'main dataset B from local file',
};

const FILE_DATASET_NON_MAIN = {
  ...DEFAULT_DATASET,
  id: 'D-stbdataset0',
  name: 'Hidden dataset',
  description: 'hidden dataset',
};

export const DATASETS = [FILE_DATASET_MAIN_A, FILE_DATASET_MAIN_B, FILE_DATASET_NON_MAIN];
