// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_ORGANIZATION_PERMISSIONS = [
  {
    component: 'organization',
    roles: {
      none: [],
      viewer: ['read', 'read_security'],
      user: ['read', 'read_security', 'create_children'],
      editor: ['read', 'read_security', 'create_children', 'write'],
      admin: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
    },
  },
  {
    component: 'workspace',
    roles: {
      none: [],
      viewer: ['read', 'read_security'],
      user: ['read', 'read_security', 'create_children'],
      editor: ['read', 'read_security', 'create_children', 'write'],
      admin: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
    },
  },
  {
    component: 'scenario',
    roles: {
      none: [],
      viewer: ['read', 'read_security'],
      editor: ['read', 'read_security', 'launch', 'write'],
      validator: ['read', 'read_security', 'launch', 'write', 'validate'],
      admin: ['read', 'read_security', 'launch', 'write', 'validate', 'write_security', 'delete'],
    },
  },
];

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
