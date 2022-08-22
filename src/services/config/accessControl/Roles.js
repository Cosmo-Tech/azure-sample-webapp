// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const APP_ROLES = {
  ORGANIZATION: {
    ADMIN: 'Organization.Admin',
    COLLABORATOR: 'Organization.Collaborator',
    MODELER: 'Organization.Modeler',
    USER: 'Organization.User',
    VIEWER: 'Organization.Viewer',
  },
  PLATFORM: {
    ADMIN: 'Platform.Admin',
  },
  OrganizationAdmin: 'Organization.Admin', // Deprecated
  OrganizationCollaborator: 'Organization.Collaborator', // Deprecated
  OrganizationModeler: 'Organization.Modeler', // Deprecated
  OrganizationUser: 'Organization.User', // Deprecated
  OrganizationViewer: 'Organization.Viewer', // Deprecated
  PlatformAdmin: 'Platform.Admin', // Deprecated
};

export const ACL_ROLES = {
  SCENARIO: {
    READER: 'commonroleviewer',
    WRITER: 'commonroleditor',
    VALIDATOR: 'scenariorolevalidator',
    ADMIN: 'commonroleadmin',
  },
};
