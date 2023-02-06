// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export { ORGANIZATION_ID, WORKSPACE_ID } from '../../../../src/config/GlobalConfiguration';

export const URL_ROOT = 'https://dev.api.cosmotech.com';
export const AUTH_QUERY_URL =
  'https://login.microsoftonline.com/e413b834-8be8-4822-a370-be619545cb49/oauth2/v2.0/token';
export const LOCAL_WEBAPP_URL = 'http://localhost:3000';
export const URL_POWERBI = `${LOCAL_WEBAPP_URL}/api/get-embed-info`;
export const BREWERY_WORKSPACE_ID = 'w-81264wr3xw5q5';

export const PAGE_NAME = {
  SCENARIO: '/scenario',
  SCENARIOS: '/scenarios',
  SIGN_IN: '/sign-in',
  SCENARIO_MANAGER: '/scenariomanager',
};

export const URL_REGEX = {
  SCENARIOS_LIST: new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}$`),
  SCENARIO_PAGE: new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}`),
  SCENARIO_PAGE_WITH_ID: new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/.*`),
  SCENARIO_PAGE_RUN_WITH_ID: new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/.*/run`),
};

export const API_ENDPOINT = {
  SCENARIOS: URL_ROOT + '/.*/scenarios',
  SCENARIO: URL_ROOT + '/.*/scenarios/(s-[\\w]+)',
  SCENARIO_DEFAULT_SECURITY: URL_ROOT + '/.*/scenarios/(s-[\\w]+)/security/default',
  SCENARIO_SECURITY_ACL: URL_ROOT + '/.*/scenarios/(s-[\\w]+)/security/access',
  RUN_SCENARIO: URL_ROOT + '/.*/scenarios/(s-[\\w]+)/run',
  DATASETS: URL_ROOT + '/.*/datasets',
  WORKSPACES: URL_ROOT + '/.*/workspaces',
  WORKSPACE: URL_ROOT + '/.*/workspaces/((w|W)-[\\w]+)',
  SOLUTIONS: URL_ROOT + '/.*/solutions',
  SOLUTION: URL_ROOT + '/.*/solutions/((sol|SOL)-[\\w]+)',
  PERMISSIONS_MAPPING: URL_ROOT + '/.*/organizations/permissions',
  ORGANIZATION_USERS: URL_ROOT + '/.*/organizations/((o|O)-[\\w]+)/security/users',
  WORKSPACE_USERS: URL_ROOT + '/.*/workspaces/((w|W)-[\\w]+)/security/users',
  // TODO ?
  // /organizations/{organization_id}/workspaces/{workspace_id}/permissions/{role}:
  // /organizations/{organization_id}/workspaces/{workspace_id}/scenarios/permissions/{role}
};

export const ROLES = {
  ORGANIZATION: {
    NONE: 'none',
    VIEWER: 'viewer',
    USER: 'user',
    EDITOR: 'editor',
    ADMIN: 'admin',
  },
  WORKSPACE: {
    NONE: 'none',
    VIEWER: 'viewer',
    USER: 'user',
    EDITOR: 'editor',
    ADMIN: 'admin',
  },
  SCENARIO: {
    NONE: 'none',
    VIEWER: 'viewer',
    EDITOR: 'editor',
    VALIDATOR: 'validator',
    ADMIN: 'admin',
  },
};

export const PERMISSIONS = {
  ORGANIZATION: {
    READ: 'read',
    READ_SECURITY: 'read_security',
    CREATE_CHILDREN: 'create_children',
    WRITE: 'write',
    WRITE_SECURITY: 'write_security',
    DELETE: 'delete',
  },
  WORKSPACE: {
    READ: 'read',
    READ_SECURITY: 'read_security',
    CREATE_CHILDREN: 'create_children',
    WRITE: 'write',
    WRITE_SECURITY: 'write_security',
    DELETE: 'delete',
  },
  SCENARIO: {
    READ: 'read',
    READ_SECURITY: 'read_security',
    LAUNCH: 'launch',
    WRITE: 'write',
    VALIDATE: 'validate',
    WRITE_SECURITY: 'write_security',
    DELETE: 'delete',
  },
};

export const ROLES_PERMISSIONS_MAP = {
  [ROLES.SCENARIO.VIEWER]: {
    granted: [PERMISSIONS.SCENARIO.READ, PERMISSIONS.SCENARIO.READ_SECURITY],
    notGranted: [
      PERMISSIONS.SCENARIO.LAUNCH,
      PERMISSIONS.SCENARIO.WRITE,
      PERMISSIONS.SCENARIO.VALIDATE,
      PERMISSIONS.SCENARIO.WRITE_SECURITY,
      PERMISSIONS.SCENARIO.DELETE,
    ],
  },
  [ROLES.SCENARIO.EDITOR]: {
    granted: [
      PERMISSIONS.SCENARIO.READ,
      PERMISSIONS.SCENARIO.READ_SECURITY,
      PERMISSIONS.SCENARIO.LAUNCH,
      PERMISSIONS.SCENARIO.WRITE,
    ],
    notGranted: [PERMISSIONS.SCENARIO.VALIDATE, PERMISSIONS.SCENARIO.WRITE_SECURITY, PERMISSIONS.SCENARIO.DELETE],
  },
  [ROLES.SCENARIO.VALIDATOR]: {
    granted: [
      PERMISSIONS.SCENARIO.READ,
      PERMISSIONS.SCENARIO.READ_SECURITY,
      PERMISSIONS.SCENARIO.LAUNCH,
      PERMISSIONS.SCENARIO.WRITE,
      PERMISSIONS.SCENARIO.VALIDATE,
    ],
    notGranted: [PERMISSIONS.SCENARIO.WRITE_SECURITY, PERMISSIONS.SCENARIO.DELETE],
  },
  [ROLES.SCENARIO.ADMIN]: {
    granted: [
      PERMISSIONS.SCENARIO.READ,
      PERMISSIONS.SCENARIO.READ_SECURITY,
      PERMISSIONS.SCENARIO.LAUNCH,
      PERMISSIONS.SCENARIO.WRITE,
      PERMISSIONS.SCENARIO.VALIDATE,
      PERMISSIONS.SCENARIO.WRITE_SECURITY,
      PERMISSIONS.SCENARIO.DELETE,
    ],
    notGranted: [],
  },
};

export const API_REGEX = {
  ALL: new RegExp(URL_ROOT),
  SCENARIOS: new RegExp('^' + API_ENDPOINT.SCENARIOS + '$'),
  SCENARIO: new RegExp('^' + API_ENDPOINT.SCENARIO),
  SCENARIO_DEFAULT_SECURITY: new RegExp('^' + API_ENDPOINT.SCENARIO_DEFAULT_SECURITY + '$'),
  SCENARIO_SECURITY_ACL: new RegExp('^' + API_ENDPOINT.SCENARIO_SECURITY_ACL + '$'),
  RUN_SCENARIO: new RegExp('^' + API_ENDPOINT.RUN_SCENARIO),
  DATASETS: new RegExp('^' + API_ENDPOINT.DATASETS + '$'),
  WORKSPACE: new RegExp('^' + API_ENDPOINT.WORKSPACE + '$'),
  WORKSPACES: new RegExp('^' + API_ENDPOINT.WORKSPACES + '$'),
  SOLUTION: new RegExp('^' + API_ENDPOINT.SOLUTION),
  PERMISSIONS_MAPPING: new RegExp('^' + API_ENDPOINT.PERMISSIONS_MAPPING + '$'),
  ORGANIZATION_USERS: new RegExp('^' + API_ENDPOINT.ORGANIZATION_USERS + '$'),
  WORKSPACE_USERS: new RegExp('^' + API_ENDPOINT.WORKSPACE_USERS + '$'),
};

export const SCENARIO_RUN_IN_PROGRESS = 'Scenario run in progress...';

export const WEBAPP_URL_REGEX = {
  SCENARIO_PAGE: new RegExp(PAGE_NAME.SCENARIO + '$'),
  SCENARIO_ID_PATTERN: /\/(s-\w+)/,
};
