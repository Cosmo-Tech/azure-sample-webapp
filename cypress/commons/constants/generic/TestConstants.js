// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export { ORGANIZATION_ID } from '../../../../src/config/GlobalConfiguration';

export const URL_ROOT = 'https://kubernetes.cosmotech.com/cosmotech-api/brewery/v4';
export const AUTH_QUERY_URL = '';
export const GET_EMBED_INFO_ENDPOINT = '/api/get-embed-info';

export const PAGE_NAME = {
  SCENARIO: '/scenario',
  SCENARIOS: '/scenarios',
  SIGN_IN: '/sign-in',
  SCENARIO_MANAGER: '/scenariomanager',
  WORKSPACE_SELECTOR: '/workspaces',
};

export const URL_REGEX = {
  SCENARIOS_LIST: new RegExp(`^${URL_ROOT}(?:/.*)?${PAGE_NAME.SCENARIOS}$`),
  SCENARIO_PAGE: new RegExp(`^${URL_ROOT}(?:/.*)?${PAGE_NAME.SCENARIOS}`),
  SCENARIO_PAGE_WITH_ID: new RegExp(`^${URL_ROOT}(?:/.*)?${PAGE_NAME.SCENARIOS}/.*`),
  SCENARIO_PAGE_RUN_WITH_ID: new RegExp(`^${URL_ROOT}(?:/.*)?${PAGE_NAME.SCENARIOS}/.*/run`),
};

export const API_ENDPOINT = {
  SCENARIOS: URL_ROOT + '/.*/scenarios',
  SCENARIO: URL_ROOT + '/.*/scenarios/(s-[\\w]+)',
  SCENARIO_DEFAULT_SECURITY: URL_ROOT + '/.*/scenarios/(s-[\\w]+)/security/default',
  SCENARIO_SECURITY_ACL: URL_ROOT + '/.*/scenarios/(s-[\\w]+)/security/access',
  LAUNCH_SCENARIO: URL_ROOT + '/.*/scenarios/(s-[\\w]+)/run', // Endpoint to start the run of a scenario
  SCENARIO_RUN: URL_ROOT + '/.*/scenarioruns/(sr-[\\w]+)', // Endpoint to get the data of a specific scenario run
  STOP_SCENARIO_RUN: URL_ROOT + '/.*/scenarioruns/(sr-[\\w]+)/stop', // Endpoint to stop a scenario run
  SCENARIO_RUN_STATUS: URL_ROOT + '/.*/scenarioruns/(sr-[\\w]+)/status',
  DATASETS: URL_ROOT + '/.*/datasets',
  DATASET: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)',
  DATASET_DEFAULT_SECURITY: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/security/default',
  DATASET_LINK: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/link\\?workspaceId=((w|W)-[\\w]+)',
  DATASET_SECURITY_ACL: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/security/access',
  DATASET_SECURITY_USER_ACCESS: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/security/access/(.*)',
  DATASET_REFRESH: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/refresh',
  DATASET_ROLLBACK: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/refresh/rollback',
  DATASET_STATUS: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/status',
  DATASET_TWINGRAPH: URL_ROOT + '/.*/datasets/((d|D)-[\\w]+)/twingraph',
  RUNNERS: URL_ROOT + '/.*/runners',
  RUNNER: URL_ROOT + '/.*/runners/((r|R)-[\\w]+)',
  START_RUNNER: URL_ROOT + '/.*/runners/((r|R)-[\\w]+)/start', // Endpoint to start the runner
  RUNNER_STATE: URL_ROOT + '/.*/runs/(run-[\\w]+)/status',
  STOP_RUNNER: URL_ROOT + '/.*/runners/((r|R)-[\\w]+)/stop', // Endpoint to stop a runner run
  RUNNER_DEFAULT_SECURITY: URL_ROOT + '/.*/runners/((r|R)-[\\w]+)/security/default',
  RUNNER_SECURITY_ACL: URL_ROOT + '/.*/runners/((r|R)-[\\w]+)/security/access',
  RUNNER_SECURITY_USER_ACCESS: URL_ROOT + '/.*/runners/((r|R)-[\\w]+)/security/access/(.*)',
  WORKSPACES: URL_ROOT + '/.*/workspaces',
  WORKSPACE: URL_ROOT + '/.*/workspaces/((w|W)-[\\w]+)',
  SOLUTIONS: URL_ROOT + '/.*/solutions',
  SOLUTION: URL_ROOT + '/.*/solutions/((sol|SOL)-[\\w]+)',
  PERMISSIONS_MAPPING: URL_ROOT + '(?:/.*)?/organizations/permissions',
  ORGANIZATIONS: URL_ROOT + '(?:/.*)?/organizations',
  ORGANIZATION: URL_ROOT + '(?:/.*)?/organizations/((o|O)-[\\w]+)',
  ORGANIZATION_USERS: URL_ROOT + '(?:/.*)?/organizations/((o|O)-[\\w]+)/security/users',
  WORKSPACE_USERS: URL_ROOT + '/.*/workspaces/((w|W)-[\\w]+)/security/users',
  FILE_UPLOAD: URL_ROOT + '(?:/.*)?/organizations/.*/workspaces/.*/files',
  FILE_DOWNLOAD: URL_ROOT + '(?:/.*)?/organizations/.*/workspaces/.*/files/download\\?file_name=(.*)',
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
  RUNNER: {
    NONE: 'none',
    VIEWER: 'viewer',
    EDITOR: 'editor',
    VALIDATOR: 'validator',
    ADMIN: 'admin',
  },
  DATASET: {
    NONE: 'none',
    VIEWER: 'viewer',
    EDITOR: 'editor',
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
  RUNNER: {
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
  [ROLES.RUNNER.VIEWER]: {
    granted: [PERMISSIONS.RUNNER.READ, PERMISSIONS.RUNNER.READ_SECURITY],
    notGranted: [
      PERMISSIONS.RUNNER.LAUNCH,
      PERMISSIONS.RUNNER.WRITE,
      PERMISSIONS.RUNNER.VALIDATE,
      PERMISSIONS.RUNNER.WRITE_SECURITY,
      PERMISSIONS.RUNNER.DELETE,
    ],
  },
  [ROLES.RUNNER.EDITOR]: {
    granted: [
      PERMISSIONS.RUNNER.READ,
      PERMISSIONS.RUNNER.READ_SECURITY,
      PERMISSIONS.RUNNER.LAUNCH,
      PERMISSIONS.RUNNER.WRITE,
    ],
    notGranted: [PERMISSIONS.RUNNER.VALIDATE, PERMISSIONS.RUNNER.WRITE_SECURITY, PERMISSIONS.RUNNER.DELETE],
  },
  [ROLES.RUNNER.VALIDATOR]: {
    granted: [
      PERMISSIONS.RUNNER.READ,
      PERMISSIONS.RUNNER.READ_SECURITY,
      PERMISSIONS.RUNNER.LAUNCH,
      PERMISSIONS.RUNNER.WRITE,
      PERMISSIONS.RUNNER.VALIDATE,
    ],
    notGranted: [PERMISSIONS.RUNNER.WRITE_SECURITY, PERMISSIONS.RUNNER.DELETE],
  },
  [ROLES.RUNNER.ADMIN]: {
    granted: [
      PERMISSIONS.RUNNER.READ,
      PERMISSIONS.RUNNER.READ_SECURITY,
      PERMISSIONS.RUNNER.LAUNCH,
      PERMISSIONS.RUNNER.WRITE,
      PERMISSIONS.RUNNER.VALIDATE,
      PERMISSIONS.RUNNER.WRITE_SECURITY,
      PERMISSIONS.RUNNER.DELETE,
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
  LAUNCH_SCENARIO: new RegExp('^' + API_ENDPOINT.LAUNCH_SCENARIO),
  SCENARIO_RUN: new RegExp('^' + API_ENDPOINT.SCENARIO_RUN),
  STOP_SCENARIO_RUN: new RegExp('^' + API_ENDPOINT.STOP_SCENARIO_RUN),
  SCENARIO_RUN_STATUS: new RegExp('^' + API_ENDPOINT.SCENARIO_RUN_STATUS),
  DATASETS: new RegExp('^' + API_ENDPOINT.DATASETS),
  DATASET: new RegExp('^' + API_ENDPOINT.DATASET + '$'),
  DATASET_DEFAULT_SECURITY: new RegExp('^' + API_ENDPOINT.DATASET_DEFAULT_SECURITY + '$'),
  DATASET_LINK: new RegExp('^' + API_ENDPOINT.DATASET_LINK + '$'),
  DATASET_SECURITY_ACL: new RegExp('^' + API_ENDPOINT.DATASET_SECURITY_ACL + '$'),
  DATASET_SECURITY_USER_ACCESS: new RegExp('^' + API_ENDPOINT.DATASET_SECURITY_USER_ACCESS + '$'),
  DATASET_REFRESH: new RegExp('^' + API_ENDPOINT.DATASET_REFRESH + '$'),
  DATASET_ROLLBACK: new RegExp('^' + API_ENDPOINT.DATASET_ROLLBACK + '$'),
  DATASET_STATUS: new RegExp('^' + API_ENDPOINT.DATASET_STATUS + '$'),
  RUNNERS: new RegExp('^' + API_ENDPOINT.RUNNERS),
  RUNNER: new RegExp('^' + API_ENDPOINT.RUNNER),
  START_RUNNER: new RegExp('^' + API_ENDPOINT.START_RUNNER),
  RUNNER_STATE: new RegExp('^' + API_ENDPOINT.RUNNER_STATE),
  STOP_RUNNER: new RegExp('^' + API_ENDPOINT.STOP_RUNNER),
  DATASET_TWINGRAPH: new RegExp('^' + API_ENDPOINT.DATASET_TWINGRAPH + '$'),
  RUNNER_DEFAULT_SECURITY: new RegExp('^' + API_ENDPOINT.RUNNER_DEFAULT_SECURITY + '$'),
  RUNNER_SECURITY_ACL: new RegExp('^' + API_ENDPOINT.RUNNER_SECURITY_ACL + '$'),
  RUNNER_SECURITY_USER_ACCESS: new RegExp('^' + API_ENDPOINT.RUNNER_SECURITY_USER_ACCESS + '$'),
  WORKSPACE: new RegExp('^' + API_ENDPOINT.WORKSPACE + '$'),
  WORKSPACES: new RegExp('^' + API_ENDPOINT.WORKSPACES + '$'),
  SOLUTION: new RegExp('^' + API_ENDPOINT.SOLUTION),
  PERMISSIONS_MAPPING: new RegExp('^' + API_ENDPOINT.PERMISSIONS_MAPPING + '$'),
  ORGANIZATIONS: new RegExp('^' + API_ENDPOINT.ORGANIZATIONS + '$'),
  ORGANIZATION: new RegExp('^' + API_ENDPOINT.ORGANIZATION + '$'),
  ORGANIZATION_USERS: new RegExp('^' + API_ENDPOINT.ORGANIZATION_USERS + '$'),
  WORKSPACE_USERS: new RegExp('^' + API_ENDPOINT.WORKSPACE_USERS + '$'),
  FILE_UPLOAD: new RegExp('^' + API_ENDPOINT.FILE_UPLOAD + '$'),
  FILE_DOWNLOAD: new RegExp('^' + API_ENDPOINT.FILE_DOWNLOAD + '$'),
};

export const SCENARIO_RUN_IN_PROGRESS = 'Scenario run in progress...';
export const SCENARIO_TRANSFER_IN_PROGRESS = 'Transfer of scenario results in progress...';
export const FAILED_SCENARIO_RUN = 'An error occurred during the scenario run';

export const WEBAPP_URL_REGEX = {
  SCENARIO_PAGE: new RegExp(PAGE_NAME.SCENARIO + '$'),
  SCENARIO_ID_PATTERN: /\/(r-\w+)/,
  WORKSPACE: new RegExp(`^${URL_ROOT}/((w|W)-[\\w]+).*`),
};
