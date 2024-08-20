// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE, USERS_LIST } from '../default';

export const SCENARIOS = [
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr01',
    name: 'Simple Scenario 1',
    tags: ['brewery', 'tag', 'global'],
    description: 'A short description of a scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    state: 'Created',
    security: {
      default: 'admin',
    },
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr02',
    name: 'Scenario 2024',
    description: 'A short description of a supply chain scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    state: 'Successful',
    security: {
      default: 'admin',
    },
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr03',
    name: 'Scenario august',
    tags: ['supply', 'cypress'],
    description: 'A short description of a global scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[2].name,
    validationStatus: 'Validated',
    state: 'Created',
    security: {
      default: 'admin',
    },
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr04',
    name: 'Simple Scenario 2',
    description: 'A short description of a scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    state: 'Successful',
    security: {
      default: 'admin',
    },
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr05',
    name: 'Simple Scenario 3',
    tags: ['tag', 'unique', 'supply'],
    validationStatus: 'Validated',
    state: 'Failed',
    security: {
      default: 'admin',
    },
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr06',
    name: 'global scenario',
    tags: ['tag', 'cypress'],
    description: 'A short description of a supply chain scenario to easily keep track of its purpose',
    ownerName: USERS_LIST[1].name,
    validationStatus: 'Rejected',
    state: 'Successful',
    security: {
      default: 'admin',
    },
  },
];
