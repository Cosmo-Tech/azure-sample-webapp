// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const CosmotechApi = require('@cosmotech/api');

const DEFAULT_COSMOTECH_API_INSTANCE = CosmotechApi.ApiClient.instance;

// TODO read the token from localStorage
// Configure OAuth2 access token for authorization: oAuth2AuthCode
DEFAULT_COSMOTECH_API_INSTANCE.authentications.oAuth2AuthCode.accessToken = '12345';

// Configure OAuth2 access token for authorization: oAuth2AuthCode
DEFAULT_COSMOTECH_API_INSTANCE.basePath = 'http://localhost:4010';

// override render method
export { CosmotechApi as CosmotechApiService };

// REST API data object
const API_CONFIG = {
  simulator: 'twinengines.azurecr.io/SIMULATORNAME_simulator:latest'
};

export default API_CONFIG;
