// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants';

export const dispatchGetScenarioList = (payLoad) => ({
  type: SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS,
  ...payLoad
});

export const dispatchSetCurrentScenario = (scenario) => ({
  type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
  scenario: scenario
});

export const dispatchResetCurrentScenario = () => ({
  type: SCENARIO_ACTIONS_KEY.RESET_CURRENT_SCENARIO
});

export const dispatchFindScenarioById = (workspaceId, scenarioId) => ({
  type: SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID,
  workspaceId: workspaceId,
  scenarioId: scenarioId
});

export const dispatchCreateScenario = (workspaceId, scenario) => ({
  type: SCENARIO_ACTIONS_KEY.CREATE_SCENARIO,
  workspaceId: workspaceId,
  scenario: scenario
});

export const dispatchDeleteScenario = (workspaceId, scenarioId) => ({
  type: SCENARIO_ACTIONS_KEY.DELETE_SCENARIO,
  workspaceId: workspaceId,
  scenarioId: scenarioId
});

export const dispatchUpdateAndLaunchScenario = (workspaceId, scenarioId, scenarioParameters) => ({
  type: SCENARIO_ACTIONS_KEY.UPDATE_AND_LAUNCH_SCENARIO,
  workspaceId: workspaceId,
  scenarioId: scenarioId,
  scenarioParameters: scenarioParameters
});

export const dispatchSetScenarioState = (workspaceId, scenarioId, state) => ({
  type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_STATE,
  workspaceId: workspaceId,
  scenarioId: scenarioId,
  state: state
});

export const dispatchLaunchScenario = (workspaceId, scenarioId) => ({
  type: SCENARIO_ACTIONS_KEY.LAUNCH_SCENARIO,
  workspaceId: workspaceId,
  scenarioId: scenarioId
});
