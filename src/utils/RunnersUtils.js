// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SecurityUtils } from './SecurityUtils';

// TODO: change this when migrating to Cosmo Tech API v4 (new property should be response.id)
const getLastRunId = (runner) => {
  if (runner == null) return;

  // Runner property 'lastRunId' was a temporary breaking change of Cosmo Tech API in some versions of 3.2 and 3.3, but
  // should not exist in 3.3.2 (at least not until v4)
  if (runner?.lastRunId != null) {
    console.warn(
      'The Cosmo Tech API returned an object with a property "lastRunId". If you are using v3.2 or v3.3 of the ' +
        'Cosmo Tech API, please consider upgrading to the last version available.'
    );
    return runner.lastRunId;
  }

  return runner?.lastRun?.runnerRunId;
};

// TODO: change this when migrating to Cosmo Tech API v4 (new property should be response.id)
const getRunIdFromRunnerStart = (runnerStartResponse) => runnerStartResponse?.runnerRunId;

// TODO: change this when migrating to Cosmo Tech API v4 (new shape should be {lastRunId})
const forgeRunnerLastRunIdPatch = (lastRunId) => ({ lastRun: { runnerRunId: lastRunId } });

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

export const RunnersUtils = {
  forgeRunnerLastRunIdPatch,
  getLastRunId,
  getRunIdFromRunnerStart,
  patchRunnerWithCurrentUserPermissions,
  patchRunnerParameterValues,
  updateParentIdOnDelete,
};
