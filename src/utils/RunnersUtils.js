// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SecurityUtils } from './SecurityUtils';

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

export const RunnersUtils = {
  patchRunnerWithCurrentUserPermissions,
  patchRunnerParameterValues,
};
