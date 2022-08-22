// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// NOTE list of existing permissions should be provided by back-end. we may need granularity of permissions above

// TODO use these permissions when specs are available
// export const APPLICATION_PERMISSIONS = {
//   READ: 'commonpermissionread',
//   WRITE: 'commonpermissionwrite',
//   CREATE_SCENARIO: 'commonpermissioncreatescenario',
// };

export const APP_PERMISSIONS = {
  ADMIN: 'app.admin',
  SCENARIO: {
    CREATE: 'app.scenario.create',
    DELETE: 'app.scenario.delete',
    EDIT_PARAMETERS: 'app.scenario.editParameters',
    EDIT_PERMISSIONS: 'app.scenario.editPermissions',
    EDIT_VALIDATION_STATUS: 'app.scenario.editValidationStatus',
    LAUNCH: 'app.scenario.launch',
    RENAME: 'app.scenario.rename',
    VIEW: 'app.scenario.view',
    VIEW_PERMISSIONS: 'app.scenario.viewPermissions',
    VIEW_RESULTS: 'app.scenario.viewResults',
  },
};

export const ACL_PERMISSIONS = {
  SCENARIO: {
    DELETE: 'acl.scenario.delete',
    EDIT_PARAMETERS: 'acl.scenario.editParameters',
    EDIT_PERMISSIONS: 'acl.scenario.editPermissions',
    EDIT_VALIDATION_STATUS: 'acl.scenario.editValidationStatus',
    LAUNCH: 'acl.scenario.launch',
    RENAME: 'acl.scenario.rename',
    VIEW: 'acl.scenario.view',
    VIEW_PERMISSIONS: 'acl.scenario.viewPermissions',
    VIEW_RESULTS: 'acl.scenario.viewResults',
  },
};
