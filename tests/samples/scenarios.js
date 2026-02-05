// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SHARED_SCENARIOS_LIST } from '../../cypress/fixtures/stubbing/ScenarioSharing';
import {
  DEFAULT_ETL_RUNNER,
  DEFAULT_SIMULATION_RUNNER,
  DEFAULT_RUNNERS,
} from '../../cypress/fixtures/stubbing/default';

export { DEFAULT_ETL_RUNNER, DEFAULT_SIMULATION_RUNNER, DEFAULT_RUNNERS };

export const SCENARIODATA_WITHOUT_USERS = {
  ...DEFAULT_SIMULATION_RUNNER,
};

export const SCENARIODATA_WITH_USERS = {
  ...SHARED_SCENARIOS_LIST[0],
};

export const DEFAULT_SCENARIOS_LIST_DATA = [...DEFAULT_RUNNERS];
