// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
const msal = require('@azure/msal-node');
const msalConfig = require('./config');

// Create msal application object
const cca = new msal.ConfidentialClientApplication(msalConfig);

// With client credentials flows permissions need to be granted in the portal by a tenant administrator.
// The scope is always in the format "<resource>/.default"
const clientCredentialRequest = {
  scopes: [process.env.POWER_BI_SCOPE],
  skipCache: true
};

const getAccessToken = async function () {
  return new Promise((resolve, reject) => {
    cca.acquireTokenByClientCredential(clientCredentialRequest).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports.getAccessToken = getAccessToken;
