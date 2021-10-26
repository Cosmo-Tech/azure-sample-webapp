// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export { ORGANIZATION_ID, WORKSPACE_ID } from '../../../../src/config/AppInstance.js';

export const URL_ROOT = 'https://dev.api.cosmotech.com';
export const URL_POWERBI = 'http://localhost:3000/api/get-embed-info';

export const PAGE_NAME = {
  SCENARIO: '/scenario',
  SCENARIOS: '/scenarios',
  SIGN_IN: '/sign-in',
};

export const URL_REGEX = {
  SCENARIO_PAGE: new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}`),
  SCENARIO_PAGE_WITH_ID: new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/.*`),
  SCENARIO_PAGE_RUN_WITH_ID: new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/.*/run`),
};

export const SUPPORT_URL = 'http://support.cosmotech.com';

export const FILE_NAME = {
  DOC: 'doc.pdf',
};

export const SCENARIO_RUN_IN_PROGRESS = 'Scenario run in progress...';
