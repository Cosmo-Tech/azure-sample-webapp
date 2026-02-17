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
    lastRunInfo: { lastRunId: 'run-stubbedrun01', lastRunStatus: 'Created' },
    name: 'Simple Scenario 1',
    tags: ['brewery', 'tag', 'global'],
    description: 'A short description of a scenario to easily keep track of its purpose',
    additionalData: { webapp: { ownerName: USERS_LIST[1].name } },
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr02',
    lastRunInfo: { lastRunId: 'run-stubbedrun02', lastRunStatus: 'Successful' },
    name: 'Scenario 2024',
    description: 'A short description of a supply chain scenario to easily keep track of its purpose',
    additionalData: { webapp: { ownerName: USERS_LIST[1].name } },
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr03',
    lastRunInfo: { lastRunId: 'run-stubbedrun03', lastRunStatus: 'Created' },
    name: 'Scenario august',
    tags: ['supply', 'cypress'],
    description: 'A short description of a global scenario to easily keep track of its purpose',
    additionalData: { webapp: { ownerName: USERS_LIST[2].name } },
    validationStatus: 'Validated',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr04',
    lastRunInfo: { lastRunId: 'run-stubbedrun04', lastRunStatus: 'Successful' },
    name: 'Simple Scenario 2',
    description: 'A short description of a scenario to easily keep track of its purpose',
    additionalData: { webapp: { ownerName: USERS_LIST[1].name } },
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr05',
    lastRunInfo: { lastRunId: 'run-stubbedrun05', lastRunStatus: 'Failed' },
    name: 'Simple Scenario 3',
    tags: ['tag', 'unique', 'supply'],
    validationStatus: 'Validated',
    security: { default: 'admin' },
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedrnr06',
    lastRunInfo: { lastRunId: 'run-stubbedrun06', lastRunStatus: 'Successful' },
    name: 'global scenario',
    tags: ['tag', 'cypress'],
    description: 'A short description of a supply chain scenario to easily keep track of its purpose',
    additionalData: { webapp: { ownerName: USERS_LIST[1].name } },
    validationStatus: 'Rejected',
    security: { default: 'admin' },
  },
];
