// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RUNNER_ACTIONS_KEY } from './constants';

export const dispatchCreateRunner = (organizationId, workspaceId, runner) => ({
  type: RUNNER_ACTIONS_KEY.CREATE_RUNNER,
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

export const dispatchStopRunner = (organizationId, workspaceId, datasetId) => ({
  type: RUNNER_ACTIONS_KEY.STOP_RUNNER,
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

export const dispatchUpdateRunner = (organizationId, workspaceId, runnerId, runTemplateId, runnerParameters) => ({
  type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
  runTemplateId,
  runnerParameters,
});

export const dispatchUpdateRunnerData = (organizationId, workspaceId, runnerId, runnerDataPatch) => ({
  type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
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

export const dispatchStopSimulationRunner = (organizationId, workspaceId, runnerId) => ({
  type: RUNNER_ACTIONS_KEY.STOP_SIMULATION_RUNNER,
  organizationId,
  workspaceId,
  runnerId,
});
