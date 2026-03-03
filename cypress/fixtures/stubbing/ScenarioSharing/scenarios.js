// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { BASIC_PARAMETERS_SIMULATION_RUNNER } from '../default/runners';
import { USER_EXAMPLE, USERS_LIST } from '../default/users';

const PRIVATE_SCENARIO = {
  ...BASIC_PARAMETERS_SIMULATION_RUNNER,
  security: {
    default: 'none',
    accessControlList: [{ id: USER_EXAMPLE.email, role: ROLES.RUNNER.ADMIN }],
  },
};

export const PRIVATE_SCENARIOS_LIST = [PRIVATE_SCENARIO];

const DEFAULT_SECURITY = {
  default: 'none',
  accessControlList: [
    { id: USERS_LIST[1].email, role: ROLES.RUNNER.VIEWER },
    { id: USERS_LIST[2].email, role: ROLES.RUNNER.EDITOR },
    { id: USERS_LIST[3].email, role: ROLES.RUNNER.VALIDATOR },
  ],
};

export const SHARED_SCENARIOS_LIST = [
  {
    ...BASIC_PARAMETERS_SIMULATION_RUNNER,
    id: 'r-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario 1',
    security: JSON.parse(JSON.stringify(DEFAULT_SECURITY)),
  },
  {
    ...BASIC_PARAMETERS_SIMULATION_RUNNER,
    id: 'r-stubbedscnr02',
    name: 'Test Cypress - Stubbed scenario 2',
    security: JSON.parse(JSON.stringify(DEFAULT_SECURITY)),
  },
  {
    ...BASIC_PARAMETERS_SIMULATION_RUNNER,
    id: 'r-stubbedscnr03',
    name: 'Test Cypress - Stubbed scenario 3',
    security: JSON.parse(JSON.stringify(DEFAULT_SECURITY)),
  },
];

// Set a different role for USER_EXAMPLE in SHARED_SCENARIOS_LIST scenarios
SHARED_SCENARIOS_LIST[0].security.accessControlList.push({ id: USER_EXAMPLE.email, role: ROLES.RUNNER.VIEWER });
SHARED_SCENARIOS_LIST[1].security.accessControlList.push({ id: USER_EXAMPLE.email, role: ROLES.RUNNER.EDITOR });
SHARED_SCENARIOS_LIST[2].security.accessControlList.push({ id: USER_EXAMPLE.email, role: ROLES.RUNNER.VALIDATOR });

export const NO_ROOT_SCENARIOS_LIST = [
  {
    ...BASIC_PARAMETERS_SIMULATION_RUNNER,
    id: 's-stubbedscnr01',
    name: 'Test Cypress - Stubbed child scenario 1',
    parentId: 's-unknownscenario',
    rootId: 's-unknownscenario',
  },
  {
    ...BASIC_PARAMETERS_SIMULATION_RUNNER,
    id: 's-stubbedscnr02',
    name: 'Test Cypress - Stubbed child scenario 2',
    parentId: 's-unknownscenario',
    rootId: 's-unknownscenario',
  },
];
