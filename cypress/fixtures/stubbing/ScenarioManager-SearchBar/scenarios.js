// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER, USERS_LIST } from '../default';

export const SCENARIO_RUNS = [
  { id: 'run-stubbedrun01', state: 'Created' },
  { id: 'run-stubbedrun02', state: 'Successful' },
  { id: 'run-stubbedrun03', state: 'Created' },
  { id: 'run-stubbedrun04', state: 'Successful' },
  { id: 'run-stubbedrun05', state: 'Failed' },
  { id: 'run-stubbedrun06', state: 'Successful' },
];

export const SCENARIOS = [
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr01',
    lastRunId: 'run-stubbedrun01',
    name: 'Simple Scenario 1',
    tags: ['brewery', 'tag', 'global'],
    description: 'A short description of a scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr02',
    lastRunId: 'run-stubbedrun02',
    name: 'Scenario 2024',
    description: 'A short description of a supply chain scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr03',
    lastRunId: 'run-stubbedrun03',
    name: 'Scenario august',
    tags: ['supply', 'cypress'],
    description: 'A short description of a global scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[2].name,
    validationStatus: 'Validated',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr04',
    lastRunId: 'run-stubbedrun04',
    name: 'Simple Scenario 2',
    description: 'A short description of a scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr05',
    lastRunId: 'run-stubbedrun05',
    name: 'Simple Scenario 3',
    tags: ['tag', 'unique', 'supply'],
    validationStatus: 'Validated',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr06',
    lastRunId: 'run-stubbedrun06',
    name: 'global scenario',
    tags: ['tag', 'cypress'],
    description: 'A short description of a supply chain scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
];
