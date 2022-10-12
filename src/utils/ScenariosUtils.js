// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { SecurityUtils } from './SecurityUtils';
import { ACL_ROLES } from '../services/config/accessControl';

const _getUserPermissionsForScenario = (scenario, userEmail, userId, permissionsMapping) => {
  if (scenario?.security == null || Object.keys(scenario?.security).length === 0) {
    console.warn(`No security data for scenario ${scenario?.id}, falling back to v1 behavior`);
    return permissionsMapping[ACL_ROLES.SCENARIO.ADMIN];
  }
  if (scenario.ownerId === userId) {
    return permissionsMapping[ACL_ROLES.SCENARIO.ADMIN];
  }

  return SecurityUtils.getUserPermissionsForResource(scenario.security, userEmail, permissionsMapping);
};

const patchScenarioWithCurrentUserPermissions = (scenario, userEmail, userId, permissionsMapping) => {
  // scenario.security seems to be read-only, we have to create a new object to add a "currentUserPermissions" key
  scenario.security = {
    ...scenario.security,
    currentUserPermissions: _getUserPermissionsForScenario(scenario, userEmail, userId, permissionsMapping),
  };
};

export const ScenariosUtils = {
  patchScenarioWithCurrentUserPermissions,
};
