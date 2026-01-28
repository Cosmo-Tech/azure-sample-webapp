// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RUNNER_ACTIONS_KEY } from './constants';

export const dispatchCreateETLRunnerAndDataset = (organizationId, workspaceId, runner) => ({
  type: RUNNER_ACTIONS_KEY.CREATE_ETL_RUNNER_AND_DATASET,
  organizationId,
  workspaceId,
  runner,
});

export const dispatchCreateSimulationRunner = (organizationId, workspaceId, runner) => ({
  type: RUNNER_ACTIONS_KEY.CREATE_SIMULATION_RUNNER,
  organizationId,
  workspaceId,
  runner,
});

export const dispatchStopETLRunner = (organizationId, workspaceId, datasetId) => ({
  type: RUNNER_ACTIONS_KEY.STOP_ETL_RUNNER,
  organizationId,
  workspaceId,
  datasetId,
});

export const dispatchGetRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.GET_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
});

export const dispatchUpdateSimulationRunner = (
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters
) => ({
  type: RUNNER_ACTIONS_KEY.UPDATE_SIMULATION_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters,
});

export const dispatchUpdateSimulationRunnerData = (organizationId, workspaceId, runnerId, runnerDataPatch) => ({
  type: RUNNER_ACTIONS_KEY.UPDATE_SIMULATION_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runnerDataPatch,
});

export const dispatchStartRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.START_RUNNER,
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
  type: RUNNER_ACTIONS_KEY.UPDATE_AND_START_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters,
});

export const dispatchRenameRunner = (organizationId, workspaceId, runnerId, runTemplateId, newRunnerName) => ({
  type: RUNNER_ACTIONS_KEY.RENAME_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerName: newRunnerName,
});

export const dispatchApplyRunnerSharingChanges = (runnerId, newRunnerSecurity) => ({
  type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER_SECURITY,
  runnerId,
  newRunnerSecurity,
});

export const dispatchDeleteRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.DELETE_RUNNER,
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
  type: RUNNER_ACTIONS_KEY.STOP_SIMULATION_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
});

export const dispatchUpdateEtlRunner = (organizationId, workspaceId, runnerId, dataset, runnerPatch) => ({
  type: RUNNER_ACTIONS_KEY.UPDATE_ETL_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  dataset,
  runnerPatch,
});

export const dispatchStopAllRunnerStatusPolling = () => ({
  type: RUNNER_ACTIONS_KEY.STOP_ALL_RUNNERS_STATUS_POLLING,
});
