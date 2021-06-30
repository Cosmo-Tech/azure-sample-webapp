// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// system.loggerOptions.logLevel values
// Error = 0,
// Warning = 1,
// Info = 2,
// Verbose = 3,
// Trace = 4;

const msalConfig = {
  auth: {
    clientId: process.env.POWER_BI_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.POWER_BI_TENANT_ID}`,
    clientSecret: process.env.POWER_BI_CLIENT_SECRET
  },
  system: {
    loggerOptions: {
      loggerCallback (loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3
    }
  }
};

module.exports = msalConfig;
