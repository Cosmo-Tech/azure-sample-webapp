// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// REST API CLIENT CONFIGURATION
const CosmotechApi = require('@cosmotech/api');

const DEFAULT_BASE_PATH = 'https://dev.api.cosmotech.com';

const DEFAULT_COSMOTECH_API_INSTANCE = CosmotechApi.ApiClient.instance;

// Configure OAuth2 access token for authorization: oAuth2AuthCode
DEFAULT_COSMOTECH_API_INSTANCE.basePath = DEFAULT_BASE_PATH;

// REST Api client
// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/ScenarioApi.md
export const ScenarioApi = new CosmotechApi.ScenarioApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/DatasetApi.md
export const DatasetApi = new CosmotechApi.DatasetApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/ScenariorunApi.md
export const ScenarioRunApi = new CosmotechApi.ScenariorunApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/SolutionApi.md
export const SolutionApi = new CosmotechApi.SolutionApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/WorkspaceApi.md
export const WorkspaceApi = new CosmotechApi.WorkspaceApi();

// override render method
export { CosmotechApi as CosmotechApiService };

// POLLING CONFIGURATION

// Polling delay to update running scenario status (seconds)
const SCENARIO_STATUS_POLLING_DELAY = 10000;

// REST API data object
export const API_CONFIG = {
  scenarioStatusPollingDelay: SCENARIO_STATUS_POLLING_DELAY
};

// TODO move them to utility file
// Configure OAuth2 access token for authorization: oAuth2AuthCode
export function setAccessToken (token) {
  DEFAULT_COSMOTECH_API_INSTANCE.authentications.oAuth2AuthCode.accessToken = token;
}

export function resetAccessToken () {
  // Use a non-empty string to be compatible with the expected API format
  // when using a local mock server in dev mode
  DEFAULT_COSMOTECH_API_INSTANCE.authentications.oAuth2AuthCode.accessToken = 'none';
}

export const getDefaultBasePath = () => DEFAULT_BASE_PATH;
// TODO move them to utility file
