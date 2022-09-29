// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_PERMISSIONS = {
  commonrolecreator: [],
  scenariorolerunscenario: [],
  scenariorolevalidator: [],
  commonrolereader: [],
  commonrolewriter: [],
  commonroleadmin: [],
};

// commonpermissiondelete;
// commonpermissionwrite;
// commonpermissioncreatechildren;

// com.cosmotech.api.rbac.getCommonRolesDefinition ?
// com.cosmotech.api.rbac.getPermissions ?

export const DEFAULT_ORGANIZATION = {
  id: 'O-stbdorgztn',
  name: 'Stubbed organization',
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  security: {
    default: '',
    accessControlList: [],
  },
  services: null,
  users: null,
};

export const DEFAULT_ORGANIZATIONS_LIST = [DEFAULT_ORGANIZATION];
