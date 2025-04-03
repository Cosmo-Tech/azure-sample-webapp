// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE } from '../default';

export const SCENARIOS_WITH_DATASET_ERROR = [
  {
    ...SCENARIO_EXAMPLE,
    name: 'Test Cypress - 1 - dataset not found',
    id: 's-stubbedscnr02',
    datasetList: ['D-stbdatasetnfd'],
  },
  {
    ...SCENARIO_EXAMPLE,
    name: 'Test Cypress - 2 - broken dataset',
    id: 's-stubbedscnr01',
    datasetList: ['D-stbdataset9'],
  },
  {
    ...SCENARIO_EXAMPLE,
    name: 'Test Cypress - 3',
    id: 's-stubbedscnr03',
    datasetList: ['D-stbdataset8'],
  },
  {
    ...SCENARIO_EXAMPLE,
    name: 'Test Cypress - 4 - empty datasetList',
    id: 's-stubbedscnr04',
    datasetList: [],
  },
];
