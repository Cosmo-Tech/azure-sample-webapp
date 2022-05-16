// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PERMISSIONS } from '../services/config/Permissions';

export const APP_ROLES = {
  OrganizationAdmin: 'Organization.Admin',
  OrganizationCollaborator: 'Organization.Collaborator',
  OrganizationModeler: 'Organization.Modeler',
  OrganizationUser: 'Organization.User',
  OrganizationViewer: 'Organization.Viewer',
  PlatformAdmin: 'Platform.Admin',
};

export const PROFILES = {
  [APP_ROLES.OrganizationAdmin]: [
    PERMISSIONS.canChangeScenarioValidationStatus,
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.OrganizationCollaborator]: [
    PERMISSIONS.canChangeScenarioValidationStatus,
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.OrganizationModeler]: [
    PERMISSIONS.canChangeScenarioValidationStatus,
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.OrganizationUser]: [
    PERMISSIONS.canChangeScenarioValidationStatus,
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.OrganizationViewer]: [],
  [APP_ROLES.PlatformAdmin]: [
    PERMISSIONS.canChangeScenarioValidationStatus,
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
};
