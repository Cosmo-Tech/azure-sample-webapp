// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER } from '../default';

export const SCENARIOS_WITH_DATASET_ERROR = [
  {
    ...DEFAULT_SIMULATION_RUNNER,
    name: 'Test Cypress - 1 - dataset not found',
    id: 's-stubbedscnr02',
    datasets: { bases: ['D-stbdatasetnfd'] },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    name: 'Test Cypress - 2 - broken dataset',
    id: 's-stubbedscnr01',
    datasets: { bases: ['D-stbdataset9'] },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    name: 'Test Cypress - 3',
    id: 's-stubbedscnr03',
    datasets: { bases: ['D-stbdataset10'] },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    name: 'Test Cypress - 4 - empty datasetList',
    id: 's-stubbedscnr04',
    datasets: { bases: [] },
  },
];
