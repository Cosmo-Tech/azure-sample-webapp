// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE } from '../default';

export const ALL_ROOT_SCENARIOS = [
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr01',
    name: 'A1 - Test Cypress - Stubbed scenario 1',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr02',
    name: 'A2 - Test Cypress - Stubbed scenario 2',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr03',
    name: 'A3 - Test Cypress - Stubbed scenario 3',
  },
];

export const PARENT_AND_CHILD_SCENARIOS = [
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr01',
    name: 'A1 - Test Cypress - Stubbed root scenario 1',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr02',
    parentId: 'r-stubbedscnr01',
    name: 'A1.1 - Test Cypress - Stubbed child scenario 1.1',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr03',
    name: 'A2 - Test Cypress - Stubbed root scenario 2',
  },
];
