// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { USER_EXAMPLE } from './users';

export const DEFAULT_ORGANIZATION_PERMISSIONS = [
  {
    component: 'organization',
    roles: {
      none: [],
      viewer: ['read'],
      user: ['read', 'read_security', 'create_children'],
      editor: ['read', 'read_security', 'create_children', 'write'],
      admin: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
    },
  },
  {
    component: 'workspace',
    roles: {
      none: [],
      viewer: ['read'],
      user: ['read', 'read_security', 'create_children'],
      editor: ['read', 'read_security', 'create_children', 'write'],
      admin: ['read', 'read_security', 'create_children', 'write', 'write_security', 'delete'],
    },
  },
  {
    component: 'scenario',
    roles: {
      none: [],
      viewer: ['read'],
      editor: ['read', 'read_security', 'launch', 'write'],
      validator: ['read', 'read_security', 'launch', 'write', 'validate'],
      admin: ['read', 'read_security', 'launch', 'write', 'validate', 'write_security', 'delete'],
    },
  },
  {
    component: 'runner',
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
  id: 'o-stbdorgztn',
  name: 'Stubbed organization',
  createInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  updateInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  security: {
    default: '',
    accessControlList: [],
  },
};

export const DEFAULT_ORGANIZATIONS = [DEFAULT_ORGANIZATION];
