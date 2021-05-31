// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const CosmotechApi = require('@cosmotech/api');

const DEFAULT_COSMOTECH_API_INSTANCE = CosmotechApi.ApiClient.instance;

// Configure OAuth2 access token for authorization: oAuth2AuthCode
export function setAccessToken (token) {
  DEFAULT_COSMOTECH_API_INSTANCE.authentications.oAuth2AuthCode.accessToken = token;
}

export function resetAccessToken () {
  // Use a non-empty string to be compatible with the expected API format
  // when using a local mock server in dev mode
  DEFAULT_COSMOTECH_API_INSTANCE.authentications.oAuth2AuthCode.accessToken = 'none';
}

// Configure OAuth2 access token for authorization: oAuth2AuthCode
DEFAULT_COSMOTECH_API_INSTANCE.basePath = 'http://localhost:4010';

// override render method
export { CosmotechApi as CosmotechApiService };

// Polling delay to update running scenario status (seconds)
const SCENARIO_STATUS_POLLING_DELAY = 10000;

// REST API data object
const API_CONFIG = {
  simulator: 'twinengines.azurecr.io/SIMULATORNAME_simulator:latest',
  scenarioStatusPollingDelay: SCENARIO_STATUS_POLLING_DELAY
};

export default API_CONFIG;
