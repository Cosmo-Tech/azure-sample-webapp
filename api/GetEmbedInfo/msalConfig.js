// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { getConfigValue } = require('../common/config');

const MSAL_CONFIG = {
  auth: {
    clientId: getConfigValue('POWER_BI_CLIENT_ID'),
    authority: `https://login.microsoftonline.com/${getConfigValue('POWER_BI_TENANT_ID')}`,
    clientSecret: getConfigValue('POWER_BI_CLIENT_SECRET'),
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

module.exports = { MSAL_CONFIG };
