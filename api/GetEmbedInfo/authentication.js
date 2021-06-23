// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const getAccessToken = async function () {
  // Use ADAL.js for authentication
  const adal = require('adal-node');
  const AuthenticationContext = adal.AuthenticationContext;

  let authorityUrl = process.env.POWER_BI_AUTHORITY_URI;

  authorityUrl = authorityUrl.replace('common', process.env.POWER_BI_TENANT_ID);
  const context = new AuthenticationContext(authorityUrl);

  return new Promise((resolve, reject) => {
    context.acquireTokenWithClientCredentials(
      process.env.POWER_BI_SCOPE,
      process.env.POWER_BI_CLIENT_ID,
      process.env.POWER_BI_CLIENT_SECRET,
      function (err, tokenResponse) {
        // Function returns error object in tokenResponse
        // Invalid Username will return empty tokenResponse, thus err is used
        if (err) {
          reject(tokenResponse == null ? err : tokenResponse);
        }
        resolve(tokenResponse);
      }
    );
  });
};

module.exports.getAccessToken = getAccessToken;
