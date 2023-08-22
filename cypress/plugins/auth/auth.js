// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

async function fetchServiceAccountTokenWithMSAL() {
  const msal = require('@azure/msal-node');
  const MSAL_AUTH = require('./authMSAL.config.js');

  const cca = new msal.ConfidentialClientApplication(MSAL_AUTH.SECRET_CONFIG);
  try {
    await cca.acquireTokenByClientCredential(MSAL_AUTH.TOKEN_REQUEST);
    return cca.getTokenCache().getKVStore();
  } catch (err) {
    console.log(`Error when trying to fetch token from application "${MSAL_AUTH.SECRET_CONFIG.auth.clientId}":`);
    console.log(err);
    return null;
  }
}

async function fetchServiceAccountToken() {
  // MSAL is the only supported provider to get token from service account right now
  return fetchServiceAccountTokenWithMSAL();
}

module.exports = {
  fetchServiceAccountToken,
};
