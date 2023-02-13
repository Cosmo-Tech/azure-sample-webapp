// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DEFAULT_SCENARIOS_LIST, SCENARIO_EXAMPLE } from '../default/scenarios';
import { USER_EXAMPLE, USERS_LIST } from '../default/users';
import { ROLES } from '../../../commons/constants/generic/TestConstants';

export const UNSHARED_SCENARIOS_LIST = DEFAULT_SCENARIOS_LIST.map((scenario) => {
  return {
    ...scenario,
    security: {
      default: 'none',
      accessControlList: [{ id: USER_EXAMPLE.email, role: ROLES.SCENARIO.ADMIN }],
    },
  };
});

export const SHARED_SCENARIOS_LIST = DEFAULT_SCENARIOS_LIST.map((scenario) => {
  return {
    ...scenario,
    security: {
      default: 'none',
      accessControlList: [
        { id: USERS_LIST[1].email, role: ROLES.SCENARIO.VIEWER },
        { id: USERS_LIST[2].email, role: ROLES.SCENARIO.EDITOR },
        { id: USERS_LIST[3].email, role: ROLES.SCENARIO.VALIDATOR },
      ],
    },
  };
});

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
