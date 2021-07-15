// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Client id for the *test* registered application. Use this id only for
// end-to-end tests.
const AZURE_CLIENT_ID = '9e5d08f4-d8dd-471f-9cb6-b42d02271919';
const AZURE_TENANT_ID = 'e413b834-8be8-4822-a370-be619545cb49';
const AUTH_AUTHORITY = 'https://login.microsoftonline.com/' + AZURE_TENANT_ID;

const AUTH_SECRET = process.env.CYPRESS_SAMPLE_WEBAPP_AUTH_SECRET;

const msalSecretConfig = {
  // cache: {
  //   cacheLocation: 'localStorage',
  //   storeAuthStateInCookie: true
  // },
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: AUTH_AUTHORITY,
    clientSecret: AUTH_SECRET
  }
};

const tokenRequest = {
  // scopes: ['http://dev.api.cosmotech.com/platform']
  // scopes: ['http://dev.api.cosmotech.com/platform/.default']
  scopes: [
    // 'https://graph.microsoft.com/.default',
    'http://dev.api.cosmotech.com/Platform.Admin/.default'
  ]
};

module.exports = {
  SECRET_CONFIG: msalSecretConfig,
  TOKEN_REQUEST: tokenRequest
};
