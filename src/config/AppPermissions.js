// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

/*
 * Defines the mapping between:
 * - roles application defined in core Enterprise Application
 * - WebApplication persona
 */
const APP_ROLES = {
  organizationAdmin: 'Organization.Admin',
  organizationCollaborator: 'Organization.Collaborator',
  organizationModeler: 'Organization.Modeler',
  // powerUser
  organizationUser: 'Organization.User',
  // viewer
  organizationViewer: 'Organization.Viewer',
  platformAdmin: 'Platform.Admin',
};

/*
 * Defines permissions on WebApplication actions
 */
export const PERMISSIONS = {
  canCreateScenario: 'can-create-scenario',
  canDeleteScenario: 'can-delete-scenario',
  canEditOrLaunchScenario: 'can-edit-launch-scenario',
};

/*
 * Defines WebApplication profiles.
 * The aim of this part is to describe what actions are allowed for specifics roles.
 * Add a new profile like following:
 * ["New_Role"]: [ PERMISSIONS.canCreateScenario,PERMISSIONS.canDeleteScenario,]
 * means that users with role "New_Role" on the core Enterprise Application side will be allowed to:
 * - create a scenario
 * - delete a scenario
 * but will not be allowed to edit or launch a scenario
 *
 */
export const PROFILES = {
  [APP_ROLES.organizationAdmin]: [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.organizationCollaborator]: [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.organizationModeler]: [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.organizationUser]: [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
  [APP_ROLES.organizationViewer]: [],
  [APP_ROLES.platformAdmin]: [
    PERMISSIONS.canCreateScenario,
    PERMISSIONS.canDeleteScenario,
    PERMISSIONS.canEditOrLaunchScenario,
  ],
};
