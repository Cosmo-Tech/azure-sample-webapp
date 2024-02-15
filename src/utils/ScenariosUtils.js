// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SecurityUtils } from './SecurityUtils';

const _getUserPermissionsForScenario = (scenario, userEmail, userId, permissionsMapping) => {
  if (scenario?.security == null || Object.keys(scenario?.security).length === 0) {
    console.warn(`No security data for scenario ${scenario?.id}, restricting access to its content`);
    return [];
  }
  return SecurityUtils.getUserPermissionsForResource(scenario.security, userEmail, permissionsMapping);
};

const patchScenarioParameterValues = (solutionParameters, parameterValues) => {
  if (!Array.isArray(parameterValues) || !Array.isArray(solutionParameters)) return;

  parameterValues.forEach((value) => {
    if (value.varType != null || value.parameterId == null) return;

    const parameterDefinition = solutionParameters.find(
      (solutionParameter) => solutionParameter.id === value.parameterId
    );
    if (parameterDefinition) value.varType = parameterDefinition.varType;
    else console.warn(`Unknown parameter value ${value.parameterId} without any varType found in scenario data`);
  });
};

const patchScenarioWithCurrentUserPermissions = (scenario, userEmail, userId, permissionsMapping) => {
  // scenario.security seems to be read-only, we have to create a new object to add a "currentUserPermissions" key
  scenario.security = {
    ...scenario.security,
    currentUserPermissions: _getUserPermissionsForScenario(scenario, userEmail, userId, permissionsMapping),
  };
};

export const ScenariosUtils = {
  patchScenarioParameterValues,
  patchScenarioWithCurrentUserPermissions,
};
