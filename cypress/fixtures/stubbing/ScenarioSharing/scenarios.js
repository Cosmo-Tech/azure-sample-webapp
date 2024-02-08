// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_SCENARIOS_LIST, SCENARIO_EXAMPLE } from '../default/scenarios';
import { USER_EXAMPLE, USERS_LIST } from '../default/users';

const PRIVATE_SCENARIO = {
  ...SCENARIO_EXAMPLE,
  security: {
    default: 'none',
    accessControlList: [{ id: USER_EXAMPLE.email, role: ROLES.SCENARIO.ADMIN }],
  },
};

export const PRIVATE_SCENARIOS_LIST = [PRIVATE_SCENARIO];

const DEFAULT_SECURITY = {
  default: 'none',
  accessControlList: [
    { id: USERS_LIST[1].email, role: ROLES.SCENARIO.VIEWER },
    { id: USERS_LIST[2].email, role: ROLES.SCENARIO.EDITOR },
    { id: USERS_LIST[3].email, role: ROLES.SCENARIO.VALIDATOR },
  ],
};

export const SHARED_SCENARIOS_LIST = [
  { ...DEFAULT_SCENARIOS_LIST[0], security: JSON.parse(JSON.stringify(DEFAULT_SECURITY)) },
  { ...DEFAULT_SCENARIOS_LIST[1], security: JSON.parse(JSON.stringify(DEFAULT_SECURITY)) },
  { ...DEFAULT_SCENARIOS_LIST[2], security: JSON.parse(JSON.stringify(DEFAULT_SECURITY)) },
];

// Set a different role for USER_EXAMPLE in SHARED_SCENARIOS_LIST scenarios
SHARED_SCENARIOS_LIST[0].security.accessControlList.push({ id: USER_EXAMPLE.email, role: ROLES.SCENARIO.VIEWER });
SHARED_SCENARIOS_LIST[1].security.accessControlList.push({ id: USER_EXAMPLE.email, role: ROLES.SCENARIO.EDITOR });
SHARED_SCENARIOS_LIST[2].security.accessControlList.push({ id: USER_EXAMPLE.email, role: ROLES.SCENARIO.VALIDATOR });

export const NO_ROOT_SCENARIOS_LIST = [
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr01',
    name: 'Test Cypress - Stubbed child scenario 1',
    parentId: 's-unknownscenario',
    rootId: 's-unknownscenario',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr02',
    name: 'Test Cypress - Stubbed child scenario 2',
    parentId: 's-unknownscenario',
    rootId: 's-unknownscenario',
  },
];
