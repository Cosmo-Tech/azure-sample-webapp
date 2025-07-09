// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

async function fetchServiceAccountTokenWithMSAL(msalConfig) {
  const msal = require('@azure/msal-node');
  const cca = new msal.ConfidentialClientApplication(msalConfig.SECRET_CONFIG);
  try {
    await cca.acquireTokenByClientCredential(msalConfig.TOKEN_REQUEST);
    return cca.getTokenCache().getKVStore();
  } catch (err) {
    console.log(`Error when trying to fetch token from application "${msalConfig.SECRET_CONFIG.auth.clientId}":`);
    console.log(err);
    return null;
  }
}

async function fetchServiceAccountToken() {
  const useAzure =
    (process.env.CY_MSAL_TENANT_ID && process.env.CY_MSAL_TENANT_ID !== '') ||
    (process.env.CY_MSAL_CLIENT_ID && process.env.CY_MSAL_CLIENT_ID !== '') ||
    (process.env.CY_MSAL_CLIENT_SECRET && process.env.CY_MSAL_CLIENT_SECRET !== '');
  if (useAzure) {
    console.log('Using service account from Azure app registration...');
    const msalConfig = require('./msalAzureConfig.js');
    return fetchServiceAccountTokenWithMSAL(msalConfig);
  }

  const useKeycloak =
    (process.env.CY_AUTH_KEYCLOAK_REALM && process.env.CY_AUTH_KEYCLOAK_REALM !== '') ||
    (process.env.CY_AUTH_KEYCLOAK_CLIENT_ID && process.env.CY_AUTH_KEYCLOAK_CLIENT_ID !== '') ||
    (process.env.CY_AUTH_KEYCLOAK_CLIENT_SECRET && process.env.CY_AUTH_KEYCLOAK_CLIENT_SECRET !== '');
  if (useKeycloak) {
    console.log('Using service account from Keycloak client...');
    const msalConfig = require('./msalKeycloakConfig.js');
    return fetchServiceAccountTokenWithMSAL(msalConfig);
  }
  console.warn('Missing environment variables to use service account...');
}

module.exports = {
  fetchServiceAccountToken,
};
