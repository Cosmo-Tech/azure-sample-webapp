// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants';

export const dispatchGetScenarioList = (payLoad) => ({
  type: SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS,
  ...payLoad
});

export const dispatchSetCurrentScenario = (payLoad) => ({
  type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
  ...payLoad
});

export const dispatchFindScenarioById = (scenarioId) => ({
  type: SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID,
  scenarioId: scenarioId
});

export const dispatchAddNewScenario = (payLoad) => ({
  type: SCENARIO_ACTIONS_KEY.ADD_NEW_SCENARIO,
  ...payLoad
});
