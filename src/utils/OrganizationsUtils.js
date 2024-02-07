// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SecurityUtils } from './SecurityUtils';

const _getUserPermissionsForOrganization = (organization, userEmail, permissionsMapping) => {
  if (organization?.security == null || Object.keys(organization?.security).length === 0) {
    console.warn(`No security data for organization ${organization?.id}, restricting access to its content`);
    return [];
  }
  return SecurityUtils.getUserPermissionsForResource(organization.security, userEmail, permissionsMapping);
};

const patchOrganizationWithCurrentUserPermissions = (organization, userEmail, permissionsMapping) => {
  organization.security = {
    ...organization.security,
    currentUserPermissions: _getUserPermissionsForOrganization(organization, userEmail, permissionsMapping),
  };
};

export const OrganizationsUtils = {
  patchOrganizationWithCurrentUserPermissions,
};
