// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES, PERMISSIONS } from '../constants';

export const DEFAULT_APPLICATION = {
  status: 'SUCCESS',
  error: null,
  isDarkTheme: true,
  roles: {
    organization: [
      ROLES.ORGANIZATION.NONE,
      ROLES.ORGANIZATION.VIEWER,
      ROLES.ORGANIZATION.USER,
      ROLES.ORGANIZATION.EDITOR,
      ROLES.ORGANIZATION.ADMIN,
    ],
    workspace: [
      ROLES.WORKSPACE.NONE,
      ROLES.WORKSPACE.VIEWER,
      ROLES.WORKSPACE.USER,
      ROLES.WORKSPACE.EDITOR,
      ROLES.WORKSPACE.ADMIN,
    ],
    runner: [ROLES.RUNNER.NONE, ROLES.RUNNER.VIEWER, ROLES.RUNNER.EDITOR, ROLES.RUNNER.VALIDATOR, ROLES.RUNNER.ADMIN],
  },
  permissions: {
    organization: [
      PERMISSIONS.ORGANIZATION.READ,
      PERMISSIONS.ORGANIZATION.READ_SECURITY,
      PERMISSIONS.ORGANIZATION.CREATE_CHILDREN,
      PERMISSIONS.ORGANIZATION.WRITE,
      PERMISSIONS.ORGANIZATION.WRITE,
      PERMISSIONS.ORGANIZATION.WRITE_SECURITY,
      PERMISSIONS.ORGANIZATION.WRITE_SECURITY,
      PERMISSIONS.ORGANIZATION.DELETE,
    ],
    workspace: [
      PERMISSIONS.WORKSPACE.READ,
      PERMISSIONS.WORKSPACE.READ_SECURITY,
      PERMISSIONS.WORKSPACE.CREATE_CHILDREN,
      PERMISSIONS.WORKSPACE.WRITE,
      PERMISSIONS.WORKSPACE.WRITE_SECURITY,
      PERMISSIONS.WORKSPACE.DELETE,
    ],
    runner: [
      PERMISSIONS.RUNNER.READ,
      PERMISSIONS.RUNNER.READ_SECURITY,
      PERMISSIONS.RUNNER.LAUNCH,
      PERMISSIONS.RUNNER.WRITE,
      PERMISSIONS.RUNNER.VALIDATE,
      PERMISSIONS.RUNNER.WRITE_SECURITY,
      PERMISSIONS.RUNNER.DELETE,
    ],
  },
  permissionsMapping: {
    organization: {
      [ROLES.ORGANIZATION.VIEWER]: [PERMISSIONS.ORGANIZATION.READ, PERMISSIONS.ORGANIZATION.READ_SECURITY],
      [ROLES.ORGANIZATION.VIEWER]: [
        PERMISSIONS.ORGANIZATION.READ,
        PERMISSIONS.ORGANIZATION.READ_SECURITY,
        PERMISSIONS.ORGANIZATION.CREATE_CHILDREN,
      ],
      [ROLES.ORGANIZATION.EDITOR]: [
        PERMISSIONS.ORGANIZATION.READ,
        PERMISSIONS.ORGANIZATION.READ_SECURITY,
        PERMISSIONS.ORGANIZATION.CREATE_CHILDREN,
        PERMISSIONS.ORGANIZATION.WRITE,
      ],
      [ROLES.ORGANIZATION.ADMIN]: [
        PERMISSIONS.ORGANIZATION.READ,
        PERMISSIONS.ORGANIZATION.READ_SECURITY,
        PERMISSIONS.ORGANIZATION.CREATE_CHILDREN,
        PERMISSIONS.ORGANIZATION.WRITE,
        PERMISSIONS.ORGANIZATION.WRITE_SECURITY,
        PERMISSIONS.ORGANIZATION.WRITE_SECURITY,
      ],
      [ROLES.ORGANIZATION.NONE]: [],
    },
    workspace: {
      [ROLES.WORKSPACE.VIEWER]: [PERMISSIONS.WORKSPACE.READ, PERMISSIONS.WORKSPACE.READ_SECURITY],
      [ROLES.WORKSPACE.USER]: [
        PERMISSIONS.WORKSPACE.READ,
        PERMISSIONS.WORKSPACE.READ_SECURITY,
        PERMISSIONS.WORKSPACE.CREATE_CHILDREN,
      ],
      [ROLES.WORKSPACE.EDITOR]: [
        PERMISSIONS.WORKSPACE.READ,
        PERMISSIONS.WORKSPACE.READ_SECURITY,
        PERMISSIONS.WORKSPACE.CREATE_CHILDREN,
        PERMISSIONS.WORKSPACE.WRITE,
      ],
      [ROLES.WORKSPACE.ADMIN]: [
        PERMISSIONS.WORKSPACE.READ,
        PERMISSIONS.WORKSPACE.READ_SECURITY,
        PERMISSIONS.WORKSPACE.CREATE_CHILDREN,
        PERMISSIONS.WORKSPACE.WRITE,
        PERMISSIONS.WORKSPACE.WRITE_SECURITY,
        PERMISSIONS.WORKSPACE.DELETE,
      ],
      [ROLES.WORKSPACE.NONE]: [],
    },
    runner: {
      [ROLES.RUNNER.VIEWER]: [PERMISSIONS.RUNNER.READ, PERMISSIONS.RUNNER.READ_SECURITY],
      [ROLES.RUNNER.EDITOR]: [
        PERMISSIONS.RUNNER.READ,
        PERMISSIONS.RUNNER.READ_SECURITY,
        PERMISSIONS.RUNNER.LAUNCH,
        PERMISSIONS.RUNNER.WRITE,
      ],
      [ROLES.RUNNER.VALIDATOR]: [
        PERMISSIONS.RUNNER.READ,
        PERMISSIONS.RUNNER.READ_SECURITY,
        PERMISSIONS.RUNNER.LAUNCH,
        PERMISSIONS.RUNNER.WRITE,
        PERMISSIONS.RUNNER.VALIDATE,
      ],
      [ROLES.RUNNER.ADMIN]: [
        PERMISSIONS.RUNNER.READ,
        PERMISSIONS.RUNNER.READ_SECURITY,
        PERMISSIONS.RUNNER.LAUNCH,
        PERMISSIONS.RUNNER.WRITE,
        PERMISSIONS.RUNNER.VALIDATE,
        PERMISSIONS.RUNNER.WRITE_SECURITY,
        PERMISSIONS.RUNNER.DELETE,
      ],
      [ROLES.RUNNER.NONE]: [],
    },
  },
};
