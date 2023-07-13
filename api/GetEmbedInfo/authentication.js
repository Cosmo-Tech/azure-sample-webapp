// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
const msal = require('@azure/msal-node');
const { MSAL_CONFIG, getConfigValue } = require('./config');
const { ServiceAccountError } = require('./errors.js');

// Create msal application object
let cca;
if (MSAL_CONFIG?.auth?.clientId && MSAL_CONFIG?.auth?.clientSecret) {
  cca = new msal.ConfidentialClientApplication(MSAL_CONFIG);
}

// With client credentials flows permissions need to be granted in the portal by a tenant administrator.
// The scope is always in the format "<resource>/.default"
const clientCredentialRequest = {
  scopes: [getConfigValue('POWER_BI_SCOPE')],
  skipCache: true,
};

const _getMSALTroubleshootingHint = (errorMessage) => {
  const knownPatterns = {
    'Error: HTTP status code 400': 'Please check the values of "POWER_BI_CLIENT_ID" and "POWER_BI_SCOPE"',
    'Error: HTTP status code 401': 'Please check the values of "POWER_BI_CLIENT_SECRET" and "POWER_BI_AUTHORITY_URI"',
  };

  for (const [pattern, hint] of Object.entries(knownPatterns)) {
    if (errorMessage.includes(pattern)) return ' ' + hint;
  }

  return '';
};

const getAccessToken = async function () {
  try {
    return await new Promise((resolve, reject) => {
      cca
        .acquireTokenByClientCredential(clientCredentialRequest)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (err) {
    let errorMessage;
    // eslint-disable-next-line no-prototype-builtins
    if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
      errorMessage = err.error_description;
    } else {
      // Invalid PowerBI Username provided
      errorMessage = err.toString();
    }
    const hint = _getMSALTroubleshootingHint(errorMessage);
    throw new ServiceAccountError(401, 'Unauthorized', `Can't retrieve PowerBI access token.${hint}`, errorMessage);
  }
};

module.exports.getAccessToken = getAccessToken;
