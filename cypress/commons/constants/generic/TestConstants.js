// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export { ORGANIZATION_ID, WORKSPACE_ID } from '../../../../src/config/GlobalConfiguration';

export const URL_ROOT = 'https://dev.api.cosmotech.com';
export const AUTH_QUERY_URL =
  'https://login.microsoftonline.com/e413b834-8be8-4822-a370-be619545cb49/oauth2/v2.0/token';
export const LOCAL_WEBAPP_URL = 'http://localhost:3000';
export const URL_POWERBI = `${LOCAL_WEBAPP_URL}/api/get-embed-info`;

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
  SCENARIO: URL_ROOT + '/.*/scenarios/(s-[\\w]+)', // Capture scenario id
  RUN_SCENARIO: URL_ROOT + '/.*/scenarios/(s-[\\w]+)/run', // Capture scenario id
  DATASETS: URL_ROOT + '/.*/datasets',
  WORKSPACES: URL_ROOT + '/.*/workspaces',
  WORKSPACE: URL_ROOT + '/.*/workspaces/((w|W)-[\\w]+)', // Capture workspace id
  SOLUTIONS: URL_ROOT + '/.*/solutions',
  SOLUTION: URL_ROOT + '/.*/solutions/((sol|SOL)-[\\w]+)', // Capture solution id
};

export const API_REGEX = {
  ALL: new RegExp(URL_ROOT),
  SCENARIOS: new RegExp('^' + API_ENDPOINT.SCENARIOS + '$'),
  SCENARIO: new RegExp('^' + API_ENDPOINT.SCENARIO),
  RUN_SCENARIO: new RegExp('^' + API_ENDPOINT.RUN_SCENARIO),
  DATASETS: new RegExp('^' + API_ENDPOINT.DATASETS + '$'),
  WORKSPACE: new RegExp('^' + API_ENDPOINT.WORKSPACE + '$'),
  SOLUTION: new RegExp('^' + API_ENDPOINT.SOLUTION),
};

export const SCENARIO_RUN_IN_PROGRESS = 'Scenario run in progress...';

export const WEBAPP_URL_REGEX = {
  SCENARIO_PAGE: new RegExp(PAGE_NAME.SCENARIO + '$'),
  SCENARIO_PAGE_WITH_ID: new RegExp(PAGE_NAME.SCENARIO + '/(s-[\\w]+)'),
};
