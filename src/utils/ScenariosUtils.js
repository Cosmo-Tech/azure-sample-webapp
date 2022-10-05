// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { SecurityUtils } from './SecurityUtils';
import { ACL_ROLES, PERMISSIONS_BY_ACL_ROLE } from '../services/config/accessControl';

const getUserPermissionsForScenario = (scenario, userEmail, userId) => {
  let userPermissions = SecurityUtils.getUserPermissionsForResource(
    scenario.security,
    userEmail,
    PERMISSIONS_BY_ACL_ROLE
  );

  if (scenario.ownerId === userId) {
    const creatorPermissions = PERMISSIONS_BY_ACL_ROLE[ACL_ROLES.SCENARIO.CREATOR];
    userPermissions = [...new Set(userPermissions.concat(creatorPermissions))];
  }

  return userPermissions;
};

const patchScenarioWithCurrentUserPermissions = (scenario, userEmail, userId) => {
  scenario.security = {
    ...scenario.security,
    currentUserPermissions: getUserPermissionsForScenario(scenario, userEmail, userId),
  };
};

export const ScenariosUtils = {
  getUserPermissionsForScenario,
  patchScenarioWithCurrentUserPermissions,
};
