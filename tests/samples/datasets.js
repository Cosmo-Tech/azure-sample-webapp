// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_DATASET } from '../../cypress/fixtures/stubbing/default';

export const DEFAULT_DATASETS_LIST_DATA = [
  {
    ...DEFAULT_DATASET,
    id: 'D-dataSetSmp1',
    name: 'DataSet Sample 001',
    main: true,
    ingestionStatus: 'SUCCESS',
    twincacheStatus: 'FULL',
  },
  {
    ...DEFAULT_DATASET,
    id: 'D-dataSetSmp2',
    name: 'DataSet Sample 002',
    main: true,
    ingestionStatus: 'SUCCESS',
    twincacheStatus: 'FULL',
  },
  {
    ...DEFAULT_DATASET,
    id: 'D-dataSetSmp3',
    name: 'DataSet Sample 003',
    main: true,
    ingestionStatus: 'SUCCESS',
    twincacheStatus: 'FULL',
  },
  {
    ...DEFAULT_DATASET,
    id: 'D-dataSetSmp4',
    name: 'DataSet Sample 004',
    main: true,
    ingestionStatus: 'SUCCESS',
    twincacheStatus: 'FULL',
  },
];
