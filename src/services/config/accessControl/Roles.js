// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Roles keys as declared by the back-end. These constants can be useful when verifying user roles (e.g. for admin
// permissions). The full list of roles is retrieved on app loading after the sign-in page, and stored in redux
// "application" state.

export const APP_ROLES = {
  OrganizationAdmin: 'Organization.Admin',
  OrganizationCollaborator: 'Organization.Collaborator',
  OrganizationModeler: 'Organization.Modeler',
  OrganizationUser: 'Organization.User',
  OrganizationViewer: 'Organization.Viewer',
  PlatformAdmin: 'Platform.Admin',
};

export const ACL_ROLES = {
  ORGANIZATION: { ADMIN: 'admin' },
  WORKSPACE: { ADMIN: 'admin' },
  SCENARIO: { ADMIN: 'admin' },
};
