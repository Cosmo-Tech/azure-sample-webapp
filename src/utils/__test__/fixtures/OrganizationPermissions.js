// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const ORGANIZATION_PERMISSIONS = [
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

export const EXPECTED_PERMISSIONS_MAPPING = {
  organization: {
    none: [],
    viewer: ['read', 'read_security'],
    user: ['read', 'read_security', 'create_children'],
    editor: ['read', 'read_security', 'create_children', 'write'],
    admin: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
  },
  workspace: {
    none: [],
    viewer: ['read', 'read_security'],
    user: ['read', 'read_security', 'create_children'],
    editor: ['read', 'read_security', 'create_children', 'write'],
    admin: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
  },
  scenario: {
    none: [],
    viewer: ['read', 'read_security'],
    editor: ['read', 'read_security', 'launch', 'write'],
    validator: ['read', 'read_security', 'launch', 'write', 'validate'],
    admin: ['read', 'read_security', 'launch', 'write', 'validate', 'write_security', 'delete'],
  },
};

export const EXPECTED_PERMISSIONS = {
  organization: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
  workspace: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
  scenario: ['read', 'read_security', 'launch', 'write', 'validate', 'write_security', 'delete'],
};

export const EXPECTED_ROLES = {
  organization: ['none', 'viewer', 'user', 'editor', 'admin'],
  workspace: ['none', 'viewer', 'user', 'editor', 'admin'],
  scenario: ['none', 'viewer', 'editor', 'validator', 'admin'],
};
