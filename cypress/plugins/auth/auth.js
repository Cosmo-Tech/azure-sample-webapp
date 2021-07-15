// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const msal = require('@azure/msal-node');
const AUTH_DATA = require('./auth.config.js');

async function logInWithAppSecret() {
  const cca = new msal.ConfidentialClientApplication(AUTH_DATA.SECRET_CONFIG);
  try {
    await cca.acquireTokenByClientCredential(AUTH_DATA.TOKEN_REQUEST);
    return cca.getTokenCache().getKVStore();
  } catch(err) {
    console.log('Error when trying to authenticate AzureSampleWebAppTest application');
    console.error(err);
    return undefined;
  }
}

module.exports = {
  logInWithAppSecret: logInWithAppSecret
};
