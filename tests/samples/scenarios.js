// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SHARED_SCENARIOS_LIST } from '../../cypress/fixtures/stubbing/ScenarioSharing';
import { SCENARIO_EXAMPLE, DEFAULT_SCENARIOS_LIST } from '../../cypress/fixtures/stubbing/default';

export const SCENARIODATA_WITHOUT_USERS = {
  ...SCENARIO_EXAMPLE,
};

export const SCENARIODATA_WITH_USERS = {
  ...SHARED_SCENARIOS_LIST[0],
};

export const DEFAULT_SCENARIOS_LIST_DATA = [...DEFAULT_SCENARIOS_LIST];
