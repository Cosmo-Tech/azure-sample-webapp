// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const ACL_PERMISSIONS = {
  DATASET: {
    READ: 'read',
    READ_SECURITY: 'read_security',
    WRITE: 'write',
    DELETE: 'delete',
    WRITE_SECURITY: 'write_security',
  },
  ORGANIZATION: {
    READ: 'read',
    READ_SECURITY: 'read_security',
    CREATE_CHILDREN: 'create_children',
    WRITE: 'write',
    DELETE: 'delete',
    WRITE_SECURITY: 'write_security',
  },
  SCENARIO: {
    READ: 'read',
    READ_SECURITY: 'read_security',
    LAUNCH: 'launch',
    WRITE: 'write',
    VALIDATE: 'validate',
    DELETE: 'delete',
    WRITE_SECURITY: 'write_security',
  },
  WORKSPACE: {
    READ: 'read',
    READ_SECURITY: 'read_security',
    CREATE_CHILDREN: 'create_children',
    WRITE: 'write',
    DELETE: 'delete',
    WRITE_SECURITY: 'write_security',
  },
};
