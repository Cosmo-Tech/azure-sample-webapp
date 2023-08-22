// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// c.f. README.md file in the cypress folder for a description of the env variables below
const CY_MSAL_TENANT_ID = process.env.CY_MSAL_TENANT_ID;
if (!CY_MSAL_TENANT_ID)
  console.warn('MSAL tenant id is empty! Please set CY_MSAL_TENANT_ID env variable when running cypress');

const CY_MSAL_CLIENT_ID = process.env.CY_MSAL_CLIENT_ID;
if (!CY_MSAL_CLIENT_ID)
  console.warn('MSAL client id is empty! Please set CY_MSAL_CLIENT_ID env variable when running cypress');

const CY_MSAL_CLIENT_SECRET = process.env.CY_MSAL_CLIENT_SECRET;
if (!CY_MSAL_CLIENT_SECRET)
  console.warn('MSAL client secret is empty! Please set CY_MSAL_CLIENT_SECRET env variable when running cypress');

const CY_MSAL_API_HOSTNAME_FOR_SCOPE = process.env.CY_MSAL_API_HOSTNAME_FOR_SCOPE;
const CY_MSAL_SCOPE = process.env.CY_MSAL_SCOPE;
if (!CY_MSAL_API_HOSTNAME_FOR_SCOPE && !CY_MSAL_SCOPE)
  console.warn(
    'API hostname for MSAL scope is empty! Please set CY_MSAL_SCOPE or CY_MSAL_API_HOSTNAME_FOR_SCOPE env variable ' +
      'when running cypress'
  );

const msalSecretConfig = {
  auth: {
    clientId: CY_MSAL_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/' + CY_MSAL_TENANT_ID,
    clientSecret: CY_MSAL_CLIENT_SECRET,
  },
};

const tokenRequest = {
  scopes: [CY_MSAL_SCOPE ?? `http://${CY_MSAL_API_HOSTNAME_FOR_SCOPE}/.default`],
};

module.exports = {
  SECRET_CONFIG: msalSecretConfig,
  TOKEN_REQUEST: tokenRequest,
};
