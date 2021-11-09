// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const ROLES = {
  viewer: 'Viewer',
  powerUser: 'PowerUser',
  admin: 'Platform.Admin',
};

export const PERMISSIONS = {
  canViewScenarioParameters: 'can-view-scenario-parameters',
  canCreateScenario: 'can-create-scenario',
  canDeleteScenario: 'can-delete-scenario',
  canEditScenario: 'can-edit-scenario',
  canLaunchScenario: 'can-launch-scenario',
  canNone: 'can-none',
};

export const PROFILES = {
  [ROLES.viewer]: [PERMISSIONS.canViewScenarioParameters],
  [ROLES.powerUser]: [
    PERMISSIONS.canViewScenarioParameters,
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditScenario,
    PERMISSIONS.canLaunchScenario,
  ],
  [ROLES.admin]: [
    PERMISSIONS.canViewScenarioParameters,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canEditScenario,
    PERMISSIONS.canLaunchScenario,
  ],
};
