// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RUNNER_RUN_STATE } from '../services/config/ApiConstants';
import { SecurityUtils } from './SecurityUtils';

const getLastRunId = (runner) => runner?.lastRunInfo?.lastRunId;
const getLastRunStatus = (runner) => runner?.lastRunInfo?.lastRunStatus;
const setLastRunStatus = (runner, newStatus) => (runner.lastRunInfo.lastRunStatus = newStatus);

const getRunIdFromRunnerStart = (runnerStartResponse) => runnerStartResponse?.id;

const forgeRunnerLastRunInfoPatch = (lastRunId, lastRunStatus = RUNNER_RUN_STATE.CREATED) => ({
  lastRunInfo: { lastRunId, lastRunStatus },
});

const _getUserPermissionsForRunner = (scenario, userEmail, userId, permissionsMapping) => {
  if (scenario?.security == null || Object.keys(scenario?.security).length === 0) {
    console.warn(`No security data for scenario ${scenario?.id}, restricting access to its content`);
    return [];
  }
  return SecurityUtils.getUserPermissionsForResource(scenario.security, userEmail, permissionsMapping);
};

const patchRunnerParameterValues = (solutionParameters, parameterValues) => {
  if (!Array.isArray(parameterValues) || !Array.isArray(solutionParameters)) return;

  parameterValues.forEach((value) => {
    if (value.varType != null || value.parameterId == null) return;

    const parameterDefinition = solutionParameters.find(
      (solutionParameter) => solutionParameter.id === value.parameterId
    );
    if (parameterDefinition) value.varType = parameterDefinition.varType;
    else console.warn(`Unknown parameter value ${value.parameterId} without any varType found in runner data`);
  });
};

const patchRunnerWithCurrentUserPermissions = (runner, userEmail, userId, permissionsMapping) => {
  // runner.security seems to be read-only, we have to create a new object to add a "currentUserPermissions" key
  runner.security = {
    ...runner.security,
    currentUserPermissions: _getUserPermissionsForRunner(runner, userEmail, userId, permissionsMapping),
  };
};

const updateParentIdOnDelete = (runners, deletedRunnerId) => {
  const parentId = runners.find((runner) => runner.id === deletedRunnerId)?.parentId;
  runners.forEach((runner) => {
    if (runner.parentId !== deletedRunnerId) return;

    runner.parentId = parentId ?? null;
  });
};

const findParameterInDatasetParts = (parameterId, datasetParts) => {
  return datasetParts?.find((datasetPart) => datasetPart.name === parameterId);
};

const isParameterInDatasetParts = (parameterId, datasetParts) => {
  return findParameterInDatasetParts(parameterId, datasetParts) !== undefined;
};

const getRunnerOptions = (runner) => runner?.additionalData?.webapp;
const getRunnerOption = (runner, optionKey) => runner?.additionalData?.webapp?.[optionKey];

const setRunnerOptions = (runner, options) => {
  if (!runner) return;
  if (!runner.additionalData) runner.additionalData = { webapp: { ...options } };
  else if (!runner.additionalData.webapp) runner.additionalData.webapp = { ...options };
  else runner.additionalData.webapp = { ...runner.additionalData.webapp, ...options };
};

export const RunnersUtils = {
  forgeRunnerLastRunInfoPatch,
  getLastRunId,
  getLastRunStatus,
  setLastRunStatus,
  getRunIdFromRunnerStart,
  patchRunnerWithCurrentUserPermissions,
  patchRunnerParameterValues,
  updateParentIdOnDelete,
  findParameterInDatasetParts,
  isParameterInDatasetParts,
  getRunnerOptions,
  getRunnerOption,
  setRunnerOptions,
};
