// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RUNNER_ACTIONS_KEY } from '../../commons/RunnerConstants';

export const dispatchCreateRunner = (organizationId, workspaceId, runner) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_CREATE_RUNNER,
  organizationId,
  workspaceId,
  runner,
});

export const dispatchCreateSimulationRunner = (organizationId, workspaceId, runner) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_CREATE_SIMULATION_RUNNER,
  organizationId,
  workspaceId,
  runner,
});

export const dispatchStopRunner = (organizationId, workspaceId, datasetId) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_STOP_RUNNER,
  organizationId,
  workspaceId,
  datasetId,
});

export const dispatchGetRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_GET_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
});

export const dispatchUpdateRunner = (organizationId, workspaceId, runnerId, runTemplateId, runnerParameters) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters,
});

export const dispatchStartRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_START_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
});

export const dispatchUpdateAndStartRunner = (
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters
) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_AND_START_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters,
});

export const dispatchRenameRunner = (organizationId, workspaceId, runnerId, runTemplateId, newRunnerName) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_RENAME_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerName: newRunnerName,
});

export const dispatchApplyRunnerSharingChanges = (runnerId, newRunnerSecurity) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_RUNNER_SECURITY,
  runnerId,
  newRunnerSecurity,
});

export const dispatchDeleteRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_DELETE_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
});

export const dispatchResetCurrentSimulationRunner = () => ({
  type: RUNNER_ACTIONS_KEY.RESET_CURRENT_SIMULATION_RUNNER,
});

export const dispatchSetSimulationRunnerValidationStatus = (runnerId, validationStatus) => ({
  type: RUNNER_ACTIONS_KEY.SET_RUNNER_VALIDATION_STATUS,
  runnerId,
  validationStatus,
});

export const dispatchSetCurrentSimulationRunner = (runnerId, status) => ({
  type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
  runnerId,
  status,
});

export const dispatchStopSimulationRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_STOP_SIMULATION_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
});
