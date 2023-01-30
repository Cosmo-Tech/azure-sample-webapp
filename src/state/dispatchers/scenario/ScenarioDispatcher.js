// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants';

export const dispatchGetScenarioList = (payLoad) => ({
  type: SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS,
  ...payLoad,
});

export const dispatchSetCurrentScenario = (scenario) => ({
  type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
  scenario,
});

export const dispatchResetCurrentScenario = () => ({
  type: SCENARIO_ACTIONS_KEY.RESET_CURRENT_SCENARIO,
});

export const dispatchFindScenarioById = (organizationId, workspaceId, scenarioId) => ({
  type: SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID,
  organizationId,
  workspaceId,
  scenarioId,
});

export const dispatchCreateScenario = (organizationId, workspaceId, scenario) => ({
  type: SCENARIO_ACTIONS_KEY.CREATE_SCENARIO,
  organizationId,
  workspaceId,
  scenario,
});

export const dispatchDeleteScenario = (organizationId, workspaceId, scenarioId) => ({
  type: SCENARIO_ACTIONS_KEY.DELETE_SCENARIO,
  organizationId,
  workspaceId,
  scenarioId,
});

export const dispatchRenameScenario = (organizationId, workspaceId, scenarioId, newScenarioName) => ({
  type: SCENARIO_ACTIONS_KEY.RENAME_SCENARIO,
  organizationId,
  workspaceId,
  scenarioId,
  scenarioName: newScenarioName,
});

export const dispatchUpdateAndLaunchScenario = (organizationId, workspaceId, scenarioId, scenarioParameters) => ({
  type: SCENARIO_ACTIONS_KEY.UPDATE_AND_LAUNCH_SCENARIO,
  organizationId,
  workspaceId,
  scenarioId,
  scenarioParameters,
});

export const dispatchSetScenarioValidationStatus = (scenarioId, validationStatus) => ({
  type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_VALIDATION_STATUS,
  scenarioId,
  validationStatus,
});

export const dispatchApplyScenarioSharingChanges = (scenarioId, newScenarioSecurity) => ({
  type: SCENARIO_ACTIONS_KEY.APPLY_SCENARIO_SHARING_CHANGES,
  scenarioId,
  newScenarioSecurity,
});

export const dispatchSetScenarioSecurity = (
  scenarioId,
  newScenarioSecurity,
  userEmail,
  userId,
  scenariosPermissionsMapping
) => ({
  type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_SECURITY,
  scenarioId,
  security: newScenarioSecurity,
  userEmail,
  userId,
  scenariosPermissionsMapping,
});

export const dispatchLaunchScenario = (organizationId, workspaceId, scenarioId) => ({
  type: SCENARIO_ACTIONS_KEY.LAUNCH_SCENARIO,
  organizationId,
  workspaceId,
  scenarioId,
});
