// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PERMISSIONS } from '../services/config/Permissions';

export const PROFILES = {
  'Organization.Admin': [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  'Organization.Collaborator': [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  'Organization.Modeler': [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  'Organization.User': [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  'Organization.Viewer': [],
  'Platform.Admin': [PERMISSIONS.canCreateScenario, PERMISSIONS.canDeleteScenario, PERMISSIONS.canEditOrLaunchScenario],
};
